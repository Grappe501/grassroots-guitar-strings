(function (global) {
  const FOLDER = "https://drive.google.com/drive/folders/15AkjlrF7QADo-bnJNX8knYoFcuJ-dJeF";
  const STEVE = "5016903824";
  const STEVE_SHOW = "501-690-3824";

  function smsHref() {
    return "sms:" + STEVE + "?&body=" + encodeURIComponent("Photo from Grassroots and Guitar Strings");
  }

  function canShareFiles() {
    try {
      return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File(["x"], "x.jpg", { type: "image/jpeg" })] }));
    } catch (err) {
      return typeof navigator.share === "function";
    }
  }

  function status(root, text) {
    const el = root.querySelector("[data-photo-status]");
    if (el) el.textContent = text;
  }

  async function shareFiles(root, files) {
    if (!files || !files.length) return;
    const list = Array.prototype.slice.call(files);
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: list })) {
        await navigator.share({
          files: list,
          title: "Grassroots & Guitar Strings",
          text: "Photo from tonight. Drop in the Drive folder or send to Steve.",
        });
        status(root, "Sent from your share sheet. Pick Drive or Messages.");
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") {
        status(root, "Share canceled. Try again, or text Steve.");
        return;
      }
    }
    global.open(FOLDER, "_blank", "noopener");
    status(root, "Folder is open. Tap + to add the photos. Or text Steve at " + STEVE_SHOW + ".");
  }

  function html() {
    return (
      '<p class="eyebrow">PHOTOS · EVERYONE</p>' +
      "<h2>Take pictures all night.</h2>" +
      "<p>Keep it fun and lively. Snap the room, the line, David, Kelly, a laugh. Then get the photo off your phone in one tap.</p>" +
      '<div class="night-photos__actions">' +
      '<label class="night-photos__add">Add photos<input type="file" accept="image/*" multiple data-photo-files></label>' +
      '<a class="night-photos__btn" href="' +
      smsHref() +
      '">Text Steve</a>' +
      '<a class="night-photos__btn night-photos__btn--ghost" href="' +
      FOLDER +
      '" target="_blank" rel="noopener">Open photo folder</a>' +
      "</div>" +
      '<p class="night-photos__hint" data-photo-status>Add photos opens your camera roll. Share to Drive or Messages. Or text ' +
      STEVE_SHOW +
      ".</p>"
    );
  }

  function ensureCss() {
    if (document.getElementById("nightPhotosCss")) return;
    const style = document.createElement("style");
    style.id = "nightPhotosCss";
    style.textContent =
      ".night-photos{background:#0a0a4a;border:1px solid #ca913d;border-radius:18px;padding:1rem 1rem 1.1rem;margin:0.75rem 0;color:#e7eef4}" +
      ".night-photos h2{margin:0.2rem 0 0.45rem;font-size:clamp(1.4rem,6vw,1.9rem);color:#fff}" +
      ".night-photos p{margin:0;font-weight:700;color:#dbe7ef}" +
      ".night-photos__actions{display:flex;flex-wrap:wrap;gap:0.45rem;margin:0.75rem 0 0.5rem}" +
      ".night-photos__add,.night-photos__btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;padding:0.7rem 1rem;background:#ca913d;color:#07074a;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}" +
      ".night-photos__add input{position:absolute;width:1px;height:1px;opacity:0}" +
      ".night-photos__btn--ghost{background:transparent;color:#ca913d;box-shadow:inset 0 0 0 2px #ca913d}" +
      ".night-photos__hint{color:#ca913d;font-size:0.92rem}" +
      "@media print{.night-photos{display:none}}";
    document.head.appendChild(style);
  }

  function bind(root) {
    const input = root.querySelector("[data-photo-files]");
    if (!input || input.dataset.bound) return;
    input.dataset.bound = "1";
    input.addEventListener("change", function () {
      shareFiles(root, input.files);
      input.value = "";
    });
  }

  function paint() {
    ensureCss();
    if (!document.querySelector("[data-night-photos]")) {
      const nav = document.querySelector("[data-crew-nav]");
      if (nav && nav.parentNode && !nav.closest(".bar") && !document.querySelector("article.sign")) {
        const box = document.createElement("article");
        box.setAttribute("data-night-photos", "");
        nav.parentNode.insertBefore(box, nav.nextSibling);
      }
    }
    document.querySelectorAll("[data-night-photos]").forEach(function (el) {
      if (!el.dataset.ready) {
        el.classList.add("night-photos");
        el.innerHTML = html();
        el.dataset.ready = "1";
      }
      bind(el);
    });
  }

  global.GGSNightPhotos = { FOLDER: FOLDER, STEVE: STEVE_SHOW, paint: paint, canShareFiles: canShareFiles };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})(window);
