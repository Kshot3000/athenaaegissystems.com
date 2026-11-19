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
  }

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
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      var content = target.textContent;
      var original = btn.textContent;
      function feedback(ok) {
        btn.textContent = ok ? "Copied ✓" : "Select code to copy";
        if (!ok) {
          var range = document.createRange();
          range.selectNodeContents(target);
          var selection = window.getSelection();
          if (selection) { selection.removeAllRanges(); selection.addRange(range); }
        }
        setTimeout(function () { btn.textContent = original; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(function () { feedback(true); }, function () { feedback(false); });
      } else {
        feedback(false);
      }
    });
  });

  // Pricing cards preselect the matching plan in the inquiry form.
  var planSelect = document.getElementById("inquiry-plan");
  document.querySelectorAll("[data-plan]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (planSelect) planSelect.value = el.getAttribute("data-plan");
    });
  });

  // Inquiry form: build a mailto: email in the visitor's own mail app.
  var form = document.getElementById("inquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("inquiry-name").value.trim();
      var email = document.getElementById("inquiry-email").value.trim();
      var plan = planSelect ? planSelect.value : "Business Pilot";
      var message = document.getElementById("inquiry-message").value.trim();
      var subject = encodeURIComponent("Athena subscription inquiry — " + plan);
      var body = encodeURIComponent(
        "Name / company: " + name + "\nEmail: " + email +
        "\nInterested in: " + plan + "\n\n" + message);
      window.location.href =
        "mailto:kcaidevelopment@gmail.com?subject=" + subject + "&body=" + body;
      var feedback = document.getElementById("inquiry-feedback");
      if (feedback) {
        feedback.textContent =
          "Your mail app should now open with the inquiry addressed to Kshot Applications. If it doesn't, email kcaidevelopment@gmail.com directly.";
      }
    });
  }
})();
