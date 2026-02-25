# 11 - Technical Skeleton (como usarlo)

## Objetivo
El esqueleto separa negocio y canal para que puedas apagar/reemplazar Baileys sin rehacer el core.

## Contratos estables
- `DirectMessagingPort`: canal DM oficial.
- `GroupMessagingPort`: canal de grupos (Baileys hoy, oficial manana).

## Seleccion de provider
Se controla por config:
- `GROUP_AUTOMATION_ENABLED=true|false`
- `GROUP_PROVIDER=baileys|official|manual`

## Kill switch
Si `GROUP_AUTOMATION_ENABLED=false`:
- Se activa `ManualGroupAdapter`.
- No se procesan automatismos de grupo.
- El servidor sigue operativo para DM.

## Endpoints del esqueleto
- `GET /health`
- `POST /webhooks/whatsapp/direct`
- `POST /webhooks/whatsapp/group`

## Siguiente implementacion recomendada
1. Completar adaptador oficial DM.
2. Completar adaptador Baileys.
3. Añadir reglas reales de negocio y persistencia.
