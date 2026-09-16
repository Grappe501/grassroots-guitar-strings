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
    const raw = window.GGSSignIn ? window.GGSSignIn.identity().name : String(prefs().me || "").trim();
    const person = window.GGSPeople && (window.GGSPeople.uniquePerson(raw) || window.GGSPeople.findPerson(raw));
    return person ? person.name : raw;
  }

  function clockNow() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    if (y + "-" + m + "-" + d === "2026-09-17") return now;
    const mapped = new Date("2026-09-17T00:00:00");
    mapped.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return mapped;
  }

  function hm(t) {
    const p = String(t || "").split(":");
    const h = Number(p[0]);
    const m = p[1] || "00";
    if (!Number.isFinite(h)) return t;
    return (h % 12 || 12) + ":" + m + " " + (h >= 12 ? "PM" : "AM");
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
        leave: "Leave",
        done: "Done",
      }[kind] || kind
    );
  }

  function atTime(t, now) {
    const p = String(t || "").split(":");
    const d = new Date(now.getTime());
    d.setSeconds(0, 0);
    d.setHours(Number(p[0]) || 0, Number(p[1]) || 0, 0, 0);
    return d;
  }

  function clockIndex(clock) {
    const now = clockNow();
    let idx = 0;
    (clock || []).forEach(function (row, i) {
      if (now >= atTime(row.t, now)) idx = i;
    });
    return idx;
  }

  function spotCue(name) {
    const spot = spotFor(name);
    if (!spot || !spot.clock || !spot.clock.length) return null;
    const now = clockNow();
    const i = clockIndex(spot.clock);
    const current = spot.clock[i];
    const next = spot.clock[i + 1] || null;
    return {
      place: spot.title,
      do: current.text,
      next: next ? next.text : "",
      strike: current.kind === "strike",
      waiting: now < atTime(spot.clock[0].t, now),
      empty: false,
      spot: spot,
    };
  }

  function state() {
    return store ? store.readCache() : {};
  }

  function roster() {
    return (store && store.readDoc("volunteers")) || { setup: [], event: [], strike: [] };
  }

  function packFor(name) {
    if (!slice || !slice.sliceFor) return { mine: [], rosterHits: [], roles: [] };
    try {
      return slice.sliceFor(name, state(), roster(), sections);
    } catch (err) {
      return { mine: [], rosterHits: [], roles: [] };
    }
  }

  function seatFor(name) {
    if (window.GGSLeadDuties && window.GGSLeadDuties.jobFor) {
      const job = window.GGSLeadDuties.jobFor(name);
      if (job) return job;
    }
    const jobs = (window.GGSPeople && window.GGSPeople.JOBS) || [];
    const match = window.GGSPeople && window.GGSPeople.match;
    return (
      jobs.find(function (job) {
        return job.defaultOwner && match && match(job.defaultOwner, name);
      }) || null
    );
  }

  function spotFor(name) {
    const named = window.GGSDaySpots && window.GGSDaySpots.spotForName(name);
    if (named) return named;
    const job = seatFor(name);
    if (job && window.GGSDaySpots) {
      return window.GGSDaySpots.SPOTS.find(function (spot) {
        return spot.leadJob === job.id;
      }) || null;
    }
    return null;
  }

  function paintSeat(name) {
    const job = seatFor(name);
    const brief = window.GGSLeadDuties ? window.GGSLeadDuties.briefing(name) : null;
    const seatEl = document.getElementById("v5Seat");
    const whoEl = document.getElementById("v5Who");
    const kickerEl = document.getElementById("v5Kicker");
    const roleEl = document.getElementById("v5Role");
    if (whoEl) whoEl.textContent = name || "";
    if (job) {
      if (kickerEl) kickerEl.textContent = "YOUR SEAT";
      if (seatEl) seatEl.textContent = job.title;
      if (roleEl) roleEl.textContent = "Arrive " + job.arrival + ". " + job.owns;
      return job;
    }
    if (kickerEl) kickerEl.textContent = brief && brief.kicker ? brief.kicker : "YOUR NIGHT";
    if (seatEl) seatEl.textContent = brief && brief.title ? brief.title : "Your job";
    if (roleEl) roleEl.textContent = brief && brief.next ? brief.next : "";
    return null;
  }

  function roleOpen(roles) {
    if (!slice || !slice.harvest) return [];
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
    const pick = window.GGSPeople
      ? window.GGSPeople.leadSelectHtml(row.owner || "", {
          className: "v5-owner",
          attrs: 'data-own="' + esc(row.key) + '"',
          includeVenue: true,
        })
      : "";
    return (
      '<div class="v5-job-wrap"><button type="button" class="v5-job' +
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
      "</em></button>" +
      pick +
      "</div>"
    );
  }

  function bindJobs(root, name) {
    if (!root) return;
    root.querySelectorAll("[data-key]").forEach((btn) => {
      btn.addEventListener("click", function () {
        toggle(btn.dataset.key, name);
      });
    });
    root.querySelectorAll("[data-own]").forEach((sel) => {
      sel.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      sel.addEventListener("change", function (e) {
        e.stopPropagation();
        if (!store) return;
        const current = state()[sel.dataset.own] || {};
        store.saveOne(sel.dataset.own, {
          owner: sel.value,
          when: current.when || "",
          done: !!current.done,
          extra: current.extra || "",
        });
        render();
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
    if (next === "jobs") {
      const line = document.querySelector("#jobsClock .is-now");
      if (line) line.scrollIntoView({ block: "center" });
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
    const social = window.GGSDaySpots && window.GGSDaySpots.SOCIAL;
    const duties = (brief.duties || []).slice();
    if (social && !duties.some((d) => /#GrappeSOS/.test(d))) duties.push(social);
    list.innerHTML = duties.map((d) => "<li>" + esc(d) + "</li>").join("");
    const day = window.GGSDaySpots && window.GGSDaySpots.spotForName(name);
    let link = card.querySelector("[data-day-spot]");
    if (!link) {
      link = document.createElement("a");
      link.className = "v5-link";
      link.setAttribute("data-day-spot", "1");
      card.appendChild(link);
    }
    if (day) {
      link.hidden = false;
      link.href = "/spots/" + day.id + "/";
      link.textContent = "Your minute-by-minute day";
    } else {
      link.hidden = false;
      link.href = "/spots/";
      link.textContent = "The 17 phone pages";
    }
  }

  function renderNow(name, pack, roles, lead) {
    const fromSpot = spotCue(name);
    const cue =
      fromSpot ||
      (slice && slice.cueAt
        ? slice.cueAt(roles, clockNow())
        : { place: "Stand by", do: "Your jobs are on this page.", next: null, empty: true });
    const card = document.getElementById("nowCard");
    card.classList.toggle("is-strike", !!cue.strike);
    document.getElementById("nowKicker").textContent = cue.strike ? "STRIKE" : cue.waiting ? "Be here first" : "You should be";
    document.getElementById("nowPlace").textContent = cue.place;
    document.getElementById("nowDo").textContent = cue.do;
    document.getElementById("nowNext").textContent = cue.empty
      ? "When your name is on a job, this fills in."
      : cue.next
        ? "Next — " + cue.next
        : "Hard stop 10:00 PM";
    const leadBox = document.getElementById("leadNext");
    leadBox.hidden = !lead;
    if (lead && window.GGSNextAction) window.GGSNextAction.paint(state(), roster());
    const mine = pack.mine.filter((row) => !row.done).slice(0, 3);
    const command =
      lead || (leads && leads.isCaptain && leads.isCaptain(roles))
        ? roleOpen(roles).filter((row) => !pack.mine.some((m) => m.key === row.key)).slice(0, 3)
        : [];
    const box = document.getElementById("nowJobs");
    const rows = mine.concat(command);
    box.innerHTML = rows.length
      ? rows.map((row) => jobBtn(row, name)).join("")
      : '<p class="v5-meta">Nothing open on your name right now.</p>';
    bindJobs(box, name);
  }

  function paintDayClock(spot) {
    const root = document.getElementById("jobsClock");
    if (!root || !spot || !spot.clock) return;
    const idx = clockIndex(spot.clock);
    if (root.dataset.spot !== spot.id || root.children.length !== spot.clock.length) {
      root.dataset.spot = spot.id;
      root.innerHTML = spot.clock
        .map(function (block) {
          return (
            '<li class="is-' +
            esc(block.kind) +
            '"><b>' +
            esc(hm(block.t)) +
            "</b><em>" +
            esc(kindLabel(block.kind)) +
            "</em><span>" +
            esc(block.text) +
            "</span></li>"
          );
        })
        .join("");
    }
    Array.prototype.forEach.call(root.children, function (li, i) {
      li.classList.toggle("is-now", i === idx);
      li.classList.toggle("is-past", i < idx);
    });
  }

  function renderJobs(name, pack, roles) {
    const spot = spotFor(name);
    const mine = pack.mine;
    const extras = slice ? roleOpen(roles).filter((row) => !mine.some((m) => m.key === row.key)) : [];
    const captain = !!(seatFor(name) || (leads && ((leads.isCaptain && leads.isCaptain(roles)) || (leads.isLead && leads.isLead(name)))));
    const facts = document.getElementById("jobsFacts");
    const clockEl = document.getElementById("jobsClock");
    if (spot && spot.clock && spot.clock.length) {
      document.getElementById("jobsKicker").textContent = "YOUR DAY · " + String(spot.title || "").toUpperCase();
      document.getElementById("jobsTitle").textContent = "Minute by minute. Gold row is now.";
      facts.hidden = false;
      facts.textContent = "Arrive " + spot.arrive + " · Eat — " + spot.eat + " · Sit — " + spot.sit;
      paintDayClock(spot);
    } else {
      document.getElementById("jobsKicker").textContent = captain ? "YOUR COMMAND" : "YOUR JOBS";
      document.getElementById("jobsTitle").textContent = captain
        ? "Your list plus open work in your lane. Tap done. It updates every phone."
        : "Only jobs with your name. Tap done. It updates every phone.";
      facts.hidden = true;
      facts.textContent = "";
      clockEl.innerHTML = "";
      clockEl.removeAttribute("data-spot");
    }
    const list = document.getElementById("jobsList");
    const open = mine.filter((row) => !row.done);
    const done = mine.filter((row) => row.done);
    const gap = captain ? extras.filter((row) => !String(row.owner || "").trim()) : [];
    const owned = captain ? extras.filter((row) => String(row.owner || "").trim()) : [];
    let html = "";
    if (open.length) html += "<p class='eyebrow'>BOARD CHECKS ON YOU</p>" + open.map((row) => jobBtn(row, name)).join("");
    if (gap.length) html += "<p class='eyebrow'>STILL NEED A NAME</p>" + gap.slice(0, 12).map((row) => jobBtn(row, name)).join("");
    if (owned.length) html += "<p class='eyebrow'>IN YOUR LANE</p>" + owned.slice(0, 12).map((row) => jobBtn(row, name)).join("");
    if (done.length) html += "<p class='eyebrow'>DONE</p>" + done.slice(0, 8).map((row) => jobBtn(row, name)).join("");
    if (!html && !spot) html = '<p class="v5-meta">Nothing on this phone yet. A lead can put your name on a job.</p>';
    list.innerHTML = html;
    bindJobs(list, name);
  }

  function renderBoard(name) {
    const board = document.getElementById("boardList");
    if (!leads || !leads.isLead(name)) {
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
    try {
      if (window.GGSSignIn) window.GGSSignIn.applyLock();
      const name = meName();
      if (!name) return;
      if (window.GGSLeadDuties && window.GGSLeadDuties.seedDefaults) {
        try {
          window.GGSLeadDuties.seedDefaults();
        } catch (err) {
          /* keep the seat even if the shared board is late */
        }
      }
      const job = paintSeat(name);
      const pack = packFor(name);
      const roles = leads && leads.rolesFor ? leads.rolesFor(name, pack) : [];
      const lead = !!(job || (leads && leads.isLead && leads.isLead(name)));
      const boardBtn = document.getElementById("boardTab");
      if (boardBtn) boardBtn.hidden = !lead;
      const nav = document.querySelector(".v5-nav");
      if (nav) nav.dataset.cols = lead ? "4" : "3";
      if (!lead && tab === "board") setTab("now");
      renderBrief(name);
      renderNow(name, pack, roles, lead);
      renderJobs(name, pack, roles);
      renderBoard(name);
    } catch (err) {
      const seatEl = document.getElementById("v5Seat");
      if (seatEl && !seatEl.textContent) seatEl.textContent = "Your job";
    }
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
