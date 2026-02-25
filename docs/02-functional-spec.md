# 02 - Functional Spec

## Reglas clave
- Staff siempre prevalece ante cualquier conflicto.
- Solo staff puede aprobar cancelaciones.
- El bot nunca ejecuta acciones criticas con baja confianza.
- Formato de partido MVP: 4 jugadores.

## Flujo A - Publicar partido
1. Staff crea partido (nivel, hora, pista, plazas).
2. Bot publica mensaje en canal/grupo habilitado.
3. Jugadores solicitan entrada por interaccion definida (DM o flujo soportado).

## Flujo B - Inscripcion
1. Jugador pide inscripcion.
2. Bot valida disponibilidad.
3. Si hay plaza: confirma alta.
4. Si no hay plaza: agrega a waitlist FIFO.

## Flujo C - Cancelacion y reemplazo
1. Jugador pide baja.
2. Staff aprueba o rechaza.
3. Si se aprueba: se dispara oferta al siguiente de waitlist.
4. Timeout de confirmacion: 30 minutos.
5. Si no confirma nadie: escalar a staff.

## Flujo D - Escalado
Se escala a staff cuando:
- Intent critico con baja confianza.
- Estado inconsistente.
- Expiracion de oferta de reemplazo.
- Conflicto de reglas.

## Soporte idiomas
- Espanol e ingles.

## Privacidad UX
- Consentimiento explicito en onboarding.
- Aviso corto de privacidad + enlace.
- Comando de borrado de datos disponible en MVP.
