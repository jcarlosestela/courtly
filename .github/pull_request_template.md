## Summary
- What changed?
- Why was it needed?

## Architecture Guardrails
- [ ] Domain layer remains provider-agnostic
- [ ] No Baileys imports outside `src/infrastructure/adapters/groups/`
- [ ] `GroupMessagingPort` contract unchanged or docs updated
- [ ] Kill switch behavior (`GROUP_AUTOMATION_ENABLED`) validated

## Scope
- [ ] Direct messaging (Cloud API)
- [ ] Group messaging (Baileys / official / manual adapter)
- [ ] Domain/use-cases
- [ ] Persistence
- [ ] Observability / ops

## Testing
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `GET /health` returns providers and config
- [ ] Direct webhook path tested (`/webhooks/whatsapp/direct`)
- [ ] Group webhook path tested (`/webhooks/whatsapp/group`)
- [ ] Manual fallback tested (`GROUP_AUTOMATION_ENABLED=false`)

## Risk and Rollback
- Risk level: Low / Medium / High
- Rollback plan:
  - [ ] Can disable group automation via config without redeploy
  - [ ] Service remains available for direct channel

## Documentation
- [ ] Updated docs under `docs/` if contracts or behavior changed
- [ ] Updated `.codex/` context if strategic decisions changed
