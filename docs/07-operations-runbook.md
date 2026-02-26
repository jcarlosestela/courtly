# 07 - Operations Runbook

## Minimum monitoring
- Error rate by endpoint.
- p95 latency for webhook and intent parsing.
- Number of open escalations.
- Low-confidence ratio for critical intents.
- Direct webhook idempotency counters (`received`, `processed`, `duplicates`).

## Alerts
- Uptime below 99% in operating hours.
- Consecutive webhook failures above threshold.
- Open escalations above threshold for more than 30 minutes.
- Repeated direct webhook verification failures (`GET /webhooks/whatsapp/direct`).

## Degraded mode
If AI or external integration fails:
1. Disable risky automated execution.
2. Keep receiving and logging requests.
3. Escalate all critical actions to staff.
4. Notify staff status.

## Incident handling
1. Identify scope (players, matches, staff impact).
2. Freeze risky automations.
3. Fix inconsistent state.
4. Audit all corrective actions.
5. Close with short postmortem.
