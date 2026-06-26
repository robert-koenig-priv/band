/* The Donkey Shorts — Frontend-Interaktionen */
(function () {
  "use strict";

  // --- JS ist aktiv: Reveal-Animationen freischalten ---
  // (Ohne diese Klasse bleibt der Inhalt per CSS sichtbar, falls JS ausfällt.)
  document.documentElement.classList.add("js-anim");

  // --- Jahr im Footer ---
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Navbar: Hintergrund beim Scrollen ---
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobiles Menü ---
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // --- Songs rendern ---
  var grid = document.getElementById("songGrid");
  if (grid && Array.isArray(window.SONGS)) {
    window.SONGS.forEach(function (s, i) {
      var el = document.createElement("div");
      el.className = "song reveal";
      el.innerHTML =
        '<span class="num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="meta">' +
          '<span class="title">' + s.title + "</span>" +
          '<span class="artist">' + s.artist + "</span>" +
        "</span>";
      grid.appendChild(el);
    });
  }

  // --- Band-Karussell (Swipe / Pfeile / Punkte) ---
  // In try/catch gekapselt: ein Fehler hier darf die Reveal-Logik unten
  // nicht verhindern (sonst bliebe die Seite unsichtbar).
  try {
  var track = document.getElementById("memberTrack");
  if (track) {
    var slides = track.querySelectorAll(".member");
    var prevBtn = document.getElementById("memberPrev");
    var nextBtn = document.getElementById("memberNext");
    var dotsWrap = document.getElementById("memberDots");
    var current = 0;

    function slideWidth() {
      return slides.length ? slides[0].getBoundingClientRect().width : track.clientWidth;
    }
    function goTo(i) {
      current = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: current * slideWidth(), behavior: "smooth" });
    }
    function syncFromScroll() {
      var idx = Math.round(track.scrollLeft / slideWidth());
      idx = Math.max(0, Math.min(slides.length - 1, idx));
      if (idx !== current) current = idx;
      updateUI();
    }
    function updateUI() {
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === slides.length - 1;
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (d, i) {
          d.classList.toggle("active", i === current);
          d.setAttribute("aria-selected", i === current ? "true" : "false");
        });
      }
    }

    // Punkte erzeugen
    if (dotsWrap) {
      slides.forEach(function (s, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        var name = s.querySelector("h3");
        dot.setAttribute("aria-label", name ? name.textContent : "Mitglied " + (i + 1));
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    // Tastatur (wenn Track fokussiert)
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    });

    // Scroll/Swipe -> UI nachziehen (entprellt)
    var scrollTimer = null;
    track.addEventListener("scroll", function () {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(syncFromScroll, 90);
    }, { passive: true });

    window.addEventListener("resize", function () { goTo(current); });
    updateUI();
  }
  } catch (e) {
    if (window.console) console.warn("Karussell konnte nicht initialisiert werden:", e);
  }

  // --- Reveal-Animationen beim Scrollen ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // --- Aktiver Nav-Link je nach Sektion ---
  var sections = document.querySelectorAll("section[id], header[id]");
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
