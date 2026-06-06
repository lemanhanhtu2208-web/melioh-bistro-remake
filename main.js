/* MeliOh Bistro Da Nang — Remake Concept
   Cinematic motion: preloader, hero entrance + parallax, sticky
   storytelling, clip-path image reveals, package interaction,
   gallery, reservation form, footer — powered by GSAP + ScrollTrigger
   + Lenis, with a graceful no-JS / reduced-motion fallback. */

(function () {
  "use strict";

  var doc = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 720px)").matches;

  // GSAP + ScrollTrigger arrive via deferred CDN scripts before this file.
  var hasGSAP = !!(window.gsap && window.ScrollTrigger) && !prefersReduced;

  // If the motion libraries didn't load (offline / blocked), drop the
  // pre-paint flag so everything is visible and fall back to the
  // IntersectionObserver reveals below.
  if (!hasGSAP) doc.classList.remove("has-gsap");

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function closeNav() {
    header.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".acc").forEach(function (acc) {
    var head = acc.querySelector(".acc__head");
    var panel = acc.querySelector(".acc__panel");
    head.addEventListener("click", function () {
      var isOpen = acc.classList.contains("is-open");
      document.querySelectorAll(".acc.is-open").forEach(function (o) {
        if (o !== acc) {
          o.classList.remove("is-open");
          o.querySelector(".acc__head").setAttribute("aria-expanded", "false");
          o.querySelector(".acc__panel").style.maxHeight = null;
        }
      });
      if (isOpen) {
        acc.classList.remove("is-open");
        head.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        acc.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      // Heights changed — keep scroll triggers in sync.
      if (hasGSAP && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });
  });

  /* ============================================================
     Motion
     ============================================================ */
  if (hasGSAP) {
    initCinematicMotion();
  } else {
    initFallbackReveals();
    // Plain fade-out preloader (CSS handles the entrance animations).
    window.addEventListener("load", function () {
      var pre = document.getElementById("preloader");
      if (pre) setTimeout(function () { pre.classList.add("is-done"); }, 600);
    });
  }

  /* ---------- Fallback reveals (no GSAP) ---------- */
  function initFallbackReveals() {
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------- Cinematic motion (GSAP) ---------- */
  function initCinematicMotion() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    // Signal the head safety-net that motion is taking over, so it won't
    // strip the cinematic states even on slow (>2.5s) page loads.
    window.__meliohMotionReady = true;
    gsap.registerPlugin(ScrollTrigger);

    /* --- Lenis smooth scroll (desktop / pointer only) --- */
    var lenis = null;
    if (window.Lenis && !isMobile) {
      lenis = new window.Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);

      // Smooth in-page anchor navigation.
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        a.addEventListener("click", function (e) {
          var target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          closeNav();
          lenis.scrollTo(target, { offset: -64 });
        });
      });
    }

    /* --- Initial states for the hero entrance --- */
    gsap.set(".header", { y: -14 });
    gsap.set([".hero__eyebrow", ".hero__sub", ".hero__actions"], { y: 18 });

    /* --- Preloader timeline --- */
    function playPreloaderOut(onDone) {
      var pre = document.getElementById("preloader");
      if (!pre) { onDone(); return; }
      gsap.to(pre, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
        delay: 0.5,
        onComplete: function () {
          pre.classList.add("is-done");
          onDone();
        }
      });
    }

    /* --- Hero entrance --- */
    function playHeroEntrance() {
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".header", { opacity: 1, y: 0, duration: 1.1 }, 0)
        .to(".hero__media img", { scale: 1, duration: 1.9, ease: "power2.out" }, 0)
        .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.9 }, 0.25)
        .to(".hero__line > span", { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.4)
        .to(".hero__sub", { opacity: 1, y: 0, duration: 0.9 }, 1.0)
        .to(".hero__actions", { opacity: 1, y: 0, duration: 0.9 }, 1.15)
        .to(".hero__foot", { opacity: 1, duration: 0.9 }, 1.3);
    }

    window.addEventListener("load", function () {
      playPreloaderOut(playHeroEntrance);
      // Recalculate trigger positions once images/fonts have settled.
      ScrollTrigger.refresh();
    });

    /* --- Hero scroll parallax (desktop only) --- */
    if (!isMobile) {
      gsap.set(".hero__veil", { opacity: 0.85 });
      gsap.fromTo(".hero__media img",
        { scale: 1 },
        {
          scale: 1.12, yPercent: 6, ease: "none", immediateRender: false,
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      gsap.to(".hero__content", {
        yPercent: -16, opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "70% top", scrub: true }
      });
      gsap.to(".hero__veil", {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    /* --- Generic reveals (fade-in-up, per element) --- */
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 34 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" }
        });
    });

    /* --- Clip-path image wipes (left to right) --- */
    var wipeImgs = gsap.utils.toArray(
      ".exp__item-media img, .story__media img, .gallery .collage__item img"
    );
    wipeImgs.forEach(function (img) {
      img.setAttribute("data-img-wipe", "");
      gsap.to(img, {
        clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "power3.out",
        scrollTrigger: { trigger: img, start: "top 90%" }
      });
    });

    /* --- About: keyword / fact stagger --- */
    if (document.querySelector(".factlist")) {
      gsap.from(".factlist li", {
        opacity: 0, y: 18, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".factlist", start: "top 88%" }
      });
    }

    /* --- Experience: sticky storytelling, per item --- */
    var tints = ["#F8EFE3", "#F7ECDD", "#F8EDE0", "#F6EADB", "#F7ECDE"];
    var experience = document.querySelector(".experience");
    gsap.utils.toArray(".exp__item").forEach(function (item, i) {
      var img = item.querySelector("img");
      var bodyBits = item.querySelectorAll(".exp__item-body > *");

      gsap.fromTo(img,
        { scale: 1.12 },
        {
          scale: 1, duration: 1.6, ease: "power2.out", immediateRender: false,
          scrollTrigger: { trigger: item, start: "top 88%" }
        });

      gsap.from(bodyBits, {
        opacity: 0, y: 24, duration: 1, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 78%" }
      });

      // Very subtle warm background tint as each moment takes focus.
      if (experience) {
        ScrollTrigger.create({
          trigger: item, start: "top center", end: "bottom center",
          onToggle: function (self) {
            if (self.isActive) {
              gsap.to(experience, { backgroundColor: tints[i % tints.length], duration: 1.2, ease: "power2.out" });
            }
          }
        });
      }
    });

    /* --- Reservation: invitation-card glow on reveal --- */
    var resForm = document.querySelector(".reservation .form");
    if (resForm) {
      ScrollTrigger.create({
        trigger: resForm, start: "top 80%", once: true,
        onEnter: function () { resForm.classList.add("is-shown"); }
      });
    }

    /* --- Footer reveal (staggered) --- */
    if (document.querySelector(".footer")) {
      gsap.from(".footer__brand, .footer__col", {
        opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".footer", start: "top 92%" }
      });
    }
  }

  /* ============================================================
     Reservation form (Formspree) — logic unchanged
     ============================================================ */
  var form = document.getElementById("reservationForm");
  var statusEl = document.getElementById("formStatus");

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form__status" + (type ? " is-" + type : "");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot
      if (form.querySelector('[name="_gotcha"]').value) return;

      // validate required
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = input.value.trim() !== "" && input.checkValidity();
        if (field) field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        setStatus("Please complete the highlighted fields so we can reach you.", "err");
        return;
      }

      var action = form.getAttribute("action") || "";
      var notConfigured = action.indexOf("your-form-id") !== -1;

      setStatus("Sending your request…", "");

      if (notConfigured) {
        // Demo mode: no live Formspree endpoint set yet.
        setTimeout(function () {
          setStatus("Thank you. This is a concept demo — connect a Formspree ID to receive live requests. We would reply to confirm your evening.", "ok");
          form.reset();
        }, 700);
        return;
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          setStatus("Thank you. We have received your request and will reply soon to confirm the details.", "ok");
          form.reset();
        } else {
          setStatus("Something went wrong. Please call us at +84 0918 204 008 and we will help.", "err");
        }
      }).catch(function () {
        setStatus("Network issue. Please call us at +84 0918 204 008 and we will help.", "err");
      });
    });

    // clear invalid state on input
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var f = el.closest(".field");
        if (f) f.classList.remove("is-invalid");
      });
    });
  }

  /* ---------- Newsletter (demo) ---------- */
  var news = document.getElementById("newsletterForm");
  if (news) {
    news.addEventListener("submit", function (e) {
      var action = news.getAttribute("action") || "";
      if (action.indexOf("your-form-id") !== -1) {
        e.preventDefault();
        var input = news.querySelector("input");
        if (input.checkValidity()) {
          news.innerHTML = '<p style="color:var(--wine);font-family:var(--serif);font-size:1.2rem;">Thank you for subscribing.</p>';
        } else {
          input.reportValidity();
        }
      }
    });
  }
})();
