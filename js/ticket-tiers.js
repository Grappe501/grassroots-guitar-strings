(function () {
  const cfg = window.EVENT_CONFIG || {};
  const tiers = window.TICKET_TIERS || [];
  const root = document.querySelector("[data-ticket-tiers]");
  if (!root || tiers.length === 0) return;

  const ticketUrl = cfg.ticketUrl || "https://goodchange.app/donate/grass-ax";

  tiers.forEach((tier) => {
    const card = document.createElement("article");
    card.className = "ticket-tier" + (tier.featured ? " ticket-tier--featured" : "");
    card.innerHTML = `
      <div class="ticket-tier__head">
        <h3 class="ticket-tier__name">${tier.name}</h3>
        ${tier.available ? '<span class="ticket-tier__badge">Available</span>' : '<span class="ticket-tier__badge ticket-tier__badge--sold">Sold out</span>'}
      </div>
      <p class="ticket-tier__desc">${tier.description}</p>
      <p class="ticket-tier__price">${tier.priceLabel}${tier.price > 0 ? '<span class="ticket-tier__each"> each</span>' : ""}</p>
      <a class="btn ${tier.price === 0 ? "btn--gold" : "btn--primary"} ticket-tier__cta" href="${tier.ctaHref || (tier.price === 0 ? "/details/" : ticketUrl)}" data-track="${tier.track || (tier.price === 0 ? "youth_free_details_clicked" : "ticket_button_clicked")}">${tier.ctaLabel || (tier.price === 0 ? "Just show up — details" : "Select on GoodChange")}</a>
    `;
    root.appendChild(card);
  });
})();
