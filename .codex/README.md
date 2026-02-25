# Codex Context Pack

Este directorio guarda contexto persistente para futuras sesiones con agentes.

## Lee esto al inicio de cada sesion
1. `./.codex/PROJECT_CONTEXT.md`
2. `./.codex/IMPLEMENTATION_RULES.md`
3. `./docs/10-implementation-checklist.md`
4. `./docs/11-technical-skeleton.md`

## Estado actual
- Proyecto en fase de esqueleto tecnico.
- Arquitectura hibrida definida:
  - DM (1:1): WhatsApp Business Cloud API oficial.
  - Grupos: Baileys desacoplado por puerto/adaptador.
- Kill switch de grupos activo por configuracion.

## Config clave
- `GROUP_AUTOMATION_ENABLED=true|false`
- `GROUP_PROVIDER=baileys|official|manual`
