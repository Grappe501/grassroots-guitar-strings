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
      '<p class="eyebrow">Photos</p>' +
      "<h2>Upload pictures</h2>" +
      "<p>Capture the room, the line, the set, and guests. Send files from this page.</p>" +
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
      ".night-photos{background:#141824;border:1px solid #2a3142;border-radius:4px;padding:0.95rem 1rem;margin:0.75rem 0;color:#e8ecf2}" +
      "body.spot .night-photos{background:#fff;border-color:#d5dae3;color:#151821}" +
      ".night-photos h2{margin:0.15rem 0 0.4rem;font-size:1.15rem;font-weight:650;color:inherit}" +
      ".night-photos p{margin:0;font-weight:500;color:inherit}" +
      ".night-photos__actions{display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.7rem 0 0.45rem}" +
      ".night-photos__add,.night-photos__btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:4px;padding:0.5rem 0.8rem;background:#000066;color:#fff;font:inherit;font-weight:600;text-decoration:none;cursor:pointer}" +
      ".night-photos__add input{position:absolute;width:1px;height:1px;opacity:0}" +
      ".night-photos__btn--ghost{background:transparent;color:#000066;box-shadow:inset 0 0 0 1px #000066}" +
      "body.v5 .night-photos__btn--ghost{color:#ca913d;box-shadow:inset 0 0 0 1px #ca913d}" +
      ".night-photos__hint{color:#5a6170;font-size:0.88rem}" +
      "body.v5 .night-photos__hint{color:#ca913d}" +
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
