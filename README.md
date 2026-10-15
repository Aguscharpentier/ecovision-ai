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
11. **Nosotros**: origen en Concepción y la Universidad del Desarrollo, con mapa de Google Maps de la sede Ainavillo (Ainavillo 456) y botones "Cómo llegar" y "Abrir en Google Maps".
12. **CTA final** con formulario de postulación al piloto.
13. **Footer** con columnas de enlaces y ubicación.

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

**Tipografía:** Plus Jakarta Sans (títulos), Inter (texto) y JetBrains Mono (código y datos), todas de Google Fonts.

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
- **Formulario:** no envía datos a ningún lado. Para recibir postulaciones, conéctalo a un servicio como Formspree, Getform o Netlify Forms y reemplaza el bloque `submit` de `script.js` por el envío real.
- **Redes sociales:** los enlaces de LinkedIn, Instagram y YouTube apuntan a `#`. Cambia el `href` por las URLs reales.
- **Privacidad:** el enlace del footer también apunta a `#`.

## Personalización rápida

- **Textos:** todo el contenido está en `index.html`, comentado por sección.
- **Servicios:** cada flip card es un bloque `<article class="service-card-flip">`. Cambia la imagen, el título, la descripción y las etiquetas.
- **Demo:** en `script.js`, `SPAWN_POOL` define la mezcla de materiales y la función `classify()` define las tasas de acierto del modo IA y del modo manual.
- **Imágenes:** puedes reemplazar los SVG por fotos reales (PNG o WebP) con el mismo nombre de archivo, actualizando la extensión en `index.html`.

## Créditos

Diseño y desarrollo para EcoVision AI · Concepción, Región del Biobío, Chile.
Fuentes: Google Fonts (licencia SIL Open Font License).
