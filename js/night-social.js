(function (global) {
  const VIBE_KEY = "ggs-vibe-v1";
  const VIBES = [
    { id: "here", label: "Here" },
    { id: "walk", label: "Walking" },
    { id: "break", label: "Break" },
    { id: "help", label: "Need a hand" },
    { id: "fire", label: "Crushing it" },
  ];
  const QUICK = [
    { text: "On my way", kind: "quick" },
    { text: "All good", kind: "quick" },
    { text: "Need a hand", kind: "quick" },
    { text: "🔥", kind: "quick" },
    { text: "🙌", kind: "quick" },
  ];

  function vibe() {
    const raw = String(localStorage.getItem(VIBE_KEY) || "here");
    return VIBES.some((v) => v.id === raw) ? raw : "here";
  }

  function vibeLabel(id) {
    const hit = VIBES.find((v) => v.id === id);
    return hit ? hit.label : "Here";
  }

  function who() {
    return String((global.GGSSignIn && global.GGSSignIn.identity().name) || "").trim();
  }

  function first(name) {
    return String(name || "").trim().split(/\s+/)[0] || name;
  }

  function paintBars() {
    document.querySelectorAll("[data-night-pulse]").forEach((root) => {
      const them = global.GGSRadioNight && global.GGSRadioNight.selectedName ? global.GGSRadioNight.selectedName() : "";
      root.innerHTML =
        '<p class="eyebrow">NIGHT PULSE</p>' +
        '<div class="night-vibes">' +
        VIBES.map((v) => {
          return (
            '<button type="button" class="night-chip' +
            (vibe() === v.id ? " is-on" : "") +
            '" data-vibe="' +
            v.id +
            '">' +
            v.label +
            "</button>"
          );
        }).join("") +
        "</div>" +
        '<div class="night-quick">' +
        QUICK.map((q) => {
          return '<button type="button" class="night-chip night-chip--send" data-quick="' + q.text + '">' + q.text + "</button>";
        }).join("") +
        (them
          ? '<button type="button" class="night-chip night-chip--gold" data-shout="1">Shout out ' + first(them) + "</button>"
          : "") +
        '<button type="button" class="night-chip night-chip--gold" data-hype="1">Hype the room</button>' +
        "</div>";
      root.querySelectorAll("[data-vibe]").forEach((btn) => {
        btn.addEventListener("click", function () {
          localStorage.setItem(VIBE_KEY, btn.dataset.vibe);
          if (global.GGSRadioNight && global.GGSRadioNight.touch) global.GGSRadioNight.touch();
          paintBars();
          if (navigator.vibrate) navigator.vibrate(10);
        });
      });
      root.querySelectorAll("[data-quick]").forEach((btn) => {
        btn.addEventListener("click", function () {
          sendChip(btn.dataset.quick, "quick");
        });
      });
      root.querySelectorAll("[data-shout]").forEach((btn) => {
        btn.addEventListener("click", shout);
      });
      root.querySelectorAll("[data-hype]").forEach((btn) => {
        btn.addEventListener("click", hype);
      });
    });
  }

  function sendChip(text, kind) {
    const feed = global.GGSRadioFeed;
    const name = who();
    if (!feed || !feed.pushLine) return;
    const result = feed.pushLine(name, text, kind);
    if (!result.ok && result.reason === "name") return;
    if (result.ok) {
      global.dispatchEvent(new CustomEvent("ggs-radio-sent"));
      const box = document.getElementById("radioFeed");
      if (box && feed.render) feed.render(box);
      if (navigator.vibrate) navigator.vibrate(12);
    }
  }

  function shout() {
    const them = global.GGSRadioNight && global.GGSRadioNight.selectedName ? global.GGSRadioNight.selectedName() : "";
    if (!them) return;
    sendChip("🙌 " + first(them) + " is crushing it", "shout");
  }

  function hype() {
    const store = global.GGSPrepStore;
    const name = who();
    if (!name || name.length < 2) return;
    if (store) store.saveDoc("hype", { by: name.slice(0, 40), at: Date.now(), id: Date.now().toString(36) });
    sendChip("just hyped the room", "hype");
    flash(name, true);
  }

  function flash(by, mine) {
    document.querySelectorAll(".night-hype-flash").forEach((n) => n.remove());
    const el = document.createElement("div");
    el.className = "night-hype-flash";
    el.innerHTML = "<p>" + (mine ? "You hyped the room" : first(by) + " hyped the room") + "</p>";
    document.body.appendChild(el);
    if (navigator.vibrate) navigator.vibrate(mine ? [12, 40, 12] : [20, 30, 20]);
    setTimeout(function () {
      el.remove();
    }, 1600);
  }

  function watchHype() {
    const store = global.GGSPrepStore;
    const doc = store ? store.readDoc("hype") : null;
    if (!doc || !doc.at) return;
    const seen = Number(sessionStorage.getItem("ggs-hype-seen") || 0);
    if (doc.at <= seen) return;
    sessionStorage.setItem("ggs-hype-seen", String(doc.at));
    if (Date.now() - doc.at > 8000) return;
    const me = who().toLowerCase();
    if (String(doc.by || "").toLowerCase() === me) return;
    flash(doc.by, false);
  }

  function mount() {
    if (!document.querySelector("[data-night-pulse]")) return;
    paintBars();
    watchHype();
    global.addEventListener("ggs-prep-loaded", function () {
      paintBars();
      watchHype();
    });
    global.addEventListener("ggs-radio-sent", paintBars);
    global.addEventListener("ggs-signed-in", paintBars);
  }

  global.GGSNightSocial = { vibe, vibeLabel, mount, paint: paintBars };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
