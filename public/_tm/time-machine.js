/*
 * The time machine: one widget on every page that shows a version. The proxy
 * injects it into the live portfolio and the archive route renders it around
 * its frame; src/lib/time-machine.ts is what both share.
 *
 * The version list is not duplicated here: it arrives as JSON from
 * src/data/history.ts, so shipping v9 stays a one-line change there.
 */
(function () {
  "use strict";

  if (document.getElementById("tm-root")) return;

  var dataEl = document.getElementById("tm-versions");
  if (!dataEl) return;

  var versions;
  try {
    versions = JSON.parse(dataEl.textContent || "[]");
  } catch (e) {
    return;
  }
  if (!versions.length) return;

  var currentIndex = 0;
  versions.forEach(function (version, i) {
    if (version.current) currentIndex = i;
  });

  /* The morph shapes the trigger animates through. */
  var MORPHS = [
    "M0.412,0.004 C0.496,0.007,0.579,0.033,0.651,0.075 C0.72,0.115,0.789,0.168,0.818,0.241 C0.845,0.312,0.772,0.395,0.802,0.466 C0.839,0.556,0.992,0.584,1,0.681 C1,0.765,0.907,0.827,0.835,0.876 C0.77,0.921,0.687,0.925,0.61,0.948 C0.544,0.968,0.482,1,0.412,1 C0.343,0.998,0.292,0.943,0.228,0.919 C0.158,0.893,0.057,0.915,0.017,0.855 C-0.025,0.791,0.039,0.709,0.039,0.634 C0.039,0.576,0.022,0.522,0.018,0.465 C0.013,0.391,-0.015,0.315,0.011,0.244 C0.038,0.169,0.095,0.102,0.166,0.06 C0.238,0.017,0.327,0.002,0.412,0.004",
    "M0.545,0.068 C0.618,0.064,0.684,-0.011,0.756,0.008 C0.826,0.027,0.873,0.1,0.91,0.166 C0.945,0.229,0.959,0.302,0.963,0.375 C0.966,0.442,0.926,0.504,0.93,0.572 C0.937,0.673,1,0.768,0.997,0.863 C0.967,0.948,0.863,0.982,0.78,1 C0.701,1,0.622,0.985,0.545,0.963 C0.48,0.945,0.424,0.909,0.362,0.883 C0.296,0.854,0.223,0.845,0.167,0.8 C0.104,0.749,0.046,0.685,0.02,0.605 C-0.007,0.524,0.006,0.434,0.019,0.349 C0.032,0.26,0.035,0.157,0.097,0.096 C0.161,0.034,0.259,0.037,0.344,0.032 C0.413,0.028,0.476,0.072,0.545,0.068",
    "M0.513,0.017 C0.582,0.034,0.629,0.094,0.689,0.132 C0.742,0.166,0.803,0.186,0.849,0.229 C0.898,0.276,0.939,0.329,0.965,0.392 C0.992,0.459,1,0.531,1,0.603 C0.997,0.683,0.987,0.765,0.946,0.834 C0.902,0.906,0.843,0.985,0.76,1 C0.672,1,0.599,0.93,0.513,0.908 C0.449,0.892,0.384,0.902,0.32,0.888 C0.244,0.871,0.157,0.87,0.099,0.819 C0.04,0.767,-0.005,0.686,0.002,0.609 C0.009,0.528,0.096,0.48,0.135,0.408 C0.162,0.356,0.174,0.299,0.196,0.245 C0.226,0.173,0.224,0.078,0.288,0.033 C0.349,-0.012,0.439,-0.001,0.513,0.017",
    "M0.483,0.027 C0.536,0.045,0.571,0.112,0.626,0.124 C0.708,0.141,0.804,0.054,0.872,0.108 C0.933,0.156,0.896,0.271,0.917,0.352 C0.939,0.438,1,0.511,1,0.601 C0.991,0.69,0.938,0.776,0.871,0.821 C0.803,0.866,0.716,0.821,0.64,0.842 C0.583,0.858,0.539,0.907,0.483,0.929 C0.411,0.957,0.325,1,0.263,0.989 C0.195,0.932,0.248,0.798,0.218,0.708 C0.199,0.649,0.151,0.612,0.121,0.56 C0.078,0.488,0.007,0.427,0.001,0.339 C-0.004,0.253,0.037,0.167,0.091,0.106 C0.143,0.047,0.22,0.026,0.292,0.011 C0.356,-0.001,0.421,0.006,0.483,0.027",
    "M0.525,0.091 C0.604,0.081,0.669,-0.005,0.748,0.006 C0.826,0.018,0.906,0.074,0.942,0.152 C0.978,0.231,0.928,0.327,0.938,0.415 C0.947,0.493,1,0.566,0.995,0.639 C0.967,0.715,0.856,0.707,0.809,0.771 C0.763,0.833,0.795,0.954,0.731,0.994 C0.67,1,0.596,0.954,0.525,0.95 C0.458,0.946,0.395,0.98,0.329,0.972 C0.248,0.962,0.141,0.974,0.097,0.899 C0.051,0.819,0.143,0.713,0.125,0.621 C0.108,0.531,0.002,0.479,0.001,0.387 C-0.001,0.299,0.06,0.221,0.119,0.161 C0.175,0.104,0.25,0.072,0.325,0.059 C0.392,0.047,0.457,0.099,0.525,0.091",
  ];

  var SVG_NS = "http://www.w3.org/2000/svg";
  var DURATION = 5;
  var WARP_MS = 900;
  var NUDGE_KEY = "tm-nudged";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Out and back again, so the loop closes without a jump. */
  function morphValues() {
    var back = MORPHS.slice().reverse();
    back.shift();
    return MORPHS.concat(back).join(";");
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function sky() {
    var wrap = el("span", "tm-sky");
    wrap.setAttribute("aria-hidden", "true");
    wrap.appendChild(el("span", "tm-stars1"));
    wrap.appendChild(el("span", "tm-stars2"));
    wrap.appendChild(el("span", "tm-stars3"));
    return wrap;
  }

  /* Storage can throw (private windows, blocked site data); none of it is essential. */
  function store(kind, method, key, value) {
    try {
      return window[kind][method](key, value);
    } catch (e) {
      return null;
    }
  }

  var root = el("div");
  root.id = "tm-root";

  /* --- the clip path the trigger animates through --- */
  var svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "tm-defs");
  svg.setAttribute("aria-hidden", "true");
  var clip = document.createElementNS(SVG_NS, "clipPath");
  clip.setAttribute("id", "tm-clip");
  clip.setAttribute("clipPathUnits", "objectBoundingBox");
  var path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", MORPHS[0]);
  var animate = document.createElementNS(SVG_NS, "animate");
  animate.setAttribute("attributeName", "d");
  animate.setAttribute("values", morphValues());
  animate.setAttribute("dur", DURATION + "s");
  animate.setAttribute("repeatCount", "indefinite");
  animate.setAttribute("calcMode", "linear");
  animate.setAttribute("fill", "freeze");
  path.appendChild(animate);
  clip.appendChild(path);
  svg.appendChild(clip);
  root.appendChild(svg);

  /* --- trigger --- */
  var wrap = el("div", "tm-trigger-wrap");

  var trigger = el("button", "tm-trigger");
  trigger.type = "button";
  trigger.setAttribute("aria-label", "Time travel");
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", "tm-overlay");
  trigger.setAttribute("aria-expanded", "false");
  trigger.appendChild(sky());
  wrap.appendChild(trigger);

  var icon = el("span", "tm-trigger-icon", "⌛");
  icon.setAttribute("aria-hidden", "true");
  wrap.appendChild(icon);

  var hint = el("span", "tm-hint", "Time travel");
  hint.setAttribute("aria-hidden", "true");
  wrap.appendChild(hint);

  root.appendChild(wrap);

  /* --- overlay --- */
  var overlay = el("div", "tm-overlay");
  overlay.id = "tm-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "tm-title");
  overlay.appendChild(sky());

  var close = el("button", "tm-close", "Close");
  close.type = "button";
  overlay.appendChild(close);

  var stage = el("div", "tm-stage");

  var title = el("h2", "tm-title");
  title.id = "tm-title";
  title.appendChild(el("span", null, "Time Travel"));
  stage.appendChild(title);

  /* Oldest to newest along one line: a timeline needs no explaining. */
  var timeline = el("ol", "tm-timeline");
  var entries = versions.map(function (version, i) {
    var item = el("li", version.current ? "tm-current" : null);
    var link = el("a", "tm-entry");
    link.href = version.href;
    if (version.current) link.setAttribute("aria-current", "page");

    var blurbId = "tm-blurb-" + i;
    link.setAttribute("aria-describedby", blurbId);

    link.appendChild(el("span", "tm-here", version.current ? "You are here" : ""));

    var hole = el("span", "tm-wormhole");
    hole.setAttribute("aria-hidden", "true");
    for (var r = 0; r < 4; r++) hole.appendChild(document.createElement("i"));
    link.appendChild(hole);

    link.appendChild(el("span", "tm-name", version.name));
    link.appendChild(el("span", "tm-date", version.date));
    item.appendChild(link);

    /* The preview panel is visual only; screen readers get the blurb here. */
    var blurb = el("span", "tm-sr", version.blurb);
    blurb.id = blurbId;
    item.appendChild(blurb);

    timeline.appendChild(item);

    link.addEventListener("mouseenter", function () {
      showPreview(i);
    });
    link.addEventListener("focus", function () {
      showPreview(i);
    });
    link.addEventListener("click", function (event) {
      onEntryClick(event, i);
    });

    return { item: item, link: link, hole: hole };
  });
  stage.appendChild(timeline);

  /* --- preview: what's on the other side of the wormhole --- */
  var preview = el("div", "tm-preview");
  preview.setAttribute("aria-hidden", "true");
  var thumb = el("img", "tm-thumb");
  thumb.alt = "";
  thumb.width = 240;
  thumb.height = 150;
  thumb.addEventListener("error", function () {
    thumb.style.visibility = "hidden";
  });
  var previewText = el("div");
  var previewName = el("p", "tm-preview-name");
  var previewDate = el("p", "tm-preview-date");
  var previewBlurb = el("p", "tm-preview-blurb");
  previewText.appendChild(previewName);
  previewText.appendChild(previewDate);
  previewText.appendChild(previewBlurb);
  preview.appendChild(thumb);
  preview.appendChild(previewText);
  stage.appendChild(preview);

  overlay.appendChild(stage);
  root.appendChild(overlay);

  document.body.appendChild(root);

  function showPreview(i) {
    var version = versions[i];
    thumb.style.visibility = "";
    thumb.src = version.thumb;
    previewName.textContent = version.name;
    previewDate.textContent = version.current ? version.date + " · you are here" : version.date;
    previewBlurb.textContent = version.blurb;
  }

  /* --- motion preferences reach the SMIL morph too --- */
  function applyMotion() {
    if (reducedMotion.matches) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }
  applyMotion();
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", applyMotion);

  /* --- open / close --- */
  var thumbsLoaded = false;
  var savedOverflow = "";

  function isOpen() {
    return root.classList.contains("tm-open");
  }

  function setOpen(open) {
    if (open === isOpen()) return;
    root.classList.toggle("tm-open", open);
    trigger.setAttribute("aria-expanded", String(open));

    if (open) {
      endNudge();
      store("localStorage", "setItem", NUDGE_KEY, "1");
      savedOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      showPreview(currentIndex);
      if (!thumbsLoaded) {
        thumbsLoaded = true;
        versions.forEach(function (version) {
          new Image().src = version.thumb;
        });
      }
      close.focus();
    } else {
      document.documentElement.style.overflow = savedOverflow;
      trigger.focus();
    }
  }

  trigger.addEventListener("click", function () {
    setOpen(!isOpen());
  });
  close.addEventListener("click", function () {
    setOpen(false);
  });

  /* Load the overlay's font as soon as someone looks like they'll open it. */
  function warmFonts() {
    if (!document.fonts || !document.fonts.load) return;
    document.fonts.load('300 1em "tm-lato"');
    document.fonts.load('700 1em "tm-lato"');
  }
  trigger.addEventListener("pointerenter", warmFonts, { once: true });
  trigger.addEventListener("focus", warmFonts, { once: true });

  /* --- keyboard: Escape, focus kept inside the dialog, arrows along the line --- */
  document.addEventListener("keydown", function (event) {
    if (!isOpen() || root.classList.contains("tm-departing")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Tab") {
      var stops = [close].concat(entries.map(function (entry) {
        return entry.link;
      }));
      var first = stops[0];
      var last = stops[stops.length - 1];
      var inside = overlay.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      var at = -1;
      entries.forEach(function (entry, i) {
        if (entry.link === document.activeElement) at = i;
      });
      if (at === -1) return;
      event.preventDefault();
      var next = event.key === "ArrowLeft" ? at - 1 : at + 1;
      entries[(next + entries.length) % entries.length].link.focus();
    }
  });

  /* --- travel --- */
  function onEntryClick(event, i) {
    /* New tab, new window, download: the browser's business, not a journey. */
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    if (versions[i].current) {
      setOpen(false);
      return;
    }
    travel(i);
  }

  function travel(i) {
    var href = versions[i].href;
    var went = false;
    function go() {
      if (went) return;
      went = true;
      store("sessionStorage", "setItem", "tm-arrive", "1");
      window.location.assign(href);
    }

    if (reducedMotion.matches) {
      go();
      return;
    }

    root.classList.add("tm-departing");
    entries[i].item.classList.add("tm-chosen");

    var rect = entries[i].hole.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    var far = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy)
    );

    var warp = el("div", "tm-warp");
    warp.style.left = cx + "px";
    warp.style.top = cy + "px";
    warp.style.width = rect.width + "px";
    warp.style.height = rect.height + "px";
    root.appendChild(warp);

    var scale = (far * 2) / rect.width + 1;
    if (warp.animate) {
      var flight = warp.animate(
        [{ transform: "scale(1)" }, { transform: "scale(" + scale + ")" }],
        { duration: WARP_MS, easing: "cubic-bezier(0.7, 0, 0.84, 0)", fill: "forwards" }
      );
      if (flight.finished) flight.finished.then(go, go);
    }
    /* In case the animation never reports back. */
    window.setTimeout(go, WARP_MS + 300);
  }

  /* Back from a journey via the back button: the page comes out of the
   * bfcache mid-departure, so put it back the way it was. */
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    root.classList.remove("tm-departing");
    entries.forEach(function (entry) {
      entry.item.classList.remove("tm-chosen");
    });
    var warp = root.querySelector(".tm-warp");
    if (warp) warp.remove();
    document.documentElement.classList.remove("tm-arriving");
    if (isOpen()) setOpen(false);
  });

  /* --- arrival: the head script covered the page; lift it once it has played --- */
  if (document.documentElement.classList.contains("tm-arriving")) {
    window.setTimeout(function () {
      document.documentElement.classList.remove("tm-arriving");
    }, 1400);
  }

  /* --- out of the way while scrolling --- */
  var scrollTimer = 0;
  window.addEventListener(
    "scroll",
    function () {
      if (isOpen()) return;
      root.classList.add("tm-scrolling");
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        root.classList.remove("tm-scrolling");
      }, 600);
    },
    { passive: true }
  );

  /* --- a one-time nudge, so first-time visitors learn what the blob is --- */
  var nudgeTimers = [];

  function endNudge() {
    nudgeTimers.forEach(window.clearTimeout);
    nudgeTimers = [];
    root.classList.remove("tm-nudge");
  }

  var blobShown = window.matchMedia("(min-width: 768px)").matches;
  if (blobShown && !store("localStorage", "getItem", NUDGE_KEY)) {
    nudgeTimers.push(
      window.setTimeout(function () {
        if (isOpen()) return;
        root.classList.add("tm-nudge");
        store("localStorage", "setItem", NUDGE_KEY, "1");
        nudgeTimers.push(window.setTimeout(endNudge, 3500));
      }, 4000)
    );
  }
})();
