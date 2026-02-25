# 08 - WA Business: Onboarding y Prueba Minima (2-3 personas)

## Objetivo
Tener una prueba real y rapida del modelo hibrido:
- DM (1:1) con API oficial.
- Grupos con Baileys.

## Referencias oficiales (Meta)
- https://developers.facebook.com/docs/whatsapp/about-the-platform/
- https://developers.facebook.com/docs/whatsapp/cloud-api/
- https://developers.facebook.com/docs/whatsapp/group-chat-api/
- https://developers.facebook.com/docs/whatsapp/on-premises/compare/

## Importante sobre grupos/canales
- La mensajeria 1:1 en WhatsApp Business Platform (Cloud API) es estandar.
- Si optas por Baileys para grupos, tratalo como capa de riesgo y no como base contractual del negocio.
- Para canales, no asumas soporte API de producto hasta validacion explicita en tu tenant.

## Checklist de setup negocio (paso a paso)
1. Crear o usar Business Manager (Meta Business).
2. Verificar el negocio (documentacion legal de empresa/autonomo).
3. Crear una app en Meta for Developers.
4. Agregar producto WhatsApp a la app.
5. Asociar un numero de telefono (ideal: numero dedicado al piloto).
6. Configurar webhook (URL + verify token + suscripciones de eventos).
7. Generar y guardar token de sistema (nunca usar tokens efimeros en pruebas largas).
8. Definir y aprobar al menos 1 plantilla (por si necesitas iniciar conversacion fuera de ventana).
9. Revisar politicas de mensajeria y calidad de numero.

## Prueba minima recomendada (tu + 2 personas)

### Fase A - Sanidad 1:1 (obligatoria)
1. Usuario A escribe al numero de negocio.
2. Recibes webhook y respondes automaticamente.
3. Usuario B repite.
4. Verificas:
- Recepcion y envio correcto.
- Mapeo por telefono.
- Logs de auditoria basicos.

### Fase B - Validacion de grupos/canales (gate)
1. Preparar cuenta/sesion de Baileys para grupo de prueba del club.
2. Ejecutar una demo funcional real en entorno controlado:
- Publicar mensaje de "partido abierto".
- Leer respuesta de usuarios en grupo.
- Confirmar inscripcion y trazabilidad en backend.
3. Registrar evidencia:
- Capturas de logs/eventos.
- IDs de eventos.
- Resultado de conmutar kill switch ON/OFF.

## Criterio de aprobacion del gate
Se aprueba solo si hay evidencia reproducible de:
- DM oficial estable.
- Grupos con Baileys estables para el piloto.
- Apagado de Baileys sin romper operacion (fallback manual real).

## Criterio de rechazo
Si Baileys no es estable en la operacion real del club, no automatizar grupos.
