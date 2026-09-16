(function () {
  const store = window.GGSPrepStore;
  const PREFS = "ggs-prep-v3-prefs";
  const milestones = [
    ["2026-09-17T08:00:00", "8:00 AM", "Venue open. Tracy window"],
    ["2026-09-17T10:00:00", "10:00 AM", "Setup Lead + dressers arrive"],
    ["2026-09-17T16:30:00", "4:30 PM", "SOUND CHECK + night crew"],
    ["2026-09-17T17:15:00", "5:15 PM", "Food doors — concert-only stay in cars"],
    ["2026-09-17T17:30:00", "5:30 PM", "Buffet opens"],
    ["2026-09-17T17:45:00", "5:45 PM", "David starts"],
    ["2026-09-17T18:15:00", "6:15 PM", "Acoustic wraps"],
    ["2026-09-17T18:30:00", "6:30 PM", "Concert doors"],
    ["2026-09-17T18:45:00", "6:45 PM", "Hard checkpoint"],
    ["2026-09-17T19:00:00", "7:00 PM", "Concert starts"],
    ["2026-09-17T20:45:00", "8:45 PM", "Strike begins"],
    ["2026-09-17T21:15:00", "9:15 PM", "Load-out underway"],
    ["2026-09-17T22:00:00", "10:00 PM", "Building cleared"],
  ];
  const packets = [
    { id: "captain", label: "I'm Event Lead", match: /event captain|event lead|choose event captain|hard stop|load-out|announce teardown/i, tabs: ["overview", "volunteers", "timeline", "final"], who: /steve|event captain|event lead/i },
    { id: "setup", label: "I'm Setup", match: /setup person|tables|chairs|horseshoe|tablecloth|lobby ticket setup|dress 8 guest/i, tabs: ["setup"], who: /setup/i },
    { id: "floater", label: "I'm Floater", match: /floater|relief loop|becomes floater/i, tabs: ["setup", "volunteers", "food", "tickets", "campaign"], who: /floater|relief/i },
    {
      id: "tracy",
      label: "I'm Tracy",
      who: /tracy/i,
      pick: function (row) {
        if (row.section === "production") return true;
        if (row.section === "volunteers" && /tracy production helper|sound\/lights muscle/i.test(row.text)) return true;
        if (row.section === "production" && /sound\/lights muscle/i.test(row.text)) return true;
        if (row.section === "breakdown" && /shut down sound|shut down lights|disconnect equipment|coil cables|pack microphones|pack stands|pack speakers|pack mixer|pack lighting|account for all production|load tracy|final stage check|sound\/lights muscle/i.test(row.text)) return true;
        return false;
      },
    },
    { id: "tickets", label: "I'm Tickets", match: /ticket|cash|envelope|reconcile|payment/i, tabs: ["tickets"], who: /ticket|check-in/i },
    { id: "food", label: "I'm Ben", who: /ben/i, match: /bbq|buffet|tea|lemonade|cooler|pulled pork|ben |\$1 water|money bag|sweetener|unsweet|120 bottle|bags ice/i, tabs: ["ben", "food"] },
    { id: "campaign", label: "I'm Campaign", match: /yard sign|merch|qr|literature|regnet|campaign display|pull-up|push card|foldover/i, tabs: ["campaign"], who: /campaign|sign|merch/i },
    { id: "strike", label: "I'm Strike", match: /strike|teardown|load-out|final venue|building cleared/i, tabs: ["breakdown", "final"], who: /strike|teardown/i },
  ];

  let prefs = { me: "", mode: "plan", packet: "captain" };
  try {
    prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(PREFS) || "{}"));
  } catch (err) {
    /* keep */
  }

  const esc = (x) =>
    String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  function assignments() {
    return store ? store.readCache() : {};
  }

  function roster() {
    return (store && store.readDoc("volunteers")) || { setup: [], event: [], strike: [] };
  }

  function namedCount(rows) {
    return (rows || []).filter((row) => String(row.name || "").trim()).length;
  }

  function namedRole(rows, hint) {
    const hit = (rows || []).find((row) => hint.test(String(row.role || "")) && String(row.name || "").trim());
    return hit ? hit.name.trim() : "";
  }

  function taskNamed(re) {
    const state = assignments();
    return Object.keys(state).some((key) => {
      const row = state[key];
      if (!row || !row.owner) return false;
      const node = document.querySelector('.task[data-key="' + key + '"] .task-text');
      const text = node ? node.textContent : key;
      return re.test(text);
    });
  }

  function gates() {
    const people = roster();
    const captain = namedRole(people.event, /event captain/i) || (taskNamed(/choose event captain|event captain/i) ? "named" : "");
    const setup = namedCount(people.setup);
    const tickets = namedRole(people.event, /primary ticket|check-in/i);
    const photo = namedRole(people.event, /photo|video/i);
    const tracy =
      namedRole(people.event, /tracy/i) ||
      (taskNamed(/tracy production helper|name the campaign volunteer helper|campaign volunteer to assist tracy/i) ? "named" : "");
    const strike = namedCount(people.strike);
    return [
      { id: "captain", label: "Event Captain", ok: !!captain, detail: captain || "Need a name" },
      { id: "setup", label: "Setup 3", ok: setup >= 3, detail: setup + " / 3" },
      { id: "tracy", label: "Tracy helper", ok: !!tracy, detail: tracy || "Need a helper" },
      { id: "tickets", label: "Ticket lead", ok: !!tickets, detail: tickets || "Need a lead" },
      { id: "photo", label: "Photo Lead · roam", ok: !!photo, detail: photo || "Need a rover" },
      { id: "strike", label: "Teardown 10+", ok: strike >= 10, detail: strike + " / 10" },
    ];
  }

  function renderGates() {
    const el = document.getElementById("gateGrid");
    if (!el) return;
    const list = gates();
    const ready = list.every((g) => g.ok);
    const book = window.GGSCrewSlice && store ? window.GGSCrewSlice.readContacts(store) : {};
    el.innerHTML = list
      .map((g) => {
        const named = g.ok && g.detail && !/\d+\s*\/\s*\d+/.test(g.detail) && g.detail !== "named";
        const detail =
          named && window.GGSCrewSlice
            ? window.GGSCrewSlice.contactHtml(g.detail, window.GGSCrewSlice.phoneFor(g.detail, book), { page: true })
            : esc(g.detail);
        return (
          '<article class="gate' +
          (g.ok ? " is-ok" : " is-hot") +
          '"><strong>' +
          esc(g.label) +
          "</strong><span>" +
          detail +
          "</span></article>"
        );
      })
      .join("");
    document.getElementById("gatesBand").classList.toggle("is-ready", ready);
  }

  function writePrefs(patch) {
    try {
      const raw = Object.assign(JSON.parse(localStorage.getItem(PREFS) || "{}"), patch);
      localStorage.setItem(PREFS, JSON.stringify(raw));
      Object.assign(prefs, patch);
    } catch (err) {
      Object.assign(prefs, patch);
    }
  }

  function setMode(mode) {
    prefs.mode = mode === "run" || mode === "packet" || mode === "lists" ? mode : "plan";
    writePrefs({ mode: prefs.mode });
    document.body.dataset.mode = prefs.mode;
    document.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.classList.toggle("is-active-mode", btn.dataset.mode === prefs.mode);
    });
    const plan = document.getElementById("planStage");
    const run = document.getElementById("runStage");
    const packet = document.getElementById("packetStage");
    const lists = document.getElementById("listsStage");
    if (plan) plan.hidden = prefs.mode !== "plan";
    if (run) run.hidden = prefs.mode !== "run";
    if (packet) packet.hidden = prefs.mode !== "packet";
    if (lists) lists.hidden = prefs.mode !== "lists";
    document.querySelectorAll(".now-strip, .dashboard, .crew-band, .attention, .gates, .radio-band").forEach((el) => {
      el.hidden = prefs.mode !== "plan";
    });
    if (prefs.mode === "packet" && packet) {
      packet.scrollIntoView({ block: "start" });
    }
    document.querySelectorAll(".ops-bar").forEach((el) => {
      el.hidden = prefs.mode === "packet";
    });
    document.querySelectorAll(".role-row").forEach((el) => {
      el.hidden = prefs.mode === "packet" || prefs.mode === "lists";
    });
    const hash = (location.hash || "").replace("#", "");
    if (prefs.mode === "run" || prefs.mode === "packet" || prefs.mode === "lists") {
      if (hash !== prefs.mode) history.replaceState(null, "", "#" + prefs.mode);
    } else if (hash === "run" || hash === "packet" || hash === "lists") {
      history.replaceState(null, "", location.pathname);
    }
    if (prefs.mode === "run") renderRun();
    if (prefs.mode === "packet") renderPacket();
    if (prefs.mode === "lists" && window.GGSPrepV4) window.GGSPrepV4.renderGear();
  }

  function cue() {
    const now = new Date();
    let current = milestones[0];
    let upcoming = milestones[1];
    let idx = 0;
    for (let i = 0; i < milestones.length; i += 1) {
      if (new Date(milestones[i][0]) <= now) {
        current = milestones[i];
        upcoming = milestones[i + 1] || milestones[i];
        idx = i;
      }
    }
    return { now, current, upcoming, idx };
  }

  function renderRun() {
    const { now, current, upcoming, idx } = cue();
    const clock = document.getElementById("runClock");
    if (clock) clock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const strike = new Date("2026-09-17T20:45:00");
    const clear = new Date("2026-09-17T22:00:00");
    const stage = document.getElementById("runStage");
    if (stage) stage.classList.toggle("is-strike", now >= strike);
    document.getElementById("runNow").textContent = now >= strike ? "STRIKE. Clear the building." : current[2];
    document.getElementById("runNext").textContent = now >= strike ? "10:00 PM hard stop" : "Next: " + upcoming[1] + " · " + upcoming[2];
    const hot = document.getElementById("runHot");
    if (hot) {
      const missing = gates().filter((g) => !g.ok);
      hot.hidden = missing.length === 0;
      hot.innerHTML = missing.length
        ? missing.map((g) => "<span>" + esc(g.label) + " · " + esc(g.detail) + "</span>").join("")
        : "";
    }
    if (now >= strike) {
      const mins = Math.max(0, Math.round((clear - now) / 60000));
      document.getElementById("runHard").textContent = mins + " minutes to 10:00 PM clearance";
      document.getElementById("runKicker").textContent = "STRIKE CLOCK";
    } else {
      document.getElementById("runHard").textContent = current[1] + " · building clear by 10:00 PM";
      document.getElementById("runKicker").textContent = "EVENT CLOCK";
    }
    const queue = document.getElementById("runQueue");
    if (queue) {
      queue.innerHTML = milestones
        .slice(idx, idx + 4)
        .map((m, i) => '<div class="run-cue' + (i === 0 ? " is-now" : "") + '"><b>' + esc(m[1]) + "</b><span>" + esc(m[2]) + "</span></div>")
        .join("");
    }
    const storedMe = (JSON.parse(localStorage.getItem(PREFS) || "{}").me || "").trim();
    const me = storedMe.toLowerCase();
    const mine = document.getElementById("runMine");
    if (!mine) return;
    const rows = Array.from(document.querySelectorAll(".task[data-key]")).filter((row) => {
      if (row.querySelector(".task-check").checked) return false;
      const owner = (row.querySelector(".owner").value || "").trim().toLowerCase();
      return me && owner.includes(me);
    });
    mine.innerHTML = rows.length
      ? rows
          .slice(0, 12)
          .map((row) => {
            const key = row.dataset.key;
            const text = row.querySelector(".task-text").textContent;
            return (
              '<button type="button" class="run-task" data-done="' +
              esc(key) +
              '"><span>' +
              esc(text) +
              "</span><em>Mark done</em></button>"
            );
          })
          .join("")
      : '<p class="muted">No open work on your signed-in name yet.</p>';
    mine.querySelectorAll("[data-done]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = document.querySelector('.task[data-key="' + btn.dataset.done + '"]');
        if (!row) return;
        row.querySelector(".task-check").checked = true;
        row.dispatchEvent(new Event("change", { bubbles: true }));
        renderRun();
        renderGates();
      });
    });
  }

  function signedName() {
    if (window.GGSSignIn) {
      const who = window.GGSSignIn.identity();
      if (who && who.name) return who.name;
    }
    return String(prefs.me || "").trim();
  }

  function packetList() {
    const me = signedName();
    const list = packets.slice();
    if (me && !list.some((p) => p.who && p.who.test(me))) {
      list.unshift({ id: "me", label: "I'm " + me.split(/\s+/)[0], who: null, mine: me });
    }
    return list;
  }

  function belongs(pack, row, me) {
    if (pack.mine) {
      return !!(window.GGSCrewSlice && window.GGSCrewSlice.nameMatch(row.owner, pack.mine));
    }
    if (pack.who && pack.who.test(String(row.owner || ""))) return true;
    if (me && pack.who && pack.who.test(me) && window.GGSCrewSlice && window.GGSCrewSlice.nameMatch(row.owner, me)) {
      return true;
    }
    if (pack.pick) return pack.pick(row);
    if (pack.tabs && pack.tabs.indexOf(row.section) !== -1) return true;
    if (pack.match && pack.match.test(row.text || "")) return true;
    return false;
  }

  function togglePacket(key, done) {
    const node = document.querySelector('.task[data-key="' + key + '"]');
    if (node) {
      node.querySelector(".task-check").checked = done;
      node.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (store) {
      const cur = assignments()[key] || {};
      store.saveOne(key, { owner: cur.owner || "", when: cur.when || "", done: done, extra: cur.extra || "" });
    }
    renderPacket();
    renderGates();
    if (window.GGSNextAction) window.GGSNextAction.paint(assignments(), roster());
  }

  function renderPacket() {
    const roles = document.getElementById("packetRoles");
    const sheet = document.getElementById("packetSheet");
    if (!roles || !sheet) return;
    try {
      paintPacket(roles, sheet);
    } catch (err) {
      sheet.innerHTML = "<p>This packet could not load. Open My night instead.</p><p><a href=\"/v5/\">My night</a></p>";
    }
  }

  function paintPacket(roles, sheet) {
    const slice = window.GGSCrewSlice;
    const sections = window.GGS_PREP_SECTIONS || [];
    const state = assignments();
    const people = roster();
    const me = signedName();
    const list = packetList();
    if (!list.some((p) => p.id === prefs.packet)) prefs.packet = list[0].id;
    roles.innerHTML = list
      .map(
        (p) =>
          '<button type="button" class="chip' +
          (prefs.packet === p.id ? " is-active" : "") +
          '" data-packet="' +
          p.id +
          '">' +
          esc(p.label) +
          "</button>"
      )
      .join("");
    roles.querySelectorAll("[data-packet]").forEach((btn) => {
      btn.addEventListener("click", () => {
        writePrefs({ packet: btn.dataset.packet });
        renderPacket();
      });
    });
    const pack = list.find((p) => p.id === prefs.packet) || list[0];
    const harvested = slice ? slice.harvest(state, sections) : [];
    const seen = {};
    let lines = harvested.filter((row) => belongs(pack, row, me)).filter((row) => {
      const key = String(row.text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
    if (pack.mine && slice) {
      const mine = slice.sliceFor(pack.mine, state, people, sections);
      const extra = harvested.filter((row) => {
        if (row.done || String(row.owner || "").trim()) return false;
        return (mine.roles || []).some((role) => role.test.test(row.text || ""));
      });
      extra.forEach((row) => {
        if (!lines.some((item) => item.key === row.key)) lines.push(row);
      });
    }
    const assigned = lines.filter((row) => !row.done && String(row.owner || "").trim());
    const gaps = lines.filter((row) => !row.done && !String(row.owner || "").trim());
    const done = lines.filter((row) => row.done);
    const book = slice && store ? slice.readContacts(store) : {};
    const rolesForCue = pack.mine && slice ? slice.sliceFor(pack.mine, state, people, sections).roles : slice ? slice.ROLES.filter((r) => r.id === (pack.id === "food" ? "food" : pack.id === "tracy" ? "production" : pack.id)) : [];
    const cueNow = slice && rolesForCue.length ? slice.cueAt(rolesForCue, new Date()) : null;
    const bookWho = function (name) {
      if (!name) return "UNASSIGNED";
      return slice ? slice.contactHtml(name, slice.phoneFor(name, book)) : esc(name);
    };
    function block(title, rows, limit) {
      const shown = typeof limit === "number" ? rows.slice(0, limit) : rows;
      if (!shown.length) return "";
      return (
        "<h3>" +
        esc(title) +
        "</h3><ul class=\"packet-live\">" +
        shown
          .map((row) => {
            return (
              '<li class="' +
              (row.done ? "is-done" : "") +
              '"><label><input type="checkbox" data-packet-key="' +
              esc(row.key) +
              '"' +
              (row.done ? " checked" : "") +
              "> <strong>" +
              esc(row.text) +
              "</strong></label><span>" +
              bookWho(row.owner) +
              (row.when ? " · " + esc(row.when) : "") +
              (row.card ? " · " + esc(row.card) : "") +
              "</span></li>"
            );
          })
          .join("") +
        "</ul>"
      );
    }
    sheet.innerHTML =
      "<p class=\"eyebrow\">LIVE FROM THE BOARD</p><h2>" +
      esc(pack.label) +
      "</h2><p class=\"packet-stats\">" +
      assigned.length +
      " assigned open · " +
      gaps.length +
      " still need a name · " +
      done.length +
      " done</p>" +
      (cueNow && !cueNow.empty
        ? "<p><strong>Now:</strong> " + esc(cueNow.place) + " — " + esc(cueNow.do) + "</p>"
        : "") +
      "<p>Not a print copy. Check a box and it writes back to every phone.</p>" +
      "<p><strong>Hard stop:</strong> strike at 8:45–9:00 PM. Building cleared by 10:00 PM.</p>" +
      block("Do these", assigned) +
      block("Still need a name", gaps) +
      block("Already done", done, 12);
    sheet.querySelectorAll("[data-packet-key]").forEach((box) => {
      box.addEventListener("change", () => togglePacket(box.dataset.packetKey, box.checked));
    });
  }

  function bindRadio() {
    /* v4 feed owns radio */
  }

  function refresh() {
    renderGates();
    if (prefs.mode === "run") renderRun();
    if (prefs.mode === "packet") renderPacket();
    if (window.GGSRadioFeed) {
      const feed = document.getElementById("radioFeed");
      if (feed) window.GGSRadioFeed.render(feed);
    }
  }

  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });
  const runMe = document.getElementById("runMe");
  if (runMe) {
    runMe.addEventListener("input", () => {
      writePrefs({ me: runMe.value });
      const planMe = document.getElementById("meInput");
      if (planMe) planMe.value = runMe.value;
      renderRun();
    });
  }
  bindRadio();
  const hash = (location.hash || "").replace("#", "");
  if (hash === "run" || hash === "packet" || hash === "lists") prefs.mode = hash;
  const listsJump = document.getElementById("listsJump");
  if (listsJump) listsJump.addEventListener("click", () => setMode("lists"));
  setMode(prefs.mode || "plan");
  refresh();
  setInterval(() => {
    if (prefs.mode === "run") renderRun();
  }, 15000);
  window.addEventListener("ggs-prep-loaded", refresh);
  window.GGSPrepV3 = { refresh, setMode };
})();
