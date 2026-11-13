# CUBOVERSO ALPHA — servidor en internet

Juego HTML + servidor Node.js con salas privadas, chat, bloques compartidos y mundos persistentes. **No es el juego oficial Minecraft.**

## Empezar en tu computadora

1. Instala Node.js 18 o posterior.
2. Abre una terminal dentro de esta carpeta y ejecuta `npm start` o `node servidor.js`.
3. Abre **http://localhost:3000** en Chrome.
4. Selecciona **Multijugador → Crear sala**. Comparte el código con personas de confianza.

## Publicarlo con Railway

1. Crea un repositorio privado de GitHub con el contenido de esta carpeta (sin subir tus archivos personales).
2. Abre **https://railway.com/** y crea un proyecto **Deploy from GitHub Repo** usando ese repositorio.
3. Railway detectará el `Dockerfile` y ejecutará Node.js. En **Settings → Networking → Public Networking → Generate Domain**, habilita un enlace web HTTPS.
4. **Importante para conservar los mundos:** añade un **Volume** al servicio y móntalo en **`/data`**. Luego, en **Variables**, añade **`DATA_DIR=/data`**. Se usará `mundos_servidor.json` dentro de ese volumen. Si no pones volumen, las partidas pueden desaparecer tras reinicios o actualizaciones.
5. Recomiendo configurar una contraseña en **Variables**: **`ACCESS_KEY=...`** con una contraseña larga que compartirás solo con tus amigos. No la pongas en los archivos del repositorio.
6. Abre el enlace HTTPS generado en Chrome. En el menú **Multijugador**, deja en blanco **Dirección del servidor**: se conectará automáticamente usando WSS al mismo dominio. Escribe la contraseña si la configuraste y pulsa **Crear sala**.
7. Tus amigos abren exactamente el mismo enlace HTTPS, escriben su nombre y la contraseña, y eligen **Unirse a sala** con el código que les hayas enviado.

Railway podría requerir un plan o datos de facturación; consulta su precio antes de habilitar un servicio. Si necesitas un adulto para completar una cuenta de pago, solicita su ayuda.

## Variables de entorno

| Variable | Valor sugerido | Descripción |
| --- | --- | --- |
| `PORT` | (automática en Railway) | Puerto HTTP / WebSocket |
| `HOST` | `0.0.0.0` | Dirección de escucha |
| `DATA_DIR` | `/data` | Directorio persistente (en Railway monta un volumen ahí) |
| `ACCESS_KEY` | secreto opcional | Restringe la creación y acceso a salas |
| `MAX_ROOMS` | `100` | Máximo de salas que pueden crearse |
| `MAX_CONNECTIONS` | `80` | Máximo de conexiones WebSocket simultáneas |

La ruta `/health` permite comprobar que el servidor está funcionando; muestra el número total de salas y jugadores, no códigos.

## Qué funciona y qué falta

**Funciona:** salas con código, jugadores visibles, chat, cambios de bloques compartidos, inventarios por navegador/nombre y guardado de mundos en el servidor cuando se usa almacenamiento persistente.

**Pendiente de mejorar:** los animales y enemigos siguen simulados individualmente en cada cliente. No incluye cuentas, moderación avanzada, recuperación automática tras desconexión ni protección anti-trampas. Comparte el enlace solo con amigos y no compartas datos personales en el chat.

## Comprobar que el servidor esté vivo

Abre `https://TU-DOMINIO/health`, reemplazando `TU-DOMINIO` por la URL que Railway te asigne. Debería aparecer un JSON con `"ok":true`.
