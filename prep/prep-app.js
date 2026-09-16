(function () {
  const S = window.GGS_PREP_SECTIONS || [];
  const store = window.GGSPrepStore;
  const state = store ? store.readCache() : JSON.parse(localStorage.getItem("ggs-prep-2026-09-17-v2") || "{}");
  const PREFS = "ggs-prep-v3-prefs";
  const milestones = [
    ["2026-09-17T08:00:00", "8:00 AM", "Venue open. Tracy window 8-10"],
    ["2026-09-17T10:00:00", "10:00 AM", "Tracy on site — band load-in 2:00"],
    ["2026-09-17T14:00:00", "2:00 PM", "Band load-in — you tell us"],
    ["2026-09-17T15:00:00", "3:00 PM", "DAB check — volunteers not required yet"],
    ["2026-09-17T16:30:00", "4:30 PM", "Night volunteers arrive. SOUND CHECK"],
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
  const criticalHints = /teardown|strike|event captain|tracy|ben food|ticket|floater|night roster|load-out|photographer|cooler captain/i;

  let prefs = { me: "", phone: "", filter: "all", night: false, tab: "overview", q: "" };
  try {
    prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(PREFS) || "{}"));
  } catch (err) {
    /* keep defaults */
  }

  const root = document.getElementById("tabContent");
  const tabsEl = document.querySelector(".tabs");
  const esc = (x) =>
    String(x)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  function key(section, card, i) {
    return section + ":" + card + ":" + i;
  }

  const VENUE_LAYOUT = {
    "overview:0:1": { done: true, owner: "Venue", when: "In place on arrival" },
    "overview:0:2": { done: true, owner: "Venue", when: "In place on arrival" },
    "overview:0:3": { done: true, owner: "Venue", when: "In place on arrival" },
    "overview:0:4": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:3": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:12": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:13": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:14": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:15": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:16": { done: true, owner: "Venue", when: "In place on arrival" },
    "setup:0:17": { done: true, owner: "Venue", when: "In place on arrival" },
  };

  const TRACY_READY = {
    "overview:1:6": { done: true, owner: "Tracy", when: "8-10 AM · he brings it" },
    "production:0:0": { done: true, owner: "Tracy", when: "Complete system" },
    "production:0:3": { done: true, owner: "Tracy", when: "He brings it" },
    "production:0:4": { done: true, owner: "Tracy", when: "He brings it" },
    "production:0:5": { done: true, owner: "Tracy", when: "He brings it" },
    "production:0:6": { done: true, owner: "Tracy", when: "He brings it" },
    "production:0:7": { done: true, owner: "Tracy", when: "Ready when he is up" },
    "gear:in:production:0": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:1": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:2": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:3": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:4": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:5": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:6": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:7": { done: true, owner: "Tracy", when: "He brings it" },
    "gear:in:production:8": { done: true, owner: "Tracy", when: "He brings it" },
  };

  const NO_TICKETS = {
    "tickets:0:2": { done: true, owner: "House", when: "No paper tickets" },
    "tickets:1:4": { done: true, owner: "House", when: "No paper tickets" },
    "gear:in:tickets:0": { done: true, owner: "House", when: "No paper tickets" },
    "gear:out:tickets:2": { done: true, owner: "House", when: "No stubs" },
  };

  function seedFixed(map, already) {
    let wrote = false;
    Object.keys(map).forEach((k) => {
      const cur = state[k] || {};
      if (already(cur)) return;
      state[k] = Object.assign({}, cur, map[k]);
      if (store) store.saveOne(k, state[k]);
      wrote = true;
    });
    return wrote;
  }

  function seedVenueLayout() {
    const venue = seedFixed(VENUE_LAYOUT, (cur) => cur.done && String(cur.owner || "").toLowerCase().includes("venue"));
    const tracy = seedFixed(TRACY_READY, (cur) => cur.done && /tracy/i.test(String(cur.owner || "")));
    const notix = seedFixed(NO_TICKETS, (cur) => cur.done && /house|no paper/i.test(String(cur.owner || "") + String(cur.when || "")));
    if (!venue && !tracy && !notix) return;
    restore();
    progress();
    applyFilters();
    renderGaps();
  }

  function savePrefs() {
    localStorage.setItem(PREFS, JSON.stringify(prefs));
    const link = document.getElementById("myPageLink");
    const btn = document.getElementById("myPageBtn");
    const name = (prefs.me || "").trim();
    const href = name && window.GGSCrewSlice ? window.GGSCrewSlice.pageUrl(name) : "/v5/";
    if (link) {
      link.href = href;
      link.hidden = name.length < 2;
    }
    if (btn) btn.href = href;
  }

  function applyNight() {
    document.documentElement.classList.toggle("night", !!prefs.night);
    const btn = document.getElementById("nightBtn");
    if (btn) btn.textContent = prefs.night ? "Day mode" : "Night mode";
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.setAttribute("content", prefs.night ? "#07074a" : "#000066");
  }

  function rowState(el) {
    const k = el.dataset.key || el.dataset.qrKey;
    return state[k] || {};
  }

  function saveRow(el) {
    const k = el.dataset.key || el.dataset.qrKey;
    if (!k) return;
    const next = {
      done: el.querySelector(".task-check").checked,
      owner: el.querySelector(".owner").value,
      when: el.querySelector(".when").value,
    };
    state[k] = next;
    if (store) store.saveOne(k, next);
    progress();
    applyFilters();
    renderCrew();
    renderAttention();
    renderGaps();
    paintOwnerReach();
    if (window.GGSPrepV3) window.GGSPrepV3.refresh();
    if (window.GGSPrepV4) window.GGSPrepV4.fillOwnerList();
  }

  function claim(el) {
    const name = (prefs.me || "").trim();
    if (!name) {
      const input = document.getElementById("meInput");
      if (input) {
        input.focus();
        input.classList.add("is-needed");
      }
      return;
    }
    const owner = el.querySelector(".owner");
    if (owner && owner.tagName === "SELECT" && name && ![].some.call(owner.options, (opt) => opt.value === name)) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      owner.appendChild(opt);
    }
    if (owner) owner.value = name;
    saveRow(el);
    const phone = document.getElementById("mePhone");
    if (phone && !(prefs.phone || "").trim()) {
      phone.classList.add("is-needed");
      phone.focus();
    }
    if (window.GGSPrepV4) window.GGSPrepV4.fillOwnerList();
  }

  function taskHtml(k, label, whenPlaceholder) {
    const x = state[k] || {};
    return (
      '<div class="task" data-key="' +
      esc(k) +
      '"><label class="check"><input class="task-check" type="checkbox"' +
      (x.done ? " checked" : "") +
      '><span class="checkmark"></span><span class="task-text">' +
      esc(label) +
      "</span></label>" +
      (window.GGSPeople
        ? window.GGSPeople.leadSelectHtml(x.owner || "", { includeVenue: true })
        : '<input class="owner" value="' + esc(x.owner || "") + '" placeholder="Assigned to…">') +
      '<span class="owner-reach"></span><input class="when" value="' +
      esc(x.when || "") +
      '" placeholder="' +
      esc(whenPlaceholder) +
      '"><button type="button" class="claim" data-claim>Assign to me</button></div>'
    );
  }

  function renderTabs() {
    tabsEl.innerHTML = S.map((s, i) => {
      const id = s[0];
      const title = s[1];
      const active = (prefs.tab || "overview") === id || (!prefs.tab && i === 0);
      return (
        '<button class="tab' +
        (active ? " is-active" : "") +
        '" data-tab="' +
        id +
        '" aria-selected="' +
        (active ? "true" : "false") +
        '">' +
        esc(title) +
        ' <span class="tab-count" data-count="' +
        id +
        '"></span></button>'
      );
    }).join("");
  }

  function render() {
    root.innerHTML = S.map((s, si) => {
      const [id, title, intro, cards, timeline] = s;
      const active = (prefs.tab || "overview") === id || (!prefs.tab && si === 0);
      if (timeline) {
        return (
          '<section class="section' +
          (active ? " is-active" : "") +
          '" data-section="' +
          id +
          '"><div class="section-head"><p class="eyebrow">RUN OF SHOW</p><h2>' +
          esc(title) +
          "</h2><p>" +
          esc(intro) +
          '</p></div><div class="card"><div class="timeline">' +
          timeline
            .map(
              (r, i) =>
                '<div class="time-row"><div class="time">' +
                esc(r[0]) +
                "</div><div><strong>" +
                esc(r[1]) +
                '</strong><div class="mini">' +
                esc(r[2]) +
                "</div>" +
                taskHtml(key(id, "timeline", i), "Checkpoint complete", "Actual time…") +
                "</div></div>",
            )
            .join("") +
          "</div></div></section>"
        );
      }
      return (
        '<section class="section' +
        (active ? " is-active" : "") +
        '" data-section="' +
        id +
        '"><div class="section-head"><p class="eyebrow">EVENT COMMAND</p><h2>' +
        esc(title) +
        "</h2><p>" +
        esc(intro) +
        '</p></div><div class="grid">' +
        cards
          .map(
            (c, ci) =>
              '<article class="card"><h3>' +
              esc(c[0]) +
              '</h3><div class="checklist-actions"><button class="small-btn" data-complete="' +
              id +
              "|" +
              ci +
              '">Complete section</button><button class="small-btn" data-clear="' +
              id +
              "|" +
              ci +
              '">Clear section</button></div><div class="task-list">' +
              c[1].map((t, ti) => taskHtml(key(id, ci, ti), t, "When…")).join("") +
              "</div></article>",
          )
          .join("") +
        "</div></section>"
      );
    }).join("");
    bind();
    restore();
    seedVenueLayout();
    progress();
    applyFilters();
    renderCrew();
    renderAttention();
    renderGaps();
    updateTabCounts();
    window.dispatchEvent(new CustomEvent("ggs-prep-rendered"));
  }

  function bind() {
    document.querySelectorAll(".task").forEach((row) => {
      ["change", "input"].forEach((evt) => row.addEventListener(evt, () => saveRow(row)));
      const claimBtn = row.querySelector("[data-claim]");
      if (claimBtn) claimBtn.addEventListener("click", () => claim(row));
    });
    document.querySelectorAll("[data-complete],[data-clear]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const raw = btn.dataset.complete || btn.dataset.clear;
        const [section, card] = raw.split("|");
        const done = !!btn.dataset.complete;
        document
          .querySelectorAll('[data-section="' + section + '"] .card')
          [+card].querySelectorAll(".task")
          .forEach((row) => {
            const k = row.dataset.key;
            const x = state[k] || {};
            x.done = done;
            state[k] = x;
            row.querySelector(".task-check").checked = done;
            if (store) store.saveOne(k, x);
          });
        progress();
        applyFilters();
        renderAttention();
        renderGaps();
        updateTabCounts();
        if (window.GGSPrepV3) window.GGSPrepV3.refresh();
      });
    });
  }

  function restore() {
    const active = document.activeElement;
    document.querySelectorAll(".task").forEach((row) => {
      if (active && row.contains(active)) return;
      const x = rowState(row);
      row.querySelector(".task-check").checked = !!x.done;
      row.querySelector(".owner").value = x.owner || "";
      row.querySelector(".when").value = x.when || "";
    });
  }

  function allTasks() {
    return Array.from(document.querySelectorAll(".task[data-key], .task[data-qr-key]"));
  }

  function matchesFilter(row) {
    const x = {
      done: row.querySelector(".task-check").checked,
      owner: (row.querySelector(".owner").value || "").trim(),
      text: (row.querySelector(".task-text").textContent || "").toLowerCase(),
    };
    const card = row.closest(".card");
    const cardTitle = card && card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
    const q = (prefs.q || "").trim().toLowerCase();
    if (q && !x.text.includes(q) && !x.owner.toLowerCase().includes(q) && !cardTitle.includes(q)) return false;
    if (prefs.filter === "open") return !x.done;
    if (prefs.filter === "done") return x.done;
    if (prefs.filter === "owner") return !x.done && !x.owner;
    if (prefs.filter === "mine") {
      const me = (prefs.me || "").trim().toLowerCase();
      return !!me && x.owner.toLowerCase().includes(me);
    }
    return true;
  }

  function ensurePlan() {
    const mode = document.body.dataset.mode || "plan";
    if (mode === "packet" || mode === "run" || mode === "lists") return;
    if (window.GGSPrepV3) window.GGSPrepV3.setMode("plan");
    else {
      document.body.dataset.mode = "plan";
      const plan = document.getElementById("planStage");
      const run = document.getElementById("runStage");
      const packet = document.getElementById("packetStage");
      if (plan) plan.hidden = false;
      if (run) run.hidden = true;
      if (packet) packet.hidden = true;
    }
  }

  function applyFilters() {
    let shown = 0;
    allTasks().forEach((row) => {
      const on = matchesFilter(row);
      row.hidden = !on;
      if (on) shown += 1;
    });
    document.querySelectorAll(".card").forEach((card) => {
      const visible = card.querySelectorAll(".task:not([hidden])").length;
      card.classList.toggle("is-filtered-out", visible === 0 && !!card.querySelector(".task"));
    });
    const empty = document.getElementById("emptyFilter");
    if (empty) empty.hidden = shown > 0;
    const visibleCount = document.getElementById("visibleCount");
    if (visibleCount) visibleCount.textContent = String(shown);
    const status = document.getElementById("filterStatus");
    if (status) {
      const labels = { all: "All tasks", open: "Open tasks", owner: "Needs an owner", mine: "Assigned to you", done: "Done" };
      const q = (prefs.q || "").trim();
      status.textContent =
        (q ? '"' + q + '" · ' : "") + (labels[prefs.filter] || "All tasks") + " · " + shown + " showing";
    }
    updateTabCounts();
  }

  function revealWork() {
    ensurePlan();
    applyFilters();
    const current = document.querySelector(".section.is-active");
    if (current && current.querySelector(".task:not([hidden])")) {
      current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const hit = allTasks().find((row) => !row.hidden);
    const section = hit && hit.closest("[data-section]");
    if (section) showTab(section.dataset.section);
    else {
      const stage = document.getElementById("planStage");
      if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function progress() {
    const rows = allTasks();
    const done = rows.filter((x) => x.querySelector(".task-check").checked).length;
    const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;
    document.getElementById("progressPct").textContent = pct + "%";
    document.getElementById("progressCount").textContent = done + " / " + rows.length;
    document.getElementById("progressBar").style.width = pct + "%";
  }

  function updateTabCounts() {
    S.forEach((s) => {
      const id = s[0];
      const open = document.querySelectorAll('[data-section="' + id + '"] .task:not([hidden])').length;
      const badge = document.querySelector('[data-count="' + id + '"]');
      if (badge) badge.textContent = open ? String(open) : "";
    });
  }

  function contacts() {
    return window.GGSCrewSlice && store ? window.GGSCrewSlice.readContacts(store) : {};
  }

  function paintOwnerReach() {
    if (!window.GGSCrewSlice) return;
    const book = contacts();
    document.querySelectorAll(".task").forEach((row) => {
      const reach = row.querySelector(".owner-reach");
      if (!reach) return;
      const name = (row.querySelector(".owner").value || "").trim();
      reach.innerHTML = name ? window.GGSCrewSlice.contactHtml(name, window.GGSCrewSlice.phoneFor(name, book)) : "";
    });
  }

  function renderCrew() {
    const names = {};
    allTasks().forEach((row) => {
      const owner = (row.querySelector(".owner").value || "").trim();
      if (owner) names[owner] = (names[owner] || 0) + 1;
    });
    const list = Object.entries(names).sort((a, b) => b[1] - a[1]);
    const el = document.getElementById("crewList");
    if (!el) return;
    const book = contacts();
    el.innerHTML = list.length
      ? list
          .map(([name, n]) => {
            const phone = window.GGSCrewSlice ? window.GGSCrewSlice.phoneFor(name, book) : "";
            return (
              '<span class="crew-pill">' +
              (window.GGSCrewSlice
                ? window.GGSCrewSlice.contactHtml(name, phone, { extra: n + " jobs" })
                : esc(name) + " · " + n) +
              "</span>"
            );
          })
          .join("")
      : '<span class="muted">Names appear here as people get assigned.</span>';
    paintOwnerReach();
  }

  function renderAttention() {
    const items = allTasks()
      .map((row) => {
        const text = row.querySelector(".task-text").textContent || "";
        const owner = (row.querySelector(".owner").value || "").trim();
        const done = row.querySelector(".task-check").checked;
        const section = row.closest("[data-section]");
        return { text, owner, done, section: section ? section.dataset.section : "", critical: criticalHints.test(text) };
      })
      .filter((x) => !x.done && !x.owner)
      .sort((a, b) => Number(b.critical) - Number(a.critical))
      .slice(0, 8);
    const el = document.getElementById("attentionList");
    if (!el) return;
    el.innerHTML = items.length
      ? items
          .map(
            (x) =>
              "<li><button type=\"button\" data-jump=\"" +
              esc(x.section) +
              '">' +
              esc(x.text) +
              "</button></li>",
          )
          .join("")
      : "<li>Every open task has a name. Keep moving the clock.</li>";
    el.querySelectorAll("[data-jump]").forEach((btn) => btn.addEventListener("click", () => showTab(btn.dataset.jump)));
  }

  function renderGaps() {
    const gap = allTasks().filter((row) => {
      return !row.querySelector(".task-check").checked && !(row.querySelector(".owner").value || "").trim();
    }).length;
    const el = document.getElementById("gapCount");
    if (el) el.textContent = String(gap);
  }

  function showTab(id) {
    if (!id || !document.querySelector('[data-section="' + id + '"]')) return;
    ensurePlan();
    prefs.tab = id;
    savePrefs();
    document.querySelectorAll(".tab").forEach((tab) => {
      const on = tab.dataset.tab === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.section === id);
    });
    document.querySelectorAll(".role[data-jump]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.jump === id);
    });
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    const section = document.querySelector('[data-section="' + id + '"]');
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function tick() {
    const now = new Date();
    const clock = document.getElementById("nowClock");
    if (clock) clock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    let current = milestones[0];
    let upcoming = milestones[1];
    for (let i = 0; i < milestones.length; i += 1) {
      const t = new Date(milestones[i][0]);
      if (t <= now) {
        current = milestones[i];
        upcoming = milestones[i + 1] || milestones[i];
      }
    }
    const concert = new Date("2026-09-17T19:00:00");
    const strike = new Date("2026-09-17T20:45:00");
    const label = document.getElementById("nowLabel");
    if (now >= strike) {
      if (label) label.textContent = "STRIKE MODE · building clear by 10:00 PM";
    } else if (now >= concert) {
      if (label) label.textContent = "Concert is live";
    } else if (label) {
      label.textContent = current[1] + " · " + current[2];
    }
    if (window.GGSNextAction) {
      const roster = (store && store.readDoc("volunteers")) || { strike: [] };
      window.GGSNextAction.paint(state, roster);
    } else {
      document.getElementById("nextTitle").textContent = upcoming[2];
      document.getElementById("nextMeta").textContent = upcoming[1];
    }
  }

  function paintMeSigned() {
    const el = document.getElementById("meSigned");
    if (!el) return;
    const name = (prefs.me || "").trim();
    el.textContent = name ? "Signed in as " + name : "";
  }

  function bindChrome() {
    paintMeSigned();
    window.addEventListener("ggs-signed-in", function (e) {
      if (e.detail && e.detail.me) prefs.me = e.detail.me;
      if (e.detail && e.detail.phone) prefs.phone = e.detail.phone;
      paintMeSigned();
    });
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => showTab(tab.dataset.tab));
    });
    document.querySelectorAll(".role[data-jump]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.jump === prefs.tab);
      btn.addEventListener("click", () => {
        prefs.filter = "all";
        prefs.q = "";
        const search = document.getElementById("searchInput");
        if (search) search.value = "";
        document.querySelectorAll("[data-filter]").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "all"));
        savePrefs();
        applyFilters();
        showTab(btn.dataset.jump);
      });
    });
    document.querySelectorAll("[data-jump]:not(.role)").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.dataset.jump));
    });
    document.querySelectorAll("[data-filter]").forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.filter === prefs.filter);
      chip.setAttribute("aria-pressed", chip.dataset.filter === prefs.filter ? "true" : "false");
      chip.addEventListener("click", () => {
        prefs.filter = chip.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((c) => {
          const on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        savePrefs();
        if (prefs.filter === "mine" && !(prefs.me || "").trim()) {
          const me = document.getElementById("meInput");
          if (me) {
            me.classList.add("is-needed");
            me.focus();
          }
        }
        revealWork();
      });
    });
    const me = document.getElementById("meInput");
    if (me) {
      me.value = prefs.me || "";
      me.addEventListener("input", () => {
        prefs.me = me.value;
        me.classList.remove("is-needed");
        savePrefs();
        if (prefs.filter === "mine") applyFilters();
        const runMe = document.getElementById("runMe");
        if (runMe && document.activeElement !== runMe) runMe.value = prefs.me;
        if (window.GGSPrepV3) window.GGSPrepV3.refresh();
      });
      me.addEventListener("change", () => {
        const phone = document.getElementById("mePhone");
        if (store && window.GGSCrewSlice && (prefs.me || "").trim() && phone && window.GGSCrewSlice.phoneDigits(phone.value)) {
          window.GGSCrewSlice.saveContact(store, prefs.me, phone.value);
        }
        if (window.GGSSignIn) window.GGSSignIn.save(prefs.me, phone ? phone.value : prefs.phone);
      });
    }
    const phone = document.getElementById("mePhone");
    if (phone) {
      phone.value = prefs.phone || "";
      let phoneTimer = null;
      const pushPhone = () => {
        prefs.phone = phone.value;
        savePrefs();
        if (store && window.GGSCrewSlice && (prefs.me || "").trim() && window.GGSCrewSlice.phoneDigits(phone.value)) {
          window.GGSCrewSlice.saveContact(store, prefs.me, phone.value);
        }
        renderCrew();
      };
      phone.addEventListener("input", () => {
        prefs.phone = phone.value;
        savePrefs();
        clearTimeout(phoneTimer);
        phoneTimer = setTimeout(pushPhone, 250);
      });
      phone.addEventListener("change", () => {
        if (window.GGSSignIn) window.GGSSignIn.save(prefs.me, phone.value);
      });
    }
    const search = document.getElementById("searchInput");
    if (search) {
      search.value = prefs.q || "";
      search.addEventListener("input", () => {
        prefs.q = search.value;
        savePrefs();
        revealWork();
      });
    }
    document.getElementById("nightBtn").addEventListener("click", () => {
      prefs.night = !prefs.night;
      savePrefs();
      applyNight();
    });
    document.getElementById("printBtn").addEventListener("click", () => print());
    document.getElementById("resetBtn").addEventListener("click", () => {
      const typed = window.prompt("This clears the shared board on every device. Type RESET to continue.");
      if (typed !== "RESET") return;
      (store ? store.reset() : Promise.resolve()).then(() => location.reload());
    });
    const hash = (location.hash || "").replace("#", "");
    if (hash && hash !== "run" && hash !== "packet") prefs.tab = hash;
    savePrefs();
  }

  applyNight();
  renderTabs();
  bindChrome();
  render();
  tick();
  setInterval(tick, 30000);

  window.addEventListener("ggs-prep-loaded", (e) => {
    if (store && store.isPicking && store.isPicking()) return;
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, e.detail || {});
    restore();
    seedVenueLayout();
    progress();
    applyFilters();
    renderCrew();
    renderAttention();
    renderGaps();
    if (window.GGSPrepV3) window.GGSPrepV3.refresh();
  });
  window.addEventListener("ggs-prep-status", (e) => {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    el.textContent =
      e.detail === "saving"
        ? "Saving to every device…"
        : e.detail === "offline"
          ? "Shared board unreachable — this phone only until it reconnects."
          : "Shared across every device. No refresh needed.";
    el.dataset.state = e.detail || "ok";
  });
  window.addEventListener("ggs-prep-rendered", () => {
    setTimeout(() => {
      applyFilters();
      renderCrew();
      renderAttention();
      renderGaps();
      if (window.GGSPrepV3) window.GGSPrepV3.refresh();
    }, 0);
  });
  if (store) store.startSync();

  window.GGSPrepApp = { applyFilters, showTab, revealWork, renderCrew, renderAttention };
})();
