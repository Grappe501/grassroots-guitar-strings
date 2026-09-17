(function (global) {
  const LINKS = [
    { href: "/v5/", label: "Tonight" },
    { href: "/v5/#photos", label: "Photos" },
    { href: "/spots/", label: "SPOTS" },
    { href: "/prep/#lists", label: "Events" },
  ];

  function here(href) {
    const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    if (href.indexOf("#photos") >= 0) return path === "/v5" && location.hash === "#photos";
    if (href.indexOf("#lists") >= 0) return path === "/prep";
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
      ".crew-nav{display:flex;flex-wrap:wrap;gap:0;margin:0.7rem 0 0;border-bottom:1px solid rgba(255,255,255,0.18)}" +
      ".crew-nav a{border:0;border-radius:0;padding:0.55rem 0.75rem;background:transparent;color:#d5dbe6;font:inherit;font-weight:600;text-decoration:none;border-bottom:2px solid transparent}" +
      ".crew-nav a[aria-current=page]{color:#fff;border-bottom-color:#ca913d}" +
      ".top-actions .crew-nav{margin:0}" +
      ".v5-top .crew-nav a,.wifi-nav.crew-nav a,.bar .crew-nav a{background:transparent;color:#d5dbe6}" +
      "body.spot .crew-nav a,body.ops .crew-nav a{color:#c5cdd8}" +
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
