# CUBOVERSO ALPHA 1.2 — Juego y servidor

Juego original en HTML y WebGL, inspirado en los juegos clásicos de bloques. No es el Minecraft oficial.

## Novedades

- Los bloques y algunos animales dejan objetos pequeños que caen, rebotan, giran y se recogen al acercarse.
- Las ovejas dan lana; las tijeras permiten esquilarlas.
- Cama de dos bloques: 3 lanas + 3 tablones en la mesa de trabajo. Permite guardar el lugar de reaparición y dormir de noche.
- Sol, luna, estrellas, nubes, cambios de luz, agua pixelada y niebla.
- Antorchas con iluminación; nuevos bloques, lana, flores y cofres.
- Primera persona y dos cámaras en tercera persona: **F5** en PC o **📷 Cámara** en celular.
- Inventario de casillas, armaduras, crafteo manual 2×2 y 3×3, hornos y cofres.
- Guardado de mundos solo y en multijugador con códigos de sala y chat.
- Servidor online preconfigurado: https://nose-production-de5ef24b.up.railway.app/.

## Instalar localmente

1. Instala Node.js 18 o posterior.
2. En esta carpeta ejecuta `npm start`.
3. Abre http://localhost:3000/.
4. Crea una sala multijugador y comparte el código con tus amigos.

El juego carga Three.js desde un CDN y opcionalmente un modelo 3D de Higgsfield: se necesita conexión a internet para esos recursos.

## Publicar la nueva versión en TU Railway

Tu URL es https://nose-production-de5ef24b.up.railway.app/.
**Este ZIP no actualiza automáticamente esa web:** tienes que desplegar estos archivos.

Si tu proyecto de Railway utiliza un repositorio GitHub:
1. **Haz una copia de seguridad** del volumen de datos, si existe.
2. Reemplaza los archivos del repositorio por todos los de este ZIP, en particular `index.html`, `servidor.js` y `package.json`.
3. Guarda y sube el commit. Si Railway tiene habilitado el despliegue automático desde esa rama, publicará la nueva versión.
4. Abre la web y confirma que la portada dice **Alpha 1.2**. Verifica además que la ruta `/health` responde.

Si es un nuevo servicio, crea un despliegue desde el repositorio (el `Dockerfile` y `railway.json` están incluidos), habilita una dirección HTTPS y configura el volumen.

### Conservar mundos

- Añade o conserva un volumen persistente montado en `/data`.
- Configura la variable de entorno `DATA_DIR=/data`.
- No elimines el volumen ni el archivo `mundos_servidor.json` durante el despliegue.
- Puedes configurar `ACCESS_KEY` como contraseña privada del servidor. No la pongas en archivos públicos.

## Controles

- PC: WASD mover; ratón mirar; mantener clic izquierdo minar; clic derecho colocar/usar; E inventario; T chat; F5 cámara; 1–9 casillas; espacio saltar; Escape pausa.
- Móvil: joystick, deslizar para mirar, botones Minar/Colocar/Saltar/Inventario/Chat/Cámara.
- Cama: colócala sobre dos espacios libres; tócala para fijar el punto de aparición y dormir de noche.
- Ovejas: esquílalas con tijeras o recoge lana al vencer una oveja.
- Objetos del suelo: se guardan automáticamente al acercarte.

## Limitaciones

- La experiencia gráfica completa en navegadores aún requiere pruebas con dispositivos reales.
- Los animales y enemigos se simulan en cada cliente y no están sincronizados por el servidor.
- El servidor está pensado para salas pequeñas con amigos; no incluye cuentas ni moderación avanzada.
- No compartas información personal en el chat. Usa una contraseña privada para salas cerradas.
