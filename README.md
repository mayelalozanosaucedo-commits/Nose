# 🎮 CUBOVERSO ALPHA 1.5 — ARCADE + SERVIDOR

Juego original de cubos inspirado en la estética de los juegos sandbox clásicos. Incluye portal de juegos, multijugador, mundos persistentes (si configuras volumen), inventario y modelos cúbicos animados. No es un producto oficial de Minecraft.

## Novedades

- Criaturas zombis, esqueletos, endermans, creepers, ovejas, vacas, cerdos y perros con detalles de cubos y movimiento de cuerpo. La mayoría de los modelos son **procedurales** del propio juego.
- Reacción roja al recibir daño, animación de ataque y caída al desaparecer, con efectos sonoros.
- Arco y flechas **virtuales** para el juego, incluyendo un esqueleto que utiliza un arco de fantasía; recetas en la cuadrícula de elaboración.
- Armaduras mejor ajustadas: casco que sigue la cabeza y hombreras que se mueven con los brazos.
- Cabeza que sigue la dirección de la cámara arriba, abajo y a los lados. Posición mejorada de las herramientas en manos.
- Servidores favoritos con código de sala recordado y botón «Entrar». Guardar contraseña es siempre opcional y solo se recomienda en dispositivos privados.
- Consulta opcional de cuántos jugadores están en una sala específica (`/room-status?code=...`).
- Juego y portal web (Cuboverso + Universo Sandbox) listos para publicar.

**Higgsfield:** se consiguió generar un modelo GLB de zombi en Higgsfield, pero no se incluyó como modelo animado en el juego porque no se pudo descargar y riggear desde este entorno. La cuenta indicó que no tenía créditos para generar los demás. Las criaturas jugables siguen con modelos originales animados del código.

## 🔴 ¡IMPORTANTE! PROTEGER TU SALA ANTES DE ACTUALIZAR

Tu proyecto **Nose**, en Railway, usa el dominio `https://nose-production-de5ef24b.up.railway.app/`. Al revisar Railway, no tenía ningún volumen persistente. Sin volumen, un nuevo despliegue o un reinicio del contenedor **puede borrar los datos del mundo**. Por eso NO desplegamos esta versión automáticamente.

Sigue este orden exacto:

1. **Sin reiniciar el servidor actual**, abre `rescatar_sala.html` desde tu computadora/celular, introduce la URL y el código de tu sala y descarga el archivo JSON con su mundo. Si tu nombre está conectado, elige un nombre libre para la copia del mundo. Guarda el JSON en un lugar seguro.
2. Si quieres recuperar los inventarios personales, cada jugador puede crear su propio respaldo con su nombre de jugador y luego usar «Restaurar el inventario de otro jugador». Si su sesión original sigue abierta, primero debe salir y luego acceder desde la herramienta para que el nombre esté libre.
3. En Railway, abre el servicio **Nose** y añade un volumen persistente montado en `/data`. Configura `DATA_DIR=/data`. **No hagas esto antes de tener respaldo**, porque el nuevo despliegue puede borrar los datos del contenedor antiguo.
4. Configura `ADMIN_IMPORT_KEY` con una clave aleatoria larga (mínimo 16 caracteres). No la pongas en un repositorio ni la compartas con jugadores.
5. Publica la nueva versión 1.5 reemplazando archivos en el repositorio GitHub conectado con Railway. Conserva el volumen en próximos despliegues.
6. Abre `restaurar_sala.html` en tu propio navegador, introduce la URL nueva, tu clave administrativa y el JSON del respaldo. La página recuperará el mismo código de sala. Por seguridad, el servidor no permitirá sobrescribir una sala existente.
7. Tus amigos podrán volver a entrar usando el **mismo código**. Guarda la sala en la lista de favoritos para entrar después con un clic.

### Precaución: respaldo en navegador

El archivo JSON puede contener información de inventario de tu personaje, nombres del mundo y construcciones. No compartas este respaldo públicamente. La herramienta de respaldo no almacena tu contraseña. No comparte información con ninguna web salvo con el servidor que introduzcas.

## Cómo probar localmente

1. Instala Node.js 18+.
2. En esta carpeta ejecuta `npm start` (o el script de iniciar servidor de tu sistema).
3. Abre `http://localhost:3000` para entrar en la biblioteca de juegos. `http://localhost:3000/cuboverso` abre el juego directamente.
4. Para guardar mundos del servidor localmente, crea la carpeta `data` y ejecuta con `DATA_DIR` señalando a esa carpeta, o deja los datos junto al servidor por defecto.

## Publicación en Railway

- El servidor usa `process.env.PORT` y escucha en `0.0.0.0`.
- Un volumen persistente debe quedar montado en `/data`, con `DATA_DIR=/data`.
- Opcional: `ACCESS_KEY` restringe el acceso al servidor de jugadores.
- `ADMIN_IMPORT_KEY` protege exclusivamente la ruta de importación de respaldos. Si no la configuras, la importación está desactivada.
- Health check: `/health`.
- Consulta de sala: `/room-status?code=CODIGO`.
- La ruta `POST /api/admin/restore-room` restaura una sala con un respaldo validado y clave administrativa. No sobrescribe salas existentes.
- La ruta `POST /api/admin/restore-player` restaura el inventario de otro jugador de la misma sala con la misma clave administrativa.

## Controles

- PC: WASD moverse; ratón mirar; clic izquierdo interactuar en el juego; clic derecho colocar/abrir; E inventario; F5 cambiar cámara; T chat; 1–9 ranuras.
- Móvil: joystick izquierdo, deslizar para mirar, botones táctiles de acción, cámara e inventario.

## Limitaciones

- No hay garantía de que el servidor remoto permanezca en línea 24/7: depende del plan, facturación y despliegue de Railway.
- La sala actual de Railway no se ha migrado por nuestra cuenta: es indispensable guardar el JSON **antes** del despliegue.
- La versión 1.5 añade animaciones y mejoras al combate, pero las criaturas y sus proyectiles todavía se simulan localmente; el servidor no es autoritativo para cada mob.
- Los modelos procedurales tienen una estética clásica; no son un clon ni usan texturas oficiales.
- La representación gráfica 3D no pudo probarse completamente desde este entorno por restricciones del navegador; se verificó sintaxis y lógica del servidor.
