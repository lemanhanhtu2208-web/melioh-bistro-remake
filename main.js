/* MeliOh Bistro Da Nang — Dark Fine Dining Editorial
   Lightweight vanilla interactions: preloader, header, mobile nav,
   reveal-on-scroll, accordion, reservation form (Formspree).
   No external libraries. Content is visible by default — JS only
   enhances, so the page never blanks out if a script fails. */

(function () {
  "use strict";

  // Tell the head safety-net that JS is running, so it won't strip
  // the .js class (which would skip the reveal animations).
  window.__meliohReady = true;

  var doc = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    // Let the champagne line finish its sweep before fading into the hero.
    var elapsed = (window.performance && performance.now) ? performance.now() : 0;
    var wait = Math.max(500, 1700 - elapsed);
    setTimeout(function () { pre.classList.add("is-done"); }, wait);
  });

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

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (doc.classList.contains("js") && "IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // No JS-motion path: make sure everything is shown.
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    doc.classList.remove("js");
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".acc").forEach(function (acc) {
    var head = acc.querySelector(".acc__head");
    head.addEventListener("click", function () {
      var isOpen = acc.classList.contains("is-open");
      document.querySelectorAll(".acc.is-open").forEach(function (o) {
        if (o !== acc) {
          o.classList.remove("is-open");
          o.querySelector(".acc__head").setAttribute("aria-expanded", "false");
        }
      });
      acc.classList.toggle("is-open", !isOpen);
      head.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------- Reservation form (Formspree) ---------- */
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

      if (form.querySelector('[name="_gotcha"]').value) return;

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
          news.innerHTML = '<p style="color:var(--gold);font-family:var(--serif);font-style:italic;font-size:1.15rem;">Thank you for subscribing.</p>';
        } else {
          input.reportValidity();
        }
      }
    });
  }
})();
