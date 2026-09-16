(function () {
  const store = window.GGSPrepStore;
  const PREFS = "ggs-prep-v3-prefs";
  const milestones = [
    ["2026-09-17T08:00:00", "8:00 AM", "Venue access + setup"],
    ["2026-09-17T10:00:00", "10:00 AM", "Room / production check"],
    ["2026-09-17T16:30:00", "4:30 PM", "Shift to event mode"],
    ["2026-09-17T17:00:00", "5:00 PM", "Event crew in position"],
    ["2026-09-17T17:30:00", "5:30 PM", "BBQ / social hour"],
    ["2026-09-17T17:45:00", "5:45 PM", "David acoustic set"],
    ["2026-09-17T18:15:00", "6:15 PM", "Acoustic wraps"],
    ["2026-09-17T18:30:00", "6:30 PM", "Concert doors"],
    ["2026-09-17T18:45:00", "6:45 PM", "Hard checkpoint"],
    ["2026-09-17T19:00:00", "7:00 PM", "Concert starts"],
    ["2026-09-17T20:45:00", "8:45 PM", "Strike begins"],
    ["2026-09-17T21:15:00", "9:15 PM", "Load-out underway"],
    ["2026-09-17T22:00:00", "10:00 PM", "Building cleared"],
  ];
  const packets = [
    { id: "captain", label: "Event Captain", match: /event captain|choose event captain|hard stop|load-out|announce teardown/i, tabs: ["overview", "volunteers", "timeline", "final"] },
    { id: "setup", label: "Setup crew", match: /setup person|tables|chairs|horseshoe|tablecloth|lobby ticket setup/i, tabs: ["setup"] },
    {
      id: "tracy",
      label: "Tracy + helper",
      intro: "Tracy owns lights, sound, and electrical. One campaign volunteer stays with her from 8:00 AM load-in through Strike D. The venue already placed tables, chairs, and the dance floor — do not rebuild them. Photo/video is a different person.",
      pick: function (row) {
        if (row.tab === "production") return true;
        if (row.tab === "volunteers" && /tracy production helper/i.test(row.text)) return true;
        if (row.tab === "breakdown" && /shut down sound|shut down lights|disconnect equipment|coil cables|pack microphones|pack stands|pack speakers|pack mixer|pack lighting|account for all production|load tracy|final stage check/i.test(row.text)) return true;
        return false;
      },
    },
    { id: "tickets", label: "Tickets + money", match: /ticket|cash|envelope|reconcile|payment/i, tabs: ["tickets"] },
    { id: "food", label: "Food + drinks", match: /bbq|buffet|tea|lemonade|cooler|pulled pork|ben |\$1 water|money bag/i, tabs: ["ben", "food"] },
    { id: "campaign", label: "Campaign + merch", match: /yard sign|merch|qr|literature|regnet|campaign display/i, tabs: ["campaign"] },
    { id: "strike", label: "Strike / teardown", match: /strike|teardown|load-out|final venue|building cleared/i, tabs: ["breakdown", "final"] },
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
      { id: "photo", label: "Vertical photo", ok: !!photo, detail: photo || "Need a shooter" },
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
    prefs.mode = mode === "run" || mode === "packet" ? mode : "plan";
    writePrefs({ mode: prefs.mode });
    document.body.dataset.mode = prefs.mode;
    document.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.classList.toggle("is-active-mode", btn.dataset.mode === prefs.mode);
    });
    const plan = document.getElementById("planStage");
    const run = document.getElementById("runStage");
    const packet = document.getElementById("packetStage");
    if (plan) plan.hidden = prefs.mode !== "plan";
    if (run) run.hidden = prefs.mode !== "run";
    if (packet) packet.hidden = prefs.mode !== "packet";
    document.querySelectorAll(".now-strip, .dashboard, .crew-band, .attention").forEach((el) => {
      el.hidden = prefs.mode !== "plan";
    });
    document.querySelectorAll(".ops-bar, .role-row").forEach((el) => {
      el.hidden = prefs.mode === "packet";
    });
    const hash = (location.hash || "").replace("#", "");
    if (prefs.mode === "run" || prefs.mode === "packet") {
      if (hash !== prefs.mode) history.replaceState(null, "", "#" + prefs.mode);
    } else if (hash === "run" || hash === "packet") {
      history.replaceState(null, "", location.pathname);
    }
    if (prefs.mode === "run") renderRun();
    if (prefs.mode === "packet") renderPacket();
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
    const runMe = document.getElementById("runMe");
    const storedMe = (JSON.parse(localStorage.getItem(PREFS) || "{}").me || "").trim();
    if (runMe && document.activeElement !== runMe) runMe.value = storedMe;
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
      : '<p class="muted">Type your name in Plan, then assign work to yourself. Those jobs land here.</p>';
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

  function renderPacket() {
    const roles = document.getElementById("packetRoles");
    const sheet = document.getElementById("packetSheet");
    if (!roles || !sheet) return;
    roles.innerHTML = packets
      .map(
        (p) =>
          '<button type="button" class="chip' +
          (prefs.packet === p.id ? " is-active" : "") +
          '" data-packet="' +
          p.id +
          '">' +
          esc(p.label) +
          "</button>",
      )
      .join("");
    roles.querySelectorAll("[data-packet]").forEach((btn) => {
      btn.addEventListener("click", () => {
        writePrefs({ packet: btn.dataset.packet });
        renderPacket();
      });
    });
    const pack = packets.find((p) => p.id === prefs.packet) || packets[0];
    const seen = {};
    const lines = Array.from(document.querySelectorAll(".task[data-key]"))
      .map((row) => {
        const section = row.closest("[data-section]");
        const card = row.closest(".card");
        return {
          text: (row.querySelector(".task-text").textContent || "").trim(),
          owner: row.querySelector(".owner").value.trim(),
          when: row.querySelector(".when").value.trim(),
          done: row.querySelector(".task-check").checked,
          tab: section ? section.dataset.section : "",
          group: card && card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "",
        };
      })
      .filter((row) => {
        if (pack.pick) return pack.pick(row);
        return (pack.tabs && pack.tabs.indexOf(row.tab) !== -1) || (pack.match && pack.match.test(row.text));
      })
      .filter((row) => {
        const key = row.text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
    const open = lines.filter((row) => !row.done);
    const shown = pack.id === "tracy" ? lines : open.slice(0, 40);
    const book = window.GGSCrewSlice && store ? window.GGSCrewSlice.readContacts(store) : {};
    const groups = [];
    shown.forEach((row) => {
      const name = row.group || "Job";
      const last = groups[groups.length - 1];
      if (!last || last.name !== name) groups.push({ name, rows: [row] });
      else last.rows.push(row);
    });
    function lineHtml(row) {
      const who = row.owner
        ? window.GGSCrewSlice
          ? window.GGSCrewSlice.contactHtml(row.owner, window.GGSCrewSlice.phoneFor(row.owner, book))
          : esc(row.owner)
        : "UNASSIGNED";
      return (
        "<li" +
        (row.done ? ' class="is-done"' : "") +
        "><strong>" +
        esc(row.text) +
        "</strong><span> " +
        who +
        (row.when ? " · " + esc(row.when) : "") +
        "</span></li>"
      );
    }
    sheet.innerHTML =
      "<h2>" +
      esc(pack.label) +
      "</h2><p>Thursday, September 17, 2026 · Woody's Sherwood Forest · 1111 West Maryland Avenue</p>" +
      (pack.intro ? "<p>" + esc(pack.intro) + "</p>" : "") +
      "<p><strong>Hard stop:</strong> strike at 8:45–9:00 PM. Building cleared by 10:00 PM.</p>" +
      groups
        .map((g) => "<h3>" + esc(g.name) + "</h3><ol>" + g.rows.map(lineHtml).join("") + "</ol>")
        .join("");
  }

  function bindRadio() {
    const box = document.getElementById("radioNote");
    const by = document.getElementById("radioBy");
    if (!box) return;
    const doc = store ? store.readDoc("radio") : null;
    if (doc && doc.note) {
      box.value = doc.note;
      if (by) by.textContent = doc.by ? "Last update: " + doc.by : "";
    }
    let timer = null;
    box.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const me = (JSON.parse(localStorage.getItem(PREFS) || "{}").me || "").trim();
        if (store) store.saveDoc("radio", { note: box.value, by: me, at: new Date().toISOString() });
        if (by) by.textContent = me ? "Last update: " + me : "Saved to the shared board";
      }, 250);
    });
  }

  function refresh() {
    renderGates();
    if (prefs.mode === "run") renderRun();
    if (prefs.mode === "packet") renderPacket();
    const doc = store ? store.readDoc("radio") : null;
    const box = document.getElementById("radioNote");
    if (box && doc && document.activeElement !== box) {
      box.value = doc.note || "";
      const by = document.getElementById("radioBy");
      if (by && doc.by) by.textContent = "Last update: " + doc.by;
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
  if (hash === "run" || hash === "packet") prefs.mode = hash;
  setMode(prefs.mode || "plan");
  refresh();
  setInterval(() => {
    if (prefs.mode === "run") renderRun();
  }, 15000);
  window.addEventListener("ggs-prep-loaded", refresh);
  window.GGSPrepV3 = { refresh, setMode };
})();
