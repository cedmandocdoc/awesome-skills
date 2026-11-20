---
doc_type: sending-index
generated_by: sending-messages
author: e174974e-3680-4d3d-b926-27cf069d9f5f
account_id: none
database: sending-messages
kv_id: none
worker: sending-messages
from: none
smtp_host: none
smtp_port: 465
env_file: .env
smtp_user_var: SMTP_USER
smtp_pass_var: SMTP_PASS
list_unsubscribe: none
timezone: UTC
days: mon-fri
hours: 9-17
daily_cap: 10
gap_minutes: 3-8
tracking_database: none
---

# Sending

Config for the `sending-messages` skill: the sender, the send window, and the Cloudflare D1 outbox, KV namespace and Worker that send each queued message when it is due. The messages live in the outbox, never here.
