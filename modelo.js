/* =========================================================
   EcoVision AI · Modelo real de Teachable Machine
   ---------------------------------------------------------
   - Modelo de imagen entrenado en Teachable Machine
     (https://teachablemachine.withgoogle.com/models/WM3F4zqXx/).
     Los archivos están copiados en /model para que carguen
     rápido y no dependan de servidores externos.
   - Las librerías (TensorFlow.js y Teachable Machine) se
     descargan solo cuando la persona usa la sección, para no
     hacer más lenta la página.
   - Todo se procesa en el navegador: ninguna imagen sale del
     dispositivo.
   ========================================================= */
(function () {
  "use strict";

  var MODEL_URL = "model/model.json";
  var METADATA_URL = "model/metadata.json";
  var LIBS = [
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js",
    "https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js"
  ];
  var INTERVAL_MS = 180;   // cada cuánto se clasifica un cuadro de la cámara

  var $ = function (id) { return document.getElementById(id); };
  var video = $("tm-video"), photo = $("tm-photo"), empty = $("tm-empty"), tag = $("tm-tag");
  var btnCam = $("tm-camera"), btnStop = $("tm-stop"), btnFlip = $("tm-flip"), fileInput = $("tm-file");
  var status = $("tm-status"), topEl = $("tm-top"), bars = $("tm-bars"), view = $("tm-view");
  if (!video || !btnCam) return;

  var model = null, loading = null, stream = null, rafId = null, lastRun = 0;
  var facing = "environment";

  /* ---------- Colores por clase (según el nombre de la etiqueta) ---------- */
  function classColor(label) {
    var l = label.toLowerCase();
    if (l.indexOf("pet") !== -1 || l.indexOf("plást") !== -1 || l.indexOf("plast") !== -1) return "var(--mat-pet)";
    if (l.indexOf("metal") !== -1 || l.indexOf("alumin") !== -1 || l.indexOf("acero") !== -1) return "var(--mat-acero)";
    if (l.indexOf("papel") !== -1 || l.indexOf("cart") !== -1) return "var(--mat-carton)";
    return "var(--green)";
  }

  function setStatus(text, isError) {
    status.textContent = text || "";
    status.classList.toggle("is-error", !!isError);
  }

  /* ---------- Carga diferida de librerías y modelo ---------- */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("No se pudo cargar " + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureModel() {
    if (model) return Promise.resolve(model);
    if (loading) return loading;
    setStatus("Cargando el modelo…");
    view.classList.add("is-loading");
    loading = LIBS.reduce(function (p, src) { return p.then(function () { return loadScript(src); }); }, Promise.resolve())
      .then(function () { return window.tmImage.load(MODEL_URL, METADATA_URL); })
      .then(function (m) {
        model = m;
        buildBars(model.getClassLabels());
        view.classList.remove("is-loading");
        setStatus("");
        return model;
      })
      .catch(function (err) {
        loading = null;
        view.classList.remove("is-loading");
        setStatus("No se pudo cargar el modelo. Revisa tu conexión y vuelve a intentarlo.", true);
        throw err;
      });
    return loading;
  }

  /* ---------- Barras de resultados ---------- */
  function buildBars(labels) {
    bars.innerHTML = "";
    labels.forEach(function (label, i) {
      var li = document.createElement("li");
      li.className = "tm-bar";
      li.style.setProperty("--c", classColor(label));
      li.innerHTML = '<div class="tm-bar-head"><span class="tm-bar-label"></span><span class="tm-bar-value" id="tm-v' + i + '">0 %</span></div>' +
        '<div class="tm-bar-track"><span class="tm-bar-fill" id="tm-f' + i + '"></span></div>';
      li.querySelector(".tm-bar-label").textContent = label.trim();
      bars.appendChild(li);
    });
  }

  function showPrediction(preds) {
    var best = preds[0];
    preds.forEach(function (p, i) {
      if (p.probability > best.probability) best = p;
      var pct = Math.round(p.probability * 100);
      var v = $("tm-v" + i), f = $("tm-f" + i);
      if (v) v.textContent = pct + " %";
      if (f) f.style.width = pct + "%";
    });
    var name = best.className.trim();
    if (best.probability >= 0.6) {
      topEl.textContent = name;
      topEl.classList.remove("is-unsure");
    } else {
      topEl.textContent = "No estoy seguro";
      topEl.classList.add("is-unsure");
    }
    tag.hidden = false;
    tag.textContent = name + " " + (best.probability).toFixed(2);
    tag.style.setProperty("--c", classColor(name));
    view.style.setProperty("--det-color", best.probability >= 0.6 ? classColor(name) : "var(--warning)");
    bars.querySelectorAll(".tm-bar").forEach(function (li, i) {
      li.classList.toggle("is-best", preds[i] === best);
    });
  }

  function resetResult() {
    tag.hidden = true;
    topEl.textContent = "Esperando imagen";
    topEl.classList.remove("is-unsure");
    view.style.removeProperty("--det-color");
    bars.querySelectorAll(".tm-bar-fill").forEach(function (f) { f.style.width = "0"; });
    bars.querySelectorAll(".tm-bar-value").forEach(function (v) { v.textContent = "0 %"; });
    bars.querySelectorAll(".tm-bar").forEach(function (li) { li.classList.remove("is-best"); });
  }

  /* ---------- Cámara ---------- */
  function loop(ts) {
    rafId = requestAnimationFrame(loop);
    if (!model || video.readyState < 2 || ts - lastRun < INTERVAL_MS) return;
    lastRun = ts;
    model.predict(video).then(showPrediction).catch(function () {});
  }

  function stopCamera() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null;
    video.hidden = true;
    video.srcObject = null;
    btnStop.hidden = true;
    btnFlip.hidden = true;
    btnCam.hidden = false;
    view.classList.remove("is-live");
  }

  function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("Tu navegador no permite usar la cámara aquí. Prueba subiendo una foto.", true);
      return;
    }
    btnCam.disabled = true;
    Promise.all([
      ensureModel(),
      navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 640 } }, audio: false })
    ]).then(function (res) {
      stopCamera();
      stream = res[1];
      video.srcObject = stream;
      // La cámara frontal se muestra como espejo, como en una videollamada
      video.classList.toggle("is-mirror", facing === "user");
      return video.play();
    }).then(function () {
      photo.hidden = true;
      empty.hidden = true;
      video.hidden = false;
      btnCam.hidden = true;
      btnStop.hidden = false;
      btnFlip.hidden = false;
      view.classList.add("is-live");
      setStatus("Cámara activa. Muestra un objeto frente a ella.");
      resetResult();
      rafId = requestAnimationFrame(loop);
    }).catch(function (err) {
      if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) {
        setStatus("No diste permiso para usar la cámara. Puedes activarlo en tu navegador o subir una foto.", true);
      } else if (err && (err.name === "NotFoundError" || err.name === "OverconstrainedError")) {
        setStatus("No encontramos una cámara en este dispositivo. Prueba subiendo una foto.", true);
      } else if (model) {
        setStatus("No se pudo abrir la cámara. Prueba subiendo una foto.", true);
      }
    }).then(function () { btnCam.disabled = false; });
  }

  /* ---------- Foto subida ---------- */
  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setStatus("Ese archivo no es una imagen. Elige una foto en JPG, PNG o similar.", true);
      return;
    }
    stopCamera();
    var url = URL.createObjectURL(file);
    photo.onload = function () {
      empty.hidden = true;
      photo.hidden = false;
      ensureModel().then(function () {
        return model.predict(photo);
      }).then(function (preds) {
        showPrediction(preds);
        setStatus("Listo. Sube otra foto o activa la cámara para seguir probando.");
      }).catch(function () {});
    };
    photo.src = url;
    fileInput.value = "";
  });

  btnCam.addEventListener("click", startCamera);
  btnStop.addEventListener("click", function () {
    stopCamera();
    if (photo.hidden) empty.hidden = false;
    resetResult();
    setStatus("Cámara detenida.");
  });
  btnFlip.addEventListener("click", function () {
    facing = facing === "environment" ? "user" : "environment";
    startCamera();
  });

  // Apaga la cámara si la persona cambia de pestaña o sale de la página
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && stream) {
      stopCamera();
      empty.hidden = !photo.hidden;
      setStatus("Cámara detenida al salir de la página. Actívala de nuevo para seguir.");
    }
  });

  // Prepara las barras con las etiquetas reales sin cargar el modelo todavía
  fetch(METADATA_URL).then(function (r) { return r.json(); }).then(function (meta) {
    if (!model && meta && meta.labels) buildBars(meta.labels);
  }).catch(function () {});

  // Para pruebas: window.ecoModel.predictImage(url)
  window.ecoModel = {
    load: ensureModel,
    predictImage: function (src) {
      return ensureModel().then(function () {
        return new Promise(function (resolve, reject) {
          var img = new Image();
          img.onload = function () { resolve(model.predict(img)); };
          img.onerror = reject;
          img.src = src;
        });
      });
    }
  };
})();
