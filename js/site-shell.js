(function () {
  const cfg = window.EVENT_CONFIG;
  const navLinks = window.NAV_LINKS || [];
  const joinLinks = window.JOIN_LINKS || [];
  const path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";

  function isActive(href) {
    const norm = href.replace(/\/$/, "") || "/";
    const here = path === "" ? "/" : path;
    return norm === here || (norm !== "/" && here.startsWith(norm));
  }

  function headerHtml() {
    const navItems = navLinks
      .map(
        (l) =>
          `<a href="${l.href}" class="${isActive(l.href) ? "is-active" : ""}">${l.label}</a>`,
      )
      .join("");
    const joinItems = joinLinks.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");
    const mobileNav = [...navLinks, ...joinLinks]
      .map((l) => `<a href="${l.href}">${l.label}</a>`)
      .join("");

    const logo = cfg.brandLogo
      ? `<img class="brand-lockup__logo" src="${cfg.brandLogo}" alt="${cfg.brandLogoAlt || cfg.featuredArtist}" />`
      : "";

    return `
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand-lockup" href="/">
      ${logo}
      <span class="brand-lockup__meta">
        <span class="brand-lockup__title">${cfg.name}</span>
        <span class="brand-lockup__presented">${cfg.featuredArtist} · ${cfg.dateShort} · ${cfg.city}</span>
      </span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      ${navItems}
      <details class="site-nav__join">
        <summary>Join Us</summary>
        <div class="site-nav__join-panel">${joinItems}</div>
      </details>
    </nav>
    <div class="header-utils" aria-label="Related sites">
      <a href="${cfg.davidUrl}" target="_blank" rel="noopener noreferrer">DavidAdamByrnes.com<span class="sr-only"> (opens in new tab)</span></a>
      <a href="${cfg.kellyUrl}" target="_blank" rel="noopener noreferrer">KellyGrappe.com<span class="sr-only"> (opens in new tab)</span></a>
    </div>
    <a class="header-cta" href="${cfg.ticketUrl}" data-track="ticket_button_clicked">Get Tickets</a>
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-drawer">Menu</button>
  </div>
  <div class="container mobile-drawer" id="mobile-drawer" hidden>${mobileNav}</div>
</header>`;
  }

  function footerHtml() {
    return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <img class="footer-logo" src="${cfg.brandLogo}" alt="${cfg.featuredArtist}" loading="lazy" />
      <p class="muted" style="color:#c5d4e4;margin:.75rem 0 0">${cfg.subtitle} · ${cfg.date}</p>
      <p style="margin:.5rem 0 0">${cfg.venueName}, ${cfg.city}, ${cfg.state}</p>
    </div>
    <div>
      <h3 style="color:#fff;font-size:.95rem">Explore</h3>
      <p><a href="/david/">The Artist</a></p>
      <p><a href="/music/">Music &amp; Videos</a></p>
      <p><a href="/tickets/">Tickets</a></p>
      <p><a href="/details/">Event Details</a></p>
    </div>
    <div>
      <h3 style="color:#fff;font-size:.95rem">Official links</h3>
      <p><a href="${cfg.davidUrl}" target="_blank" rel="noopener noreferrer">David Adam Byrnes</a></p>
      <p><a href="${cfg.ticketUrl}" data-track="ticket_button_clicked">Tickets &amp; Contributions</a></p>
      <p><a href="${cfg.campaignEventUrl}">Campaign calendar listing</a></p>
      <p><a href="${cfg.kellyUrl}" target="_blank" rel="noopener noreferrer">Kelly Grappe for Secretary of State</a></p>
    </div>
  </div>
  <div class="container footer-disclaimer">
    <strong>${cfg.disclaimer}</strong>
    <p class="footer-legal">Contributions are subject to Arkansas law. Business and corporate contributions cannot be accepted.</p>
    <div class="footer-links">
      <a href="/contribution-information/">Contribution Information</a>
      <a href="/privacy/">Privacy</a>
      <a href="/accessibility/">Accessibility</a>
      <a href="mailto:${cfg.contactEmail || "info@kellygrappe.com"}">Contact</a>
    </div>
  </div>
</footer>
<div class="mobile-sticky-cta" aria-label="Quick actions">
  <a href="${cfg.ticketUrl}" data-track="ticket_button_clicked">Get Tickets</a>
  <a href="/music/">Watch Videos</a>
</div>`;
  }

  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = headerHtml();
  if (footerEl) footerEl.innerHTML = footerHtml();

  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      drawer.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      const name = el.getAttribute("data-track");
      if (typeof window.gtag === "function") window.gtag("event", name);
    });
  });
})();
