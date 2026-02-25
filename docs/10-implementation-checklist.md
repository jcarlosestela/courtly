# 10 - Implementation Checklist (Kickoff)

## Maintenance rule (mandatory)
- Keep this file updated at the end of every implementation session.
- Mark completed items immediately.
- Add new checklist items when scope changes.

## Phase 0 - Environment
- [x] Install dependencies (`npm install`).
- [x] Create `.env` with:
  - [x] `PORT=3000`
  - [x] `GROUP_AUTOMATION_ENABLED=true`
  - [x] `GROUP_PROVIDER=baileys`
- [x] Run locally (`npm run dev`).
- [x] Verify `GET /health`.

## Phase 1 - Official DM channel
- [ ] Implement `WaCloudApiDirectAdapter.sendDirect` with real Cloud API.
- [ ] Implement real webhook mapping in `parseWebhook`.
- [ ] Validate idempotency by `message_id`.
- [ ] Run minimum DM test with 2-3 users.

## Phase 2 - Baileys group channel
- [ ] Implement real connection/session handling in `BaileysGroupAdapter`.
- [ ] Implement real group event parsing.
- [ ] Restrict allowed groups using allowlist.
- [ ] Add rate limits per group and per minute.
- [ ] Verify kill switch (`GROUP_AUTOMATION_ENABLED=false`) without service outage.

## Phase 3 - Domain and business logic
- [ ] Replace echo behavior with real commands (join, waitlist, cancel).
- [ ] Add PostgreSQL persistence (players, matches, registrations, escalations, audit).
- [ ] Add complete audit trail for critical actions.
- [ ] Add staff escalation for low confidence/conflicts.

## Phase 4 - Security and operations
- [ ] Verify official webhook signatures.
- [ ] Keep secrets out of repository.
- [ ] Add structured logs + request/event correlation.
- [ ] Add alerts: provider failures, Baileys session errors, escalation backlog.

## Phase 5 - Baileys replacement readiness
- [ ] Keep `GroupMessagingPort` as the single contract.
- [ ] Avoid Baileys dependencies outside `wa-groups-baileys-adapter`.
- [ ] Implement `OfficialGroupAdapter` when viable.
- [ ] Verify provider switch via config (`GROUP_PROVIDER=official`) without touching domain logic.
