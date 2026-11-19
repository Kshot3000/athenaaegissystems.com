// ATHENA site behaviour: mobile nav, solution tabs, quickstart copy,
// plan preselection, and the inquiry form (prepares a mailto: email -
// no server submission, exactly as the form note promises).
(function () {
  "use strict";

  // Footer year (static fallback already in the HTML).
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation.
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    var header = toggle.closest("header");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    function closeNav(restoreFocus) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      if (restoreFocus) toggle.focus();
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) closeNav(true);
    });
    document.addEventListener("pointerdown", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) closeNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && nav.classList.contains("open")) closeNav(false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        closeNav(false);
      }
    });
    header.addEventListener("focusout", function (event) {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) closeNav(false);
    });
    header.classList.add("nav-enhanced");
  }

  // Mark the current page in the mobile and desktop navigation.
  var activePath = window.location.pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll("#primary-nav a[href]").forEach(function (link) {
    try {
      var destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin &&
          destination.pathname === activePath && !destination.hash) {
        link.setAttribute("aria-current", "page");
      }
    } catch (err) { /* ignore malformed optional links */ }
  });

  // Solution tabs: click + arrow-key navigation per the ARIA tabs pattern.
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".solution-tab"));
  function activate(tab, focus) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activate(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activate(tabs[j], true); }
    });
  });

  // Copy code as plain text. Never report success when clipboard access fails.
  document.querySelectorAll(".copy-button").forEach(function (btn) {
    var original = btn.textContent;
    var timer;
    btn.setAttribute("aria-live", "polite");
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      var content = target.textContent;
      function feedback(ok) {
        btn.textContent = ok ? "Copied ✓" : "Code selected. Use Copy.";
        if (!ok) {
          var range = document.createRange();
          range.selectNodeContents(target);
          var selection = window.getSelection();
          if (selection) { selection.removeAllRanges(); selection.addRange(range); }
        }
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = original; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(function () { feedback(true); }, function () { feedback(false); });
      } else {
        feedback(false);
      }
    });
  });

  // Edition and pilot links carry only a public interest code.
  var planSelect = document.getElementById("inquiry-plan");
  var form = document.getElementById("inquiry-form");
  if (form && planSelect) {
    var interests = { windows: "Desktop Edition", android: "Android Edition", business: "Business Pilot", developer: "Developer", aegis: "Aegis Security" };
    var interest = new URLSearchParams(window.location.search).get("interest");
    if (Object.prototype.hasOwnProperty.call(interests, interest)) planSelect.value = interests[interest];
    var recipient = "kcaidevelopment@gmail.com";
    var draft = document.getElementById("inquiry-draft");
    var draftText = document.getElementById("inquiry-draft-text");
    var mailLink = document.getElementById("inquiry-mailto");
    var feedback = document.getElementById("inquiry-feedback");
    var help = feedback.textContent;
    function invalidateDraft() {
      draft.hidden = true;
      draftText.value = "";
      mailLink.removeAttribute("href");
      feedback.textContent = help;
    }
    form.addEventListener("input", function (event) {
      if (!draft.hidden && !draft.contains(event.target)) invalidateDraft();
    });
    document.querySelectorAll("[data-plan]").forEach(function (link) {
      link.addEventListener("click", function () {
        planSelect.value = link.getAttribute("data-plan");
        invalidateDraft();
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("inquiry-name").value.trim();
      var email = document.getElementById("inquiry-email").value.trim();
      var plan = planSelect.selectedOptions[0].textContent;
      var message = document.getElementById("inquiry-message").value.trim();
      var subject = "Athena Aegis inquiry — " + plan;
      var body = ["Name / company: " + name, "Email: " + email, "Interested in: " + plan, "", message].join("\r\n");
      mailLink.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      draftText.value = "To: " + recipient + "\nSubject: " + subject + "\n\n" + body;
      draft.hidden = false;
      feedback.textContent = "Your draft is ready. Open your email app or copy it to use in webmail.";
      mailLink.focus();
    });
    document.getElementById("inquiry-copy").addEventListener("click", async function () {
      var text = draftText.value;
      try {
        await navigator.clipboard.writeText(text);
        if (draftText.value === text) feedback.textContent = "Email copied, including the recipient and subject.";
      } catch (err) {
        if (draftText.value !== text) return;
        draftText.focus();
        draftText.select();
        feedback.textContent = "Draft selected. Use your device’s Copy command.";
      }
    });
    document.getElementById("inquiry-direct").hidden = true;
    form.hidden = false;
  }
})();
