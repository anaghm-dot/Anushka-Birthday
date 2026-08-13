/* ============================================================
   Anushka's 20th Birthday — countdown, celebration, cake, gallery, letter
   Target: 14 August 2026, local time
   ============================================================ */
(function () {
  var TARGET = new Date(2026, 7, 14, 0, 0, 0); // month is 0-indexed: 7 = August
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getDiff() { return TARGET.getTime() - Date.now(); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function parts(diffMs) {
    var d = Math.max(diffMs, 0);
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d / 3600000) % 24),
      mins: Math.floor((d / 60000) % 60),
      secs: Math.floor((d / 1000) % 60)
    };
  }
  function fillSegs(root, p) {
    if (!root) return;
    var d = root.querySelector("[data-days]");
    var h = root.querySelector("[data-hours]");
    var m = root.querySelector("[data-mins]");
    var s = root.querySelector("[data-secs]");
    if (d) d.textContent = p.days;
    if (h) h.textContent = pad(p.hours);
    if (m) m.textContent = pad(p.mins);
    if (s) s.textContent = pad(p.secs);
  }

  /* ---------------- emoji effects ---------------- */
  function emojiRain(container, emojis, count, minDur, maxDur) {
    if (reduceMotion || !container) return;
    for (var i = 0; i < count; i++) {
      (function () {
        var span = document.createElement("span");
        span.className = "emoji-piece";
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + "vw";
        span.style.fontSize = (1.1 + Math.random() * 1.4) + "rem";
        var duration = minDur + Math.random() * (maxDur - minDur);
        span.style.animationDuration = duration + "s";
        span.style.animationDelay = (Math.random() * 0.6) + "s";
        container.appendChild(span);
        setTimeout(function () { span.remove(); }, (duration + 1) * 1000);
      })();
    }
  }

  function emojiBurst(x, y, emojis, count) {
    if (reduceMotion) return;
    for (var i = 0; i < count; i++) {
      (function () {
        var span = document.createElement("span");
        span.className = "emoji-burst";
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = x + "px";
        span.style.top = y + "px";
        span.style.fontSize = (1 + Math.random() * 1.2) + "rem";
        var angle = Math.random() * Math.PI * 2;
        var dist = 60 + Math.random() * 120;
        span.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        span.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        document.body.appendChild(span);
        setTimeout(function () { span.remove(); }, 1000);
      })();
    }
  }

  var BIRTHDAY_EMOJIS = ["🎉", "🎂", "🎈", "🎊", "🥳", "✨", "🌸", "💕", "🌷"];
  var SPARKLE_EMOJIS = ["✨", "🌸", "💐", "🎉"];

  /* ---------------- home page stage machine ---------------- */
  var stages = document.querySelectorAll(".exp-stage");
  var emojiRainEl = document.getElementById("emojiRain");
  var borderClouds = document.getElementById("borderClouds");
  var celebrationFired = false;

  function setStage(id) {
    stages.forEach(function (s) { s.classList.remove("is-active"); });
    var target = document.getElementById(id);
    if (target) target.classList.add("is-active");
  }

  function enterCelebrate() {
    setStage("stageCelebrate");
    emojiRain(emojiRainEl, BIRTHDAY_EMOJIS, 50, 3, 5);
    setTimeout(function () { emojiRain(emojiRainEl, BIRTHDAY_EMOJIS, 30, 3, 4.5); }, 900);
    setTimeout(enterCake, 3200);
  }

  function enterCake() { setStage("stageCake"); }

  function cutAndPop() {
    var cutEl = document.getElementById("cutCake");
    var knife = document.getElementById("knife");
    if (!cutEl || cutEl.classList.contains("is-cut")) return;
    if (knife) knife.classList.add("swipe");

    setTimeout(function () {
      cutEl.classList.add("is-cut");
      var rect = cutEl.getBoundingClientRect();
      emojiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, SPARKLE_EMOJIS, 22);
    }, 260);

    setTimeout(function () { cutEl.classList.add("is-popped"); }, 900);
    setTimeout(enterBouquet, 1500);
  }

  function enterBouquet() {
    setStage("stageBouquet");
    if (borderClouds) borderClouds.classList.add("is-visible");
    setTimeout(enterButtons, 3200);
  }

  function enterButtons() { setStage("stageButtons"); }

  function onBirthdayReached() {
    if (celebrationFired) return;
    celebrationFired = true;
    enterCelebrate();
  }

  function tick() {
    var diff = getDiff();
    var p = parts(diff);
    document.querySelectorAll("[data-countdown]").forEach(function (root) { fillSegs(root, p); });
    if (diff <= 0) onBirthdayReached();
  }

  if (stages.length) {
    var diff0 = getDiff();
    if (diff0 <= 0) {
      celebrationFired = true;
      enterCelebrate();
    } else {
      setStage("stageCountdown");
    }
    tick();
    setInterval(tick, 1000);

    var cutCakeEl = document.getElementById("cutCake");
    if (cutCakeEl) cutCakeEl.addEventListener("click", cutAndPop);
  }

  /* ============================================================
     Gallery — each photo hangs on the rope with a single image + caption
     ============================================================ */

  /* ============================================================
     Letter page — envelope open interaction
     ============================================================ */
  var envelope = document.getElementById("envelope");
  var envelopeWrap = document.getElementById("envelopeWrap");
  var letterContent = document.getElementById("letterContent");

  function openEnvelope() {
    if (!envelope || envelope.classList.contains("is-open")) return;
    envelope.classList.add("is-open");
    setTimeout(function () {
      if (envelopeWrap) envelopeWrap.classList.add("is-hidden");
      if (letterContent) letterContent.hidden = false;
    }, 750);
  }
  if (envelope) {
    envelope.addEventListener("click", openEnvelope);
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
    });
  }
})();
