/* Athena's visual engine — zero tracking, zero audio, no network requests.
 * Deliberately independent of experience.js: Muse can replace the voice
 * pipeline without breaking this motion layer.
 *
 * Canvas is a visual overlay only: the original portrait remains readable
 * with JS disabled, CSS reduced motion, and canvas unsupported.
 */
(() => {
  "use strict";

  const stage = document.getElementById("oracle-stage");
  const canvas = document.getElementById("avatar-atmosphere");
  if (!stage || !canvas || typeof canvas.getContext !== "function") return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const motionButton = document.getElementById("motion-toggle");
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;
  let running = false;
  let visible = true;
  let last = 0;
  let particles = [];
  let pointer = { x: 0.5, y: 0.5 };
  const MAX_PARTICLES = 58;

  // Repeatable pseudo-random sequence: deterministic look per load and no
  // high-frequency random allocation inside the animation loop.
  let seed = 123456789;
  function random() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function rebuild() {
    const bounds = stage.getBoundingClientRect();
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = [];
    const count = Math.min(MAX_PARTICLES, Math.max(12, Math.floor(width * height / 7800)));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: random() * width,
        y: random() * height,
        radius: 0.6 + random() * 1.5,
        speed: 0.09 + random() * 0.28,
        drift: random() * Math.PI * 2,
        alpha: 0.17 + random() * 0.45,
        gold: random() > 0.64
      });
    }
    draw(0, true);
  }

  function shouldAnimate() {
    return visible &&
      !motionPreference.matches &&
      !document.body.classList.contains("motion-off") &&
      !document.hidden;
  }

  function draw(seconds, still = false) {
    context.clearRect(0, 0, width, height);

    // One faint orbital sweep, not a simulated 3D body or face.
    const centerX = width * 0.59;
    const centerY = height * 0.35;
    const orbit = Math.min(width, height) * 0.32;
    const glow = context.createRadialGradient(
      centerX, centerY, 5,
      centerX, centerY, orbit * 1.5
    );
    glow.addColorStop(0, "rgba(109,197,255,0.065)");
    glow.addColorStop(0.62, "rgba(80,135,224,0.028)");
    glow.addColorStop(1, "rgba(10,20,38,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    // Small drifting flecks of gold / starlight.
    for (const p of particles) {
      const x = p.x + (still ? 0 : Math.sin(seconds * 0.35 + p.drift) * 12);
      const y = ((p.y - (still ? 0 : seconds * p.speed * 24)) % height + height) % height;
      const shimmer = still ? 0.78 : 0.65 + 0.35 * Math.sin(seconds * 1.6 + p.drift);
      context.beginPath();
      context.arc(x, y, p.radius, 0, Math.PI * 2);
      context.fillStyle = p.gold
        ? "rgba(255,210,133," + (p.alpha * shimmer).toFixed(3) + ")"
        : "rgba(175,228,255," + (p.alpha * shimmer).toFixed(3) + ")";
      context.fill();
    }

    // Sparse precision arc ticks add a subtle, non-repeating living glow.
    context.save();
    context.translate(centerX, centerY);
    for (let i = 0; i < 12; i++) {
      const offset = (i * Math.PI / 6) + (still ? 0 : seconds * 0.045);
      const r = orbit + (i % 3) * 2;
      context.beginPath();
      context.arc(0, 0, r, offset, offset + 0.012 + (i % 2) * 0.019);
      context.strokeStyle = i % 4 === 0
        ? "rgba(245,204,132,0.42)"
        : "rgba(148,210,250,0.22)";
      context.lineWidth = i % 4 === 0 ? 2 : 1;
      context.stroke();
    }
    context.restore();
  }

  function tick(timestamp) {
    frame = 0;
    if (!shouldAnimate()) {
      running = false;
      draw(0, true);
      return;
    }
    if (!last) last = timestamp;
    const elapsed = timestamp / 1000;
    // Cap atmosphere rendering at about 30fps to protect mobile batteries.
    if (timestamp - last >= 32) {
      draw(elapsed);
      last = timestamp;
    }
    frame = window.requestAnimationFrame(tick);
  }

  function refresh() {
    if (shouldAnimate() && !running) {
      running = true;
      last = 0;
      frame = window.requestAnimationFrame(tick);
    } else if (!shouldAnimate() && running) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      running = false;
      draw(0, true);
    }
  }

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => { rebuild(); refresh(); });
    resizeObserver.observe(stage);
  } else {
    window.addEventListener("resize", () => { rebuild(); refresh(); }, { passive: true });
  }

  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      refresh();
    }, { rootMargin: "120px" });
    observer.observe(stage);
  }

  stage.addEventListener("pointermove", event => {
    if (coarsePointer.matches || !shouldAnimate()) return;
    const b = stage.getBoundingClientRect();
    pointer = {
      x: (event.clientX - b.left) / b.width,
      y: (event.clientY - b.top) / b.height
    };
    stage.style.setProperty("--light-x", (pointer.x * 100).toFixed(1) + "%");
    stage.style.setProperty("--light-y", (pointer.y * 100).toFixed(1) + "%");
  }, { passive: true });
  stage.addEventListener("pointerleave", () => {
    stage.style.setProperty("--light-x", "62%");
    stage.style.setProperty("--light-y", "30%");
  });
  motionPreference.addEventListener?.("change", refresh);
  motionButton?.addEventListener("click", () => window.requestAnimationFrame(refresh));
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("pagehide", () => {
    if (frame) window.cancelAnimationFrame(frame);
    running = false;
  });

  rebuild();
  refresh();
})();