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
  $("#terminal-portrait").src = isAthena ? "./assets/athena-cybernetic.svg" : "./assets/aegis-cybernetic.svg";
  $("#terminal-portrait").alt = isAthena ? "Illustrated cybernetic Athena portrait" : "Illustrated cybernetic Aegis guardian";
  $("#terminal-kicker").textContent = isAthena ? "THE DIGITAL ACROPOLIS" : "THE SPARTAN CITADEL";
  $("#terminal-heading").innerHTML = isAthena ? "Athena <span>Intelligence mode</span>" : "Aegis <span>Security mode</span>";
  $("#terminal-subtitle").textContent = isAthena ? "Research with purpose. Create with precision. Build on evidence." : "Review risky operations. Keep humans in command. Defend in depth.";
  $("#terminal-input").placeholder = isAthena ? "Ask Athena anything…" : "Ask Aegis anything…";
  $("#terminal-assistant-label").textContent = (isAthena ? "◈ ATHENA" : "⛨ AEGIS") + " / ILLUSTRATIVE RESPONSE";
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
$("#terminal-compose-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#terminal-input");
  const prompt = input.value.trim();
  if (!prompt) { input.focus(); return; }
  $("#terminal-user-message").textContent = prompt;
  $("#terminal-response-text").textContent = "This is a design preview, not a running " + (mode === "athena" ? "Athena" : "Aegis") + " model. In the released app, this prompt would go through the configured model runtime and appropriate safety checks. Select a workflow above to view a prepared demonstration.";
  $("#terminal-response-cards").replaceChildren();
  input.value = "";
});
render();
})();