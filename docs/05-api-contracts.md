# 05 - API Contracts (Draft)

## 1) WhatsApp direct webhook (Cloud API)
`POST /webhooks/whatsapp/direct`

Body example:
```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "id": "wamid.xxx",
                "from": "34600111222",
                "timestamp": "1730000000",
                "type": "text",
                "text": { "body": "Add me to the 19:00 match" }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

Response:
- `200 OK` with counters:
```json
{"received":1,"processed":1,"duplicates":0}
```
- Duplicate events are returned as `200 OK` with `processed=0` and `duplicates>0`.

## 1.1) WhatsApp direct webhook verification
`GET /webhooks/whatsapp/direct?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...`

Response:
- `200 OK` with `hub.challenge` as plain text when token matches.
- `403` when verification fails.

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
