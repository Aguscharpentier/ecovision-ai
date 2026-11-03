/* =========================================================
   EcoVision AI · App para celular (PWA)
   1. Utilidades y almacenamiento local
   2. Modelo de Teachable Machine (mismo de la web, en ../model)
   3. Cámara, foto y registro
   4. Historial
   5. Pestañas, conexión, instalación y actualizaciones
   Todo se procesa en el celular: ninguna imagen sale del
   dispositivo y el historial queda en localStorage.
   ========================================================= */
(function () {
  "use strict";

  var APP_VERSION = "1.0.0";
  var MODEL_URL = "../model/model.json";
  var METADATA_URL = "../model/metadata.json";
  var INTERVAL_MS = 180;       // cada cuánto se clasifica un cuadro de la cámara
  var UNSURE_BELOW = 0.6;      // bajo este nivel de confianza: "No estoy seguro"
  var HISTORY_KEY = "ecovision-historial-v1";
  var HISTORY_MAX = 60;
  var THUMB_PX = 128;

  /* =========================================================
     1. UTILIDADES
     ========================================================= */
  var $ = function (id) { return document.getElementById(id); };
  var video = $("video"), photo = $("photo"), empty = $("viewer-empty"), viewer = $("viewer");
  var tag = $("viewer-tag"), stopBtn = $("stop-btn"), flipBtn = $("flip-btn"), fileInput = $("file-input");
  var mainBtn = $("main-btn"), mainLabel = $("main-label"), statusEl = $("status");
  var topEl = $("result-top"), bars = $("bars");

  var storage = {
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    }
  };

  function setStatus(text, isError) {
    statusEl.textContent = text || "";
    statusEl.classList.toggle("is-error", !!isError);
  }

  // Colores fijos por material, según el nombre de la clase
  function classColor(label) {
    var l = label.toLowerCase();
    if (l.indexOf("pet") !== -1 || l.indexOf("plást") !== -1 || l.indexOf("plast") !== -1) return "var(--mat-pet)";
    if (l.indexOf("metal") !== -1 || l.indexOf("alumin") !== -1 || l.indexOf("acero") !== -1) return "var(--mat-acero)";
    if (l.indexOf("papel") !== -1 || l.indexOf("cart") !== -1) return "var(--mat-carton)";
    return "var(--green)";
  }

  function pct(p) { return Math.round(p * 100) + " %"; }

  /* =========================================================
     2. MODELO
     ========================================================= */
  var model = null, loading = null, labels = [];
  var current = null;          // última predicción: { label, prob, unsure }

  function ensureModel() {
    if (model) return Promise.resolve(model);
    if (loading) return loading;
    viewer.classList.add("is-loading");
    loading = window.tmImage.load(MODEL_URL, METADATA_URL).then(function (m) {
      model = m;
      setLabels(model.getClassLabels());
      viewer.classList.remove("is-loading");
      return model;
    }).catch(function (err) {
      loading = null;
      viewer.classList.remove("is-loading");
      setStatus("No se pudo cargar el modelo. Abre la app una vez con internet para guardarlo.", true);
      throw err;
    });
    return loading;
  }

  function setLabels(list) {
    labels = list.map(function (l) { return l.trim(); });
    bars.innerHTML = "";
    labels.forEach(function (label, i) {
      var li = document.createElement("li");
      li.className = "bar";
      li.style.setProperty("--c", classColor(label));
      li.innerHTML = '<div class="bar-head"><span class="bar-label"></span><span class="bar-value" id="bv' + i + '">0 %</span></div>' +
        '<div class="bar-track"><span class="bar-fill" id="bf' + i + '"></span></div>';
      li.querySelector(".bar-label").textContent = label;
      bars.appendChild(li);
    });
    renderHistory();
  }

  function showPrediction(preds) {
    var best = preds[0];
    preds.forEach(function (p, i) {
      if (p.probability > best.probability) best = p;
      $("bv" + i).textContent = pct(p.probability);
      $("bf" + i).style.width = Math.round(p.probability * 100) + "%";
    });
    var name = best.className.trim();
    var unsure = best.probability < UNSURE_BELOW;
    current = { label: name, prob: best.probability, unsure: unsure };

    topEl.textContent = unsure ? "No estoy seguro" : name;
    topEl.classList.toggle("is-unsure", unsure);
    tag.hidden = false;
    tag.textContent = name + " " + best.probability.toFixed(2);
    tag.style.setProperty("--c", classColor(name));
    viewer.style.setProperty("--det-color", unsure ? "var(--warning)" : classColor(name));
    bars.querySelectorAll(".bar").forEach(function (li, i) { li.classList.toggle("is-best", preds[i] === best); });
  }

  function resetResult() {
    current = null;
    tag.hidden = true;
    topEl.textContent = "Esperando imagen";
    topEl.classList.remove("is-unsure");
    viewer.style.removeProperty("--det-color");
    bars.querySelectorAll(".bar-fill").forEach(function (f) { f.style.width = "0"; });
    bars.querySelectorAll(".bar-value").forEach(function (v) { v.textContent = "0 %"; });
    bars.querySelectorAll(".bar").forEach(function (li) { li.classList.remove("is-best"); });
  }

  /* =========================================================
     3. CÁMARA, FOTO Y REGISTRO
     ========================================================= */
  var mode = "idle";           // "idle" | "live" | "photo"
  var stream = null, rafId = null, lastRun = 0;
  var facing = "environment";  // trasera por defecto
  var photoSaved = false;

  function setMode(m) {
    mode = m;
    mainLabel.textContent = m === "live" ? "Registrar" : m === "photo" && !photoSaved ? "Registrar foto" : "Activar cámara";
    mainBtn.setAttribute("aria-label", m === "live" ? "Registrar lo que ve la cámara" : mainLabel.textContent);
    stopBtn.hidden = m !== "live";
    flipBtn.disabled = m !== "live";
  }

  function loop(ts) {
    rafId = requestAnimationFrame(loop);
    if (!model || video.readyState < 2 || ts - lastRun < INTERVAL_MS) return;
    lastRun = ts;
    model.predict(video).then(function (preds) { if (mode === "live") showPrediction(preds); }).catch(function () {});
  }

  function stopCamera() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null;
    video.srcObject = null;
    video.hidden = true;
  }

  function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("Este navegador no permite usar la cámara. Prueba con una foto.", true);
      return;
    }
    mainBtn.disabled = true;
    setStatus("Abriendo la cámara…");
    Promise.all([
      ensureModel(),
      navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 720 }, height: { ideal: 720 } }, audio: false })
    ]).then(function (res) {
      stopCamera();
      stream = res[1];
      video.srcObject = stream;
      video.classList.toggle("is-mirror", facing === "user");
      return video.play();
    }).then(function () {
      photo.hidden = true;
      empty.hidden = true;
      video.hidden = false;
      resetResult();
      setMode("live");
      setStatus("Apunta a un objeto y toca Registrar para guardarlo.");
      rafId = requestAnimationFrame(loop);
    }).catch(function (err) {
      var name = err && err.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setStatus("No diste permiso para usar la cámara. Actívalo en los ajustes del navegador o usa una foto.", true);
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setStatus("No encontramos una cámara en este dispositivo. Prueba con una foto.", true);
      } else if (model) {
        setStatus("No se pudo abrir la cámara. Prueba con una foto.", true);
      }
    }).then(function () { mainBtn.disabled = false; });
  }

  function stopToIdle(message) {
    stopCamera();
    empty.hidden = !photo.hidden;
    if (photo.hidden) resetResult();
    setMode(photo.hidden ? "idle" : "photo");
    if (message) setStatus(message);
  }

  // Miniatura cuadrada del centro (lo mismo que ve el modelo)
  function thumbnail(source) {
    var w = source.videoWidth || source.naturalWidth, h = source.videoHeight || source.naturalHeight;
    var side = Math.min(w, h);
    var c = document.createElement("canvas");
    c.width = c.height = THUMB_PX;
    var ctx = c.getContext("2d");
    if (source === video && facing === "user") { ctx.translate(THUMB_PX, 0); ctx.scale(-1, 1); }
    ctx.drawImage(source, (w - side) / 2, (h - side) / 2, side, side, 0, 0, THUMB_PX, THUMB_PX);
    try { return c.toDataURL("image/jpeg", 0.72); } catch (e) { return ""; }
  }

  function register(source) {
    if (!current) { setStatus("Espera a que el modelo muestre un resultado."); return; }
    addEntry({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      t: Date.now(),
      label: current.label,
      prob: Math.round(current.prob * 1000) / 1000,
      unsure: current.unsure,
      thumb: thumbnail(source)
    });
    if (navigator.vibrate) navigator.vibrate(15);
    mainBtn.classList.add("is-saved");
    setTimeout(function () { mainBtn.classList.remove("is-saved"); }, 250);
    setStatus("Registrado: " + (current.unsure ? "No estoy seguro" : current.label) + " (" + pct(current.prob) + ").");
  }

  mainBtn.addEventListener("click", function () {
    if (mode === "live") register(video);
    else if (mode === "photo" && !photoSaved) { register(photo); photoSaved = true; setMode("photo"); }
    else startCamera();
  });
  stopBtn.addEventListener("click", function () { stopToIdle("Cámara detenida."); });
  flipBtn.addEventListener("click", function () {
    facing = facing === "environment" ? "user" : "environment";
    startCamera();
  });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    if (!/^image\//.test(file.type)) { setStatus("Ese archivo no es una imagen.", true); return; }
    stopCamera();
    var url = URL.createObjectURL(file);
    // Se clasifica la imagen a tamaño original (el <img> en pantalla está recortado)
    var original = new Image();
    original.src = url;
    setStatus("Analizando la foto…");
    Promise.all([ensureModel(), original.decode()]).then(function () {
      photo.src = url;
      photo.hidden = false;
      empty.hidden = true;
      photoSaved = false;
      return model.predict(original);
    }).then(function (preds) {
      showPrediction(preds);
      setMode("photo");
      setStatus("Toca Registrar foto para guardarla en el historial.");
    }).catch(function () {
      if (model) setStatus("No se pudo leer esa imagen. Prueba con otra.", true);
    });
  });

  // Apaga la cámara al cambiar de app o de pestaña
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && stream) stopToIdle("Cámara detenida al salir de la app. Actívala de nuevo para seguir.");
  });

  /* =========================================================
     4. HISTORIAL
     ========================================================= */
  var history = storage.get(HISTORY_KEY, []);
  if (!Array.isArray(history)) history = [];

  function saveHistory() {
    // Si el almacenamiento se llena, se descartan los registros más antiguos
    while (!storage.set(HISTORY_KEY, history) && history.length > 1) history.pop();
  }

  function addEntry(entry) {
    history.unshift(entry);
    if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
    saveHistory();
    renderHistory();
  }

  var timeFmt = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  function renderHistory() {
    var list = $("history"), summary = $("summary");
    list.innerHTML = "";
    history.forEach(function (e) {
      var li = document.createElement("li");
      li.style.setProperty("--c", e.unsure ? "var(--warning)" : classColor(e.label));
      var img = document.createElement("img");
      img.alt = "";
      img.width = img.height = 64;
      if (e.thumb) img.src = e.thumb;
      var text = document.createElement("div");
      var label = document.createElement("p");
      label.className = "h-label" + (e.unsure ? " is-unsure" : "");
      label.textContent = e.unsure ? "No estoy seguro" : e.label;
      var meta = document.createElement("p");
      meta.className = "h-meta";
      meta.textContent = (e.unsure ? e.label + " " : "") + pct(e.prob) + ", " + timeFmt.format(new Date(e.t));
      text.appendChild(label); text.appendChild(meta);
      var del = document.createElement("button");
      del.type = "button";
      del.className = "h-del";
      del.setAttribute("aria-label", "Borrar registro de " + label.textContent);
      del.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      del.addEventListener("click", function () {
        history = history.filter(function (x) { return x.id !== e.id; });
        saveHistory();
        renderHistory();
      });
      li.appendChild(img); li.appendChild(text); li.appendChild(del);
      list.appendChild(li);
    });

    // Resumen: una casilla por clase del modelo, más "No estoy seguro"
    var groups = labels.map(function (l) { return { name: l, color: classColor(l), n: 0 }; });
    var unsure = { name: "No estoy seguro", color: "var(--warning)", n: 0 };
    history.forEach(function (e) {
      if (e.unsure) { unsure.n++; return; }
      var g = groups.filter(function (x) { return x.name === e.label; })[0];
      if (g) g.n++;
    });
    summary.innerHTML = "";
    groups.concat(unsure).forEach(function (g) {
      var div = document.createElement("div");
      div.style.setProperty("--c", g.color);
      var dt = document.createElement("dt"); dt.textContent = g.name;
      var dd = document.createElement("dd"); dd.textContent = g.n;
      div.appendChild(dt); div.appendChild(dd);
      summary.appendChild(div);
    });

    var count = $("tab-count");
    count.hidden = history.length === 0;
    count.textContent = history.length;
    $("history-empty").hidden = history.length > 0;
    $("clear-btn").hidden = history.length === 0;
  }

  $("clear-btn").addEventListener("click", function () {
    if (!window.confirm("¿Borrar todo el historial de este celular?")) return;
    history = [];
    saveHistory();
    renderHistory();
  });

  /* =========================================================
     5. PESTAÑAS, CONEXIÓN, INSTALACIÓN Y ACTUALIZACIONES
     ========================================================= */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function showView(id) {
    tabs.forEach(function (t) {
      var on = t.dataset.view === id;
      t.classList.toggle("is-active", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
      $(t.dataset.view).hidden = !on;
    });
    if (id !== "view-scan" && stream) stopToIdle("Cámara detenida.");
    window.scrollTo(0, 0);
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { showView(t.dataset.view); }); });

  // Conexión
  var netChip = $("net-chip");
  function updateNet() { netChip.hidden = navigator.onLine; }
  window.addEventListener("online", updateNet);
  window.addEventListener("offline", updateNet);
  updateNet();

  // Instalación: Android/Chrome ofrece el aviso; iPhone necesita instrucciones
  var installBtn = $("install-btn"), deferredPrompt = null;
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () { deferredPrompt = null; installBtn.hidden = true; });
  });
  window.addEventListener("appinstalled", function () { installBtn.hidden = true; });

  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS && !standalone && !storage.get("ecovision-ios-hint-cerrado", false)) $("ios-hint").hidden = false;
  $("ios-hint-close").addEventListener("click", function () {
    $("ios-hint").hidden = true;
    storage.set("ecovision-ios-hint-cerrado", true);
  });

  // Service worker: guarda la app y el modelo para usarlos sin internet
  if ("serviceWorker" in navigator) {
    var refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    navigator.serviceWorker.register("sw.js").then(function (reg) {
      function offerUpdate(worker) {
        $("update-toast").hidden = false;
        $("update-btn").onclick = function () { worker.postMessage("skipWaiting"); };
      }
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      reg.addEventListener("updatefound", function () {
        var worker = reg.installing;
        worker.addEventListener("statechange", function () {
          if (worker.state === "installed" && navigator.serviceWorker.controller) offerUpdate(worker);
        });
      });
    }).catch(function () {});
  }

  /* ---------- Inicio ---------- */
  $("app-version").textContent = APP_VERSION;
  setMode("idle");
  // Etiquetas reales para las barras y el resumen, antes de cargar el modelo
  fetch(METADATA_URL).then(function (r) { return r.json(); }).then(function (meta) {
    if (!model && meta && meta.labels) setLabels(meta.labels);
  }).catch(function () { renderHistory(); });
  // El modelo se prepara de inmediato: es la función principal de la app
  ensureModel().catch(function () {});

  // Para pruebas
  window.ecoApp = { model: ensureModel, history: function () { return history.slice(); }, showView: showView };
})();
