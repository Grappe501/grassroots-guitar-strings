(function () {
  const cfg = window.EVENT_CONFIG || {};
  const ticket = cfg.ticketUrl || "https://goodchange.app/donate/grass-ax";
  const site = window.location.origin || "https://grassrootsguitarstrings.com";

  const templates = {
    sms:
      "Come sit with us in Sherwood on Sep 17 — live music with David Adam Byrnes, dinner, and a hometown night with Kelly Grappe. Not a debate — just community. Tickets: " +
      ticket,
    emailSubject: "Grassroots & Guitar Strings — Sherwood Homecoming (Sep 17)",
    emailBody:
      "I wanted to personally invite you to Grassroots & Guitar Strings — a Sherwood homecoming with live country music (David Adam Byrnes), dinner, and a celebration of democracy with Kelly Grappe.\n\n" +
      "Thursday, September 17, 2026 · Sherwood Forest · 5:30 p.m.\n\n" +
      "This is meant to be fun — music, meal, neighbors. Not a night of partisan arguments.\n\n" +
      "Tickets: " +
      ticket +
      "\n\nLearn more: " +
      site,
    facebook:
      "Grassroots & Guitar Strings — Sherwood homecoming Sep 17. Live music with David Adam Byrnes, dinner, and a celebration of democracy. Come sit with us. " +
      site,
  };

  function copyText(text, btn) {
    navigator.clipboard?.writeText(text).then(
      () => {
        const prev = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = prev;
        }, 2000);
      },
      () => window.prompt("Copy this invitation:", text),
    );
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const key = btn.getAttribute("data-copy");
    const text = templates[key];
    if (!text) return;
    btn.addEventListener("click", () => copyText(text, btn));
  });

  const mail = document.querySelector("[data-mail-invite]");
  if (mail) {
    mail.href =
      "mailto:?subject=" +
      encodeURIComponent(templates.emailSubject) +
      "&body=" +
      encodeURIComponent(templates.emailBody);
  }

  const fb = document.querySelector("[data-share-facebook]");
  if (fb) {
    fb.href =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(site) +
      "&quote=" +
      encodeURIComponent(templates.facebook);
    fb.target = "_blank";
    fb.rel = "noopener noreferrer";
  }

  const smsBlock = document.getElementById("copy-sms");
  if (smsBlock) smsBlock.textContent = templates.sms;
})();
