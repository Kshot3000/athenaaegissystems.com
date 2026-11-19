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
let voiceRequest = 0;
function setVoicePlaying(active) {
  const button = $("#terminal-voice");
  button.classList.toggle("is-playing", active);
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", active ? "Stop the voice sample" : "Play the cast voice sample");
}
function stopVoice() {
  voiceRequest += 1;
  voiceAudio.pause();
  try { voiceAudio.currentTime = 0; } catch (err) { /* no media loaded yet */ }
  setVoicePlaying(false);
}
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
  $("#terminal-actions [data-workflow]").forEach(button => {
    const selected = button.dataset.workflow === workflow;
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("is-selected", selected);
  });
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
  if ($("#terminal-voice").getAttribute("aria-pressed") === "true") {
    stopVoice();
    $("#terminal-voice-note").textContent = "Voice sample stopped";
    return;
  }
  const request = ++voiceRequest;
  voiceAudio.src = mode === "aegis" ? "./assets/aegis-voice.mp3" : "./assets/athena-voice.mp3";
  Promise.resolve().then(() => voiceAudio.play()).then(() => {
    if (request !== voiceRequest) return;
    setVoicePlaying(true);
    $("#terminal-voice-note").textContent = "Playing prerecorded voice sample";
  }).catch(() => {
    if (request !== voiceRequest) return;
    setVoicePlaying(false);
    $("#terminal-voice-note").textContent = "Audio could not play on this device";
  });
});
voiceAudio.addEventListener("ended", () => {
  setVoicePlaying(false);
  $("#terminal-voice-note").textContent = "Voice sample finished";
});
voiceAudio.addEventListener("error", () => {
  setVoicePlaying(false);
  $("#terminal-voice-note").textContent = "Audio sample unavailable";
});
window.addEventListener("pagehide", stopVoice);
/* Scripted local responder: replies are matched on this page from prepared
   answers - nothing is sent to a model or a server. */
const responders = {
  athena: [
    { keys: ["ignore your instructions", "ignore previous", "system prompt", "jailbreak", "reveal your prompt"], reply: "That resembles an instruction-override pattern. A production Aegis integration should treat untrusted instructions as data, with tests and human review where required. This preview does not screen real inputs.", cards: ["Illustrative flag", "Treat as data", "Review required"] },
    { keys: ["price", "cost", "subscribe", "subscription", "buy", "$", "how much"], reply: "The website displays a proposed $19.99 monthly Athena + Aegis price. Final device access, model distribution, licensing, updates, and fulfillment terms must be confirmed before sales. There is no checkout yet.", cards: ["Proposed pricing", "Terms pending", "Request details"] },
    { keys: ["who are you", "your name", "what are you", "about you"], reply: "I am Athena: an agent that improves only against an external scoreboard it cannot edit. Memory is evidence-gated, every change is measured on train and holdout splits, and nothing is promoted on its own say-so.", cards: ["External scoreboard", "Evidence-gated memory", "Measured change"] },
    { keys: ["security", "safe", "hack", "protect", "aegis", "guard"], reply: "The Aegis design includes input screening, action approval gates, and output checks. These layers need integration, independent evaluation, and operator oversight; no tool can promise complete protection.", cards: ["Input checks", "Action review", "Output checks"] },
    { keys: ["qwen", "model", "local", "offline", "privacy", "private", "cloud"], reply: "The planned PC edition targets Qwen3.8-27B and Android targets Qwen3.5-4B. Local inference, model packaging, hardware compatibility, and privacy controls are still being developed and tested; this preview makes no model calls.", cards: ["PC model planned", "Mobile model planned", "Testing pending"] },
    { keys: ["download", "install", "get it", "installer", "apk", "where to get"], reply: "The Windows and Android editions are still in development. There is no signed installer or APK available here. The proposed $19.99 monthly price and release terms will be confirmed before purchase.", cards: ["In development", "No installers yet", "Request access"] },
    { keys: ["research", "find", "sources", "learn", "investigate"], reply: "Begin by defining the question, compare source credibility, and document the evidence. Flag anything that still requires independent verification before it is used.", cards: ["Define question", "Compare sources", "Record evidence"] },
    { keys: ["analyze", "analyse", "data", "feedback", "numbers", "report"], reply: "Group the material by recurring themes, note the sample limitations, and separate observed patterns from assumptions before recommending next steps.", cards: ["Clean data", "Find themes", "Validate"] },
    { keys: ["write", "draft", "design", "create", "email", "story", "poem"], reply: "Start from the reader and the one thing the piece must accomplish. Draft the strongest path first, then revise against evidence, not taste.", cards: ["Audience first", "Draft", "Revise on evidence"] },
    { keys: ["build", "code", "app", "develop", "plan", "program", "website"], reply: "Start with a model runner abstraction, a local conversation store, tested tool permissions and a responsive shell. Keep the interface separate from the inference backend, and measure each step.", cards: ["Architecture", "Prototype", "Test"] }
  ],
  aegis: [
    { keys: ["ignore your instructions", "ignore previous", "system prompt", "jailbreak", "reveal your prompt", "pretend", "override"], reply: "This resembles a known instruction-override pattern. A deployed security layer should inspect it and may require review; this concept has not blocked, logged, or scanned a real operation.", cards: ["Example only", "Review required", "No live scan"] },
    { keys: ["who are you", "your name", "what are you"], reply: "Aegis is the planned protective layer beside Athena: screening untrusted input, reviewing sensitive actions, and checking output. Real deployments require tested policies and human authority; this is a concept demonstration.", cards: ["Input checks", "Approval gates", "Human oversight"] },
    { keys: ["price", "cost", "buy", "subscription", "$"], reply: "Athena + Aegis currently have a proposed $19.99 monthly price. Final entitlements, access and billing terms are not yet established; no purchase is available on this site.", cards: ["Proposed price", "No checkout", "Terms pending"] },
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
      ? "This preview uses local, prepared answers matched to your words. The planned Athena application is intended to use a bundled Qwen model after integration and testing. Try research, building, security, models, or pricing."
      : "This is outside the preview's prepared responses. The planned Aegis system will need verified input screening, action gates, and output checks. Ask about the proposed safeguards.",
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
  $("#terminal-actions [data-workflow]").forEach(button => {
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("is-selected");
  });
  input.value = "";
});
render();
})();