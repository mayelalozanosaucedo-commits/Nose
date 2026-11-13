# CUBOVERSO ALPHA 1.3 — Juego web y servidor

**Juego independiente** hecho en HTML + JavaScript + WebGL, con aspecto pixelado inspirado en los juegos clásicos de bloques. No es Minecraft oficial ni contiene sus texturas originales.

## Cambios de esta versión

- **Mundo generado por sectores de 16×16 (chunks)** que se cargan y descargan al explorar. Incluye costas, océanos, desiertos, bosques, nieve, cuevas y montañas altas. El mapa ya no termina en el antiguo cuadrado de 96×96. Los límites prácticos dependen del rendimiento y de la memoria; el servidor admite exploración muy extensa, no una simulación literalmente ilimitada.
- **Texturas pixeladas originales** para bloques, madera, roca, minerales, vidrio, puertas, trampillas y cofres.
- **Vidrio transparente:** se dibuja separado de la geometría opaca, permite ver el mundo detrás y sigue bloqueando el paso.
- **Nuevas piezas de construcción:** puerta de madera de dos bloques, trampilla, losas de madera/piedra, escaleras de madera/piedra. Las puertas y trampillas se abren/cerran al usarlas y conservan la orientación al guardar.
- **Hachas:** madera, piedra, hierro y diamante, con velocidad mejorada al talar.
- **Crafteo manual** 2×2 y 3×3, horno con combustible, inventario gris retro, armaduras equipables y cofres.
- **Personajes:** movimiento de piernas y brazos, armaduras visibles y objeto de la mano visible por los demás jugadores en multijugador.
- **Agua mejorada:** transparencia, ondas visuales, caída/flujo limitado a los huecos que abres y movimiento del jugador al nadar. No es simulación avanzada de fluidos.
- **Conserva funciones anteriores:** guardado de mundos, camas y spawn, lana de ovejas, animales, objetos recogibles, día/noche, clima, chat, primera/tercera persona y salas privadas.
- **Vaca 3D opcional de Higgsfield:** intenta cargar un GLB desde internet. Si no funciona, muestra el modelo cúbico integrado.

## Jugar individualmente

Abre `index.html` con Chrome o un navegador compatible. Necesitas conexión para cargar Three.js y el modelo 3D opcional. Al crear mundos en el navegador se guardan con `localStorage`; utilizar modo incógnito, borrar los datos del navegador o cambiar de navegador puede perderlos. Antes de actualizar conviene hacer una copia del guardado original.

## Jugar en servidor local

1. Instala Node.js 18+ (recomendado Node.js 22).
2. Abre una terminal en la carpeta descomprimida.
3. Ejecuta `npm start`.
4. Abre **http://localhost:3000/**.
5. Elige *Multijugador → Crear sala* y comparte el código de sala con las otras personas que entrarán por la misma página.

## Actualizar tu Railway

Tu dominio comunicado es **https://nose-production-de5ef24b.up.railway.app/**. El dominio ya está configurado como servidor por defecto cuando se abre el HTML como archivo local, pero **estos archivos no se suben automáticamente a tu servidor**.

1. **Haz copia de seguridad** de tus datos del servidor y del volumen existente.
2. Extrae el ZIP de esta versión y coloca sus archivos en el repositorio GitHub conectado a Railway (reemplaza `index.html`, `servidor.js`, `package.json`, `Dockerfile`, etc.).
3. Haz commit/push y confirma en Railway que el despliegue terminó sin errores.
4. Abre **https://nose-production-de5ef24b.up.railway.app/health**: en la respuesta debe aparecer `"version":"1.3.0"`.
5. Abre el enlace principal y comprueba que el menú dice **Cuboverso Alpha 1.3**.

Si tu servicio no tiene despliegue automático, elige **Deploy** en tu panel de Railway tras subir los cambios.

### Conservar mundos y progreso

- Mantén un **volumen persistente** montado en `/data`.
- Usa la variable de entorno `DATA_DIR=/data`.
- No elimines el archivo `mundos_servidor.json` ni el volumen entre versiones.
- `ACCESS_KEY` es una contraseña opcional; configúrala como **variable privada** en Railway, nunca en un repositorio público.
- El nuevo servidor guarda la orientación y el estado abierto/cerrado de puertas y trampillas. Los mundos nuevos utilizan el generador mejorado; la base de terrenos de mundos antiguos podría cambiar. **Respalda antes de actualizar.**

## Controles

| Accion | Computadora | Celular |
|---|---|---|
| Mover | WASD | Joystick izquierdo |
| Mirar | Ratón | Deslizar el dedo en el paisaje |
| Minar | Mantener clic izquierdo | Mantener **Minar** |
| Colocar / usar puerta, trampilla, cama, horno | Clic derecho | **Colocar** |
| Saltar | Espacio | **Saltar** |
| Inventario personal / fabricar 2×2 | E | Botón bolsa |
| Mesa de trabajo 3×3 | Utilizar una mesa colocada | Utilizar una mesa colocada |
| Cambiar cámara 1.ª / 3.ª | F5 | Botón cámara |
| Chat | T | Botón Chat |
| Barra rápida | 1–9 / rueda | Tocar casilla |
| Pausa | Escape | Botón menú |

### Recetas nuevas en la mesa de trabajo

- **Hacha:** 3 tablones/rocas/lingotes/diamantes formando cabeza lateral y 2 palos verticales.
- **Puerta:** 2 columnas por 3 filas de tablones → 3 puertas.
- **Trampilla:** 2 filas de 3 tablones → 2 trampillas.
- **Losa:** 3 tablones o 3 rocas en una fila → 6 losas.
- **Escalera:** 6 tablones o 6 rocas con forma de escalera → 4 escaleras.
- **Vidrio:** coloca arena y carbón en el horno; recoge el vidrio cuando termine.

## Límites conocidos

- Esta versión ha pasado revisión de sintaxis y pruebas de lógica del generador y del protocolo multijugador. **No se ha podido verificar el renderizado WebGL completo** en este entorno.
- Es un prototipo indie, no una réplica 1:1 del juego comercial. Las recetas y las físicas son simplificadas.
- Los animales se simulan por separado en cada cliente; el servidor sincroniza jugadores, objetos en manos, chat, piezas orientadas, cambios de bloques, cofres, hornos y objetos caídos.
- El servidor admite salas pequeñas (hasta 12 jugadores por sala), no un mundo masivo con cuentas, moderación o protección contra todas las trampas.
- Los cambios de agua son locales y limitados; los océanos se generan según la semilla.
- No compartas información personal en el chat; para jugar con amistades usa un código de sala privado.
