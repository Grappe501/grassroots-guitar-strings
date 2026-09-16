(function (global) {
  const LINKS = [
    { href: "/v5/", label: "Tonight" },
    { href: "/v5/#photos", label: "Photos" },
    { href: "/spots/", label: "SPOTS" },
    { href: "/volunteers/", label: "Lists" },
  ];

  function here(href) {
    const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    if (href.indexOf("#photos") >= 0) return path === "/v5" && location.hash === "#photos";
    const target = href.replace(/\/+$/, "") || "/";
    if (target === "/v5") return path === "/v5" && location.hash !== "#photos";
    return path === target || path.indexOf(target + "/") === 0;
  }

  function html() {
    return (
      '<nav class="crew-nav" aria-label="Crew">' +
      LINKS.map(function (link) {
        return (
          '<a href="' +
          link.href +
          '"' +
          (here(link.href) ? ' aria-current="page"' : "") +
          ">" +
          link.label +
          "</a>"
        );
      }).join("") +
      "</nav>"
    );
  }

  function ensureCss() {
    if (document.getElementById("crewNavCss")) return;
    const style = document.createElement("style");
    style.id = "crewNavCss";
    style.textContent =
      ".crew-nav{display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.75rem 0 0}" +
      ".crew-nav a{border:0;border-radius:999px;padding:0.45rem 0.8rem;background:#ca913d;color:#07074a;font:inherit;font-weight:800;text-decoration:none}" +
      ".crew-nav a[aria-current=page]{background:#fff;color:#000066}" +
      ".top-actions .crew-nav{margin:0}" +
      ".v5-top .crew-nav a,.wifi-nav.crew-nav a,.bar .crew-nav a{background:#ca913d;color:#07074a}" +
      "@media print{.crew-nav{display:none}}";
    document.head.appendChild(style);
  }

  function paint() {
    ensureCss();
    const markup = html();
    document.querySelectorAll("[data-crew-nav]").forEach(function (el) {
      el.innerHTML = markup;
    });
  }

  global.GGSCrewNav = { paint: paint, html: html };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})(window);
