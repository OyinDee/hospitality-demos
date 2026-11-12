/* Velour Studio — interactions */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setNav = (open) => {
    body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.getElementById("mobile-nav").setAttribute("aria-hidden", String(!open));
  };
  toggle.addEventListener("click", () => setNav(!body.classList.contains("nav-open")));
  mobileLinks.forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("nav-open")) setNav(false);
  });

  /* Reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children).filter((c) =>
            c.classList.contains("reveal")
          );
          el.style.transitionDelay = Math.min(siblings.indexOf(el) * 80, 320) + "ms";
          el.classList.add("in-view");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in-view"));
  }

  /* Drag to scroll the work strip */
  const strip = document.getElementById("work-strip");
  if (strip) {
    let down = false, startX = 0, startScroll = 0;
    strip.addEventListener("pointerdown", (e) => {
      down = true;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener("pointermove", (e) => {
      if (!down) return;
      strip.scrollLeft = startScroll - (e.clientX - startX);
    });
    const end = () => { down = false; };
    strip.addEventListener("pointerup", end);
    strip.addEventListener("pointercancel", end);
  }

  /* Booking form */
  const form = document.getElementById("book-form");
  const success = document.getElementById("book-success");
  const summary = document.getElementById("book-summary");
  const dateInput = form.querySelector('input[name="date"]');
  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = iso;
  dateInput.value = iso;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim().split(" ")[0] || "there";
    const service = data.get("service");
    const stylist = data.get("stylist");
    const date = data.get("date");
    const time = data.get("time");
    const nice = date
      ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : "your chosen date";
    const withWhom = stylist && stylist !== "No preference" ? ` with ${stylist}` : "";
    summary.textContent = `${name}, we have your request for ${service}${withWhom} on ${nice} at ${time}. We will confirm by email shortly.`;
    success.hidden = false;
    success.setAttribute("tabindex", "-1");
    success.focus();
  });

  /* Newsletter */
  const news = document.getElementById("newsletter-form");
  news.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!news.checkValidity()) {
      news.reportValidity();
      return;
    }
    document.getElementById("news-success").hidden = false;
    news.reset();
  });
})();
