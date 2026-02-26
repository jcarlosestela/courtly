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

## Phase 0.1 - Quality and security baseline
- [x] Add ESLint and TypeScript lint config.
- [x] Add Prettier config.
- [x] Add unit test framework (Vitest).
- [x] Add coverage reporting and thresholds.
- [x] Add dependency security audit command (`npm audit`).
- [x] Add optional Semgrep and Gitleaks hooks (`scripts/security-check.sh`).
- [x] Add quality/security documentation (`docs/12-quality-and-security.md`).
- [x] Validate end-to-end verification pipeline (`npm run verify`).

## Phase 0.2 - Codex automation policy
- [x] Add Codex rules file for automation command control (`codex/rules/default.rules`).
- [x] Add documentation for Codex rules usage (`docs/13-codex-rules.md`).

## Phase 1 - Official DM channel
- [x] Implement `WaCloudApiDirectAdapter.sendDirect` with real Cloud API.
- [x] Implement real webhook mapping in `parseWebhook`.
- [x] Validate idempotency by `message_id`.
- [x] Run minimum DM test with 2-3 users.
  - Local end-to-end DM validation completed with real tenant credentials (outbound + inbound via ngrok webhook).

## Phase 2 - Baileys group channel
- [x] Implement real connection/session handling in `BaileysGroupAdapter`.
- [x] Implement real group event parsing.
- [x] Restrict allowed groups using allowlist.
- [x] Add rate limits per group and per minute.
- [x] Verify kill switch (`GROUP_AUTOMATION_ENABLED=false`) without service outage.
  - Added tests for Baileys group parsing, allowlist/rate-limit enforcement, and service continuity with kill switch enabled.

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
