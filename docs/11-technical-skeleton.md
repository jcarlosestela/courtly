# 11 - Technical Skeleton (How to use)

## Goal
The skeleton separates business logic from channel providers so Baileys can be disabled/replaced without rewriting core logic.

## Stable contracts
- `DirectMessagingPort`: official DM channel.
- `GroupMessagingPort`: group channel (Baileys today, official tomorrow).

## Provider selection
Controlled by config:
- `GROUP_AUTOMATION_ENABLED=true|false`
- `GROUP_PROVIDER=baileys|official|manual`

## Kill switch
If `GROUP_AUTOMATION_ENABLED=false`:
- `ManualGroupAdapter` is used.
- Group automations are disabled.
- Server remains operational for direct channel.

## Skeleton endpoints
- `GET /health`
- `GET /webhooks/whatsapp/direct` (Meta webhook verification)
- `POST /webhooks/whatsapp/direct`
- `POST /webhooks/whatsapp/group`

## Recommended next implementation order
1. Complete official DM adapter.
2. Complete Baileys adapter.
3. Add real business rules and persistence.
