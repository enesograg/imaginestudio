/* ============================================================
   IMAGINE STUDIO — interactions
   GSAP + ScrollTrigger + Lenis + SplitType (all local vendor files)
   ============================================================ */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (reduceMotion || !hasGsap) doc.classList.add("no-motion");

  /* ---------- preloader ---------- */
  var preloader = document.querySelector(".preloader");
  function hidePreloader() {
    if (preloader) preloader.classList.add("is-done");
  }
  if (doc.classList.contains("no-motion")) {
    hidePreloader();
  } else {
    var done = false;
    var finish = function () { if (!done) { done = true; setTimeout(hidePreloader, 650); } };
    window.addEventListener("load", finish);
    setTimeout(finish, 2200); // never trap the user behind the loader
  }

  /* ---------- gsap setup ---------- */
  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- smooth scroll (Lenis) ----------
     Set SMOOTH_SCROLL to false for fully native scrolling. */
  var SMOOTH_SCROLL = true;
  var lenis = null;
  if (SMOOTH_SCROLL && !doc.classList.contains("no-motion") && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 0.85, /* time-based easing: lands crisply, no endless lerp tail */
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    if (hasGsap && window.ScrollTrigger) {
      /* one clock for scroll + animations, so parallax never jitters against the page */
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time) { lenis.raf(time); requestAnimationFrame(raf); });
    }
  }

  /* ---------- nav scroll state (background + hide on scroll down) ---------- */
  var nav = document.querySelector(".nav");
  var lastNavY = 0;
  function onScrollState() {
    var y = lenis ? lenis.scroll : (window.scrollY || 0);
    if (!nav) return;
    nav.classList.toggle("is-scrolled", y > 40);
    var menuOpen = mobileMenu && mobileMenu.classList.contains("is-open");
    if (!menuOpen && !doc.classList.contains("no-motion")) {
      if (y > 320 && y > lastNavY + 6) nav.classList.add("is-away");
      else if (y < lastNavY - 6 || y <= 320) nav.classList.remove("is-away");
    }
    lastNavY = y;
  }
  if (lenis) lenis.on("scroll", onScrollState);
  window.addEventListener("scroll", onScrollState, { passive: true });
  onScrollState();

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var mobileMenu = document.querySelector(".mobile-menu");
  function closeMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    if (nav) nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  }
  if (burger && mobileMenu) {
    mobileMenu.id = mobileMenu.id || "mobile-menu";
    burger.setAttribute("aria-controls", mobileMenu.id);
    burger.addEventListener("click", function () {
      var open = !mobileMenu.classList.contains("is-open");
      burger.classList.toggle("is-open", open);
      mobileMenu.classList.toggle("is-open", open);
      if (nav) { nav.classList.toggle("menu-open", open); nav.classList.remove("is-away"); }
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- split headline reveals ---------- */
  function initSplits() {
    if (doc.classList.contains("no-motion") || typeof window.SplitType === "undefined") {
      document.querySelectorAll("[data-split]").forEach(function (el) { el.classList.add("is-split"); });
      return;
    }
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var split = new SplitType(el, { types: "lines,words", lineClass: "line", wordClass: "word" });
      el.classList.add("is-split");
      gsap.set(split.words, { yPercent: 112 });
      gsap.to(split.words, {
        yPercent: 0,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.045,
        delay: parseFloat(el.getAttribute("data-split-delay") || 0),
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }
  if (document.fonts && document.fonts.ready) {
    var splitStarted = false;
    var startSplits = function () { if (!splitStarted) { splitStarted = true; initSplits(); } };
    document.fonts.ready.then(startSplits);
    setTimeout(startSplits, 1600); // fallback if fonts hang
  } else {
    initSplits();
  }

  /* ---------- generic reveals ---------- */
  if (hasGsap && !doc.classList.contains("no-motion")) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: "power3.out",
        delay: parseFloat(el.getAttribute("data-delay") || 0),
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });

    /* parallax images (prefer the visible video layer on autoplay cards) */
    document.querySelectorAll("[data-parallax]").forEach(function (wrap) {
      var img = wrap.classList.contains("autoplay")
        ? (wrap.querySelector("video") || wrap.querySelector("img"))
        : wrap.querySelector("img, video");
      if (!img) return;
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* counters */
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      el.textContent = "0"; /* HTML carries the final value for no-JS / reduced-motion */
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: function () { el.textContent = Math.round(obj.v); }
      });
    });
  }

  /* ---------- hero video (with fallback + reduced-motion respect) ---------- */
  var hero = document.querySelector(".hero");
  var heroVideo = hero ? hero.querySelector("video") : null;
  if (hero && heroVideo) {
    if (doc.classList.contains("no-motion")) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
      hero.classList.add("no-video"); /* static poster instead of looping motion */
    } else {
      heroVideo.addEventListener("error", function () { hero.classList.add("no-video"); }, true);
      var src = heroVideo.querySelector("source");
      if (src) src.addEventListener("error", function () { hero.classList.add("no-video"); });
      heroVideo.play && heroVideo.play().catch(function () { /* autoplay blocked: poster still shows */ });
    }
  }

  /* keyboard support for click-driven elements */
  function pressable(el) {
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
    });
  }

  /* ---------- hover-to-play preview videos ---------- */
  document.querySelectorAll("[data-hover-video]").forEach(function (card) {
    var video = card.querySelector("video");
    if (!video) return;
    card.addEventListener("mouseenter", function () { video.play().catch(function () {}); });
    card.addEventListener("mouseleave", function () { video.pause(); });
  });

  /* ---------- autoplay previews (play in view, pause offscreen) ---------- */
  var autoVideos = document.querySelectorAll(".feature-media.autoplay video");
  if (autoVideos.length && !doc.classList.contains("no-motion")) {
    if ("IntersectionObserver" in window) {
      var autoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.play().catch(function () {});
          else entry.target.pause();
        });
      }, { threshold: 0.2 });
      autoVideos.forEach(function (v) { autoObserver.observe(v); });
    } else {
      autoVideos.forEach(function (v) { v.play().catch(function () {}); });
    }
  }

  /* ---------- film players (click poster to play) ---------- */
  var players = document.querySelectorAll(".film-player");
  players.forEach(function (player) {
    player.tabIndex = 0;
    player.setAttribute("role", "button");
    var block = player.closest(".film-block");
    var t = block && block.querySelector("h3");
    player.setAttribute("aria-label", "Play film" + (t ? ": " + t.textContent : ""));
    pressable(player);
    player.addEventListener("click", function () {
      if (player.classList.contains("is-playing")) return;
      var video = player.querySelector("video");
      if (!video) return;
      players.forEach(function (other) {
        if (other !== player) {
          var v = other.querySelector("video");
          if (v && !v.paused) v.pause();
        }
      });
      if (!video.getAttribute("src") && video.getAttribute("data-src")) {
        video.setAttribute("src", video.getAttribute("data-src"));
      }
      player.classList.add("is-playing");
      video.controls = true;
      video.play().catch(function () {});
    });
  });

  /* ---------- work filters (with staggered re-entry) ---------- */
  var chips = document.querySelectorAll(".filters .chip");
  var workItems = document.querySelectorAll(".work-item");
  chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.classList.contains("is-active"))); });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      var f = chip.getAttribute("data-filter");
      var shown = [];
      workItems.forEach(function (item) {
        var show = f === "all" || item.getAttribute("data-cat") === f;
        item.classList.toggle("is-hidden", !show);
        if (show) {
          shown.push(item);
          item.querySelectorAll(".clip-pending").forEach(function (m) { m.classList.remove("clip-pending"); });
        }
      });
      if (hasGsap && !doc.classList.contains("no-motion")) {
        gsap.fromTo(shown, { opacity: 0, y: 26 }, {
          opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.035, overwrite: true,
          onComplete: function () { gsap.set(shown, { clearProps: "transform" }); }
        });
      }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------- package tabs (deep-linkable) ---------- */
  var pkgTabs = document.querySelectorAll(".pkg-tabs .chip");
  var pkgPanels = document.querySelectorAll(".pkg-panel");
  function openPanel(id, updateHash) {
    var found = false;
    pkgPanels.forEach(function (p) {
      var match = p.id === id;
      p.classList.toggle("is-open", match);
      if (match) found = true;
    });
    if (!found && pkgPanels.length) { pkgPanels[0].classList.add("is-open"); id = pkgPanels[0].id; }
    pkgTabs.forEach(function (t) { t.classList.toggle("is-active", t.getAttribute("data-panel") === id); });
    if (updateHash && history.replaceState) history.replaceState(null, "", "#" + id);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  if (pkgTabs.length) {
    pkgTabs.forEach(function (tab) {
      tab.addEventListener("click", function () { openPanel(tab.getAttribute("data-panel"), true); });
    });
    var initial = (location.hash || "").replace("#", "");
    openPanel(initial || "weddings", false);
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Media viewer");
    var stageMedia = lightbox.querySelector(".lb-media");
    var capTitle = lightbox.querySelector(".lb-title");
    var capCount = lightbox.querySelector(".lb-count");
    var galleryItems = [];
    var galleryIndex = 0;
    var lastFocus = null;

    function renderLightbox() {
      var item = galleryItems[galleryIndex];
      if (!item) return;
      stageMedia.innerHTML = "";
      if (item.video) {
        var v = document.createElement("video");
        v.src = item.video;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        stageMedia.appendChild(v);
      } else {
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title || "";
        stageMedia.appendChild(img);
      }
      capTitle.textContent = item.title || "";
      capCount.textContent = galleryItems.length > 1 ? (galleryIndex + 1) + " / " + galleryItems.length : "";
    }
    function openLightbox(items, index) {
      galleryItems = items;
      galleryIndex = index || 0;
      renderLightbox();
      lastFocus = document.activeElement;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
      lightbox.querySelector(".lb-close").focus();
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      stageMedia.innerHTML = "";
      document.body.style.overflow = "";
      if (lenis) lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function stepLightbox(dir) {
      if (galleryItems.length < 2) return;
      galleryIndex = (galleryIndex + dir + galleryItems.length) % galleryItems.length;
      renderLightbox();
    }

    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); stepLightbox(-1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); stepLightbox(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });

    /* gallery items: [data-lightbox] within [data-gallery] scope */
    document.querySelectorAll("[data-gallery]").forEach(function (scope) {
      var nodes = Array.prototype.slice.call(scope.querySelectorAll("[data-lightbox]"));
      nodes.forEach(function (node, i) {
        node.tabIndex = 0;
        node.setAttribute("role", "button");
        node.setAttribute("aria-label", "View: " + (node.getAttribute("data-title") || "image " + (i + 1)));
        pressable(node);
        node.addEventListener("click", function () {
          var items = nodes
            .filter(function (n) { return !n.classList.contains("is-hidden"); })
            .map(function (n) {
              return {
                src: n.getAttribute("data-full") || (n.querySelector("img") ? n.querySelector("img").src : ""),
                video: n.getAttribute("data-video") || null,
                title: n.getAttribute("data-title") || ""
              };
            });
          var visibleIndex = nodes.filter(function (n) { return !n.classList.contains("is-hidden"); }).indexOf(node);
          openLightbox(items, Math.max(visibleIndex, 0));
        });
      });
    });

    /* single triggers (e.g. showreel buttons) */
    document.querySelectorAll("[data-lightbox-video]").forEach(function (btn) {
      if (btn.tagName !== "BUTTON") pressable(btn);
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox([{ video: btn.getAttribute("data-lightbox-video"), title: btn.getAttribute("data-title") || "Showreel" }], 0);
      });
    });
  }

  /* ---------- contact form ---------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        /* Formspree not configured yet — fall back to the visitor's email app */
        e.preventDefault();
        var get = function (name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value : ""; };
        var subject = encodeURIComponent("Project enquiry — " + (get("service") || "General"));
        var body = encodeURIComponent(
          "Name: " + get("name") + "\nEmail: " + get("email") + "\nPhone: " + get("phone") +
          "\nService: " + get("service") + "\nDate: " + get("date") + "\n\n" + get("message")
        );
        window.location.href = "mailto:" + (form.getAttribute("data-mailto") || "hello@example.com") + "?subject=" + subject + "&body=" + body;
      }
    });
  }

  /* ============================================================
     Craft layer
     ============================================================ */
  var motionOK = hasGsap && !doc.classList.contains("no-motion");
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* --- curtain reveals: media un-clips upward, image settles from a slight zoom --- */
  if (motionOK && window.ScrollTrigger) {
    var clipTargets = document.querySelectorAll(
      ".feature-media, .work-media, .film-player, .service-card, .portrait-frame, .trio figure"
    );
    clipTargets.forEach(function (el) {
      el.classList.add("clip", "clip-pending");
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () { el.classList.remove("clip-pending"); }
      });
    });

    /* hero video breathes in behind the preloader */
    var heroMedia = document.querySelector(".hero-media");
    if (heroMedia) gsap.fromTo(heroMedia, { scale: 1.12 }, { scale: 1, duration: 3.4, ease: "power2.out", delay: 0.55 });

    /* showreel band grows to full width as it scrolls into place */
    document.querySelectorAll(".reel-band").forEach(function (band) {
      gsap.fromTo(band, { scale: 0.9, borderRadius: "22px" }, {
        scale: 1, borderRadius: "2px", ease: "none",
        scrollTrigger: { trigger: band, start: "top 96%", end: "top 38%", scrub: true }
      });
    });
  }

  /* --- contextual cursor --- */
  document.querySelectorAll(".film-player, .reel-band, [data-lightbox-video]").forEach(function (el) {
    if (!el.hasAttribute("data-cursor")) el.setAttribute("data-cursor", "Play");
  });
  document.querySelectorAll(".work-item, .trio figure").forEach(function (el) {
    if (!el.hasAttribute("data-cursor")) el.setAttribute("data-cursor", "View");
  });
  document.querySelectorAll(".feature-media").forEach(function (el) {
    if (!el.hasAttribute("data-cursor")) el.setAttribute("data-cursor", "Watch");
  });

  var cursorEl = document.querySelector(".cursor");
  if (cursorEl && motionOK && finePointer) {
    var cursorLabel = cursorEl.querySelector(".cursor-label");
    gsap.set(cursorEl, { x: -100, y: -100 });
    var curX = gsap.quickTo(cursorEl, "x", { duration: 0.32, ease: "power3" });
    var curY = gsap.quickTo(cursorEl, "y", { duration: 0.32, ease: "power3" });
    window.addEventListener("mousemove", function (e) {
      curX(e.clientX); curY(e.clientY);
      cursorEl.classList.remove("is-gone");
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { cursorEl.classList.add("is-gone"); });
    document.querySelectorAll("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursorLabel.textContent = el.getAttribute("data-cursor");
        cursorEl.classList.add("is-active");
      });
      el.addEventListener("mouseleave", function () { cursorEl.classList.remove("is-active"); });
    });
  }

  /* --- magnetic buttons --- */
  if (motionOK && finePointer) {
    document.querySelectorAll(".btn, .play-pill, .nav-cta").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      var my = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      el.addEventListener("mouseleave", function () { mx(0); my(0); });
    });
  }

  /* --- local time in the footer --- */
  var timeEls = document.querySelectorAll("[data-time]");
  if (timeEls.length) {
    var tickTime = function () {
      var d = new Date();
      var s = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
      timeEls.forEach(function (el) { el.textContent = s; });
    };
    tickTime();
    setInterval(tickTime, 30000);
  }

  /* ---------- footer helpers ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  document.querySelectorAll("[data-scroll-top]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* anchor links → lenis */
  if (lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });
  }
})();
