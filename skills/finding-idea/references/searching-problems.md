# Searching Problems

## Overview

**Read-only.** Researches real problems for an industry or audience and replies with ranked app proposals in chat. Stops at the proposals.

## Guidelines

### 1. Set the scope

From the request: the industry or audience, the market (country, city), and the build constraint (budget, days to a first version). Ask once, in one message, for what it leaves out; with no industry, that message also asks what the apps are for (the user's offer). Then, with no industry, propose 3–5 industries where the job still runs on paper, chat, or spreadsheets, and stop until the user picks one or more.

### 2. Research

Search where the audience complains and asks for help, in the market's languages:

| Source | Look for |
| --- | --- |
| Facebook groups, Reddit, forums | Posts asking how others handle a task, complaints, "is there an app for…" |
| Reviews of the tools they use now (app stores, G2, Capterra), 1–3 stars | What the tool fails at, what users wish for |
| Job posts | Roles hired to do manual work an app could take over |
| News and regulation | Deadlines, new rules, or seasons that make a pain urgent |

Quote each finding with its URL. A source the tools can't open (a private group): continue with the others, and list it in the reply with a request for pasted posts.

### 3. Write the problems

Per problem: who struggles (role, business type, size, location), with what, today's workaround, and at least 2 quotes from different sources. A problem with one quote gets `(thin evidence)` in its Problem cell and is proposed only when fewer than 3 problems have 2 quotes.

### 4. Rank

Score each problem 1–3 per criterion; rank by the total, ties by quote count:

| Criterion | 3 means |
| --- | --- |
| Pain | Costs them money, customers, or hours every week |
| Frequency | Hits daily or every customer |
| Already paying | They pay for a workaround today (staff time, a tool, a service) |
| Buildable | A first version fits the build constraint |

### 5. Propose

The top 3–5 problems (all, when fewer), each as an app proposal per **Examples**: core features that serve its hero flow, the hero flow from entry to done in 3–6 steps, and its riskiest assumption with the cheapest test.

### 6. Reply

The scope in one line, the ranking table, then the proposals. Next: the user picks one and says where it goes.

## Examples

```markdown
Scope: dental clinics, Metro Manila, 1–3 chairs; first version in 14 days

| # | Problem | Pain | Freq. | Paying | Build | Total |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Clinics lose slots to no-shows | 3 | 3 | 2 | 3 | 11 |

### 1. Clinic no-shows — Dental clinic booking with reminders

- Problem: owner-dentists at 1–3 chair clinics in Metro Manila lose 3–5 slots a week to no-shows; today's workaround is a paper logbook and manual Messenger reminders by the receptionist.
- Evidence:
  - "Ang daming hindi sumisipot kahit nag-confirm na" — <URL>
  - "Our receptionist spends an hour a day texting reminders" — <URL>
- App: patients book a slot online; the clinic sees one calendar; reminders go out automatically.
- Core features: slot calendar, booking form, automatic reminder, today's list for the front desk.
- Hero flow: 1. calendar with free slots → 2. tap a slot, fill name and phone → 3. booked, reminder scheduled.
- Riskiest assumption: patients will book through a link instead of messaging — test: share a booking link in one clinic's page for a week.
```
