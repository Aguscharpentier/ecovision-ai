# EcoVision AI · Landing page

**El ojo inteligente que acelera el reciclaje.**

Landing page premium en modo oscuro para EcoVision AI, startup B2B de Concepción (Chile) que automatiza la clasificación de PET, acero, papel y cartón con visión artificial.

La web es 100 % estática (HTML, CSS y JavaScript sin dependencias). Funciona abriendo `index.html` en el navegador y se puede publicar tal cual en Netlify, Vercel, GitHub Pages o cualquier hosting.

---

## Estructura

```
ecovision-ai/
├── index.html        Estructura y contenido de todas las secciones
├── styles.css        Sistema de diseño, componentes y responsive
├── script.js         Animaciones, flip cards, demo en vivo y formulario
├── chatbot.js        Asistente de preguntas frecuentes (sin servidor)
├── modelo.js         Prueba del modelo de Teachable Machine con cámara o foto
├── model/            Archivos del modelo (model.json, model.weights.bin, metadata.json)
├── app/              App para celular (PWA), ver "App para celular" más abajo
├── README.md
└── images/
    ├── logo.svg          Logo principal (navbar, footer, favicon)
    ├── logo_white.svg    Versión blanca del logo
    ├── hero_visual.svg   Visual principal del hero (animado)
    ├── service_1.svg     Visión en tiempo real
    ├── service_2.svg     Clasificación de PET
    ├── service_3.svg     Acero
    ├── service_4.svg     Papel y cartón
    ├── service_5.svg     Expulsión automática
    └── service_6.svg     Analítica de planta
```

Las imágenes son SVG propios, en verde #22C55E sobre fondo oscuro y sin texto dentro (salvo el logo, que es un ojo con iris segmentado dentro de esquinas de enfoque de cámara). Pesan pocos KB y se ven nítidas en cualquier pantalla.

## Secciones

1. **Navbar** fija con desenfoque al hacer scroll y menú hamburguesa en tablet y móvil.
2. **Hero** con el tagline, la propuesta de valor, dos CTA y el visor de cámara que enfoca y muestra las detecciones.
3. **Tecnología y métricas** (marcadas como metas del piloto).
4. **Solución**: 6 flip cards con imagen. Giran con hover en escritorio y con un toque en móvil o con Enter en teclado.
5. **Cómo funciona**: los 4 pasos, de la captura a la medición.
6. **Demo en vivo**: simulación en canvas de una cinta con detección y separación. Permite cambiar entre EcoVision AI y clasificación manual y comparar la pureza.
7. **Prueba del modelo**: el modelo de Teachable Machine con cámara o foto.
8. **Integraciones y API** con un ejemplo de evento JSON y botón para copiar.
9. **Planes**: Piloto, Planta y Red, todos a cotizar (sin precios en números).
10. **Roadmap** en 4 fases.
11. **Nosotros**: origen en Concepción y la Universidad del Desarrollo.
12. **Ubicación**: mapa interactivo de Google Maps incrustado en la página (UDD sede Ainavillo, Ainavillo 456, Concepción), con botones Edificio / Barrio / Ciudad para cambiar el acercamiento sin salir de la web.
13. **CTA final** con formulario de postulación al piloto.
14. **Footer** con columnas de enlaces y ubicación.

## Asistente de preguntas frecuentes

El botón **¿Dudas?** (abajo a la derecha) abre un asistente que responde preguntas frecuentes al instante. Funciona 100 % en el navegador: no necesita servidor ni claves de API, no tiene costo y no guarda datos de los visitantes.

- **Cómo entiende:** busca palabras clave en la pregunta, sin importar tildes, mayúsculas ni plurales. Las palabras genéricas pesan menos que las específicas, así "¿funciona sin internet?" responde sobre internet y no sobre el funcionamiento general.
- **Temas que cubre:** qué es EcoVision, materiales (y los que vienen), cómo funciona, precisión, velocidad, instalación, internet, integraciones, reportes y Ley REP, planes y precios, piloto, ubicación, contacto, equipo, roadmap, demo, el modelo de Teachable Machine y beneficios.
- **Si no sabe:** lo dice y ofrece el correo y el Instagram.
- **Editar o agregar respuestas:** abre `chatbot.js` y modifica el arreglo `INTENTS`. Cada tema tiene `keys` (palabras clave; agrega `~1` a las genéricas), `answer` (la respuesta), `actions` (botones a secciones o enlaces) y `next` (preguntas sugeridas).
- **Pasar a IA más adelante:** se puede reemplazar la función `findAnswer` por una llamada a un modelo de IA a través de un servidor intermedio (por ejemplo Cloudflare Workers) que guarde la clave de API. Nunca pongas una clave de API directamente en estos archivos, porque quedaría pública.

## Modelo real (Teachable Machine)

