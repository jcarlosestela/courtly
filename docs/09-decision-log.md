# 09 - Decision Log

## Finalized decisions
1. Project working language: English documentation.
2. MVP focuses on match management, not full competition automation.
3. Staff always has final authority.
4. Cancellations require staff approval.
5. Waitlist replacement timeout is 30 minutes.
6. Backend is TypeScript + PostgreSQL.
7. Start with one pilot club.
8. Target monthly budget under 200 EUR.
9. Data deletion included in MVP.
10. Hybrid channel strategy:
   - DM via official WA Business Cloud API.
   - Groups via Baileys.
11. Mandatory kill switch to disable Baileys without stopping club operations.

## Open risks
1. Ban/restriction risk on non-official group layer (Baileys).
2. WhatsApp Web protocol changes that can break integration.
3. Operational cost of session maintenance and relogin handling.
