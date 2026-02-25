# Implementation Rules (para agentes)

## Principios de arquitectura
1. Ports and adapters obligatorio.
2. Dominio agnostico de proveedores.
3. Feature flags y kill switch antes de automatizar.
4. Fallback manual siempre disponible.

## Regla anti-acoplamiento
- Prohibido importar Baileys fuera de `src/infrastructure/adapters/groups/baileys-group-adapter.ts` (o submodulos directos de ese adapter).

## Convenciones de codigo
- TypeScript estricto (`strict: true`).
- Errores explicitos con mensajes accionables.
- Logs estructurados para eventos criticos.
- Idempotencia en webhooks por `message_id/event_id`.

## Checklist minimo por PR/cambio
- [ ] No rompe `GroupMessagingPort`.
- [ ] Respeta kill switch.
- [ ] Mantiene compatibilidad con `manual` provider.
- [ ] Incluye caso de error y degradacion.
- [ ] Actualiza docs si cambia contrato.

## Prioridad de implementacion
1. Completar adapter DM oficial.
2. Completar adapter Baileys real.
3. Persistencia PostgreSQL + auditoria.
4. Casos de uso reales (join/waitlist/cancel).
5. Alertas y observabilidad.
