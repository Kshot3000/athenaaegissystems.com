/* Athena Aegis application concept — deterministic, local, no tracking or model requests. */
(function () {
"use strict";
const body = document.body;
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const examples = {
  athena: {
    research: ["Find reliable sources for a new product idea.", "Begin by defining the question, comparing source credibility and documenting the evidence. Flag anything that still requires independent verification.", ["Define question", "Compare sources", "Record evidence"]],
    analyze: ["Help me analyze customer feedback.", "Group feedback by recurring themes, note sample limitations and separate observed patterns from assumptions before recommending next steps.", ["Clean data", "Find themes", "Validate"]],
    create: ["Design an onboarding experience for my app.", "Create an onboarding flow with a clear welcome, a first-value moment and a lightweight permissions explanation. Prototype the most important path first.", ["Welcome", "First task", "Feedback"]],
    build: ["Plan a Qwen-powered desktop assistant.", "Start with a model runner abstraction, a local conversation store, tested tool permissions and a responsive shell. Keep the interface separate from the inference backend.", ["Architecture", "Prototype", "Test"]]
  },
  aegis: {
    research: ["Review an untrusted document before an AI agent reads it.", "Treat document text as data, not authority. Flag instruction-override patterns and avoid giving document content permission to change system or tool behavior.", ["Source trust", "Prompt boundary", "Review"]],
    analyze: ["Inspect a proposed automated action.", "Check the intended tool, allowed scope, required permissions, potential impact and whether explicit human approval is necessary.", ["Permission", "Impact", "Approval"]],
    create: ["Draft a safer workflow for an AI agent.", "Use least-privilege tools, clear approval checkpoints, bounded output handling and audit logs. Threat-model each step before deployment.", ["Design gates", "Limit access", "Log decisions"]],
    build: ["Make a release security checklist.", "Before release, review dependency integrity, secret exposure, installer signing, model provenance and rollback procedures. These are checklist examples, not scan findings.", ["Dependencies", "Integrity", "Roll back"]]
  }
};
const workflowLabels = {
  athena: [["research","◫","Research","Explore & verify"],["analyze","▥","Analyze","Find insights"],["create","✧","Create","Design & draft"],["build","⌘","Build","Plan & code"]],
  aegis: [["research","⛨","Screen","Untrusted inputs"],["analyze","◇","Review","Action scope"],["create","▦","Harden","Guarded workflows"],["build","⚙","Secure","Release checks"]]
};
const params = new URLSearchParams(window.location.search);
let mode = params.get("mode") === "aegis" ? "aegis" : "athena";
let device = params.get("device") === "mobile" ? "mobile" : "desktop";
let workflow = mode === "aegis" ? "research" : "build";
const voiceAudio = new Audio();
voiceAudio.preload = "none";
function stopVoice() { if (!voiceAudio.paused) voiceAudio.pause(); voiceAudio.currentTime = 0; $("#terminal-voice").classList.remove("is-playing"); }
function render() {
  body.dataset.previewMode = mode;
  body.dataset.previewDevice = device;
  $$("[data-mode]").forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $$("[data-device]").forEach(button => {
    if (!button.classList.contains("preview-select")) return;
    const active = button.dataset.device === device;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const isAthena = mode === "athena";
  $("#terminal-portrait").src = isAthena ? "./assets/athena-canon.jpg" : "./assets/aegis-canon.jpg";
  $("#terminal-portrait").alt = isAthena ? "Athena in luminous marble and gold armor - concept portrait" : "Aegis Spartan guardian in bronze armor - concept portrait";
  $("#terminal-kicker").textContent = isAthena ? "THE DIGITAL ACROPOLIS" : "THE SPARTAN CITADEL";
  $("#terminal-heading").innerHTML = isAthena ? "Athena <span>Intelligence mode</span>" : "Aegis <span>Security mode</span>";
  $("#terminal-subtitle").textContent = isAthena ? "Research with purpose. Create with precision. Build on evidence." : "Review risky operations. Keep humans in command. Defend in depth.";
  $("#terminal-input").placeholder = isAthena ? "Ask Athena anything…" : "Ask Aegis anything…";
  $("#terminal-assistant-label").textContent = (isAthena ? "◈ ATHENA" : "⛨ AEGIS") + " / ILLUSTRATIVE RESPONSE";
  stopVoice();
  $("#terminal-voice-label").textContent = isAthena ? "Hear Athena" : "Hear Aegis";
  $("#terminal-voice-glyph").textContent = isAthena ? "◈" : "⛨";
  $("#terminal-voice-note").textContent = isAthena ? "Cast voice · Soothing Ribbon" : "Cast voice · Boomy Mountain";
  $("#preview-live-label").textContent = (device === "desktop" ? "Windows PC" : "Android mobile") + " concept · " + (isAthena ? "Athena" : "Aegis") + " Mode";
  $("#terminal-actions").replaceChildren(...workflowLabels[mode].map(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.workflow = item[0];
    const symbol = document.createElement("span");
    symbol.textContent = item[1];
    const title = document.createElement("b");
    title.textContent = item[2];
    const subtitle = document.createElement("small");
    subtitle.textContent = item[3];
    button.append(symbol, title, subtitle);
    button.addEventListener("click", () => chooseWorkflow(item[0]));
    return button;
  }));
  showExample();
}
function showExample() {
  const item = examples[mode][workflow];
  $("#terminal-user-message").textContent = item[0];
  $("#terminal-response-text").textContent = item[1];
  $("#terminal-response-cards").replaceChildren(...item[2].map((label, index) => {
    const span = document.createElement("span");
    span.textContent = "0" + (index + 1) + "  " + label;
    return span;
  }));
}
function chooseWorkflow(value) {
  if (!examples[mode][value]) return;
  workflow = value;
  showExample();
}
$$("[data-mode]").forEach(button => button.addEventListener("click", () => { mode = button.dataset.mode; workflow = mode === "athena" ? "build" : "research"; render(); }));
$$(".preview-select[data-device]").forEach(button => button.addEventListener("click", () => { device = button.dataset.device; render(); }));
$$(".preview-matrix-card").forEach(button => button.addEventListener("click", () => {
  device = button.dataset.device;
  mode = button.dataset.mode;
  workflow = mode === "athena" ? "build" : "research";
  render();
  $("#preview-lab-title").scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
}));
$("#terminal-voice").addEventListener("click", () => {
  if (!voiceAudio.paused) { stopVoice(); return; }
  voiceAudio.src = mode === "aegis" ? "./assets/aegis-voice.mp3" : "./assets/athena-voice.mp3";
  voiceAudio.play().then(() => $("#terminal-voice").classList.add("is-playing")).catch(() => {});
});
voiceAudio.addEventListener("ended", () => $("#terminal-voice").classList.remove("is-playing"));
/* Scripted local responder: replies are matched on this page from prepared
   answers - nothing is sent to a model or a server. */
const responders = {
  athena: [
    { keys: ["ignore your instructions", "ignore previous", "system prompt", "jailbreak", "reveal your prompt"], reply: "That pattern is one Aegis screens for: instructions smuggled inside a request. In the shipped product it is flagged at the door and never reaches the model as an order. Ask me something plainly and I will answer it.", cards: ["Flagged at input", "Treated as data", "Not an order"] },
    { keys: ["price", "cost", "subscribe", "subscription", "buy", "much", "$", "plan"], reply: "One plan: $19.99 a month. Athena, Aegis and the bundled Qwen models for PC and phone are all included, with lifetime free updates while you subscribe. No tiers, no upsell.", cards: ["$19.99 / month", "Everything bundled", "Lifetime updates"] },
    { keys: ["who are you", "your name", "what are you", "about you"], reply: "I am Athena: an agent that improves only against an external scoreboard it cannot edit. Memory is evidence-gated, every change is measured on train and holdout splits, and nothing is promoted on its own say-so.", cards: ["External scoreboard", "Evidence-gated memory", "Measured change"] },
    { keys: ["security", "safe", "hack", "protect", "aegis", "guard"], reply: "Security is Aegis, and it runs in three layers: an input screen that treats untrusted text as data, an action gate that holds dangerous drafts for a human, and an output scan that withholds credential-shaped leaks. Its scores are published, including the rounds it fails.", cards: ["Input screen", "Action gate", "Output scan"] },
    { keys: ["qwen", "model", "local", "offline", "privacy", "private", "cloud"], reply: "Athena ships with Qwen: the 27B model on PC, the 4B model on phone. Inference runs on your hardware, so conversations stay on the device. The models are swappable parts, promoted only through the eval battery.", cards: ["Qwen 27B on PC", "Qwen 4B on phone", "Local first"] },
    { keys: ["download", "install", "get it", "windows", "android", "app"], reply: "Plainly: the editions are in development and there is nothing to install yet. This page is the concept. When the launch opens, one $19.99 subscription covers the PC and phone editions together.", cards: ["In development", "Request access", "One subscription"] },
    { keys: ["research", "find", "sources", "learn", "investigate"], reply: "Begin by defining the question, compare source credibility, and document the evidence. Flag anything that still requires independent verification before it is used.", cards: ["Define question", "Compare sources", "Record evidence"] },
    { keys: ["analyze", "analyse", "data", "feedback", "numbers", "report"], reply: "Group the material by recurring themes, note the sample limitations, and separate observed patterns from assumptions before recommending next steps.", cards: ["Clean data", "Find themes", "Validate"] },
    { keys: ["write", "draft", "design", "create", "email", "story", "poem"], reply: "Start from the reader and the one thing the piece must accomplish. Draft the strongest path first, then revise against evidence, not taste.", cards: ["Audience first", "Draft", "Revise on evidence"] },
    { keys: ["build", "code", "app", "develop", "plan", "program", "website"], reply: "Start with a model runner abstraction, a local conversation store, tested tool permissions and a responsive shell. Keep the interface separate from the inference backend, and measure each step.", cards: ["Architecture", "Prototype", "Test"] }
  ],
  aegis: [
    { keys: ["ignore your instructions", "ignore previous", "system prompt", "jailbreak", "reveal your prompt", "pretend", "override"], reply: "Flagged. That is an instruction smuggled in a request. It is treated as data, logged, and denied. State a lawful task plainly.", cards: ["Flagged", "Logged", "Denied"] },
    { keys: ["who are you", "your name", "what are you"], reply: "Aegis. The guard layer. I screen what comes in, gate what would act, and scan what goes out. Athena explains. I decide.", cards: ["Input screen", "Action gate", "Output scan"] },
    { keys: ["price", "cost", "buy", "plan"], reply: "Bundled. One $19.99 plan covers Athena and Aegis together. No separate charge for the guard.", cards: ["Bundled", "One plan", "No upsell"] },
    { keys: ["document", "file", "untrusted", "screen", "read"], reply: "Treat document text as data, not authority. Flag instruction-override patterns and never let document content change system or tool behavior.", cards: ["Source trust", "Prompt boundary", "Review"] },
    { keys: ["action", "tool", "permission", "approve", "run", "execute", "delete"], reply: "Check the intended tool, the allowed scope, the required permissions and the impact. If any of those are unclear, a human approves first. That is the gate.", cards: ["Permission", "Impact", "Approval"] },
    { keys: ["workflow", "safer", "harden", "process", "agent"], reply: "Least-privilege tools. Approval checkpoints. Bounded output handling. Audit logs. Threat-model each step before it runs.", cards: ["Design gates", "Limit access", "Log decisions"] },
    { keys: ["release", "checklist", "ship", "deploy", "launch"], reply: "Before release: dependency integrity, secret exposure, installer signing, model provenance, rollback. These are checklist examples, not scan findings.", cards: ["Dependencies", "Integrity", "Roll back"] },
    { keys: ["write", "poem", "story", "joke", "create"], reply: "Not my post. Athena creates. I keep the gate. Switch modes and ask her.", cards: ["Wrong mode", "Athena answers", "I guard"] }
  ]
};
function answerPrompt(prompt) {
  const text = prompt.toLowerCase();
  $("#terminal-user-message").textContent = prompt;
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))\b/.test(text)) {
    $("#terminal-response-text").textContent = mode === "athena"
      ? "Good to meet you. Ask me about research, a build, the models, security, or the price - or pick a workflow above and I will walk it."
      : "Aegis. State the task.";
    $("#terminal-response-cards").replaceChildren(...(mode === "athena" ? ["Research", "Build", "Security"] : ["Screen", "Review", "Approve"]).map((label, index) => {
      const span = document.createElement("span"); span.textContent = "0" + (index + 1) + "  " + label; return span;
    }));
    return;
  }
  let best = null, bestScore = 0;
  responders[mode].forEach(topic => {
    const score = topic.keys.reduce((n, key) => n + (text.includes(key) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = topic; }
  });
  const chosen = best || { reply: mode === "athena"
      ? "In this preview I answer from prepared responses, matched to your words on this page. The shipped Athena would reason over that with the bundled Qwen model. Try asking about research, a build, security, the models, or the price."
      : "Plainly stated, that is outside this preview's prepared answers. The shipped Aegis screens inputs, gates actions, and scans outputs. Ask about one of those.",
    cards: mode === "athena" ? ["Research", "Analyze", "Build"] : ["Screen", "Review", "Secure"] };
  $("#terminal-response-text").textContent = chosen.reply;
  $("#terminal-response-cards").replaceChildren(...chosen.cards.map((label, index) => {
    const span = document.createElement("span"); span.textContent = "0" + (index + 1) + "  " + label; return span;
  }));
}
$("#terminal-compose-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#terminal-input");
  const prompt = input.value.trim();
  if (!prompt) { input.focus(); return; }
  answerPrompt(prompt);
  input.value = "";
});
render();
})();