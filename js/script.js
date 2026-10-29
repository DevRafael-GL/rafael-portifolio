const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// MENU

const btnMenu = document.querySelector(".menu-mobile");
const menu = document.querySelector(".menu");
const headerMenu = document.querySelector(".header-menu");

function setMenu(isOpen) {
  menu.classList.toggle("active", isOpen);
  btnMenu.setAttribute("aria-expanded", String(isOpen));
  btnMenu.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

function closeMenu() {
  setMenu(false);
}

function menuMobile(event) {
  event.stopPropagation();
  const willOpen = !menu.classList.contains("active");
  setMenu(willOpen);

  if (willOpen) {
    outsideclick(headerMenu, closeMenu);
  }
}

btnMenu.addEventListener("click", menuMobile);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("active")) {
    closeMenu();
    btnMenu.focus();
  }
});

function outsideclick(element, callback) {
  const html = document.documentElement;
  html.addEventListener("click", handleOutsideClick);

  function handleOutsideClick(event) {
    if (!element.contains(event.target)) {
      html.removeEventListener("click", handleOutsideClick);
      callback();
    }
  }
}

// HERO INTRO

document.addEventListener("DOMContentLoaded", () => {
  // Nothing in the hero is hidden by CSS, so if GSAP never arrives or the
  // visitor asked for less motion the content is simply already there.
  if (prefersReducedMotion || typeof gsap === "undefined") return;

  const tl = gsap.timeline();

  tl.from(".menu-1", {
    duration: 0.6,
    y: 50,
    opacity: 0,
    delay: 0.1,
    ease: "power3.out",
  })
    .from(".menu-2", { duration: 0.6, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
    .from(".menu-3", { duration: 0.6, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
    .from(".menu-4", { duration: 0.6, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
    .from(".menu-5", { duration: 0.6, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
    .from(
      ".container-item div",
      {
        duration: 0.8,
        y: 120,
        opacity: 0,
        stagger: { each: 0.12 },
        ease: "power3.out",
      },
      "-=0.5"
    )
    .from(
      ".container-item img",
      { duration: 0.8, y: 120, opacity: 0, ease: "power3.out" },
      "-=0.6"
    );
});

// SCROLL SUAVE

const menuItems = document.querySelectorAll(".scroll-suave");

menuItems.forEach((item) => {
  item.addEventListener("click", scrollToIdOnClick);
});

function scrollToIdOnClick(event) {
  const id = event.currentTarget.getAttribute("href");
  const section = document.querySelector(id);
  if (!section) return;

  event.preventDefault();
  closeMenu();

  window.scroll({
    top: section.offsetTop - 80,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

// ANIMA SCROLL

const target = document.querySelectorAll(".anima-scroll");

if (target.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    target.forEach((element) => element.classList.add("animate"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // One-shot: once a section is in, it stays in.
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -15% 0px" }
    );

    target.forEach((element) => observer.observe(element));
  }
}

// COPY EMAIL

const copyButton = document.querySelector(".copy-email");
const copyFeedback = document.querySelector(".copy-feedback");
let copyTimeout;

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.email;

    try {
      await navigator.clipboard.writeText(email);
      showFeedback("Copied!");
    } catch (error) {
      showFeedback("Press Ctrl+C to copy");
    }
  });
}

function showFeedback(message) {
  copyFeedback.textContent = message;
  copyFeedback.classList.add("is-visible");

  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => {
    copyFeedback.classList.remove("is-visible");
  }, 2500);
}

// FOOTER

const yearSlot = document.querySelector("[data-year]");
if (yearSlot) yearSlot.textContent = new Date().getFullYear();
