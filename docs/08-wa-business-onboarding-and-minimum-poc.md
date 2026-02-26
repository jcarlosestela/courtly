# 08 - WA Business: Onboarding and Minimum PoC (2-3 people)

## Goal
Run a fast, real-world validation of the hybrid model:
- DM (1:1) through official API.
- Groups through Baileys.

## Official references (Meta)
- https://developers.facebook.com/docs/whatsapp/about-the-platform/
- https://developers.facebook.com/docs/whatsapp/cloud-api/
- https://developers.facebook.com/docs/whatsapp/group-chat-api/
- https://developers.facebook.com/docs/whatsapp/on-premises/compare/

## Required backend config for direct webhook
- `WA_CLOUD_API_BASE_URL` (default: `https://graph.facebook.com`)
- `WA_CLOUD_API_VERSION` (example: `v22.0`)
- `WA_CLOUD_PHONE_NUMBER_ID`
- `WA_CLOUD_ACCESS_TOKEN`
- `WA_CLOUD_WEBHOOK_VERIFY_TOKEN`
- `DIRECT_IDEMPOTENCY_TTL_SECONDS` (default: `86400`)

## Important notes about groups/channels
- 1:1 messaging in WhatsApp Business Platform (Cloud API) is standard.
- If you use Baileys for groups, treat it as a risk-managed layer, not a contractual foundation.
- For Channels, do not assume product API support until explicitly validated in your tenant.

## Business setup checklist
1. Create or reuse Meta Business Manager.
2. Verify the business (company/sole trader legal docs).
3. Create app in Meta for Developers.
4. Add WhatsApp product to the app.
5. Attach a dedicated pilot phone number.
6. Configure webhook (URL + verify token + subscribed events).
   - Verification endpoint: `GET /webhooks/whatsapp/direct?hub.mode=subscribe&hub.verify_token=<token>&hub.challenge=<challenge>`
   - Event endpoint: `POST /webhooks/whatsapp/direct`
7. Generate and store system token (avoid short-lived tokens for longer tests).
8. Approve at least one template (for out-of-window initiation).
9. Review messaging policy and quality status.

## Minimum recommended test (you + 2 people)

### Phase A - Mandatory 1:1 sanity check
1. User A sends message to business number.
2. System receives webhook and auto-replies.
3. User B repeats.
4. Validate:
- Message reception and sending.
- Phone identity mapping.
- Basic audit logs.

### Phase B - Group gate validation
1. Prepare Baileys session for pilot club test group.
2. Run controlled real demo:
- Publish "open match" message.
- Read user group responses.
- Confirm registration flow and backend traceability.
3. Store evidence:
- Log/event screenshots.
- Event IDs.
- Kill switch ON/OFF behavior result.

## Gate approval criteria
Approved only if there is reproducible evidence of:
- Stable official DM.
- Stable Baileys group behavior for pilot.
- Baileys can be disabled without breaking operations (real manual fallback).

## Gate rejection criteria
If Baileys is unstable in real operations, do not automate groups.
