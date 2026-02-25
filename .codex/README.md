# Codex Context Pack

This directory stores persistent context for future agent sessions.

## Read this at the start of each session
1. `./.codex/PROJECT_CONTEXT.md`
2. `./.codex/IMPLEMENTATION_RULES.md`
3. `./docs/10-implementation-checklist.md`
4. `./docs/11-technical-skeleton.md`

## Current state
- Project is in technical skeleton phase.
- Hybrid architecture is defined:
  - DM (1:1): official WhatsApp Business Cloud API.
  - Groups: Baileys decoupled via port/adapter.
- Group kill switch is available by configuration.

## Key config
- `GROUP_AUTOMATION_ENABLED=true|false`
- `GROUP_PROVIDER=baileys|official|manual`
