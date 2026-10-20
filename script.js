/* =========================================================
   EcoVision AI · Interacciones
   1. Navbar sticky + menú móvil + link activo
   2. Partículas del hero + parallax suave
   3. Flip cards (hover en escritorio, tap/teclado en móvil)
   4. Reveal al hacer scroll + contadores animados
   5. Demo en vivo: simulación de cinta con visión artificial
   6. Copiar código, formulario y año del footer
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Utilidades ---------- */
  function debounce(func, wait) {
    var timeout;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(timeout);
      timeout = setTimeout(function () { func.apply(ctx, args); }, wait);
    };
  }

  function animateCounter(element, target, duration) {
    duration = duration || 2000;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      element.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
     1. NAVBAR
     ========================================================= */
  var navbar = document.getElementById("navbar");
  var toggle = document.getElementById("menu-toggle");
  var links = document.getElementById("nav-links");
  var heroGlow = document.querySelector(".hero-bg-glow");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    navbar.classList.toggle("scrolled", y > 24);
    // Parallax suave del brillo de fondo (0.3x)
    if (heroGlow && !reduceMotion && y < 1200) {
      heroGlow.style.transform = "translateY(" + (y * 0.3) + "px)";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    navbar.classList.toggle("scrolled", (window.scrollY || 0) > 24);
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) navbar.classList.add("scrolled");
    else closeMenu();
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("open")) { closeMenu(); toggle.focus(); }
  });
  window.addEventListener("resize", debounce(function () {
    if (window.innerWidth >= 1024) closeMenu();
  }, 150));

  // Link activo según la sección visible
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute("href"));
      if (sec) sectionObserver.observe(sec);
    });
  }

  /* =========================================================
     2. PARTÍCULAS (50)
     ========================================================= */
  var particlesContainer = document.getElementById("particles");
  if (particlesContainer && !reduceMotion) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 50; i++) {
      var particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = -(Math.random() * 20) + "s";
      particle.style.animationDuration = (15 + Math.random() * 10) + "s";
      var size = 2 + Math.random() * 2.5;
      particle.style.width = particle.style.height = size + "px";
      frag.appendChild(particle);
    }
    particlesContainer.appendChild(frag);
  }

  /* =========================================================
     3. FLIP CARDS
     ========================================================= */
  document.querySelectorAll(".service-card-flip").forEach(function (card) {
    card.addEventListener("click", function () {
      if (!canHover) card.classList.toggle("flipped");
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("flipped");
      }
    });
  });

  /* =========================================================
     4. REVEAL + CONTADORES
     ========================================================= */
  if ("IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("js-reveal");
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var vh = window.innerHeight;

    // Lo que ya está en pantalla al cargar se muestra de inmediato
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("in");
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      // Agrupa por contenedor para aplicar stagger de 0.1s
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (entry, index) {
        var el = entry.target;
        setTimeout(function () { el.classList.add("in"); }, index * 100);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach(function (el) { if (!el.classList.contains("in")) revealObserver.observe(el); });
  }

  var counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.target, 10), 1800);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* =========================================================
     5. DEMO EN VIVO · Simulación de la cinta
     ========================================================= */
  var canvas = document.getElementById("belt-canvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = 1;

    var MATS = {
      pet:    { label: "PET",    color: "#38BDF8" },
      acero:  { label: "ACERO",  color: "#A1A1AA" },
      papel:  { label: "PAPEL",  color: "#F4F4F5" },
      carton: { label: "CARTÓN", color: "#C89463" },
      otros:  { label: "OTROS",  color: "#52525B" }
    };
    var BIN_ORDER = ["pet", "acero", "papel", "carton"];
    var BIN_X = { pet: 0.44, acero: 0.59, papel: 0.74, carton: 0.89 };
    var SPAWN_POOL = ["pet", "pet", "pet", "pet", "pet", "pet", "pet",
                      "acero", "acero", "acero",
                      "papel", "papel", "papel", "papel",
                      "carton", "carton", "carton", "carton", "carton",
                      "otros", "otros"];

    var mode = "ai";          // "ai" | "manual"
    var userPaused = false;
    var visible = true;
    var items = [];
    var spawnT = 0;
    var beltOffset = 0;
    var simTime = 0;
    var stats;

    function resetStats() {
      stats = { bins: { pet: 0, acero: 0, papel: 0, carton: 0 }, correct: 0, sorted: 0, wrong: 0, lost: 0, rechazo: 0, scans: [] };
    }
    resetStats();

    function layout() {
      return {
        beltTop: H * 0.28,
        beltBot: H * 0.56,
        scanX: W * 0.24,
        binTop: H * 0.72,
        binBot: H * 0.97,
        binW: Math.min(W * 0.13, 120),
        size: Math.max(20, Math.min(H * 0.1, 44)),
        speed: W * 0.11,
        font: Math.max(10, Math.min(W / 58, 13))
      };
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function spawn(L, x) {
      var type = pick(SPAWN_POOL);
      var s = L.size;
      items.push({
        type: type,
        x: x !== undefined ? x : -s,
        y: rand(L.beltTop + s * 0.65, L.beltBot - s * 0.65),
        s: s * rand(0.85, 1.1),
        rot: rand(-0.6, 0.6),
        state: "belt",
        detected: false,
        pred: null,
        conf: 0,
        vy: 0
      });
    }

    function classify(it) {
      var others = BIN_ORDER.filter(function (m) { return m !== it.type; });
      if (mode === "ai") {
        if (it.type === "otros") {
          it.pred = Math.random() < 0.95 ? "otros" : pick(BIN_ORDER);
        } else {
          it.pred = Math.random() < 0.965 ? it.type : pick(others);
        }
        it.conf = it.pred === it.type ? rand(0.9, 0.995) : rand(0.55, 0.74);
      } else {
        var r = Math.random();
        if (it.type === "otros") it.pred = r < 0.7 ? "otros" : pick(BIN_ORDER);
        else if (r < 0.18) it.pred = "otros";                 // se escapa al rechazo
        else if (r < 0.36) it.pred = pick(others);            // mal clasificado
        else it.pred = it.type;
      }
    }

    function step(dt) {
      var L = layout();
      simTime += dt;
      beltOffset = (beltOffset + L.speed * dt) % 28;

      spawnT -= dt;
      if (spawnT <= 0) { spawn(L); spawnT = rand(0.55, 1.05) * (W < 520 ? 1.7 : 1); }

      for (var i = items.length - 1; i >= 0; i--) {
        var it = items[i];
        if (it.state === "belt") {
          it.x += L.speed * dt;
          if (!it.detected && it.x >= L.scanX) {
            it.detected = true;
            classify(it);
            stats.scans.push(simTime);
          }
          if (it.detected && it.pred !== "otros" && it.x >= W * BIN_X[it.pred]) {
            it.state = "drop";
            it.vy = -H * 0.15;
          }
          if (it.x > W + it.s) {
            stats.rechazo++;
            if (it.type !== "otros") stats.lost++;
            items.splice(i, 1);
          }
        } else if (it.state === "drop") {
          it.vy += H * 2.4 * dt;
          it.y += it.vy * dt;
          it.x += L.speed * 0.15 * dt;
          it.rot += dt * 3;
          if (it.y > L.binTop + (L.binBot - L.binTop) * 0.45) {
            stats.bins[it.pred]++;
            stats.sorted++;
            if (it.pred === it.type) stats.correct++; else stats.wrong++;
            items.splice(i, 1);
          }
        }
      }
      // ventana móvil de 20 s para objetos/min
      while (stats.scans.length && stats.scans[0] < simTime - 20) stats.scans.shift();
    }

    /* ----- Dibujo ----- */
    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function drawItem(it) {
      var s = it.s;
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.rot);
      switch (it.type) {
        case "pet":
          ctx.fillStyle = "rgba(56,189,248,0.35)";
          ctx.strokeStyle = "#7DD3FC"; ctx.lineWidth = 1.5;
          roundRect(-s * 0.22, -s * 0.42, s * 0.44, s * 0.84, s * 0.14); ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#22C55E";
          roundRect(-s * 0.1, -s * 0.54, s * 0.2, s * 0.14, 2); ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.25); ctx.lineTo(-s * 0.1, s * 0.3); ctx.stroke();
          break;
        case "acero":
          var g = ctx.createLinearGradient(-s * 0.3, 0, s * 0.3, 0);
          g.addColorStop(0, "#52525B"); g.addColorStop(0.3, "#E4E4E7"); g.addColorStop(1, "#3F3F46");
          ctx.fillStyle = g;
          ctx.fillRect(-s * 0.3, -s * 0.36, s * 0.6, s * 0.72);
          ctx.fillStyle = "#D4D4D8";
          ctx.beginPath(); ctx.ellipse(0, -s * 0.36, s * 0.3, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#52525B";
          ctx.beginPath(); ctx.ellipse(0, s * 0.36, s * 0.3, s * 0.1, 0, 0, Math.PI); ctx.fill();
          break;
        case "papel":
          ctx.fillStyle = "#F4F4F5";
          ctx.fillRect(-s * 0.36, -s * 0.44, s * 0.72, s * 0.88);
          ctx.strokeStyle = "#A1A1AA"; ctx.lineWidth = 1.5;
          for (var k = 0; k < 4; k++) {
            ctx.beginPath(); ctx.moveTo(-s * 0.24, -s * 0.24 + k * s * 0.15); ctx.lineTo(s * 0.24, -s * 0.24 + k * s * 0.15); ctx.stroke();
          }
          break;
        case "carton":
          ctx.fillStyle = "#A0703F";
          ctx.fillRect(-s * 0.45, -s * 0.38, s * 0.9, s * 0.76);
          ctx.fillStyle = "#C89463";
          ctx.fillRect(-s * 0.45, -s * 0.38, s * 0.9, s * 0.2);
          ctx.fillStyle = "rgba(90,58,30,0.8)";
          ctx.fillRect(-s * 0.06, -s * 0.38, s * 0.12, s * 0.76);
          break;
        default:
          ctx.fillStyle = "#3F3F46";
          ctx.beginPath();
          ctx.moveTo(-s * 0.4, -s * 0.1); ctx.lineTo(-s * 0.1, -s * 0.4); ctx.lineTo(s * 0.35, -s * 0.25);
          ctx.lineTo(s * 0.4, s * 0.2); ctx.lineTo(0, s * 0.4); ctx.lineTo(-s * 0.35, s * 0.25); ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#27272A"; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.restore();
    }

    function drawBox(it, L) {
      var s = it.s * 0.68;
      var x = it.x - s, y = it.y - s, w = s * 2, h = s * 2;
      var ok = it.pred === it.type;
      var col = ok ? "#4ADE80" : "#F59E0B";
      var c = Math.max(6, s * 0.4);
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.shadowColor = col; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x, y + c); ctx.lineTo(x, y); ctx.lineTo(x + c, y);
      ctx.moveTo(x + w - c, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + c);
      ctx.moveTo(x + w, y + h - c); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - c, y + h);
      ctx.moveTo(x + c, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - c);
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Etiqueta (evita que se encimen: arriba, abajo o se omite)
      var txt = MATS[it.pred].label + " " + it.conf.toFixed(2);
      ctx.font = "500 " + L.font + "px 'JetBrains Mono', ui-monospace, monospace";
      var tw = ctx.measureText(txt).width + 10;
      var th = L.font + 8;
      var lx = Math.min(x, W - tw - 2);
      var spots = [y - th - 3, y + h + 3];
      for (var k = 0; k < spots.length; k++) {
        var r = { x: lx, y: spots[k], w: tw, h: th };
        var hit = placedLabels.some(function (o) {
          return r.x < o.x + o.w + 2 && r.x + r.w + 2 > o.x && r.y < o.y + o.h + 2 && r.y + r.h + 2 > o.y;
        });
        if (!hit) {
          placedLabels.push(r);
          ctx.fillStyle = col;
          roundRect(r.x, r.y, tw, th, 4); ctx.fill();
          ctx.fillStyle = "#03140A";
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";
          ctx.fillText(txt, r.x + 5, r.y + th / 2);
          break;
        }
      }
    }

    var placedLabels = [];
    function draw() {
      if (!W) return;
      var L = layout();
      placedLabels = [];
      ctx.clearRect(0, 0, W, H);

      // Fondo con grilla
      ctx.fillStyle = "#050806"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(34,197,94,0.06)"; ctx.lineWidth = 1;
      for (var gx = 0; gx < W; gx += 32) { ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); ctx.stroke(); }
      for (var gy = 0; gy < H; gy += 32) { ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.stroke(); }

      // Cinta
      ctx.fillStyle = "#0E1712";
      ctx.fillRect(0, L.beltTop, W, L.beltBot - L.beltTop);
      ctx.strokeStyle = "rgba(34,197,94,0.12)";
      for (var bx = -28 + beltOffset; bx < W; bx += 28) {
        ctx.beginPath(); ctx.moveTo(bx, L.beltTop); ctx.lineTo(bx, L.beltBot); ctx.stroke();
      }
      ctx.fillStyle = "rgba(34,197,94,0.35)";
      ctx.fillRect(0, L.beltTop - 2, W, 2);
      ctx.fillRect(0, L.beltBot, W, 2);

      // Haz de la cámara
      var camY = L.beltTop - H * 0.16;
      var beam = ctx.createLinearGradient(0, camY, 0, L.beltBot);
      beam.addColorStop(0, mode === "ai" ? "rgba(34,197,94,0.35)" : "rgba(113,113,122,0.15)");
      beam.addColorStop(1, "rgba(34,197,94,0.02)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(L.scanX - 6, camY); ctx.lineTo(L.scanX + 6, camY);
      ctx.lineTo(L.scanX + W * 0.06, L.beltBot); ctx.lineTo(L.scanX - W * 0.06, L.beltBot); ctx.closePath(); ctx.fill();

      // Cámara
      ctx.fillStyle = "#111A14"; ctx.strokeStyle = mode === "ai" ? "#22C55E" : "#52525B"; ctx.lineWidth = 2;
      roundRect(L.scanX - 22, camY - 18, 44, 22, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = mode === "ai" ? "#4ADE80" : "#52525B";
      ctx.beginPath(); ctx.arc(L.scanX, camY + 4, 5, 0, Math.PI * 2); ctx.fill();

      // Línea de escaneo
      if (mode === "ai") {
        ctx.strokeStyle = "rgba(134,239,172,0.9)"; ctx.lineWidth = 2;
        ctx.shadowColor = "#22C55E"; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(L.scanX, L.beltTop); ctx.lineTo(L.scanX, L.beltBot); ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Bahías / contenedores
      ctx.font = "600 " + L.font + "px Inter, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      BIN_ORDER.forEach(function (m) {
        var cx = W * BIN_X[m], bw = L.binW;
        // boquilla de aire
        ctx.fillStyle = "#18241C";
        ctx.fillRect(cx - 6, L.beltBot + 2, 12, 6);
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.strokeStyle = MATS[m].color; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - bw / 2, L.binTop); ctx.lineTo(cx + bw / 2, L.binTop);
        ctx.lineTo(cx + bw / 2 - 6, L.binBot); ctx.lineTo(cx - bw / 2 + 6, L.binBot); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = MATS[m].color;
        var fs = L.font;
        ctx.font = "600 " + fs + "px Inter, system-ui, sans-serif";
        while (fs > 7 && ctx.measureText(MATS[m].label).width > bw - 10) {
          fs -= 0.5;
          ctx.font = "600 " + fs + "px Inter, system-ui, sans-serif";
        }
        ctx.fillText(MATS[m].label, cx, L.binTop + (L.binBot - L.binTop) * 0.36);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "500 " + L.font + "px 'JetBrains Mono', ui-monospace, monospace";
        ctx.fillText(String(stats.bins[m]), cx, L.binTop + (L.binBot - L.binTop) * 0.7);
        ctx.font = "600 " + L.font + "px Inter, system-ui, sans-serif";
      });
      // Rechazo
      ctx.textAlign = "right"; ctx.fillStyle = "#71717A";
      ctx.fillText("RECHAZO →", W - 10, L.beltTop - L.font);
      ctx.textAlign = "left";

      // Objetos
      items.forEach(function (it) { drawItem(it); });
      if (mode === "ai") {
        items.forEach(function (it) {
          if (it.detected && it.state === "belt") drawBox(it, L);
        });
      } else {
        ctx.fillStyle = "#F59E0B";
        ctx.font = "500 " + L.font + "px Inter, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Clasificación manual", 12, H - 16);
      }
    }

    /* ----- KPIs ----- */
    var el = {
      purity: document.getElementById("kpi-purity"),
      bar: document.getElementById("kpi-purity-bar"),
      pet: document.getElementById("kpi-pet"),
      acero: document.getElementById("kpi-acero"),
      papel: document.getElementById("kpi-papel"),
      carton: document.getElementById("kpi-carton"),
      rechazo: document.getElementById("kpi-rechazo"),
      rate: document.getElementById("kpi-rate"),
      errors: document.getElementById("kpi-errors")
    };
    function updateKpis() {
      var purity = stats.sorted ? Math.round((stats.correct / stats.sorted) * 100) : 0;
      el.purity.textContent = purity;
      el.bar.style.width = purity + "%";
      el.bar.classList.toggle("is-low", purity > 0 && purity < 90);
      el.pet.textContent = stats.bins.pet;
      el.acero.textContent = stats.bins.acero;
      el.papel.textContent = stats.bins.papel;
      el.carton.textContent = stats.bins.carton;
      el.rechazo.textContent = stats.rechazo;
      var span = Math.min(20, simTime);
      el.rate.textContent = span > 1 ? Math.round(stats.scans.length / span * 60) : 0;
      el.errors.textContent = stats.wrong + stats.lost;
    }

    // Precalienta la simulación para que el primer cuadro ya tenga objetos
    function prewarm(seconds) {
      for (var t = 0; t < seconds; t += 1 / 30) step(1 / 30);
    }

    /* ----- Bucle ----- */
    var last = 0, kpiT = 0, rafId = null;
    function loop(ts) {
      if (!last) last = ts;
      var dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      step(dt);
      draw();
      kpiT += dt;
      if (kpiT > 0.25) { updateKpis(); kpiT = 0; }
      rafId = requestAnimationFrame(loop);
    }
    function start() {
      if (rafId || userPaused || !visible) return;
      last = 0;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Controles
    var btnAi = document.getElementById("mode-ai");
    var btnManual = document.getElementById("mode-manual");
    var btnPlay = document.getElementById("demo-play");
    function setMode(m) {
      mode = m;
      btnAi.classList.toggle("is-active", m === "ai");
      btnManual.classList.toggle("is-active", m === "manual");
      btnAi.setAttribute("aria-checked", String(m === "ai"));
      btnManual.setAttribute("aria-checked", String(m === "manual"));
      items = []; simTime = 0; resetStats();
      prewarm(30);
      draw(); updateKpis();
    }
    btnAi.addEventListener("click", function () { setMode("ai"); });
    btnManual.addEventListener("click", function () { setMode("manual"); });
    function setPaused(p) {
      userPaused = p;
      btnPlay.classList.toggle("paused", p);
      btnPlay.setAttribute("aria-label", p ? "Reanudar simulación" : "Pausar simulación");
      if (p) stop(); else start();
    }
    btnPlay.addEventListener("click", function () { setPaused(!userPaused); });

    // Solo anima cuando la demo está visible
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.05 }).observe(canvas);
    }

    if ("ResizeObserver" in window) new ResizeObserver(debounce(resize, 60)).observe(canvas);
    else window.addEventListener("resize", debounce(resize, 120));

    resize();
    prewarm(30);
    draw();
    updateKpis();
    if (reduceMotion) setPaused(true); else start();
  }

  /* =========================================================
     6. COPIAR CÓDIGO · FORMULARIO · AÑO
     ========================================================= */
  var copyBtn = document.getElementById("copy-code");
  var code = document.getElementById("code-sample");
  if (copyBtn && code) {
    copyBtn.addEventListener("click", function () {
      var text = code.textContent;
      function selectFallback() {
        var range = document.createRange();
        range.selectNodeContents(code);
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        copyBtn.textContent = "Seleccionado";
      }
      try {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = "Copiado";
        }, selectFallback);
      } catch (e) { selectFallback(); }
      setTimeout(function () { copyBtn.textContent = "Copiar"; }, 2000);
    });
  }

  var form = document.getElementById("pilot-form");
  var msg = document.getElementById("form-msg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var firstBad = null;
      required.forEach(function (input) {
        var bad = !input.value.trim() || (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        input.classList.toggle("invalid", bad);
        input.setAttribute("aria-invalid", String(bad));
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) {
        msg.classList.add("error");
        msg.textContent = "Completa nombre, empresa y un correo válido para postular.";
        firstBad.focus();
        return;
      }
      msg.classList.remove("error");
      // Sin servidor: se arma un correo con los datos para enviarlo a EcoVision AI
      var fullName = form.querySelector("#f-name").value.trim();
      var name = fullName.split(" ")[0];
      var body = "Nombre: " + fullName +
        "\nEmpresa o planta: " + form.querySelector("#f-company").value.trim() +
        "\nCorreo: " + form.querySelector("#f-email").value.trim() +
        "\nVolumen procesado: " + (form.querySelector("#f-volume").value || "No indicado");
      var mailto = "mailto:ecovisionai1@gmail.com?subject=" +
        encodeURIComponent("Postulación al piloto · " + form.querySelector("#f-company").value.trim()) +
        "&body=" + encodeURIComponent(body);
      msg.innerHTML = "";
      msg.appendChild(document.createTextNode("Gracias, " + name + ". Para completar tu postulación, "));
      var link = document.createElement("a");
      link.href = mailto;
      link.textContent = "envíanos estos datos por correo";
      msg.appendChild(link);
      msg.appendChild(document.createTextNode(" o escríbenos a ecovisionai1@gmail.com."));
      form.reset();
    });
    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("invalid") && e.target.value.trim()) {
        e.target.classList.remove("invalid");
        e.target.removeAttribute("aria-invalid");
      }
    });
  }

  /* ---------- Mapa: cambiar acercamiento sin salir de la página ---------- */
  var mapFrame = document.getElementById("map-iframe");
  var zoomBtns = document.querySelectorAll(".map-view-btn");
  if (mapFrame && zoomBtns.length) {
    zoomBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        zoomBtns.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        mapFrame.src = mapFrame.src.replace(/([?&]z=)\d+/, "$1" + btn.dataset.zoom);
      });
    });
  }

  /* ---------- Copiar correo de contacto ---------- */
  document.querySelectorAll(".contact-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy;
      function done(label) {
        btn.textContent = label;
        setTimeout(function () { btn.textContent = "Copiar"; }, 2000);
      }
      try {
        navigator.clipboard.writeText(text).then(function () { done("Copiado"); }, function () { done("Selecciona y copia"); });
      } catch (e) { done("Selecciona y copia"); }
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
