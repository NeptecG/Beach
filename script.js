// Beach Bar Template - shared behavior (bilingual: reads <html lang> for el/en strings)

(function () {
  "use strict";

  var isGreek = (document.documentElement.lang || "").toLowerCase().indexOf("el") === 0;

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
