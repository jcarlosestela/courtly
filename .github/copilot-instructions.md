# Copilot Instructions

## Project context
This project implements a hybrid WhatsApp integration:
- Direct messages (1:1) via official WhatsApp Business Cloud API.
- Group interactions via Baileys (non-official) as a temporary solution.

The key technical objective is to keep Baileys decoupled so it can be replaced by an official group API in the future.

## Required architecture rules
1. Use ports/adapters pattern.
2. All group interactions must go through `GroupMessagingPort`.
3. Keep domain layer independent from provider SDKs.
4. Preserve kill switch (`GROUP_AUTOMATION_ENABLED`) and provider config (`GROUP_PROVIDER`).

## Key files to respect
- `src/domain/ports/direct-messaging-port.ts`
- `src/domain/ports/group-messaging-port.ts`
- `src/infrastructure/factories/channel-factory.ts`
- `src/infrastructure/http/server.ts`

## Restrictions
- No Baileys imports outside group adapter implementation.
- Do not remove `manual-group-adapter`.
- Do not hardcode secrets or tokens.
- Do not change port contracts without updating docs.
- Keep `docs/10-implementation-checklist.md` updated with session progress.

## Implementation style
- Strict TypeScript.
- Small functions with clear responsibility.
- Explicit error handling.
- Short comments only when they add real technical context.

## Expected next iterations
- Real Cloud API implementation in `wa-cloud-api-direct-adapter.ts`.
- Real session/events implementation in `baileys-group-adapter.ts`.
- PostgreSQL persistence.
- Audit and webhook idempotency.

## When in doubt
If a proposed change risks coupling domain logic to a specific provider, preserve the port contract and move complexity to infrastructure.
