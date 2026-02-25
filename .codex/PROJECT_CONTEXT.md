# Project Context (para agentes)

## Objetivo de producto
Automatizar la gestion de partidos abiertos de un club de padel reduciendo carga operativa del staff, sin depender al 100% de un canal no oficial.

## Decisiones cerradas
- Backend: Node.js + TypeScript.
- DB objetivo: PostgreSQL.
- Canal DM: WhatsApp Cloud API oficial.
- Canal grupos: Baileys (temporal, reemplazable).
- Estrategia de mitigacion: kill switch + fallback manual para grupos.

## Requisitos no negociables
1. Baileys no puede contaminar la capa de dominio.
2. Todo acceso a grupos debe entrar por `GroupMessagingPort`.
3. Debe ser posible cambiar a `OfficialGroupAdapter` sin tocar casos de uso.
4. Si grupos se desactivan, DM debe seguir funcionando.

## Estructura de codigo relevante
- `src/domain/ports/direct-messaging-port.ts`
- `src/domain/ports/group-messaging-port.ts`
- `src/infrastructure/adapters/direct/wa-cloud-api-direct-adapter.ts`
- `src/infrastructure/adapters/groups/baileys-group-adapter.ts`
- `src/infrastructure/adapters/groups/official-group-adapter.ts`
- `src/infrastructure/adapters/groups/manual-group-adapter.ts`
- `src/infrastructure/factories/channel-factory.ts`
- `src/infrastructure/http/server.ts`

## Endpoints actuales
- `GET /health`
- `POST /webhooks/whatsapp/direct`
- `POST /webhooks/whatsapp/group`

## Riesgos abiertos
- Bloqueo/restriccion en capa no oficial (Baileys).
- Cambios de protocolo WhatsApp Web.
- Operacion de sesiones/relogin.
