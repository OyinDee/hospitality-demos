/* Ember & Vine — interactions */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  /* Sticky header state */
  const onScroll = () => {
    header.classList.toggle("is-solid", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
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

  /* Menu tabs */
  const tabs = Array.from(document.querySelectorAll(".menu-tab"));
  const panels = Array.from(document.querySelectorAll(".menu-panel"));
  const activate = (tab) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });
    panels.forEach((p) => {
      const active = p.id === tab.getAttribute("aria-controls");
      p.classList.toggle("is-active", active);
      p.hidden = !active;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      activate(next);
    });
  });

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const siblings = Array.from(el.parentElement.children).filter((c) =>
              c.classList.contains("reveal")
            );
            const index = Math.max(0, siblings.indexOf(el));
            el.style.transitionDelay = Math.min(index * 90, 360) + "ms";
            el.classList.add("in-view");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in-view"));
  }

  /* Gallery lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  let lastFocus = null;
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      lastFocus = item;
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.querySelector("img").alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.querySelector(".lightbox-close").focus();
    });
  });
  const closeBox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lastFocus) lastFocus.focus();
  };
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeBox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeBox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeBox();
  });

  /* Reservation form */
  const form = document.getElementById("reserve-form");
  const success = document.getElementById("reserve-success");
  const summary = document.getElementById("reserve-summary");
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
    const guests = data.get("guests");
    const date = data.get("date");
    const time = data.get("time");
    const nice = date
      ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : "your chosen date";
    summary.textContent = `${name}, we have your request for ${guests} on ${nice} at ${time}. A confirmation will land in your inbox shortly.`;
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
