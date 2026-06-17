// Beach Bar Template - shared behavior (bilingual: reads <html lang> for el/en strings)

(function () {
  "use strict";

  var isGreek = (document.documentElement.lang || "").toLowerCase().indexOf("el") === 0;

  // Image titles shown on the lightbox. The list cycles, so any number of
  // photos gets a title. Edit these to rename them.
  var GALLERY_CAPTIONS = {
    el: ["Η παραλία", "Το μπαρ", "Κοκτέιλ", "Ξαπλώστρες", "Φαγητό", "Ηλιοβασίλεμα", "Live μουσική", "Βραδιά BBQ", "Η θέα"],
    en: ["The beach", "The bar", "Cocktails", "Sun beds", "Food", "Sunset", "Live music", "BBQ night", "The view"]
  };
  function galleryCaption(n) {
    var list = isGreek ? GALLERY_CAPTIONS.el : GALLERY_CAPTIONS.en;
    return list[(n - 1) % list.length];
  }

  // ---- gallery auto-loader ----------------------------------------------
  // Any element with data-gallery="<folder>/" fills itself with cards for the
  // photos it finds: 01.jpg, 02.jpg, 03.jpg ... Drop as many as you like
  // (named in order, .jpg) and they appear automatically - no HTML editing.
  // data-gallery-limit="N" caps how many to show (used by the homepage strip).
  // If no photos are found, labelled placeholders show instead.
  (function initGalleries() {
    var containers = document.querySelectorAll("[data-gallery]");
    if (!containers.length) return;

    var MAX = 99;          // hard ceiling on how many photos to look for
    var BATCH = 8;         // probe in windows; tolerates gaps up to this size
    var EXT = ".jpg";
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function probe(src, n) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve({ ok: true, n: n }); };
        img.onerror = function () { resolve({ ok: false, n: n }); };
        img.src = src;
      });
    }

    function svgIcon() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
    }

    // photos rise in, staggered, as they scroll into view (loaded in bunches)
    var revealObs = null;
    if (!reduce && "IntersectionObserver" in window) {
      revealObs = new IntersectionObserver(function (entries) {
        var b = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.transitionDelay = (b * 90) + "ms";
          el.classList.add("gi-in");
          revealObs.unobserve(el);
          b++;
          el.addEventListener("transitionend", function clr() {
            el.style.transitionDelay = "";
            el.removeEventListener("transitionend", clr);
          });
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    }

    function makeItem(base, n) {
      var cap = galleryCaption(n);
      var item = document.createElement("div");
      item.className = "gallery-item gi-fade";
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", cap);
      var img = document.createElement("img");
      img.src = base + pad(n) + EXT;
      img.alt = cap;
      img.loading = "lazy";       // browser loads photos in bunches as you scroll
      item.appendChild(img);
      if (revealObs) revealObs.observe(item); else item.classList.add("gi-in");
      return item;
    }

    function renderPlaceholders(container, base, count) {
      var label = isGreek ? "ΦΩΤΟΓΡΑΦΙΑ" : "PHOTO";
      var html = "";
      for (var n = 1; n <= count; n++) {
        html += '<div class="gallery-item"><div class="photo-ph">' + svgIcon() +
          label + '<small>' + base + pad(n) + EXT + '</small></div></div>';
      }
      container.innerHTML = html;
    }

    containers.forEach(function (container) {
      var base = container.getAttribute("data-gallery");
      if (!base) return;
      var limit = parseInt(container.getAttribute("data-gallery-limit"), 10) || 0;
      var fallback = parseInt(container.getAttribute("data-gallery-fallback"), 10) || 6;

      var appended = 0, index = 1, done = false;

      function finish() {
        if (done) return;
        done = true;
        if (appended === 0) renderPlaceholders(container, base, fallback);
      }

      function nextBatch() {
        if (done) return;
        var batch = [];
        for (var k = 0; k < BATCH && index <= MAX; k++, index++) {
          batch.push(probe(base + pad(index) + EXT, index));
        }
        if (!batch.length) { finish(); return; }
        Promise.all(batch).then(function (results) {
          var hits = results.filter(function (r) { return r.ok; })
                            .map(function (r) { return r.n; })
                            .sort(function (a, b) { return a - b; });
          if (appended === 0 && hits.length) container.innerHTML = ""; // drop empty state on first real photo
          for (var i = 0; i < hits.length; i++) {
            if (limit && appended >= limit) break;
            container.appendChild(makeItem(base, hits[i]));
            appended++;
          }
          // stop on an empty window, on hitting the limit, or at the ceiling
          if (!hits.length || (limit && appended >= limit) || index > MAX) finish();
          else nextBatch();
        });
      }

      nextBatch();
    });
  })();

  // ---- gallery lightbox (drag / swipe carousel) -------------------------
  // Click any gallery photo to open a full-screen viewer. Drag with the
  // mouse or swipe on touch to move between photos; arrows and keyboard work
  // too. Counter (number) and title show at the top.
  (function initLightbox() {
    var containers = document.querySelectorAll("[data-gallery]");
    if (!containers.length) return;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", isGreek ? "Γκαλερί" : "Gallery");
    var chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
    var chevR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
    var xIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
    lb.innerHTML =
      '<div class="lb-stage"><div class="lb-track">' +
        '<div class="lb-slide"><img alt="" draggable="false"></div>' +
        '<div class="lb-slide"><img alt="" draggable="false"></div>' +
        '<div class="lb-slide"><img alt="" draggable="false"></div>' +
      '</div></div>' +
      '<div class="lb-counter"></div>' +
      '<div class="lb-cap"></div>' +
      '<button class="lb-close" aria-label="' + (isGreek ? "Κλείσιμο" : "Close") + '">' + xIcon + '</button>' +
      '<button class="lb-prev" aria-label="' + (isGreek ? "Προηγούμενη" : "Previous") + '">' + chevL + '</button>' +
      '<button class="lb-next" aria-label="' + (isGreek ? "Επόμενη" : "Next") + '">' + chevR + '</button>';
    document.body.appendChild(lb);

    var stage = lb.querySelector(".lb-stage");
    var track = lb.querySelector(".lb-track");
    var slideImgs = lb.querySelectorAll(".lb-slide img");
    var counterEl = lb.querySelector(".lb-counter");
    var capEl = lb.querySelector(".lb-cap");
    var items = [];       // [{ src, cap }]
    var idx = 0, animating = false;

    function wrap(i) { return items.length ? (i + items.length) % items.length : 0; }
    function srcOf(i) { return items.length ? items[wrap(i)].src : ""; }
    function capOf(i) { return items.length ? items[wrap(i)].cap : ""; }
    function placeTrack() {
      track.classList.remove("anim");
      track.style.transform = "translateX(" + (-stage.clientWidth) + "px)";
    }
    // sit the counter just above the photo and the caption just below it,
    // measured from the actual displayed image (any size / aspect ratio)
    function positionLabels() {
      var im = slideImgs[1];
      if (!im || !im.naturalWidth) return;
      var r = im.getBoundingClientRect();
      counterEl.style.top = Math.max(8, r.top - 32) + "px";
      capEl.style.top = (r.bottom + 12) + "px";
    }
    function render() {
      slideImgs[0].src = srcOf(idx - 1);
      slideImgs[1].src = srcOf(idx);
      slideImgs[2].src = srcOf(idx + 1);
      slideImgs[1].alt = capOf(idx);
      counterEl.textContent = (idx + 1) + " / " + items.length;
      capEl.textContent = capOf(idx);
      placeTrack();
      slideImgs[1].onload = positionLabels;
      requestAnimationFrame(positionLabels);
    }
    function slide(delta) {
      if (animating) return;
      var w = stage.clientWidth;
      animating = true;
      track.classList.add("anim");
      track.style.transform = "translateX(" + (-w - delta * w) + "px)";
      setTimeout(function () {
        if (delta) idx = wrap(idx + delta);
        render();
        animating = false;
      }, 430);
    }
    function open(list, i) {
      items = list;
      idx = wrap(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      render();
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }

    function collect(container) {
      return Array.prototype.slice.call(container.querySelectorAll(".gallery-item img")).map(function (im) {
        return { src: im.currentSrc || im.src, cap: im.getAttribute("alt") || "" };
      });
    }

    containers.forEach(function (container) {
      container.addEventListener("click", function (e) {
        var img = e.target.closest ? e.target.closest(".gallery-item img") : null;
        if (!img) return;
        var imgs = Array.prototype.slice.call(container.querySelectorAll(".gallery-item img"));
        open(collect(container), imgs.indexOf(img));
      });
      container.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var item = e.target.closest ? e.target.closest(".gallery-item") : null;
        if (!item || !item.querySelector("img")) return;
        e.preventDefault();
        var items2 = Array.prototype.slice.call(container.querySelectorAll(".gallery-item"));
        open(collect(container), items2.indexOf(item));
      });
    });

    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); slide(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); slide(1); });
    stage.addEventListener("click", function (e) {
      if (mMoved) { mMoved = false; return; }
      if (e.target.classList.contains("lb-slide")) close();
    });
    window.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") slide(-1);
      else if (e.key === "ArrowRight") slide(1);
    });
    window.addEventListener("resize", function () { if (lb.classList.contains("open") && !animating) { placeTrack(); positionLabels(); } });

    // touch drag - neighbour peeks in as you swipe
    var downX = null, downY = null, dragging = false, dx = 0;
    stage.addEventListener("touchstart", function (e) {
      if (animating) return;
      var t = e.changedTouches[0];
      downX = t.clientX; downY = t.clientY; dragging = true; dx = 0;
      track.classList.remove("anim");
    }, { passive: true });
    stage.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      var t = e.changedTouches[0];
      var mx = t.clientX - downX, my = t.clientY - downY;
      if (Math.abs(mx) < Math.abs(my) && Math.abs(dx) < 6) return;
      dx = mx;
      track.style.transform = "translateX(" + (-stage.clientWidth + mx) + "px)";
    }, { passive: true });
    stage.addEventListener("touchend", function () {
      if (!dragging) return;
      dragging = false;
      var threshold = Math.min(70, stage.clientWidth * 0.16);
      if (dx <= -threshold) slide(1);
      else if (dx >= threshold) slide(-1);
      else slide(0);
      downX = downY = null; dx = 0;
    }, { passive: true });

    // mouse drag - same slide-with-cursor feel on desktop
    var mDown = false, mStartX = 0, mDx = 0, mMoved = false;
    stage.addEventListener("mousedown", function (e) {
      if (animating || e.button !== 0) return;
      mDown = true; mStartX = e.clientX; mDx = 0; mMoved = false;
      track.classList.remove("anim");
      stage.classList.add("dragging");
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      if (!mDown) return;
      mDx = e.clientX - mStartX;
      if (Math.abs(mDx) > 4) mMoved = true;
      track.style.transform = "translateX(" + (-stage.clientWidth + mDx) + "px)";
    });
    window.addEventListener("mouseup", function () {
      if (!mDown) return;
      mDown = false;
      stage.classList.remove("dragging");
      var threshold = Math.min(70, stage.clientWidth * 0.16);
      if (mDx <= -threshold) slide(1);
      else if (mDx >= threshold) slide(-1);
      else if (mMoved) slide(0);
      mDx = 0;
    });
  })();

  // mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // active chip highlight on menu page
  var chips = document.querySelectorAll(".menu-chips .chip");
  var sections = document.querySelectorAll(".menu-section[id]");
  if (chips.length && sections.length && "IntersectionObserver" in window) {
    var byId = {};
    chips.forEach(function (chip) {
      byId[chip.getAttribute("href").slice(1)] = chip;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var chip = byId[entry.target.id];
          if (!chip) return;
          if (entry.isIntersecting) {
            chips.forEach(function (c) { c.classList.remove("active"); });
            chip.classList.add("active");
            chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  // contact form: template stub, prevent real submit
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (note) {
        note.textContent = isGreek
          ? "Ευχαριστούμε! (Demo template: συνδέστε τη φόρμα με την υπηρεσία email ή το backend σας.)"
          : "Thanks! (Template demo: connect this form to your email service or backend.)";
        note.style.fontWeight = "700";
      }
      form.reset();
    });
  }

  // cookie consent banner
  var CONSENT_KEY = "beachbar-cookie-consent";
  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }
  function saveConsent(analytics, marketing) {
    var consent = {
      necessary: true,
      analytics: !!analytics,
      marketing: !!marketing,
      date: new Date().toISOString()
    };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch (e) { /* storage unavailable */ }
    applyConsent(consent);
  }
  function applyConsent(consent) {
    // Template hook: load your analytics / marketing scripts here when allowed.
    // if (consent.analytics) { ...load Google Analytics... }
    // if (consent.marketing) { ...load ad / pixel scripts... }
  }

  var existing = getConsent();
  if (existing) {
    applyConsent(existing);
  } else {
    var T = isGreek ? {
      title: "Σεβόμαστε την ιδιωτικότητά σας",
      text: "Χρησιμοποιούμε cookies για να βελτιώνουμε την εμπειρία περιήγησής σας, να προβάλλουμε εξατομικευμένες διαφημίσεις ή περιεχόμενο και να αναλύουμε την επισκεψιμότητά μας. Πατώντας «Αποδοχή όλων», συναινείτε στη χρήση των cookies.",
      necessary: "Απαραίτητα", necessaryDesc: "Απαιτούνται για τη λειτουργία του ιστότοπου",
      analytics: "Στατιστικά", analyticsDesc: "Μας βοηθούν να κατανοούμε την επισκεψιμότητα",
      marketing: "Διαφήμισης", marketingDesc: "Εξατομικευμένες διαφημίσεις και περιεχόμενο",
      customise: "Προσαρμογή", save: "Αποθήκευση προτιμήσεων",
      reject: "Απόρριψη όλων", accept: "Αποδοχή όλων",
      ariaLabel: "Συναίνεση cookies"
    } : {
      title: "We value your privacy",
      text: 'We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.',
      necessary: "Necessary", necessaryDesc: "Required for the site to work",
      analytics: "Analytics", analyticsDesc: "Helps us understand traffic",
      marketing: "Marketing", marketingDesc: "Personalised ads and content",
      customise: "Customise", save: "Save preferences",
      reject: "Reject All", accept: "Accept All",
      ariaLabel: "Cookie consent"
    };

    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", T.ariaLabel);
    banner.innerHTML =
      '<h3>' + T.title + '</h3>' +
      '<p>' + T.text + '</p>' +
      '<div class="cookie-prefs" id="cookie-prefs">' +
        '<label class="cookie-pref"><span><strong>' + T.necessary + '</strong><small>' + T.necessaryDesc + '</small></span><input type="checkbox" checked disabled></label>' +
        '<label class="cookie-pref"><span><strong>' + T.analytics + '</strong><small>' + T.analyticsDesc + '</small></span><input type="checkbox" id="cookie-analytics" checked></label>' +
        '<label class="cookie-pref"><span><strong>' + T.marketing + '</strong><small>' + T.marketingDesc + '</small></span><input type="checkbox" id="cookie-marketing"></label>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn" id="cookie-customise">' + T.customise + '</button>' +
        '<button type="button" class="cookie-btn" id="cookie-reject">' + T.reject + '</button>' +
        '<button type="button" class="cookie-btn primary" id="cookie-accept">' + T.accept + '</button>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add("show"); });

    function closeBanner() {
      banner.classList.remove("show");
      setTimeout(function () { banner.remove(); }, 450);
    }
    document.getElementById("cookie-accept").addEventListener("click", function () {
      saveConsent(true, true);
      closeBanner();
    });
    document.getElementById("cookie-reject").addEventListener("click", function () {
      saveConsent(false, false);
      closeBanner();
    });
    document.getElementById("cookie-customise").addEventListener("click", function () {
      var prefs = document.getElementById("cookie-prefs");
      var open = prefs.classList.toggle("open");
      if (open) {
        this.textContent = T.save;
      } else {
        saveConsent(
          document.getElementById("cookie-analytics").checked,
          document.getElementById("cookie-marketing").checked
        );
        closeBanner();
      }
    });
  }
})();
