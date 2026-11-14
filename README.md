# CUBOVERSO ARCADE — Alpha 1.4

Juego HTML original de construcción y supervivencia, inspirado en la estética de los primeros videojuegos de cubos. No es el juego oficial Minecraft ni utiliza sus archivos originales.

## Qué contiene este paquete

- `portal.html`: página principal de **Cuboverso Arcade** con selección de juegos.
- `index.html`: **Cuboverso Alpha 1.4**, juego 3D individual y multijugador.
- `universo.html`: **Universo Sandbox**, pequeño juego HTML independiente para crear cuerpos celestes.
- `servidor.js`: servidor HTTP y WebSocket para publicar los tres archivos y gestionar salas online.
- `package.json`, `Dockerfile`, `railway.json`: configuración para ejecutar y desplegar en Railway.

## Funcionalidades nuevas de Alpha 1.4

- Criaturas: ovejas, vacas, cerdos, perros (se pueden domesticar de forma sencilla), zombis, esqueletos, endermans y criaturas explosivas. Cuentan con movimientos y reacciones básicos al daño. Los zombis comprueban la altura y un recorrido despejado antes de atacar.
- Espadas de madera, piedra, hierro y diamante; palas, hachas, escudos y armadura de malla, junto con las armaduras anteriores.
- Daño entre jugadores de una sala, validación básica de distancia desde el servidor, reacción al daño, muerte y reaparición.
- Cuevas que se oscurecen según el techo sobre el personaje, antorchas, sonidos sencillos de acciones, animación de comer, saltar y golpear, y rotación de la cabeza.
- Más minerales: cobre, esmeralda, redstone, lapislázuli y cuarzo. Estructuras nuevas: torres en ruinas y cabañas sencillas.
- Generación de terreno más profundo en mundos nuevos; los sectores lejanos se regeneran a partir de la misma semilla.
- Nether **experimental**: se fabrica y coloca un bloque portal (anillo de obsidiana y diamante) para viajar a otra zona con terreno rojizo. Cerca del lugar de llegada aparece un portal para volver. No incluye todas las mecánicas del Nether original.
- Vallas, soporte de armaduras, cofres dobles básicos (hasta 54 tipos de objetos), cama corregida y puertas con apertura de 90° visual.
- Inventario retro con cuadrícula manual de crafteo, vista del personaje y pequeños sprites dibujados a píxeles para los objetos, sin emojis para equipamiento.
- Chat con mensajes visibles a la izquierda mientras juegas; servidores favoritos, opción de recordar contraseña **solo si se marca expresamente** y contador de jugadores conectados por servidor compatible.
- Portal de juegos con Cuboverso y Universo Sandbox, al que se podrán añadir otros títulos HTML más adelante.

> **Importante:** algunas funciones (Nether, IA de criaturas, cofres dobles y combate en red) siguen siendo prototipos. La experiencia gráfica completa no se ha podido verificar en todos los navegadores y dispositivos; el motor Three.js se carga de internet.

## Ejecutar localmente

Requiere Node.js 18 o superior.

1. Descomprime el ZIP en una carpeta.
2. Abre una consola en esa carpeta y ejecuta `npm start`.
3. Entra a `http://localhost:3000/` — verás la **biblioteca de juegos**.
4. Para Cuboverso entra a `http://localhost:3000/cuboverso`.
5. Puedes usar el chat, crear una sala y compartir el código con otras personas conectadas al mismo servidor.

Abrir `index.html` directamente funciona para **un jugador** con internet; para acceder a la biblioteca y a salas multijugador necesitas el servidor web.

## Publicar en tu Railway

Tu dirección proporcionada fue: `https://nose-production-de5ef24b.up.railway.app/`.

**Este ZIP no actualiza por sí mismo el sitio remoto.** Si usas GitHub con Railway, realiza lo siguiente:

1. Haz una copia de seguridad del volumen o archivo `mundos_servidor.json` que almacena mundos y jugadores.
2. Reemplaza los archivos de tu repositorio conectado a Railway por el contenido de este paquete. No subas ninguna contraseña ni archivo `.env`.
3. Confirma los cambios en el repositorio; revisa que Railway realice un despliegue usando el `Dockerfile` de esta versión (incluye `portal.html` y `universo.html`).
4. Comprueba `https://nose-production-de5ef24b.up.railway.app/health` y que reporte `version: "1.4.0"`.
5. Abre la dirección principal: verás **Cuboverso Arcade**. Para jugar entra a `/cuboverso`.

**Persistencia:** en Railway añade o conserva un volumen montado en `/data` y establece `DATA_DIR=/data`. No elimines ni sustituyas el volumen al publicar. Los mundos que guardas en tu navegador son diferentes de los mundos almacenados en el servidor.

**Contraseña del servidor:** si estableces `ACCESS_KEY` como variable privada de Railway, al entrar a una sala los jugadores deberán conocerla. El botón “Guardar servidor actual” permite recordar un servidor. La contraseña se guarda como texto en el almacenamiento del navegador **únicamente si se activa la casilla**; evita esa opción en teléfonos o computadoras compartidos. El código de sala y la contraseña no deben publicarse en el chat abierto.

**Límites del multijugador:** hasta 12 jugadores por sala, no incluye sistema de cuentas, moderación avanzada ni protección completa frente a trampas. Para partidas públicas con desconocidos se necesitarían controles adicionales.

## Controles

- **PC:** WASD mover, ratón mirar, clic izquierdo minar/golpear, clic derecho colocar o usar, E inventario, T chat, F5 cambiar cámara, 1–9 barra rápida, espacio saltar, Shift correr, Escape menú.
- **Celular:** joystick para caminar, desliza para mirar y usa los botones para minar, colocar, saltar, inventario, chat y cámara.

## Verificación realizada

- Comprobación de sintaxis JS del cliente y servidor.
- Prueba de inventario y creación/guardado de un mundo nuevo con navegador de pruebas (sin WebGL completo).
- Prueba de ocho recetas de crafteo manual de construcción.
- Pruebas con dos jugadores para sincronización de bloques, mensajes, daño PvP y contador de conectados.
- Prueba de rutas `/`, `/cuboverso`, `/juegos/universo.html` y `/health`.
- El renderizado real 3D, las animaciones y el rendimiento en tu dispositivo todavía requieren comprobarse en Chrome.
