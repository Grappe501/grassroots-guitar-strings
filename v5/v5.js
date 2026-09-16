(function () {
  const store = window.GGSPrepStore;
  const slice = window.GGSCrewSlice;
  const leads = window.GGSSiteLeads;
  const sections = window.GGS_PREP_SECTIONS || [];
  const PREFS = "ggs-prep-v3-prefs";
  let tab = "now";
  let openSec = "";

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function prefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS) || "{}");
    } catch (err) {
      return {};
    }
  }

  function meName() {
    if (window.GGSSignIn) return window.GGSSignIn.identity().name;
    return String(prefs().me || "").trim();
  }

  function state() {
    return store ? store.readCache() : {};
  }

  function roster() {
    return (store && store.readDoc("volunteers")) || { setup: [], event: [], strike: [] };
  }

  function packFor(name) {
    return slice.sliceFor(name, state(), roster(), sections);
  }

  function roleOpen(roles) {
    const rows = slice.harvest(state(), sections);
    return rows.filter((row) => {
      if (row.done) return false;
      return (roles || []).some((role) => role.test.test(row.text || "") || role.test.test(row.sectionTitle || ""));
    });
  }

  function toggle(key, name) {
    if (!store) return;
    const current = state()[key] || {};
    store.saveOne(key, {
      owner: current.owner || name,
      when: current.when || "",
      done: !current.done,
      extra: current.extra || "",
    });
    if (navigator.vibrate) navigator.vibrate(12);
    render();
  }

  function jobBtn(row, name) {
    return (
      '<button type="button" class="v5-job' +
      (row.done ? " is-done" : "") +
      '" data-key="' +
      esc(row.key) +
      '"><b>' +
      esc(row.text) +
      "</b><span>" +
      esc(row.sectionTitle || row.card || "") +
      (row.owner && row.owner !== name ? " · " + esc(row.owner) : "") +
      "</span><em>" +
      (row.done ? "Done" : "Mark done") +
      "</em></button>"
    );
  }

  function bindJobs(root, name) {
    if (!root) return;
    root.querySelectorAll("[data-key]").forEach((btn) => {
      btn.addEventListener("click", function () {
        toggle(btn.dataset.key, name);
      });
    });
  }

  function setTab(next) {
    tab = next;
    document.querySelectorAll(".v5-tab").forEach((el) => {
      el.hidden = el.id !== "tab" + next.charAt(0).toUpperCase() + next.slice(1);
    });
    document.getElementById("tabNow").hidden = next !== "now";
    document.getElementById("tabJobs").hidden = next !== "jobs";
    document.getElementById("tabRadio").hidden = next !== "radio";
    document.getElementById("tabBoard").hidden = next !== "board";
    document.querySelectorAll(".v5-nav [data-tab]").forEach((btn) => {
      btn.classList.toggle("is-on", btn.dataset.tab === next);
    });
    if (next === "radio" && window.GGSRadioFeed) {
      const feed = document.getElementById("radioFeed");
      if (feed) window.GGSRadioFeed.render(feed);
    }
  }

  function renderBrief(name) {
    const card = document.getElementById("briefCard");
    if (!card || !window.GGSLeadDuties) return;
    const brief = window.GGSLeadDuties.briefing(name);
    document.getElementById("briefKicker").textContent = brief.kicker;
    document.getElementById("briefTitle").textContent = brief.title;
    document.getElementById("briefNext").textContent = brief.next;
    const list = document.getElementById("briefDuties");
    list.innerHTML = (brief.duties || []).map((d) => "<li>" + esc(d) + "</li>").join("");
  }

  function renderNow(name, pack, roles, lead) {
    const cue = slice.cueAt(roles, new Date());
    const card = document.getElementById("nowCard");
    card.classList.toggle("is-strike", !!cue.strike);
    document.getElementById("nowKicker").textContent = cue.strike ? "STRIKE" : cue.waiting ? "Be here first" : "You should be";
    document.getElementById("nowPlace").textContent = cue.place;
    document.getElementById("nowDo").textContent = cue.do;
    document.getElementById("nowNext").textContent = cue.empty ? "When your name is on a job, this fills in." : "Hard stop 10:00 PM";
    const leadBox = document.getElementById("leadNext");
    leadBox.hidden = !lead;
    if (lead && window.GGSNextAction) window.GGSNextAction.paint(state(), roster());
    const mine = pack.mine.filter((row) => !row.done).slice(0, 3);
    const command = lead || leads.isCaptain(roles) ? roleOpen(roles).filter((row) => !pack.mine.some((m) => m.key === row.key)).slice(0, 3) : [];
    const box = document.getElementById("nowJobs");
    const rows = mine.concat(command);
    box.innerHTML = rows.length
      ? rows.map((row) => jobBtn(row, name)).join("")
      : '<p class="v5-meta">Nothing open on your name right now.</p>';
    bindJobs(box, name);
  }

  function renderJobs(name, pack, roles) {
    const mine = pack.mine;
    const extras = roleOpen(roles).filter((row) => !mine.some((m) => m.key === row.key));
    const captain = leads.isCaptain(roles) || leads.isLead(name);
    document.getElementById("jobsKicker").textContent = captain ? "YOUR COMMAND" : "YOUR JOBS";
    document.getElementById("jobsTitle").textContent = captain
      ? "Your list plus open work in your lane. Tap done. It updates every phone."
      : "Only jobs with your name. Tap done. It updates every phone.";
    const list = document.getElementById("jobsList");
    const open = mine.filter((row) => !row.done);
    const done = mine.filter((row) => row.done);
    const gap = captain ? extras.filter((row) => !String(row.owner || "").trim()) : [];
    const owned = captain ? extras.filter((row) => String(row.owner || "").trim()) : [];
    let html = "";
    if (open.length) html += "<p class='eyebrow'>ASSIGNED TO YOU</p>" + open.map((row) => jobBtn(row, name)).join("");
    if (gap.length) html += "<p class='eyebrow'>STILL NEED A NAME</p>" + gap.slice(0, 20).map((row) => jobBtn(row, name)).join("");
    if (owned.length) html += "<p class='eyebrow'>IN YOUR LANE</p>" + owned.slice(0, 20).map((row) => jobBtn(row, name)).join("");
    if (done.length) html += "<p class='eyebrow'>DONE</p>" + done.slice(0, 8).map((row) => jobBtn(row, name)).join("");
    if (!html) html = '<p class="v5-meta">Nothing on this phone yet. A lead can put your name on a job.</p>';
    list.innerHTML = html;
    bindJobs(list, name);
  }

  function renderBoard(name) {
    const board = document.getElementById("boardList");
    if (!leads.isLead(name)) {
      board.innerHTML = "";
      return;
    }
    if (window.GGSNextAction) window.GGSNextAction.paint(state(), roster());
    const rows = slice.harvest(state(), sections);
    const groups = {};
    rows.forEach((row) => {
      const id = row.section || "other";
      if (!groups[id]) groups[id] = { title: row.sectionTitle || id, rows: [] };
      groups[id].rows.push(row);
    });
    const order = ["overview", "ben", "setup", "volunteers", "tickets", "campaign", "food", "production", "breakdown", "final"];
    board.innerHTML = order
      .filter((id) => groups[id])
      .map((id) => {
        const g = groups[id];
        const open = g.rows.filter((row) => !row.done);
        const gaps = open.filter((row) => !String(row.owner || "").trim()).length;
        const on = openSec === id;
        return (
          '<article class="v5-sec"><button type="button" class="v5-sec-head" data-sec="' +
          id +
          '"><strong>' +
          esc(g.title) +
          "</strong><span>" +
          open.length +
          " open · " +
          gaps +
          " need a name</span></button>" +
          (on ? open.slice(0, 30).map((row) => jobBtn(row, name)).join("") : "") +
          "</article>"
        );
      })
      .join("");
    board.querySelectorAll("[data-sec]").forEach((btn) => {
      btn.addEventListener("click", function () {
        openSec = openSec === btn.dataset.sec ? "" : btn.dataset.sec;
        renderBoard(name);
      });
    });
    bindJobs(board, name);
  }

  function render() {
    if (window.GGSSignIn && !window.GGSSignIn.identity().ok) return;
    const name = meName();
    if (!name) return;
    const pack = packFor(name);
    const roles = leads.rolesFor(name, pack);
    const lead = leads.isLead(name);
    document.getElementById("v5Who").textContent = name;
    const brief = window.GGSLeadDuties ? window.GGSLeadDuties.briefing(name) : null;
    document.getElementById("v5Kicker").textContent = brief && brief.kicker ? brief.kicker : lead ? "SITE LEAD" : leads.isCaptain(roles) ? "CAPTAIN" : "YOUR NIGHT";
    document.getElementById("v5Role").textContent = brief && brief.job
      ? brief.job.title + " · " + brief.job.arrival
      : roles.length
        ? roles.map((r) => r.label).join(" · ")
        : lead
          ? "Day-of lead. Claim a seat on the 10-job list."
          : "Your jobs only";
    const boardBtn = document.getElementById("boardTab");
    boardBtn.hidden = !lead;
    document.querySelector(".v5-nav").dataset.cols = lead ? "4" : "3";
    if (!lead && tab === "board") setTab("now");
    renderBrief(name);
    renderNow(name, pack, roles, lead);
    renderJobs(name, pack, roles);
    renderBoard(name);
  }

  document.querySelectorAll(".v5-nav [data-tab]").forEach((btn) => {
    btn.addEventListener("click", function () {
      setTab(btn.dataset.tab);
    });
  });

  if (window.GGSRadioFeed) {
    window.GGSRadioFeed.mount({
      feed: "#radioFeed",
      input: "#radioInput",
      send: "#radioSend",
      getName: meName,
    });
  }

  window.addEventListener("ggs-signed-in", render);
  window.addEventListener("ggs-prep-loaded", render);
  window.addEventListener("ggs-prep-status", function (e) {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    el.textContent =
      e.detail === "saving"
        ? "Saved to every phone…"
        : e.detail === "offline"
          ? "Offline — this phone only until it reconnects."
          : "Live on every phone.";
  });
  const who = String(new URLSearchParams(location.search).get("who") || "").trim();
  if (who && window.GGSSignIn && !window.GGSSignIn.identity().ok) {
    try {
      const raw = JSON.parse(localStorage.getItem(PREFS) || "{}");
      raw.me = who;
      localStorage.setItem(PREFS, JSON.stringify(raw));
    } catch (err) {
      /* keep */
    }
    const gate = document.getElementById("gateName");
    if (gate) gate.value = who;
  }
  if (window.GGSSignIn) window.GGSSignIn.applyLock();
  render();
  setInterval(render, 20000);
  if (store) store.startSync();
})();
