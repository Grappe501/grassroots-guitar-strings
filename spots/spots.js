(function () {
  const store = window.GGSPrepStore;
  const spots = window.GGSDaySpots;
  const people = window.GGSPeople;

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function hm(t) {
    const p = String(t || "").split(":");
    const h = Number(p[0]);
    const m = p[1] || "00";
    if (!Number.isFinite(h)) return t;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return h12 + ":" + m + " " + ampm;
  }

  function todayAt(t) {
    const p = String(t || "").split(":");
    const d = new Date();
    d.setSeconds(0, 0);
    d.setHours(Number(p[0]) || 0, Number(p[1]) || 0, 0, 0);
    return d;
  }

  function kindLabel(kind) {
    return (
      {
        arrive: "Arrive",
        work: "Do this",
        eat: "Eat",
        sit: "Sit",
        show: "Show",
        strike: "Strike",
        leave: "You may leave",
        done: "Done",
      }[kind] || kind
    );
  }

  function nowBlock(clock) {
    const now = new Date();
    let current = clock[0];
    let next = clock[1] || null;
    clock.forEach((block, i) => {
      if (now >= todayAt(block.t)) {
        current = block;
        next = clock[i + 1] || null;
      }
    });
    return { current: current, next: next };
  }

  function renderHub() {
    const root = document.getElementById("spotHub");
    if (!root || !spots) return;
    const map = spots.hydrateFromRoster(store);
    root.innerHTML = spots.SPOTS.map((spot) => {
      const who = map[spot.id] || "";
      return (
        '<article class="spot-card"><p class="eyebrow">' +
        spot.n +
        " · " +
        esc(spot.short) +
        '</p><h2><a href="/spots/' +
        spot.id +
        '/">' +
        esc(spot.title) +
        "</a></h2><p>Arrive " +
        esc(spot.arrive) +
        "</p><p>Eat — " +
        esc(spot.eat) +
        "</p><p>Sit — " +
        esc(spot.sit) +
        "</p>" +
        (people
          ? people.leadSelectHtml(who, {
              className: "spot-owner",
              attrs: 'data-spot="' + spot.id + '"',
              blank: "Name tomorrow",
            })
          : "") +
        '<a class="spot-go" href="/spots/' +
        spot.id +
        '/">Open this phone page</a></article>'
      );
    }).join("");
    root.querySelectorAll(".spot-owner").forEach((sel) => {
      sel.addEventListener("change", function () {
        spots.saveOwner(store, sel.dataset.spot, sel.value);
      });
    });
  }

  function renderPage() {
    const id = document.body.getAttribute("data-spot");
    const spot = spots && spots.byId(id);
    if (!spot) return;
    const map = spots.hydrateFromRoster(store);
    const who = map[spot.id] || "";
    const live = nowBlock(spot.clock);
    const whoEl = document.getElementById("spotWho");
    const pick = document.getElementById("spotPick");
    document.title = spot.title + " — Thursday clock";
    document.getElementById("spotKicker").textContent = "SPOT " + spot.n + " OF " + spots.SPOTS.length + " · " + spot.short.toUpperCase();
    document.getElementById("spotTitle").textContent = spot.title;
    document.getElementById("spotWhy").textContent = spot.why;
    document.getElementById("spotArrive").textContent = spot.arrive;
    document.getElementById("spotEat").textContent = spot.eat;
    document.getElementById("spotSit").textContent = spot.sit;
    document.getElementById("spotWear").textContent = spots.WEAR;
    document.getElementById("spotShows").textContent = spots.SHOWS.dinner + " · " + spots.SHOWS.concert;
    const socialEl = document.getElementById("spotSocial");
    if (socialEl) socialEl.textContent = spots.SOCIAL;
    if (pick && people) {
      pick.innerHTML = people.leadSelectHtml(who, {
        className: "spot-owner",
        attrs: 'id="spotOwner"',
        blank: "Name tomorrow",
      });
      const sel = pick.querySelector("select");
      sel.addEventListener("change", function () {
        spots.saveOwner(store, spot.id, sel.value);
        whoEl.textContent = sel.value ? sel.value + " — this is your page." : "Name goes here tomorrow.";
      });
    }
    whoEl.textContent = who ? who + " — this is your page." : "Name goes here tomorrow.";
    paintNow(spot, live);
  }

  function paintNow(spot, live) {
    const nowEl = document.getElementById("spotNow");
    const list = document.getElementById("spotClock");
    if (!nowEl || !list) return;
    nowEl.innerHTML =
      '<p class="eyebrow">' +
      kindLabel(live.current.kind).toUpperCase() +
      " · " +
      hm(live.current.t) +
      "</p><h2>" +
      esc(live.current.text) +
      "</h2>" +
      (live.next
        ? "<p>Next · " + hm(live.next.t) + " — " + esc(live.next.text) + "</p>"
        : "<p>That is the last line on this page.</p>");
    nowEl.className = "spot-now is-" + live.current.kind;
    list.innerHTML = spot.clock
      .map((block) => {
        const on = live.current === block;
        return (
          '<li class="spot-line is-' +
          block.kind +
          (on ? " is-now" : "") +
          '"><b>' +
          hm(block.t) +
          '</b><em>' +
          esc(kindLabel(block.kind)) +
          "</em><span>" +
          esc(block.text) +
          "</span></li>"
        );
      })
      .join("");
    const line = list.querySelector(".is-now");
    if (line && !window.__spotDidScroll) {
      window.__spotDidScroll = true;
      line.scrollIntoView({ block: "center" });
    }
  }

  function start() {
    if (store && store.isPicking && store.isPicking()) return;
    if (store && store.startSync) store.startSync();
    if (document.getElementById("spotHub")) renderHub();
    if (document.body.getAttribute("data-spot")) renderPage();
  }

  window.addEventListener("ggs-prep-loaded", start);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  setInterval(function () {
    const id = document.body.getAttribute("data-spot");
    const spot = spots && spots.byId(id);
    if (!spot) return;
    paintNow(spot, nowBlock(spot.clock));
  }, 30000);
})();
