# Project Context (for agents)

## Product goal
Automate open match coordination for a padel club while reducing staff operational work, without hard dependency on a non-official channel.

## Finalized decisions
- Backend: Node.js + TypeScript.
- Target DB: PostgreSQL.
- DM channel: official WhatsApp Cloud API.
- Group channel: Baileys (temporary, replaceable).
- Mitigation strategy: kill switch + manual fallback for groups.

## Non-negotiable requirements
1. Baileys must not leak into domain layer.
2. All group access must go through `GroupMessagingPort`.
3. Swapping to `OfficialGroupAdapter` must not require use-case changes.
4. If groups are disabled, DM must continue working.

## Relevant code structure
- `src/domain/ports/direct-messaging-port.ts`
- `src/domain/ports/group-messaging-port.ts`
- `src/infrastructure/adapters/direct/wa-cloud-api-direct-adapter.ts`
- `src/infrastructure/adapters/groups/baileys-group-adapter.ts`
- `src/infrastructure/adapters/groups/official-group-adapter.ts`
- `src/infrastructure/adapters/groups/manual-group-adapter.ts`
- `src/infrastructure/factories/channel-factory.ts`
- `src/infrastructure/http/server.ts`

## Current endpoints
- `GET /health`
- `POST /webhooks/whatsapp/direct`
- `POST /webhooks/whatsapp/group`

## Open risks
- Ban/restriction risk on non-official layer (Baileys).
- WhatsApp Web protocol changes.
- Session/relogin operational overhead.
