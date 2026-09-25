// State registry for surfaces. Load before the surface's own scripts.
// A surface registers each non-default state with the code real use would run:
//   Preview.state("submit-error", () => showToast("error"));
// preview.html opens the surface with #state=<id>; the handler runs once the page has loaded.
(() => {
  const handlers = {};
  window.Preview = { state(id, run) { handlers[id] = run; } };

  const wanted = new URLSearchParams(location.hash.slice(1)).get("state");

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (window.parent !== window) {
        window.parent.postMessage({ type: "preview:states", states: ["default", ...Object.keys(handlers)] }, "*");
      }
      if (wanted && handlers[wanted]) handlers[wanted]();
    }, 0);
  });
})();
