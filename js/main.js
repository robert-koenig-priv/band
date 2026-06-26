/* The Donkey Shorts — Frontend-Interaktionen */
(function () {
  "use strict";

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
