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

Las imágenes son vectoriales (SVG): pesan pocos KB, se ven nítidas en cualquier pantalla y algunas tienen animaciones sutiles incorporadas (línea de escaneo, campos magnéticos, chorros de aire).

## Secciones

1. **Navbar** fija con desenfoque al hacer scroll y menú hamburguesa en tablet y móvil.
2. **Hero** con el tagline, la propuesta de valor, dos CTA, 50 partículas y el visual flotante.
3. **Tecnología y métricas** con contadores animados (marcadas como metas del piloto).
4. **Solución**: 6 flip cards con imagen. Giran con hover en escritorio y con un toque en móvil o con Enter en teclado.
5. **Cómo funciona**: los 4 pasos, de la captura a la medición.
6. **Demo en vivo**: simulación en canvas de una cinta con detección y separación. Permite cambiar entre EcoVision AI y clasificación manual y comparar la pureza.
7. **Integraciones y API** con un ejemplo de evento JSON y botón para copiar.
8. **Planes**: Piloto, Planta y Red.
9. **Roadmap** en 4 fases.
10. **Testimonios** (textos de ejemplo, ver abajo).
11. **Nosotros**: origen en Concepción y la Universidad del Desarrollo.
12. **Ubicación**: mapa interactivo de Google Maps incrustado en la página (UDD sede Ainavillo, Ainavillo 456, Concepción), con botones Edificio / Barrio / Ciudad para cambiar el acercamiento sin salir de la web.
13. **CTA final** con formulario de postulación al piloto.
14. **Footer** con columnas de enlaces y ubicación.

## Asistente de preguntas frecuentes

El botón **¿Dudas?** (abajo a la derecha) abre un asistente que responde preguntas frecuentes al instante. Funciona 100 % en el navegador: no necesita servidor ni claves de API, no tiene costo y no guarda datos de los visitantes.

- **Cómo entiende:** busca palabras clave en la pregunta, sin importar tildes, mayúsculas ni plurales. Las palabras genéricas pesan menos que las específicas, así "¿funciona sin internet?" responde sobre internet y no sobre el funcionamiento general.
- **Temas que cubre:** qué es EcoVision, materiales (y los que vienen), cómo funciona, precisión, velocidad, instalación, internet, integraciones, reportes y Ley REP, planes y precios, piloto, ubicación, contacto, equipo, roadmap, demo y beneficios.
- **Si no sabe:** lo dice y ofrece el correo y el Instagram.
- **Editar o agregar respuestas:** abre `chatbot.js` y modifica el arreglo `INTENTS`. Cada tema tiene `keys` (palabras clave; agrega `~1` a las genéricas), `answer` (la respuesta), `actions` (botones a secciones o enlaces) y `next` (preguntas sugeridas).
- **Pasar a IA más adelante:** se puede reemplazar la función `findAnswer` por una llamada a un modelo de IA a través de un servidor intermedio (por ejemplo Cloudflare Workers) que guarde la clave de API. Nunca pongas una clave de API directamente en estos archivos, porque quedaría pública.

## Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `--primary-500` | `#22C55E` | Acento principal |
| `--primary-400` | `#4ADE80` | Hover y textos destacados |
| `--primary-600` | `#16A34A` | Botones activos |
| `--primary-700` | `#15803D` | Gradientes profundos |
| `--bg-primary` | `#000000` | Fondo principal |
| `--bg-secondary` | `#09090B` | Secciones alternas |
| `--bg-tertiary` | `#18181B` | Cards |
| `--text-primary` | `#FFFFFF` | Títulos |
| `--text-secondary` | `#E4E4E7` | Texto |
| `--text-tertiary` | `#A1A1AA` | Texto secundario |

La escala completa (`--primary-50` a `--primary-900`) y `--primary-rgb` están al inicio de `styles.css`. Para cambiar el color de marca basta con editar esas variables.

El texto de los botones verdes es casi negro (`--on-primary`) en vez de blanco, porque el blanco sobre verde neón no tiene contraste suficiente para leerse bien.

**Tipografía:** Archivo (Google Fonts) para toda la web, usando su ancho variable: más ancho e industrial en los títulos, normal en el texto. JetBrains Mono solo en el bloque de código.

**Sello visual:** las esquinas de detección de la cámara enmarcan solo lo importante (visor del inicio, plan recomendado, mapa y reverso de cada servicio). Cada material tiene un color fijo: PET azul, acero gris metal, papel blanco y cartón kraft. La única animación de entrada es el visor del inicio, que enfoca y muestra las detecciones.

## Responsive

| Ancho | Comportamiento |
|---|---|
| ≥ 1440 px | Contenedor de 1280 px |
| 1024–1439 px | Escritorio: hero en 2 columnas, servicios en 3 |
| 768–1023 px | Tablet: menú hamburguesa, servicios en 2 columnas, panel de la demo bajo la cinta |
| < 768 px | Móvil: 1 columna, botones a ancho completo, demo cuadrada, menos partículas |

También respeta `prefers-reduced-motion`: si el usuario pidió menos movimiento, se desactivan las animaciones y la demo parte en pausa.

## Antes de publicar

- **Testimonios:** los tres textos son de ejemplo y lo dicen en la página. Reemplázalos por testimonios reales de los pilotos (en `index.html`, sección `#testimonios`) y borra el aviso amarillo.
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
Fuentes: Google Fonts (licencia SIL Open Font License).
