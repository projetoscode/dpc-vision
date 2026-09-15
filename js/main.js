(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* header: scroll state                                                */
  /* ------------------------------------------------------------------ */

  var body = document.body;
  var onScrollHeader = function () {
    if (window.scrollY > window.innerHeight * 0.6) {
      body.classList.add("scrolled");
    } else {
      body.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ------------------------------------------------------------------ */
  /* mobile menu                                                         */
  /* ------------------------------------------------------------------ */

  var menuBtn = document.querySelector(".menu-btn");
  var mobileNav = document.getElementById("mobile-nav-menu");

  if (menuBtn && mobileNav) {
    var closeMenu = function () {
      mobileNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    menuBtn.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ------------------------------------------------------------------ */
  /* scroll-spy: highlight active section in side nav + accent color     */
  /* ------------------------------------------------------------------ */

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var sideLinks = Array.prototype.slice.call(document.querySelectorAll(".side-progress a"));
  var sideItems = Array.prototype.slice.call(document.querySelectorAll(".side-progress li"));
  var progressFill = document.getElementById("progressFill");
  var root = document.documentElement;

  var accentBySection = {
    inicio: "--pink",
    servicos: "--red",
    metodologia: "--blue",
    diferenciais: "--green",
    negocio: "--magenta",
    contato: "--yellow",
  };

  function setActive(id) {
    sideItems.forEach(function (li) {
      var link = li.querySelector("a");
      li.classList.toggle("is-active", link && link.dataset.target === id);
    });
    var index = sections.findIndex(function (s) {
      return s.id === id;
    });
    if (index > -1 && progressFill) {
      var step = 100 / sections.length;
      progressFill.style.transform = "translateY(" + index * 100 + "%)";
      progressFill.style.height = step + "%";
    }
    var accentVar = accentBySection[id];
    if (accentVar) {
      root.style.setProperty("--accent", "var(" + accentVar + ")");
    }
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ------------------------------------------------------------------ */
  /* newsletter form: local-only confirmation (no backend available)     */
  /* ------------------------------------------------------------------ */

  var form = document.getElementById("newsletterForm");
  var msg = document.getElementById("newsletterMsg");
  if (form && msg) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "Obrigado! Em breve você recebe nossas novidades.";
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* background particle field                                           */
  /* ------------------------------------------------------------------ */

  var canvas = document.getElementById("bg-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COUNT = window.innerWidth < 720 ? 90 : 220;

  function resize() {
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      vy: Math.random() * 0.12 + 0.03,
      vx: (Math.random() - 0.5) * 0.05,
      tw: Math.random() * Math.PI * 2,
      base: Math.random() * 0.5 + 0.25,
    };
  }

  function getAccentRGB() {
    var val = getComputedStyle(root).getPropertyValue("--accent").trim();
    var probe = document.createElement("span");
    probe.style.color = val || "#fc93b5";
    document.body.appendChild(probe);
    var rgb = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    return rgb;
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(makeParticle());
  }

  var lastAccentCheck = 0;
  var accentRGB = "252,147,181";

  function frame(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (t - lastAccentCheck > 500) {
      var rgb = getAccentRGB().match(/\d+/g);
      if (rgb) accentRGB = rgb.slice(0, 3).join(",");
      lastAccentCheck = t;
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.vy;
      p.x += p.vx;
      p.tw += 0.02;
      if (p.y < -10) {
        p.y = window.innerHeight + 10;
        p.x = Math.random() * window.innerWidth;
      }
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;

      var flicker = p.base + Math.sin(p.tw) * 0.18;
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + accentRGB + "," + Math.max(flicker, 0.08) + ")";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  init();
  window.addEventListener("resize", init);
  requestAnimationFrame(frame);
  if (reduceMotion) frame(0);
})();
