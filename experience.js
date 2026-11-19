/* Athena presentation: intentionally NOT a live chat or agent endpoint.
 * Speech uses the visitor's built-in browser text-to-speech on click only.
 * Motion is decorative; it respects reduced-motion preference and pause.
 */
(function () {
  "use strict";

  var scripts = {
    intro: {
      title: "I am Athena.",
      body: "Wisdom is not the absence of mistakes. It is the courage to measure them. I am Athena, an AI agent framework designed to remember verified lessons, coordinate multiple models, and improve only when the evidence supports change."
    },
    learning: {
      title: "I follow the evidence.",
      body: "Every improvement begins with a question: did this actually help? A candidate is proposed, tested against a benchmark, and adopted only when training improves without regression on the evaluated splits. Rejected ideas stay in the record so we can learn from what did not work."
    },
    integrations: {
      title: "I fit into your ambitions.",
      body: "Athena is currently a private Python developer preview. Approved teams can install her framework, connect their supported model providers, evaluate real workflows, and choose how humans review consequential actions. Subscriptions are available through Stripe. Developer access is arranged directly."
    },
    trust: {
      title: "Trust must be earned.",
      body: "I don't call a guess a fact. Lessons require evidence. Models can review each other's proposals, and human operators retain control of production code, financial decisions, and account actions. A small benchmark is a useful start, not proof of universal intelligence."
    }
  };

  var topicButtons = Array.prototype.slice.call(document.querySelectorAll("[data-topic]"));
  var scriptTitle = document.getElementById("script-title");
  var scriptBody = document.getElementById("script-body");
  var primaryPlay = document.getElementById("voice-start");
  var primaryLabel = document.getElementById("voice-label");
  var topicPlay = document.getElementById("topic-play");
  var topicPlayLabel = document.getElementById("topic-play-label");
  var stopButton = document.getElementById("topic-stop");
  var status = document.getElementById("voice-status");
  var stageStatus = document.getElementById("stage-status");
  var motionButton = document.getElementById("motion-toggle");
  var stage = document.getElementById("oracle-stage");

  var selectedTopic = "intro";
  var playing = false;
  var speechRun = 0;
  var speech = ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window)
    ? window.speechSynthesis : null;

  function updateSpeechState(active, message) {
    playing = active;
    document.body.classList.toggle("is-speaking", active);
    if (primaryPlay) {
      primaryPlay.setAttribute("aria-pressed", String(active));
      if (primaryLabel) primaryLabel.textContent = active ? "Stop Athena's narration" : "Hear Athena introduce herself";
    }
    if (topicPlay) {
      topicPlay.setAttribute("aria-pressed", String(active));
      if (topicPlayLabel) topicPlayLabel.textContent = active ? "Stop narration" : "Speak this introduction";
    }
    if (stopButton) stopButton.disabled = !active;
    if (stageStatus) stageStatus.textContent = active ? "ATHENA // VOICE PREVIEW" : "ATHENA // VISUAL PREVIEW";
    if (status) status.textContent = message;
  }

  function stopSpeech(message) {
    speechRun += 1; // Invalidate stale voice-engine completion events.
    if (speech) {
      try { speech.cancel(); } catch (err) { /* browser voice engine may be unavailable */ }
    }
    updateSpeechState(false, message || "Narration stopped.");
  }

  function chooseVoice() {
    if (!speech || !speech.getVoices) return null;
    var voices = speech.getVoices().filter(function (voice) {
      return voice.lang && voice.lang.toLowerCase().indexOf("en") === 0;
    });
    if (!voices.length) return null;
    return voices.find(function (voice) {
      return /samantha|aria|zira|serena|female|natural/i.test(voice.name || "");
    }) || voices.find(function (voice) { return voice.default; }) || voices[0];
  }

  function speak() {
    if (playing) {
      stopSpeech("Narration stopped.");
      return;
    }
    if (!speech) {
      updateSpeechState(false, "Voice isn't supported by this browser. You can read the full script below.");
      return;
    }
    // Cancel any other site-owned utterance before starting a fresh one.
    speechRun += 1;
    var thisRun = speechRun;
    speech.cancel();
    var utterance = new window.SpeechSynthesisUtterance(scripts[selectedTopic].body);
    utterance.lang = "en-US";
    utterance.rate = 0.87;
    utterance.pitch = 0.93;
    utterance.volume = 1;
    var preferred = chooseVoice();
    if (preferred) utterance.voice = preferred;
    utterance.onend = function () {
      if (thisRun !== speechRun) return;
      updateSpeechState(false, "Narration finished. Select another topic to continue exploring.");
    };
    utterance.onerror = function () {
      if (thisRun !== speechRun) return;
      updateSpeechState(false, "Audio wasn't available. The full narration is readable on this page.");
    };
    updateSpeechState(true, "Playing a prepared narration with your device's speech voice.");
    try {
      speech.speak(utterance);
    } catch (err) {
      updateSpeechState(false, "Voice playback could not start on this device.");
    }
  }

  function selectTopic(key) {
    if (!Object.prototype.hasOwnProperty.call(scripts, key)) return;
    if (playing) stopSpeech("Narration stopped when you changed topics.");
    selectedTopic = key;
    if (scriptTitle) scriptTitle.textContent = scripts[key].title;
    if (scriptBody) scriptBody.textContent = scripts[key].body;
    topicButtons.forEach(function (button) {
      var selected = button.getAttribute("data-topic") === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (status) status.textContent = "Topic selected. Play narration or read the script.";
  }

  topicButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectTopic(button.getAttribute("data-topic"));
    });
  });

  if (primaryPlay) {
    primaryPlay.addEventListener("click", function () {
      if (!playing) selectTopic("intro");
      speak();
    });
  }
  if (topicPlay) topicPlay.addEventListener("click", speak);
  if (stopButton) stopButton.addEventListener("click", function () {
    stopSpeech("Narration stopped.");
  });

  if (!speech) {
    if (primaryPlay) primaryPlay.disabled = true;
    if (topicPlay) topicPlay.disabled = true;
    if (status) status.textContent = "This browser doesn't provide text-to-speech. Narration transcripts are available below.";
  }

  window.addEventListener("pagehide", function () {
    if (playing) stopSpeech("Narration stopped.");
  });

  var motionKey = "athena-aegis-ambient-motion-paused";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var motionDisabled = false;
  try { motionDisabled = window.localStorage.getItem(motionKey) === "1"; }
  catch (err) { /* persistence is optional */ }
  function refreshMotionControl() {
    var systemReduced = !!(reduceMotion && reduceMotion.matches);
    var paused = motionDisabled || systemReduced;
    document.body.classList.toggle("motion-off", paused);
    if (motionButton) {
      motionButton.disabled = systemReduced;
      motionButton.textContent = systemReduced
        ? "Motion reduced by device settings"
        : (motionDisabled ? "Resume motion" : "Pause motion");
      motionButton.setAttribute("aria-pressed", String(paused));
    }
    if (stage && paused) {
      stage.style.setProperty("--tilt-x", "0px");
      stage.style.setProperty("--tilt-y", "0px");
    }
  }
  if (motionButton) {
    motionButton.addEventListener("click", function () {
      if (reduceMotion && reduceMotion.matches) return;
      motionDisabled = !motionDisabled;
      try { window.localStorage.setItem(motionKey, motionDisabled ? "1" : "0"); }
      catch (err) { /* persistence is optional */ }
      refreshMotionControl();
    });
  }
  if (reduceMotion) {
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", refreshMotionControl);
    else if (reduceMotion.addListener) reduceMotion.addListener(refreshMotionControl);
  }
  refreshMotionControl();
  if (stage) {
    stage.addEventListener("pointermove", function (event) {
      if (motionDisabled || (reduceMotion && reduceMotion.matches) || event.pointerType === "touch") return;
      var rect = stage.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--tilt-x", (x * 11).toFixed(1) + "px");
      stage.style.setProperty("--tilt-y", (y * 8).toFixed(1) + "px");
    });
    stage.addEventListener("pointerleave", function () {
      stage.style.setProperty("--tilt-x", "0px");
      stage.style.setProperty("--tilt-y", "0px");
    });
  }
})();
