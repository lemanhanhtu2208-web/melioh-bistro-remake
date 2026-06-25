/* MeliOh Bistro Da Nang — Dark Fine Dining Editorial
   Lightweight vanilla interactions: preloader, header, mobile nav,
   reveal-on-scroll, accordion, reservation form (Google Apps Script).
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
    var wait = Math.max(400, 1300 - elapsed);
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

  /* ---------- Reservation form ----------
     Sends the booking to the Google Apps Script backend (config.js →
     MELIOH_CONFIG.endpoint) so the admin sees it from any device.
     A copy is always mirrored to localStorage as an offline backup.
     If no endpoint is configured, the site runs in local demo mode. */
  var CFG = window.MELIOH_CONFIG || {};
  var ENDPOINT = CFG.endpoint || "";
  var PHONE = CFG.phone || "+84 0918 204 008";

  var form = document.getElementById("reservationForm");
  var statusEl = document.getElementById("formStatus");

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form__status" + (type ? " is-" + type : "");
  }

  function collectBooking(formEl) {
    var data = new FormData(formEl);
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: (data.get("name") || "").trim(),
      phone: (data.get("phone") || "").trim(),
      date: data.get("date") || "",
      time: data.get("time") || "",
      guests: data.get("guests") || "",
      occasion: data.get("occasion") || "",
      message: (data.get("message") || "").trim(),
      status: "pending",
      source: "website",
      receivedAt: new Date().toISOString()
    };
  }

  function mirrorLocally(booking) {
    try {
      var all = JSON.parse(localStorage.getItem("melioh_reservations") || "[]");
      all.push(booking);
      localStorage.setItem("melioh_reservations", JSON.stringify(all));
    } catch (e) {}
  }

  /* ---- Validation helpers (Vietnam timezone) ---- */

  // "Now" in Asia/Ho_Chi_Minh (UTC+7), independent of the visitor's device clock.
  function vnNow() {
    var local = new Date();
    var utc = local.getTime() + local.getTimezoneOffset() * 60000;
    return new Date(utc + 7 * 3600000);
  }
  function vnTodayStr() {
    var d = vnNow();
    return d.getFullYear() + "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2);
  }

  // Accept Vietnamese phone numbers: 0xxxxxxxxx (10 digits) or +84xxxxxxxxx.
  function isValidVNPhone(raw) {
    var digits = String(raw).replace(/[\s.\-()]/g, "");
    if (/^0\d{9}$/.test(digits)) return true;            // 0918204008
    if (/^\+?84\d{9}$/.test(digits)) return true;         // +84918204008 / 84918204008
    return false;
  }

  // Returns an error message string, or "" if the booking date+time is valid.
  function dateTimeError(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";
    var today = vnTodayStr();
    if (dateStr < today) return "Please choose today or a future date.";
    if (dateStr === today) {
      var now = vnNow();
      var parts = timeStr.split(":");
      var bookMin = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      var nowMin = now.getHours() * 60 + now.getMinutes();
      if (bookMin <= nowMin + 30) {
        return "For tonight, please choose a time at least 30 minutes ahead — or call us.";
      }
    }
    return "";
  }

  function markInvalid(input, bad) {
    var field = input && input.closest(".field");
    if (field) field.classList.toggle("is-invalid", bad);
  }

  if (form) {
    // Prevent picking a past date in the calendar widget itself.
    var dateInput = form.querySelector('[name="date"]');
    if (dateInput) dateInput.setAttribute("min", vnTodayStr());

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (form.querySelector('[name="_gotcha"]').value) return;

      // 1) Required fields present & natively valid.
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var ok = input.value.trim() !== "" && input.checkValidity();
        markInvalid(input, !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        setStatus("Please complete the highlighted fields so we can reach you.", "err");
        return;
      }

      // 2) Phone format (Vietnam).
      var phoneInput = form.querySelector('[name="phone"]');
      if (!isValidVNPhone(phoneInput.value)) {
        markInvalid(phoneInput, true);
        setStatus("Please enter a valid Vietnamese phone number, e.g. 0918 204 008.", "err");
        return;
      }

      // 3) Guests within range.
      var guestsInput = form.querySelector('[name="guests"]');
      var guests = parseInt(guestsInput.value, 10);
      if (isNaN(guests) || guests < 1 || guests > 40) {
        markInvalid(guestsInput, true);
        setStatus("Number of guests should be between 1 and 40. For larger parties, please call us.", "err");
        return;
      }

      // 4) Date & time not in the past (Vietnam time).
      var dtErr = dateTimeError(form.querySelector('[name="date"]').value,
                                form.querySelector('[name="time"]').value);
      if (dtErr) {
        markInvalid(form.querySelector('[name="date"]'), true);
        markInvalid(form.querySelector('[name="time"]'), true);
        setStatus(dtErr, "err");
        return;
      }

      var booking = collectBooking(form);

      // Demo mode — no backend yet. Be honest: the restaurant will NOT receive
      // this. Do not claim success; tell the guest to call. Keep their input.
      if (!ENDPOINT) {
        mirrorLocally(booking); // local preview only
        setStatus("⚠ Online booking is not active yet. To reserve, please call or message us at " + PHONE + ". (Your details are kept on this page so you can copy them.)", "err");
        return;
      }

      // Live mode — send to Google Apps Script. text/plain avoids a CORS
      // preflight, so the request goes straight through.
      setStatus("Sending your request…", "");
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "add", booking: booking })
      }).then(function (res) {
        return res.json().catch(function () { return { ok: res.ok }; });
      }).then(function (data) {
        if (submitBtn) submitBtn.disabled = false;
        if (data && data.ok) {
          mirrorLocally(booking); // cache only after a confirmed save
          setStatus("Thank you, " + booking.name + "! We have received your request and will call you shortly to confirm.", "ok");
          form.reset();
          if (dateInput) dateInput.setAttribute("min", vnTodayStr());
        } else {
          setStatus("We couldn't save your request. Please call us at " + PHONE + " and we'll arrange it — your details are still in the form.", "err");
        }
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        // Network/CORS issue — do not lose the guest's input (no reset).
        setStatus("Network problem saving your request. Please call us at " + PHONE + " — your details are still in the form.", "err");
      });
    });

    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        markInvalid(el, false);
      });
    });
  }
})();
