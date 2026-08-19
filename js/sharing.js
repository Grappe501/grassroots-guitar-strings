(function () {
  const cfg = window.EVENT_CONFIG || {};
  const ticket = cfg.ticketUrl || "https://goodchange.app/donate/grass-ax";
  const site = window.location.origin || "https://grassrootsguitarstrings.com";

  const templates = {
    sms:
      "David Adam Byrnes live in Sherwood Sep 17 — Grassroots & Guitar Strings. Concert, dinner, hometown night. Get tickets: " +
      ticket,
    emailSubject: "David Adam Byrnes Live in Sherwood — Sep 17",
    emailBody:
      "I wanted to invite you to see David Adam Byrnes live at Grassroots & Guitar Strings in Sherwood.\n\n" +
      "Thursday, September 17, 2026 · Sherwood Forest · 5:30 p.m.\n\n" +
      "Live country concert, dinner, and a Constitution Day gathering. Watch his videos first: " +
      site +
      "/music/\n\n" +
      "Tickets: " +
      ticket,
    facebook:
      "David Adam Byrnes live in Sherwood — Grassroots & Guitar Strings, Sep 17. Concert, dinner, hometown night. " +
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
