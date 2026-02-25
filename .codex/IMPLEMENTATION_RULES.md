# Implementation Rules (for agents)

## Architecture principles
1. Ports and adapters are mandatory.
2. Domain layer must stay provider-agnostic.
3. Feature flags and kill switch before automation.
4. Manual fallback must always exist.

## Anti-coupling rule
- Do not import Baileys outside `src/infrastructure/adapters/groups/baileys-group-adapter.ts` (or files directly under that adapter module).

## Coding conventions
- Strict TypeScript (`strict: true`).
- Explicit errors with actionable messages.
- Structured logs for critical events.
- Webhook idempotency by `message_id/event_id`.

## Minimum checklist per change
- [ ] `GroupMessagingPort` contract preserved.
- [ ] Kill switch behavior preserved.
- [ ] `manual` provider compatibility preserved.
- [ ] Error and degraded path covered.
- [ ] Docs updated if contracts changed.

## Implementation priority
1. Complete official DM adapter.
2. Complete Baileys adapter.
3. PostgreSQL persistence + audit.
4. Real use cases (join/waitlist/cancel).
5. Alerts and observability.
