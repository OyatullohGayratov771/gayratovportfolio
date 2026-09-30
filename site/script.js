const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lets CSS hide .reveal sections only when this script is running to show them again
if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js");
}

document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

const closeNav = () => {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};

navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    closeNav();
    navToggle.focus();
  }
});

// Scroll progress bar
const progress = document.getElementById("progress");
if (progress) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = pct + "%";
  };
  document.addEventListener("scroll", () => requestAnimationFrame(updateProgress), { passive: true });
  updateProgress();
}

// Localized glow on spotlight-cards, tracked per card
if (!reduceMotion && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - rect.left + "px");
        card.style.setProperty("--my", e.clientY - rect.top + "px");
      },
      { passive: true }
    );
  });
}

// Fade-up reveal as sections enter the viewport
// (threshold 0 so sections taller than the viewport still trigger on phones)
if (document.documentElement.classList.contains("js")) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