La sección **Prueba nuestro modelo con tu cámara** usa el modelo de imagen entrenado en Teachable Machine (https://teachablemachine.withgoogle.com/models/WM3F4zqXx/), con tres clases: Plástico PET, Metal/ Aluminio y Papel y cartón.

- **Cómo se usa:** el visitante activa la cámara (en el celular abre la trasera; hay un botón para cambiarla) o sube una foto. El modelo muestra en vivo el material más probable y el porcentaje de cada clase. Bajo 60 % de confianza indica "No estoy seguro". Las fotos se clasifican a su tamaño original (recortadas al centro), no al tamaño con que se ven en pantalla.
- **Privacidad:** todo se procesa en el navegador con TensorFlow.js. Ninguna imagen sale del dispositivo, y la cámara se apaga sola al cambiar de pestaña.
- **Velocidad:** las librerías (TensorFlow.js 1.3.1 y @teachablemachine/image 0.8.5, desde jsDelivr) y el modelo (~2 MB) se descargan solo cuando alguien usa la sección, así que no hacen más lenta la página.
- **Archivos:** el modelo está copiado en la carpeta `model/` para que cargue rápido y no dependa del enlace de Teachable Machine.
- **Actualizar el modelo:** si lo reentrenan, en Teachable Machine elijan "Exportar modelo", luego "Tensorflow.js" y "Descargar", y reemplacen los tres archivos de `model/` por los nuevos. La app para celular usa estos mismos archivos: cambien también `VERSION` en `app/sw.js` (ver más abajo) para que los celulares descarguen el modelo nuevo. Las etiquetas y barras se actualizan solas a partir de `metadata.json`. Si cambian los nombres de las clases, los colores se asignan por palabra clave (PET/plástico en azul, metal/aluminio/acero en gris, papel/cartón en kraft) en la función `classColor` de `modelo.js`.

## App para celular (PWA)

La carpeta `app/` es una app instalable que se publica junto a la web, en `https://aguscharpentier.github.io/ecovision-ai/app/`. Usa el mismo modelo de `model/`.

- **Qué hace:** clasifica con la cámara (trasera por defecto, con botón para girar) o con una foto. El visor es cuadrado porque el modelo analiza el cuadrado central de la imagen: lo que se ve es lo que ve el modelo. El botón **Registrar** guarda el resultado con una miniatura en el **Historial**, que muestra un resumen por material. El historial queda solo en ese celular (hasta 60 registros).
- **Sin internet:** al abrirla por primera vez, el *service worker* (`app/sw.js`) guarda la app, las librerías, la fuente y el modelo (unos 3,5 MB). Desde ahí funciona sin conexión. La app no carga nada de otros dominios: TensorFlow.js, Teachable Machine y la fuente Archivo están copiados en `app/vendor/` y `app/fonts/`.
- **Cómo se instala:**
  - Android (Chrome): aparece el botón **Instalar** arriba a la derecha, o en el menú del navegador "Instalar app".
  - iPhone (Safari): Compartir y luego **Agregar a inicio**. La app muestra este aviso la primera vez.
- **Privacidad:** igual que en la web, las imágenes se procesan en el celular y no se envían a ningún servidor.

### Publicar cambios en la app

Los celulares guardan la app, así que una versión nueva solo les llega si cambia `VERSION` en `app/sw.js`:

1. Edita lo que necesites (`app/index.html`, `app/app.css`, `app/app.js` o los archivos de `model/`).
2. Cambia `VERSION` en `app/sw.js` a la fecha del día (por ejemplo `"20261115"`).
3. En `app/index.html`, usa el mismo valor en los `?v=` de `app.css` y `app.js`.
4. Publica. Quien tenga la app abierta verá el aviso **Hay una versión nueva** con el botón **Actualizar**.

Si agregas un archivo nuevo que la app necesite sin internet, súmalo a la lista `PRECACHE` de `app/sw.js`.

### Archivos de la app

```
app/
├── index.html              Pantallas: Clasificar, Historial y Acerca
├── app.css                 Estilos (mismos colores y tipografía que la web)
├── app.js                  Cámara, foto, modelo, historial e instalación
├── sw.js                   Service worker: funcionamiento sin internet y actualizaciones
├── manifest.webmanifest    Nombre, colores e íconos para instalarla
├── icons/                  Íconos PNG (192, 512, maskable para Android, 180 para iPhone)
├── fonts/archivo-latin.woff2
└── vendor/                 TensorFlow.js 1.3.1 y @teachablemachine/image 0.8.5 (licencia Apache 2.0)
```

Los íconos se generaron a partir de `images/logo.svg`. Si cambia el logo, hay que volver a exportarlos en los mismos tamaños.

### Siguiente paso posible

Para publicarla en Google Play o App Store se puede empaquetar esta misma app con Capacitor (o, solo para Android, con una Trusted Web Activity). No hace falta reescribirla.

## Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `--primary-500` (`--green`) | `#22C55E` | Lo que el sistema detecta y las acciones principales |
| `--primary-400` (`--green-bright`) | `#4ADE80` | Hover y foco |
| `--primary-300` (`--green-soft`) | `#86EFAC` | Enlaces y textos destacados |
| `--primary-700` (`--green-deep`) | `#15803D` | Tonos profundos |
| `--on-green` | `#04140A` | Texto de los botones verdes (casi negro) |
| `--black` | `#050706` | Fondo principal (negro con leve sesgo verde) |
| `--surface` | `#0A0E0C` | Secciones alternas |
| `--panel` / `--panel-2` | `#0F1412` / `#141A17` | Tarjetas y paneles |
| `--text` | `#EEF2EE` | Títulos |
| `--text-2` | `#B9C2BC` | Texto |
| `--text-3` | `#85908A` | Texto secundario |
| `--mat-pet` | `#4FB3F6` | PET |
| `--mat-acero` | `#A9B2B8` | Acero / metal |
| `--mat-papel` | `#ECE9E0` | Papel |
| `--mat-carton` | `#C4925B` | Cartón |
| `--warning` | `#F59E0B` | "No estoy seguro", errores de la demo |

La escala completa del verde (`--primary-50` a `--primary-900`) y `--primary-rgb` están al inicio de `styles.css`; el resto de la hoja usa los alias `--green-*`. Para cambiar el color de marca basta con editar esa escala. Los colores de material se repiten en `script.js` (objeto `MATS` de la demo) para que el canvas use exactamente los mismos.

El texto de los botones verdes es casi negro (`--on-green`) en vez de blanco, porque el blanco sobre verde neón no tiene contraste suficiente para leerse bien.

**Tipografía:** Archivo (Google Fonts) para toda la web, usando su ancho variable: más ancho e industrial en los títulos, normal en el texto. JetBrains Mono solo en el bloque de código.

**Sello visual:** las esquinas de detección de la cámara enmarcan solo lo importante (visor del inicio, plan recomendado, mapa y reverso de cada servicio). Cada material tiene un color fijo: PET azul, acero gris metal, papel blanco y cartón kraft. La única animación de entrada es el visor del inicio, que enfoca y muestra las detecciones.

## Responsive

| Ancho | Comportamiento |
|---|---|
| ≥ 1440 px | Contenedor de 1280 px |
| 1024–1439 px | Escritorio: hero en 2 columnas, servicios en 3 |
| < 1200 px | Menú hamburguesa (son 8 enlaces) |
| 768–1023 px | Tablet: servicios en 2 columnas, panel de la demo bajo la cinta |
| < 768 px | Móvil: 1 columna, botones a ancho completo, demo cuadrada, asistente a pantalla completa |

También respeta `prefers-reduced-motion`: si el usuario pidió menos movimiento, se desactivan las animaciones y la demo parte en pausa.

**Caché de GitHub Pages:** los enlaces a `styles.css`, `script.js`, `chatbot.js` y `modelo.js` llevan `?v=fecha` (por ejemplo `?v=20261027b`). Cambia ese valor en `index.html` cada vez que publiques cambios en esos archivos.

## Antes de publicar

- **Métricas:** las cifras (4 materiales, <80 ms, 95 % de pureza) están marcadas como metas de diseño del piloto. Actualízalas cuando tengas resultados medidos.
- **Formulario:** no tiene servidor. Al postular, arma un correo con los datos dirigido a ecovisionai1@gmail.com para que el visitante lo envíe desde su propio correo. Para recibir las postulaciones automáticamente, conéctalo a un servicio como Formspree, Getform o Netlify Forms y reemplaza el bloque `submit` de `script.js` por el envío real.
- **Redes sociales:** Instagram (@ecovisionai1) y el correo ecovisionai1@gmail.com ya están enlazados en Contacto, Nosotros y el footer. LinkedIn y YouTube siguen apuntando a `#`: cambia el `href` por las URLs reales o borra esos enlaces.
- **Privacidad:** el enlace del footer también apunta a `#`.

## Personalización rápida

- **Textos:** todo el contenido está en `index.html`, comentado por sección.
- **Servicios:** cada flip card es un bloque `<article class="service-card-flip">`. Cambia la imagen, el título, la descripción y las etiquetas.
- **Demo:** en `script.js`, `SPAWN_POOL` define la mezcla de materiales y la función `classify()` define las tasas de acierto del modo IA y del modo manual.
- **Imágenes:** puedes reemplazar los SVG por fotos reales (PNG o WebP) con el mismo nombre de archivo, actualizando la extensión en `index.html`.

## Créditos

Diseño y desarrollo para EcoVision AI · Concepción, Región del Biobío, Chile.
Fuentes: Archivo y JetBrains Mono, de Google Fonts (licencia SIL Open Font License).
Librerías de la app: TensorFlow.js y @teachablemachine/image (licencia Apache 2.0).
