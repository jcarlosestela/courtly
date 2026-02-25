# WhatsApp Padel Bot - Product and Technical Documentation

This package keeps the project ready for future implementation sessions.

## Recommended reading order
1. `01-product-spec.md`
2. `02-functional-spec.md`
3. `03-technical-spec.md`
4. `04-data-model.md`
5. `05-api-contracts.md`
6. `06-test-plan.md`
7. `07-operations-runbook.md`
8. `08-wa-business-onboarding-and-minimum-poc.md`
9. `09-decision-log.md`
10. `10-implementation-checklist.md`
11. `11-technical-skeleton.md`
12. `12-quality-and-security.md`

## Current status
- Project is in technical skeleton phase.
- Architecture is intentionally hybrid:
  - Direct messaging through official WhatsApp Cloud API.
  - Group automation through a replaceable adapter (Baileys today).
