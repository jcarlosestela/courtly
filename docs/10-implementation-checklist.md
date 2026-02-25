# 10 - Checklist de Implementacion (arranque)

## Fase 0 - Entorno
- [ ] Instalar dependencias (`npm install`).
- [ ] Crear `.env` inicial con:
  - [ ] `PORT=3000`
  - [ ] `GROUP_AUTOMATION_ENABLED=true`
  - [ ] `GROUP_PROVIDER=baileys`
- [ ] Arrancar en local (`npm run dev`).
- [ ] Verificar `GET /health`.

## Fase 1 - Canal oficial DM
- [ ] Implementar `WaCloudApiDirectAdapter.sendDirect` contra Cloud API real.
- [ ] Implementar parse real de webhook en `parseWebhook`.
- [ ] Validar idempotencia por `message_id`.
- [ ] Prueba minima DM con 2-3 usuarios.

## Fase 2 - Canal grupos con Baileys
- [ ] Implementar conexion/sesion real en `BaileysGroupAdapter`.
- [ ] Implementar parse real de eventos de grupo.
- [ ] Limitar grupos permitidos por lista blanca.
- [ ] Configurar limites de envio por grupo y por minuto.
- [ ] Verificar kill switch (`GROUP_AUTOMATION_ENABLED=false`) sin caida del servicio.

## Fase 3 - Dominio y negocio
- [ ] Reemplazar respuestas de eco por comandos reales (join, waitlist, cancel).
- [ ] Añadir persistencia PostgreSQL (players, matches, registrations, escalations, audit).
- [ ] Añadir trazabilidad completa de acciones criticas.
- [ ] Añadir escalado a staff para baja confianza/conflictos.

## Fase 4 - Seguridad y operacion
- [ ] Firma/verificacion de webhook oficial.
- [ ] Secretos fuera de repo.
- [ ] Logging estructurado + correlacion de eventos.
- [ ] Alertas: caida de providers, errores de sesion Baileys, backlog de escalados.

## Fase 5 - Preparar sustitucion de Baileys
- [ ] Mantener `GroupMessagingPort` como contrato unico.
- [ ] Evitar dependencias de Baileys fuera de `wa-groups-baileys-adapter`.
- [ ] Implementar `OfficialGroupAdapter` cuando exista API viable.
- [ ] Hacer prueba de cambio de provider via config (`GROUP_PROVIDER=official`) sin tocar dominio.
