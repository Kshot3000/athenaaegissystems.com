/* LIVING REALMS: DIGITAL WATER / DIGITAL FIRE
 * Lightweight opt-in decorative canvas animation. No audio, tracking,
 * microphone, network, model calls, or external animation dependencies.
 * Does not manipulate Muse-owned voice / TTS code.
 *
 * Portraits and environmental artwork are always visible without JS.
 * Respects reduced motion, explicit "Pause ambient motion", document
 * visibility and offscreen stages. Uses a shared <= 30fps clock.
 */
(function () {
  "use strict";
  const nodes = Array.from(document.querySelectorAll("canvas[data-realm]"));
  if (!nodes.length || typeof window.requestAnimationFrame !== "function") return;

  const reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const mobile = window.matchMedia ? window.matchMedia("(max-width: 680px)") : null;
  const scenes = [];
  let raf = 0;
  let lastPaint = 0;
  let clock = 0;
  const TAU = Math.PI * 2;

  function rand(seed) {
    let x = (seed * 1664525 + 1013904223) >>> 0;
    return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
  }

  function buildScene(canvas, i) {
    const ctx = canvas.getContext && canvas.getContext("2d", { alpha: true });
    if (!ctx) return null;
    const scene = {
      canvas, ctx, kind: canvas.dataset.realm || "water",
      visible: true, width: 0, height: 0, ratio: 1, particles: [],
      nextSeed: rand(0x1A9E5 + i * 101)
    };
    scenes.push(scene);
    return scene;
  }

  function resize(scene) {
    const rect = scene.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    scene.width = Math.round(rect.width);
    scene.height = Math.round(rect.height);
    const ratio = Math.min(window.devicePixelRatio || 1, mobile && mobile.matches ? 1.5 : 2);
    scene.ratio = ratio;
    scene.canvas.width = Math.round(scene.width * ratio);
    scene.canvas.height = Math.round(scene.height * ratio);
    scene.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const max = mobile && mobile.matches ? 22 : 42;
    const count = Math.min(max, Math.max(8, Math.round(scene.width * scene.height / 17000)));
    scene.particles = Array.from({ length: count }, () => ({
      x: scene.nextSeed(), y: scene.nextSeed(),
      size: .5 + scene.nextSeed() * 1.7,
      speed: .19 + scene.nextSeed() * .65,
      phase: scene.nextSeed() * TAU,
      opacity: .19 + scene.nextSeed() * .39,
      warm: scene.nextSeed() > .68
    }));
    draw(scene, 0);
  }

  function water(scene, t, left = 0, right = scene.width) {
    const ctx = scene.ctx, w = right - left, h = scene.height;
    if (w <= 0) return;
    // Cyan liquid energy sweeps over the lower half, away from faces.
    for (let band = 0; band < 4; band++) {
      const y = h * (.71 + band * .073);
      ctx.beginPath();
      for (let j = 0; j <= 44; j++) {
        const x = left + (j / 44) * w;
        const wave = Math.sin(j * .33 + t * (.4 + band * .15) + band * .75) * (6 + band * 2.8)
          + Math.cos(j * .17 - t * .35 + band) * 3;
        if (j === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = [
        "rgba(33,195,255,.26)",
        "rgba(146,241,255,.31)",
        "rgba(38,115,238,.21)",
        "rgba(218,250,255,.22)"
      ][band];
      ctx.lineWidth = band === 1 ? 1.5 : 1;
      ctx.stroke();
    }
    for (const p of scene.particles) {
      const x = left + ((p.x * w + Math.sin(t * .27 + p.phase) * 12) % w + w) % w;
      const y = (p.y * h + Math.sin(t * p.speed + p.phase) * 17 + h) % h;
      // Most particles are tiny; their brightness pulses slowly.
      const glow = .65 + .35 * Math.sin(t * 1.25 + p.phase);
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, TAU);
      ctx.fillStyle = p.warm
        ? "rgba(231,220,175," + (p.opacity * glow * .5).toFixed(3) + ")"
        : "rgba(99,219,255," + (p.opacity * glow).toFixed(3) + ")";
      ctx.fill();
    }
  }

  function fire(scene, t, left = 0, right = scene.width) {
    const ctx = scene.ctx, w = right - left, h = scene.height;
    if (w <= 0) return;
    // Rising ember trails plus a restrained molten current along the base.
    for (const p of scene.particles) {
      const y = ((p.y * h - t * (19 + 37 * p.speed)) % h + h) % h;
      const x = left + ((p.x * w + Math.sin(t * p.speed + p.phase) * 17) % w + w) % w;
      const intensity = .7 + .3 * Math.sin(t * 1.6 + p.phase);
      const alpha = p.opacity * intensity;
      ctx.strokeStyle = p.warm
        ? "rgba(255,196,107," + (alpha * .77).toFixed(3) + ")"
        : "rgba(255,73,54," + alpha.toFixed(3) + ")";
      ctx.lineWidth = Math.max(.7, p.size * .85);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 3, y + 5, x + 5 + p.speed * 5, y + 11 + p.speed * 7);
      ctx.stroke();
    }
    for (let band = 0; band < 3; band++) {
      const baseline = h * (.87 + band * .049);
      ctx.beginPath();
      for (let step = 0; step <= 40; step++) {
        const x = left + (step / 40) * w;
        const y = baseline + Math.sin(step * .3 - t * (.6 + band * .14)) * (7 + band * 3);
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = band === 1 ? 1.45 : .9;
      ctx.strokeStyle = [
        "rgba(255,107,50,.27)", "rgba(255,181,103,.36)", "rgba(244,66,42,.21)"
      ][band];
      ctx.stroke();
    }
  }

  function draw(scene, t) {
    const { ctx, width, height } = scene;
    if (width < 1 || height < 1) return;
    ctx.clearRect(0, 0, width, height);
    if (scene.kind === "duality") {
      // Portal split: liquid blue on the left, red fire on the right.
      water(scene, t, 0, width * .51);
      fire(scene, t, width * .49, width);
    } else if (scene.kind === "fire") {
      fire(scene, t);
    } else {
      water(scene, t);
    }
  }

  function active() {
    return !document.hidden &&
      !(reduced && reduced.matches) &&
      !document.body.classList.contains("world-paused") &&
      !document.body.classList.contains("motion-off") &&
      scenes.some(s => s.visible && s.width > 0 && s.height > 0);
  }

  function frame(now) {
    raf = 0;
    if (!active()) { for (const s of scenes) draw(s, 0); return; }
    const interval = mobile && mobile.matches ? 52 : 33; // ~19 or ~30 fps
    if (!lastPaint || now - lastPaint >= interval) {
      clock = now / 1000;
      for (const scene of scenes) if (scene.visible) draw(scene, clock);
      lastPaint = now;
    }
    raf = window.requestAnimationFrame(frame);
  }

  function sync() {
    if (active()) {
      if (!raf) raf = window.requestAnimationFrame(frame);
    } else {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      lastPaint = 0;
      for (const s of scenes) draw(s, 0);
    }
  }

  const observer = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(entries => {
      for (const e of entries) {
        const scene = scenes.find(s => s.canvas === e.target);
        if (scene) scene.visible = e.isIntersecting;
      }
      sync();
    }, { rootMargin: "80px" }) : null;
  const resizer = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(entries => {
      for (const e of entries) {
        const scene = scenes.find(s => s.canvas === e.target);
        if (scene) resize(scene);
      }
      sync();
    }) : null;

  nodes.forEach((canvas, i) => {
    const scene = buildScene(canvas, i);
    if (!scene) return;
    resize(scene);
    if (observer) observer.observe(canvas);
    if (resizer) resizer.observe(canvas);
  });
  if (!resizer) window.addEventListener("resize", () => { scenes.forEach(resize); sync(); }, { passive:true });
  if (reduced) {
    if (reduced.addEventListener) reduced.addEventListener("change", sync);
    else if (reduced.addListener) reduced.addListener(sync);
  }
  const toggle = document.getElementById("world-motion-toggle") || document.getElementById("motion-toggle");
  // The existing page handler toggles body.world-paused / body.motion-off;
  // defer our check by one frame to observe that actual state.
  if (toggle) toggle.addEventListener("click", () => window.requestAnimationFrame(sync));
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pagehide", () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    observer?.disconnect();
    resizer?.disconnect();
  });

  sync();
})();
