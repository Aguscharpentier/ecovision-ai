/* =========================================================
   EcoVision AI · Asistente de preguntas frecuentes
   ---------------------------------------------------------
   - Funciona 100 % en el navegador: sin servidor, sin claves
     de API y sin guardar datos de los visitantes.
   - Detecta la intención de la pregunta por palabras clave
     (tolerante a tildes, mayúsculas y plurales) y responde con
     información de la propia web.
   - Para editar respuestas o agregar temas: modifica el arreglo
     INTENTS más abajo. Cada tema tiene palabras clave, una
     respuesta y, opcionalmente, botones de acción y sugerencias.
   ========================================================= */
(function () {
  "use strict";

  var EMAIL = "ecovisionai1@gmail.com";
  var INSTAGRAM = "https://www.instagram.com/ecovisionai1/";

  /* ---------- Base de conocimiento ----------
     keys:    palabras o frases que activan el tema (sin tildes, en minúscula).
              Una frase de varias palabras pesa más que una palabra suelta.
     answer:  texto en HTML simple (solo contenido nuestro, nunca del usuario).
     actions: botones que llevan a una sección de la página o a un enlace.
     next:    sugerencias que aparecen después de la respuesta.            */
  var INTENTS = [
    {
      id: "saludo",
      keys: ["hola", "buenas~1", "buenos dias", "buenas tardes", "buenas noches", "hey~1", "saludos", "que tal~1"],
      answer: "¡Hola! Soy el asistente de EcoVision AI. Te puedo contar qué hacemos, cómo funciona, cómo postular al piloto o cómo contactarnos.",
      next: ["¿Qué es EcoVision AI?", "¿Cómo funciona?", "¿Cuánto cuesta?"]
    },
    {
      id: "que_es",
      keys: ["que es ecovision", "que es eco vision", "que hace ecovision", "que hacen", "a que se dedican", "que ofrecen", "de que se trata", "en que consiste", "ecovision~1", "servicio~1", "producto~1", "solucion~1"],
      answer: "EcoVision AI automatiza la <strong>clasificación de residuos</strong> en plantas de reciclaje con visión artificial. Una cámara sobre la cinta identifica cada objeto (PET, acero, papel o cartón) y un sistema de aire lo separa a su bahía. El resultado: menos error humano, fardos más limpios y una planta más rentable.",
      actions: [{ label: "Ver la solución", href: "#solucion" }],
      next: ["¿Qué materiales clasifican?", "¿Cómo funciona?", "Quiero un piloto"]
    },
    {
      id: "materiales",
      keys: ["material", "materiales", "pet", "botella", "botellas", "plastico", "acero", "lata", "latas", "metal", "hojalata", "papel", "carton", "corrugado", "fibra", "que clasifica", "que separa", "que detecta"],
      answer: "En la primera versión clasificamos <strong>PET</strong> (botellas y envases), <strong>acero</strong> (latas y envases), <strong>papel</strong> y <strong>cartón</strong>. Lo que no corresponde a esos materiales sigue de largo hacia el rechazo.",
      actions: [{ label: "Ver materiales", href: "#solucion" }],
      next: ["¿Van a sumar más materiales?", "¿Qué tan preciso es?"]
    },
    {
      id: "mas_materiales",
      keys: ["aluminio", "vidrio", "pead", "hdpe", "otros materiales", "mas materiales", "tetra", "tetrapak", "electronico", "organico", "textil"],
      answer: "Por ahora trabajamos con PET, acero, papel y cartón. En la <strong>fase 2</strong> del roadmap sumaremos <strong>aluminio, PEAD y vidrio</strong>, usando el mismo hardware ya instalado. Si tu planta necesita otro material, escríbenos y lo evaluamos.",
      actions: [{ label: "Ver roadmap", href: "#roadmap" }],
      next: ["¿Cómo los contacto?", "¿Qué es el piloto?"]
    },
    {
      id: "como_funciona",
      keys: ["como funciona", "como trabaja", "funciona~1", "funcionamiento", "proceso", "pasos", "camara", "vision artificial", "inteligencia artificial", "ia~1", "modelo~1", "detecta~1", "reconoce~1"],
      answer: "Funciona en cuatro pasos:<ol><li><strong>Captura:</strong> cámaras con iluminación controlada sobre tu cinta.</li><li><strong>Identificación:</strong> un computador en la planta decide el material de cada objeto.</li><li><strong>Separación:</strong> el PLC activa una válvula de aire que desvía el objeto a su bahía.</li><li><strong>Medición:</strong> cada decisión queda registrada y ves pureza, volumen y rechazos por turno.</li></ol>",
      actions: [{ label: "Ver demo en vivo", href: "#demo" }],
      next: ["¿Hay que parar la cinta para instalarlo?", "¿Necesita internet?"]
    },
    {
      id: "precision",
      keys: ["precision", "preciso", "exactitud", "pureza", "porcentaje", "error", "errores", "falla", "se equivoca", "confiable", "efectivo", "resultados", "rendimiento"],
      answer: "Nuestra meta de diseño para el piloto es una <strong>pureza de 95 %</strong> por fardo, con decisiones en <strong>menos de 80 ms</strong> por objeto. Son objetivos, no resultados medidos todavía: justamente el piloto de 90 días sirve para medirlo con los datos de tu propia línea.",
      actions: [{ label: "Probar la demo", href: "#demo" }],
      next: ["¿Qué es el piloto?", "¿Qué tan rápido es?"]
    },
    {
      id: "velocidad",
      keys: ["rapido", "velocidad", "latencia", "milisegundos", "ms", "tiempo real", "cuantos objetos", "capacidad", "toneladas"],
      answer: "El sistema decide el material de cada objeto en <strong>menos de 80 ms</strong> (meta de diseño), así que trabaja en tiempo real sobre la cinta, sin detenerla. La capacidad exacta depende de tu línea, y la medimos durante el piloto.",
      next: ["¿Hay que parar la cinta para instalarlo?", "¿Qué es el piloto?"]
    },
    {
      id: "instalacion",
      keys: ["instal", "montaje", "parar la cinta", "detener", "rehacer", "cambiar la linea", "obras", "cuanto demora", "cuanto tarda", "implementa", "hardware", "equipo~1"],
      answer: "La estación de cámaras se <strong>monta sobre tu cinta actual</strong>: no hay que rehacer la línea. Se conecta a tu PLC y a válvulas de aire para separar los objetos sin detener la operación. En el piloto incluimos la instalación y la calibración en planta.",
      actions: [{ label: "Ver cómo funciona", href: "#como-funciona" }],
      next: ["¿Necesita internet?", "¿Con qué sistemas se integra?"]
    },
    {
      id: "internet",
      keys: ["internet", "conexion", "nube", "cloud", "wifi", "offline", "sin conexion", "datos seguros", "seguridad"],
      answer: "No depende de internet. El modelo corre en un <strong>computador industrial dentro de la planta</strong>, así que la clasificación sigue funcionando aunque se caiga la conexión. Los reportes y la API se pueden usar cuando hay red.",
      next: ["¿Con qué sistemas se integra?", "¿Qué reportes entrega?"]
    },
    {
      id: "integraciones",
      keys: ["integr", "plc", "scada", "mqtt", "api", "opc", "opc ua", "modbus", "erp", "power bi", "excel", "csv", "webhook", "sistema~1", "software~1"],
      answer: "Se conecta con lo que tu planta ya usa: <strong>PLC</strong> (OPC UA y Modbus TCP), <strong>SCADA</strong>, <strong>MQTT</strong>, <strong>API REST</strong> con webhooks, <strong>Power BI, Excel y CSV</strong>, y tu <strong>ERP</strong> para pesajes y despachos de fardos.",
      actions: [{ label: "Ver integraciones", href: "#integraciones" }],
      next: ["¿Qué reportes entrega?", "¿Cuánto cuesta?"]
    },
    {
      id: "reportes",
      keys: ["reporte", "panel", "dashboard", "analitica", "datos~1", "estadistica", "indicador", "kpi", "turno", "trazabilidad", "ley rep", "rep", "20920", "metas de reciclaje"],
      answer: "El panel muestra <strong>toneladas por material, pureza, rechazos y rendimiento por turno</strong>. Los datos quedan trazables, lo que ayuda a reportar metas de la <strong>Ley REP</strong>. En el plan Red también hay reportes consolidados de varias plantas.",
      actions: [{ label: "Ver planes", href: "#planes" }],
      next: ["¿Cuánto cuesta?", "¿Qué es el piloto?"]
    },
    {
      id: "precio",
      keys: ["precio", "costo", "cuesta", "cuanto cuesta", "cuanto vale", "cuanto sale", "valor~1", "tarifa", "cotiz", "plan~1", "pagar", "pago", "mensual", "barato", "caro", "inversion", "presupuesto"],
      answer: "Tenemos tres planes y el precio se cotiza según tu planta:<ul><li><strong>Piloto:</strong> 90 días en 1 línea, con instalación, calibración e informe final.</li><li><strong>Planta:</strong> pago por línea al mes, hasta 3 líneas, con panel, reentrenamiento y soporte en Chile.</li><li><strong>Red:</strong> a medida para gestores con varias plantas.</li></ul>",
      actions: [{ label: "Pedir cotización", href: "#contacto" }, { label: "Ver planes", href: "#planes" }],
      next: ["¿Qué es el piloto?", "¿Cómo los contacto?"]
    },
    {
      id: "piloto",
      keys: ["piloto", "prueba", "probar", "postul", "trial", "empezar~1", "comenzar~1", "contratar", "quiero un piloto", "me interesa"],
      answer: "El <strong>piloto dura 90 días</strong>: evaluamos tu línea, instalamos una estación de visión, ajustamos el modelo a tu material y al final te entregamos un informe de pureza y rendimiento con tus propios datos. Las postulaciones están abiertas para plantas de la <strong>Región del Biobío</strong>.",
      actions: [{ label: "Postular al piloto", href: "#contacto", primary: true }],
      next: ["¿Cuánto cuesta?", "¿Hay que parar la cinta para instalarlo?"]
    },
    {
      id: "ubicacion",
      keys: ["donde estan", "donde quedan", "donde se ubican", "donde~1", "ubica", "direccion", "oficina", "concepcion", "biobio~1", "chile~1", "ciudad~1", "visitar", "mapa", "ainavillo", "sede", "region~1", "santiago", "otra region"],
      answer: "Estamos en la <strong>Universidad del Desarrollo, sede Ainavillo</strong>: Ainavillo 456, Concepción, Región del Biobío. Hoy priorizamos pilotos en el Biobío; si tu planta está en otra región, escríbenos igual.",
      actions: [{ label: "Ver mapa", href: "#ubicacion" }],
      next: ["¿Cómo los contacto?", "¿Qué es el piloto?"]
    },
    {
      id: "contacto",
      keys: ["contact", "correo", "email", "mail", "gmail", "escribir", "hablar", "telefono", "whatsapp", "llamar", "instagram", "redes", "redes sociales", "linkedin", "comunic"],
      answer: "Puedes escribirnos a <strong>" + EMAIL + "</strong> o por Instagram a <strong>@ecovisionai1</strong>. Si quieres postular al piloto, el formulario de la página arma el correo con tus datos.",
      actions: [
        { label: "Escribir correo", href: "mailto:" + EMAIL, primary: true },
        { label: "Instagram", href: INSTAGRAM, external: true },
        { label: "Ir al formulario", href: "#contacto" }
      ],
      next: ["¿Qué es el piloto?", "¿Dónde están?"]
    },
    {
      id: "quienes",
      keys: ["quienes son", "quienes~1", "fundador", "universidad", "udd", "universidad del desarrollo", "estudiante", "historia", "origen", "empresa~1", "startup", "nosotros"],
      answer: "EcoVision AI nace en <strong>Concepción, en la Universidad del Desarrollo</strong>. Combinamos visión artificial, automatización industrial y conocimiento de la operación de las plantas, con una meta: que las plantas de Chile y Latinoamérica reciclen más, con menos error y mejores márgenes.",
      actions: [{ label: "Sobre nosotros", href: "#nosotros" }],
      next: ["¿Dónde están?", "¿Cómo los contacto?"]
    },
    {
      id: "roadmap",
      keys: ["futuro", "proximo", "proximos", "roadmap", "robot", "robotico", "brazo", "picking", "planes a futuro", "fases", "fase", "novedades"],
      answer: "Nuestro roadmap tiene cuatro fases: <strong>1)</strong> piloto con PET, acero, papel y cartón (en curso); <strong>2)</strong> aluminio, PEAD y vidrio; <strong>3)</strong> brazo robótico para objetos que el aire no puede desviar; <strong>4)</strong> reportes automáticos de trazabilidad para gestores y sistemas REP.",
      actions: [{ label: "Ver roadmap", href: "#roadmap" }],
      next: ["¿Qué es el piloto?", "¿Cuánto cuesta?"]
    },
    {
      id: "demo",
      keys: ["demo", "demostracion", "simulacion", "ver funcionando", "ejemplo~1", "video"],
      answer: "En la sección <strong>Demo en vivo</strong> puedes ver una simulación de la cinta: cambia entre <em>EcoVision AI</em> y <em>Manual</em> para comparar la pureza de los fardos. Es ilustrativa; los números reales los medimos en el piloto.",
      actions: [{ label: "Ir a la demo", href: "#demo", primary: true }],
      next: ["¿Qué tan preciso es?", "¿Qué es el piloto?"]
    },
    {
      id: "beneficios",
      keys: ["beneficio", "beneficios", "ventaja", "ventajas", "por que", "para que sirve", "ahorro", "rentabilidad", "rentable", "ganancia", "vale la pena", "mano de obra", "operarios", "trabajadores"],
      answer: "Los principales beneficios son <strong>menos error humano</strong> en la cinta, <strong>fardos más limpios</strong> (que se venden mejor y se rechazan menos) y <strong>datos por turno</strong> para gestionar la planta. El equipo deja de depender solo del ojo humano frente a una cinta que no se detiene.",
      next: ["¿Qué tan preciso es?", "¿Cuánto cuesta?"]
    },
    {
      id: "gracias",
      keys: ["gracias", "genial", "perfecto", "excelente", "ok~1", "vale~1", "listo~1", "buenisimo", "chao", "adios", "nos vemos"],
      answer: "¡De nada! Si te surge otra duda, aquí estoy. También puedes escribirnos a <strong>" + EMAIL + "</strong>.",
      next: ["Quiero un piloto", "¿Cómo los contacto?"]
    }
  ];

  var FALLBACK = {
    answer: "No tengo esa respuesta todavía. Te puedo ayudar con temas como materiales, funcionamiento, planes, piloto, integraciones o ubicación. Para otras consultas escríbenos a <strong>" + EMAIL + "</strong>.",
    actions: [{ label: "Escribir correo", href: "mailto:" + EMAIL }, { label: "Instagram", href: INSTAGRAM, external: true }],
    next: ["¿Qué es EcoVision AI?", "¿Cuánto cuesta?", "¿Cómo funciona?"]
  };

  var WELCOME = {
    answer: "¡Hola! Soy el asistente automático de EcoVision AI. Respondo dudas frecuentes sobre el sistema, el piloto y cómo contactarnos. ¿Qué te gustaría saber?",
    next: ["¿Qué es EcoVision AI?", "¿Qué materiales clasifican?", "¿Cuánto cuesta?", "Quiero un piloto"]
  };

  /* ---------- Detección de intención ---------- */
  function normalize(text) {
    return (" " + text + " ")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // quita tildes
      .replace(/[^a-z0-9ñ\s]/g, " ")                        // quita signos
      .replace(/\s+/g, " ");
  }

  // Palabras sin significado propio que no deben puntuar solas
  var STOP = { "que": 1, "de": 1, "la": 1, "el": 1, "en": 1, "y": 1, "a": 1, "los": 1, "las": 1, "un": 1, "una": 1, "es": 1, "por": 1, "con": 1, "para": 1 };

  // Prepara cada palabra clave una sola vez
  INTENTS.forEach(function (intent) {
    intent._keys = intent.keys.map(function (k) {
      var weak = /~1$/.test(k);              // "palabra~1" = palabra genérica, pesa menos
      var n = normalize(k.replace(/~1$/, "")).trim();
      return { text: n, words: n.split(" ").length, w: weak ? 1 : 2 };
    });
  });

  function scoreIntent(intent, q) {
    var score = 0;
    intent._keys.forEach(function (k) {
      if (k.words === 1 && STOP[k.text]) return;
      if (k.words > 1) {
        if (q.indexOf(" " + k.text + " ") !== -1) score += 2 + k.words;     // frase exacta
      } else if (k.text.length <= 3) {
        if (q.indexOf(" " + k.text + " ") !== -1) score += k.w;              // siglas cortas: palabra exacta
      } else if (q.indexOf(" " + k.text) !== -1) {
        score += k.w;                                                         // palabra, plural o raíz ("postul" → "postulo")
      }
    });
    return score;
  }

  function findAnswer(text) {
    var q = normalize(text);
    var best = null, bestScore = 0;
    INTENTS.forEach(function (intent) {
      var s = scoreIntent(intent, q);
      // en empate, un saludo cede ante cualquier tema concreto ("hola, ¿cuánto cuesta?")
      if (s > bestScore || (s === bestScore && s > 0 && best && best.id === "saludo")) {
        best = intent; bestScore = s;
      }
    });
    return bestScore >= 1 ? best : null;
  }

  /* ---------- Interfaz ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var root = document.createElement("div");
  root.className = "cb";
  root.innerHTML =
    '<button type="button" class="cb-launcher" id="cb-launcher" aria-expanded="false" aria-controls="cb-panel" aria-label="Abrir asistente de EcoVision AI">' +
      '<img src="images/logo.svg" alt="" width="30" height="30">' +
      '<span class="cb-launcher-text">¿Dudas?</span>' +
    '</button>' +
    '<section class="cb-panel" id="cb-panel" role="dialog" aria-modal="false" aria-labelledby="cb-title" hidden>' +
      '<header class="cb-head">' +
        '<img src="images/logo.svg" alt="" width="34" height="34" class="cb-avatar">' +
        '<div class="cb-head-text">' +
          '<h2 class="cb-title" id="cb-title">Asistente EcoVision</h2>' +
          '<p class="cb-sub">Respuestas automáticas al instante</p>' +
        '</div>' +
        '<button type="button" class="cb-close" id="cb-close" aria-label="Cerrar asistente">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="cb-log" id="cb-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="cb-suggest" id="cb-suggest" aria-label="Preguntas sugeridas"></div>' +
      '<form class="cb-form" id="cb-form" autocomplete="off">' +
        '<label for="cb-input" class="cb-sr">Escribe tu pregunta</label>' +
        '<input id="cb-input" class="cb-input" type="text" maxlength="300" placeholder="Escribe tu pregunta…" enterkeyhint="send">' +
        '<button type="submit" class="cb-send" aria-label="Enviar pregunta">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</form>' +
      '<p class="cb-foot">Asistente automático con respuestas predefinidas. Para consultas específicas escribe a ' + EMAIL + '.</p>' +
    '</section>';
  document.body.appendChild(root);

  var launcher = document.getElementById("cb-launcher");
  var panel = document.getElementById("cb-panel");
  var closeBtn = document.getElementById("cb-close");
  var log = document.getElementById("cb-log");
  var suggest = document.getElementById("cb-suggest");
  var form = document.getElementById("cb-form");
  var input = document.getElementById("cb-input");
  var started = false;
  var busy = false;

  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var row = document.createElement("div");
    row.className = "cb-msg cb-user";
    var bubble = document.createElement("p");
    bubble.className = "cb-bubble";
    bubble.textContent = text;   // texto del visitante: siempre como texto plano
    row.appendChild(bubble);
    log.appendChild(row);
    scrollLog();
  }

  function addBot(entry) {
    var row = document.createElement("div");
    row.className = "cb-msg cb-bot";
    var bubble = document.createElement("div");
    bubble.className = "cb-bubble";
    bubble.innerHTML = entry.answer;   // contenido propio de la base de conocimiento
    row.appendChild(bubble);

    if (entry.actions && entry.actions.length) {
      var acts = document.createElement("div");
      acts.className = "cb-actions";
      entry.actions.forEach(function (a) {
        var link = document.createElement("a");
        link.className = "cb-action" + (a.primary ? " is-primary" : "");
        link.href = a.href;
        link.textContent = a.label;
        if (a.external) { link.target = "_blank"; link.rel = "noopener"; }
        if (a.href.charAt(0) === "#") {
          link.addEventListener("click", function () {
            if (window.innerWidth < 768) closePanel(false);
          });
        }
        acts.appendChild(link);
      });
      row.appendChild(acts);
    }
    log.appendChild(row);
    setSuggestions(entry.next || []);
    // Muestra el inicio de la respuesta (no solo el final) para que se lea completa
    requestAnimationFrame(function () {
      var top = row.offsetTop - 12;
      log.scrollTop = Math.min(top, log.scrollHeight);
      if (row.offsetTop + row.offsetHeight > log.scrollTop + log.clientHeight && row.offsetHeight < log.clientHeight) {
        log.scrollTop = row.offsetTop + row.offsetHeight - log.clientHeight + 8;
      }
    });
  }

  function setSuggestions(list) {
    suggest.innerHTML = "";
    list.forEach(function (text) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cb-chip";
      b.textContent = text;
      b.addEventListener("click", function () { ask(text); });
      suggest.appendChild(b);
    });
    suggest.hidden = list.length === 0;
  }

  function showTyping() {
    var row = document.createElement("div");
    row.className = "cb-msg cb-bot cb-typing";
    row.setAttribute("aria-label", "El asistente está escribiendo");
    row.innerHTML = '<div class="cb-bubble"><span></span><span></span><span></span></div>';
    log.appendChild(row);
    scrollLog();
    return row;
  }

  function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true;
    addUser(text);
    setSuggestions([]);
    var intent = findAnswer(text);
    var typing = showTyping();
    var delay = reduceMotion ? 80 : 450 + Math.min(text.length * 8, 400);
    setTimeout(function () {
      typing.remove();
      addBot(intent || FALLBACK);
      busy = false;
    }, delay);
  }

  function openPanel() {
    panel.hidden = false;
    root.classList.add("is-open");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Cerrar asistente de EcoVision AI");
    if (!started) { addBot(WELCOME); started = true; }
    // En celular no se enfoca el campo para no abrir el teclado de inmediato
    if (window.matchMedia("(hover: hover)").matches) input.focus();
    else closeBtn.focus();
  }

  function closePanel(returnFocus) {
    panel.hidden = true;
    root.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Abrir asistente de EcoVision AI");
    if (returnFocus !== false) launcher.focus();
  }

  launcher.addEventListener("click", function () {
    if (panel.hidden) openPanel(); else closePanel();
  });
  closeBtn.addEventListener("click", function () { closePanel(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closePanel();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value;
    input.value = "";
    ask(text);
  });

  // Acceso para pruebas y para otros botones de la página: window.ecoChat.open()
  window.ecoChat = { open: openPanel, close: closePanel, ask: function (t) { if (panel.hidden) openPanel(); ask(t); }, match: findAnswer };
})();
