# 03 - Technical Spec

## MVP stack
- Backend: Node.js + TypeScript.
- DB: PostgreSQL.
- Infrastructure: low-cost cloud setup.
- AI: external LLM provider with abstraction layer.
- Channel adapters:
  - Official DM: WhatsApp Business Cloud API.
  - Groups: Baileys (isolated in a dedicated adapter/module).

## Logical architecture
- `wa-webhook`: receives WhatsApp events.
- `wa-official-adapter`: sends/receives official direct messages.
- `wa-groups-baileys-adapter`: reads/writes group messages (non-official).
- `intent-service`: maps text to internal commands.
- `orchestrator`: applies business rules.
- `match-service`: matches, registrations, waitlist.
- `staff-escalation`: escalation queue for staff.
- `audit-service`: full traceability.

## Non-functional requirements
- 99% uptime during club operating hours.
- Webhook idempotency by message/event id.
- Structured, auditable logs.
- Group kill switch via feature flag.
- Safe degradation: with Baileys disabled, staff runs groups manually.

## Safe AI strategy
- Intent classification + entity extraction.
- Strict schema validation.
- Guided confirmation for critical actions.
- Low confidence => do not execute, escalate.

## Baileys guardrails
- Automate only club groups with explicit consent.
- Restrict sending volume and frequency.
- Keep Baileys sessions/credentials isolated from official channel.
- Monitor bans, relogins, and session errors.
- Contingency plan: disable Baileys and continue manual operations.
