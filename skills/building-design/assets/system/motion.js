// Motion primitives that need script. Each is marked with @motion <name>.

// @motion reveal-rise — adds .is-in once the element is 20% visible
(() => {
  const els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { threshold: 0.2 });
  els.forEach((el) => io.observe(el));
})();
