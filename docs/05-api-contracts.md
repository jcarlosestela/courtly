# 05 - API Contracts (Borrador)

## 1) Webhook WhatsApp
`POST /webhooks/whatsapp`

Body (ejemplo):
```json
{
  "event_id": "wamid.xxx",
  "from": "+34600111222",
  "type": "text",
  "text": "Apuntame al partido de las 19"
}
```

Respuesta:
- `200 OK` siempre que el evento se reciba y se procese de forma idempotente.

## 2) Parse de intencion
`POST /intents/parse`

Request:
```json
{
  "text": "Apuntame al partido de las 19",
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

## 3) Crear partido
`POST /matches`

Request:
```json
{
  "level_code": "C",
  "start_at": "2026-03-02T19:00:00+01:00",
  "court_ref": "Pista 3",
  "capacity": 4
}
```

## 4) Unirse a partido
`POST /matches/{matchId}/join`

Response (confirmado):
```json
{"status":"confirmed"}
```

Response (waitlist):
```json
{"status":"waitlisted","position":2}
```

## 5) Cancelacion aprobada por staff
`POST /matches/{matchId}/cancel`

Request:
```json
{
  "player_phone": "+34600111222",
  "approved_by_staff": "+34600999888",
  "reason": "baja solicitada"
}
```

## 6) Oferta siguiente waitlist
`POST /matches/{matchId}/waitlist/offer-next`

Semantica:
- Abre ventana de confirmacion de 30 min.
- Si expira, genera escalado.

## 7) Borrado de datos
`POST /players/{playerId}/erase`

Semantica:
- Elimina/anonimiza datos personales segun politica.
- Mantiene evidencia de cumplimiento en `privacy_requests` + `audit_log`.
