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
      <p class="ticket-tier__price">${tier.priceLabel}<span class="ticket-tier__each"> each</span></p>
      <a class="btn btn--primary ticket-tier__cta" href="${ticketUrl}" data-track="ticket_button_clicked">Select on GoodChange</a>
    `;
    root.appendChild(card);
  });
})();
