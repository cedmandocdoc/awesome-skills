// sending-messages' Worker: every 5 minutes it sends the queued messages that are due, inside the send window
// and under the daily cap, through SMTP. Each message's attachments wait in KV and are deleted once it goes.
// With a tracking database bound (TRACK), a message tied to a delivery goes only while that delivery is still
// `scheduled`, and its result is written back as `sent` (with the Message-ID) or `failed` (with the error).
//
// Bindings: DB (the outbox), FILES (KV), TRACK (optional). Vars: CONFIG (JSON). Secrets: SMTP_USER, SMTP_PASS.

import { WorkerMailer } from "worker-mailer";

const PER_RUN = 2;
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function localParts(date, timezone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(date).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, weekday: DAYS.indexOf(p.weekday.toLowerCase()), minute: Number(p.hour) * 60 + Number(p.minute) };
}

function base64(buf) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function address(s) {
  const m = s.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].replace(/^"|"$/g, ""), email: m[2] } : { email: s.trim() };
}

async function dropFiles(env, row) {
  for (const a of JSON.parse(row.attachments || "[]")) await env.FILES.delete(a.key);
}

async function tracked(env, row, status, fields) {
  if (!env.TRACK || !row.delivery) return;
  const at = new Date().toISOString();
  if (status === "sent") await env.TRACK.prepare("UPDATE deliveries SET status = 'sent', sent_at = ?, link = ? WHERE id = ? AND status = 'scheduled'").bind(at, fields.message_id, row.delivery).run();
  else await env.TRACK.prepare("UPDATE deliveries SET status = 'failed', failed_at = ?, error = ? WHERE id = ? AND status = 'scheduled'").bind(at, fields.error, row.delivery).run();
}

async function sendOne(env, cfg, row) {
  if (env.TRACK && row.delivery) {
    const d = await env.TRACK.prepare("SELECT status FROM deliveries WHERE id = ?").bind(row.delivery).first();
    if (!d || d.status !== "scheduled") {
      await env.DB.prepare("UPDATE outbox SET status = 'skipped', error = ? WHERE id = ?").bind(`delivery ${row.delivery} is ${d?.status ?? "gone"}`, row.id).run();
      await dropFiles(env, row);
      return;
    }
  }
  const from = address(cfg.from);
  const messageId = `<${crypto.randomUUID()}@${from.email.split("@").pop()}>`;
  try {
    const attachments = [];
    for (const a of JSON.parse(row.attachments || "[]")) {
      const buf = await env.FILES.get(a.key, "arrayBuffer");
      if (!buf) throw new Error(`attachment ${a.filename} is missing from KV`);
      attachments.push({ filename: a.filename, content: base64(buf), type: a.type });
    }
    const headers = { "Message-ID": messageId };
    if (cfg.list_unsubscribe) headers["List-Unsubscribe"] = `<${cfg.list_unsubscribe}>`;
    await WorkerMailer.send(
      { host: cfg.smtp_host, port: cfg.smtp_port, secure: cfg.smtp_port === 465, startTls: cfg.smtp_port !== 465, credentials: { username: env.SMTP_USER, password: env.SMTP_PASS }, authType: ["plain", "login"] },
      { from, to: row.to_name ? { name: row.to_name, email: row.to_addr } : row.to_addr, subject: row.subject, text: row.text, headers, attachments },
    );
    await env.DB.prepare("UPDATE outbox SET status = 'sent', sent_at = ?, message_id = ? WHERE id = ?").bind(new Date().toISOString(), messageId, row.id).run();
    await tracked(env, row, "sent", { message_id: messageId });
  } catch (err) {
    const error = String(err?.message ?? err).slice(0, 500);
    await env.DB.prepare("UPDATE outbox SET status = 'failed', failed_at = ?, error = ? WHERE id = ?").bind(new Date().toISOString(), error, row.id).run();
    await tracked(env, row, "failed", { error });
  }
  await dropFiles(env, row);
}

async function run(env) {
  const cfg = JSON.parse(env.CONFIG);
  const now = new Date();
  const l = localParts(now, cfg.timezone);
  if (!cfg.days.includes(l.weekday) || l.minute < cfg.hours[0] * 60 || l.minute >= cfg.hours[1] * 60) return;
  const recent = await env.DB.prepare("SELECT sent_at FROM outbox WHERE status = 'sent' AND sent_at >= ?").bind(new Date(now.getTime() - 26 * 3600000).toISOString()).all();
  const today = recent.results.filter((r) => localParts(new Date(r.sent_at), cfg.timezone).day === l.day).length;
  const room = Math.min(PER_RUN, cfg.daily_cap - today);
  if (room <= 0) return;
  const due = await env.DB.prepare("SELECT * FROM outbox WHERE status = 'queued' AND send_at <= ? ORDER BY send_at LIMIT ?").bind(now.toISOString(), room).all();
  for (const row of due.results) await sendOne(env, cfg, row);
}

export default {
  async scheduled(_event, env, ctx) { ctx.waitUntil(run(env)); },
};
