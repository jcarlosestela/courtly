# 05 - API Contracts (Draft)

## 1) WhatsApp webhook
`POST /webhooks/whatsapp`

Body example:
```json
{
  "event_id": "wamid.xxx",
  "from": "+34600111222",
  "type": "text",
  "text": "Add me to the 19:00 match"
}
```

Response:
- `200 OK` when event is accepted and processed idempotently.

## 2) Intent parsing
`POST /intents/parse`

Request:
```json
{
  "text": "Add me to the 19:00 match",
  "context": {"player_phone": "+34600111222"}
}
```

Response:
```json
{
  "intent": "join_match",
  "entities": {"time": "19:00"},
  "confidence": 0.97
}
```

## 3) Create match
`POST /matches`

Request:
```json
{
  "level_code": "C",
  "start_at": "2026-03-02T19:00:00+01:00",
  "court_ref": "Court 3",
  "capacity": 4
}
```

## 4) Join match
`POST /matches/{matchId}/join`

Response (confirmed):
```json
{"status":"confirmed"}
```

Response (waitlist):
```json
{"status":"waitlisted","position":2}
```

## 5) Staff-approved cancellation
`POST /matches/{matchId}/cancel`

Request:
```json
{
  "player_phone": "+34600111222",
  "approved_by_staff": "+34600999888",
  "reason": "player requested cancellation"
}
```

## 6) Offer next waitlist player
`POST /matches/{matchId}/waitlist/offer-next`

Semantics:
- Opens a 30-minute confirmation window.
- If expired, creates escalation.

## 7) Player data deletion
`POST /players/{playerId}/erase`

Semantics:
- Deletes/anonymizes personal data according to policy.
- Keeps compliance evidence in `privacy_requests` and `audit_log`.
