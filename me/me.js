(function () {
  const store = window.GGSPrepStore;
  const slice = window.GGSCrewSlice;
  const sections = window.GGS_PREP_SECTIONS || [];
  const PREFS = (slice && slice.PREFS) || "ggs-prep-v3-prefs";

  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS) || "{}");
    } catch (err) {
      return {};
    }
  }

  function writePrefs(patch) {
    const next = Object.assign(readPrefs(), patch);
    localStorage.setItem(PREFS, JSON.stringify(next));
    return next;
  }

  function queryWho() {
    const params = new URLSearchParams(location.search);
    return String(params.get("who") || "").trim();
  }

  function setWho(name, phone) {
    const clean = String(name || "").trim();
    const number = String(phone || "").trim();
    writePrefs({ me: clean, phone: number || readPrefs().phone || "" });
    if (store && number && slice.phoneDigits(number)) slice.saveContact(store, clean, number);
    const url = slice.pageUrl(clean);
    if (clean && location.pathname + location.search !== url) {
      history.replaceState(null, "", url);
    }
    return clean;
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function fmtTime(date) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function currentName() {
    return queryWho() || String(readPrefs().me || "").trim();
  }

  function renderGate(people) {
    const gate = document.getElementById("whoGate");
    const board = document.getElementById("meBoard");
    const name = currentName();
    if (name) {
      gate.hidden = true;
      board.hidden = false;
      return;
    }
    gate.hidden = false;
    board.hidden = true;
    document.getElementById("whoTitle").textContent = "Who are you?";
    const book = store && slice ? slice.readContacts(store) : {};
    const list = document.getElementById("whoList");
    list.innerHTML = people.length
      ? people
          .map((n) => {
            const phone = slice.phoneFor(n, book);
            return (
              '<div class="who-pick">' +
              '<button type="button" data-who="' +
              esc(n) +
              '">' +
              esc(n) +
              "</button>" +
              (phone
                ? '<a class="who-num" href="' +
                  slice.telHref(phone) +
                  '">' +
                  esc(slice.displayPhone(phone)) +
                  '</a><a class="who-sms" href="' +
                  slice.smsHref(phone) +
                  '">Text</a>'
                : "") +
              "</div>"
            );
          })
          .join("")
      : "";
    list.querySelectorAll("[data-who]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const bookNow = store && slice ? slice.readContacts(store) : {};
        const known = slice.phoneFor(btn.dataset.who, bookNow);
        document.getElementById("whoInput").value = btn.dataset.who;
        if (known) {
          document.getElementById("whoPhone").value = known;
          setWho(btn.dataset.who, known);
          render();
          return;
        }
        document.getElementById("whoNeedPhone").hidden = false;
        document.getElementById("whoPhone").focus();
      });
    });
  }

  function render() {
    const state = store ? store.readCache() : {};
    const roster = (store && store.readDoc("volunteers")) || { setup: [], event: [], strike: [] };
    const people = slice.peopleFrom(state, roster, sections);
    const name = currentName();
    renderGate(people);
    if (!name) return;

    document.getElementById("whoTitle").textContent = name;
    const book = slice.readContacts(store);
    const myPhone = slice.phoneFor(name, book) || readPrefs().phone || "";
    const reach = document.getElementById("meReach");
    if (reach) reach.innerHTML = slice.contactHtml(name, myPhone, { page: false });
    const boardPhone = document.getElementById("boardPhone");
    if (boardPhone && document.activeElement !== boardPhone) boardPhone.value = myPhone;
    const pack = slice.sliceFor(name, state, roster, sections);
    const now = new Date();
    const cue = slice.cueAt(pack.roles, now);
    const here = document.getElementById("hereCard");
    here.classList.toggle("is-strike", !!cue.strike);
    here.classList.toggle("is-empty", !!cue.empty);
    document.getElementById("hereKicker").textContent = cue.waiting ? "Be here first" : cue.strike ? "STRIKE" : "You should be";
    document.getElementById("herePlace").textContent = cue.place;
    document.getElementById("hereDo").textContent = cue.do;
    const next = document.getElementById("hereNext");
    if (cue.next && cue.next.start) {
      next.textContent = "Next: " + fmtTime(cue.next.start) + " · " + cue.next.place;
    } else if (cue.next && cue.next.when) {
      next.textContent = "Next: " + fmtTime(cue.next.when) + " · " + cue.next.place;
    } else {
      next.textContent = cue.empty ? "" : "Hard stop 10:00 PM";
    }

    const roleBand = document.getElementById("roleBand");
    const extras = pack.rosterHits.map((row) => row.role).filter(Boolean);
    const labels = pack.roles.map((r) => r.label).concat(extras.filter((role) => !pack.roles.some((r) => r.roster.test(role) || r.test.test(role))));
    const unique = Array.from(new Set(labels));
    roleBand.hidden = unique.length === 0;
    document.getElementById("rolePills").innerHTML = unique.map((label) => '<span class="role-pill">' + esc(label) + "</span>").join("");

    const dayBand = document.getElementById("dayBand");
    const slots = [];
    pack.roles.forEach((role) => {
      role.day.forEach((slot) => {
        slots.push({
          start: new Date(slot.start),
          end: new Date(slot.end),
          place: slot.place,
          do: slot.do,
          role: role.label,
        });
      });
    });
    slots.sort((a, b) => a.start - b.start);
    dayBand.hidden = slots.length === 0;
    document.getElementById("dayList").innerHTML = slots
      .map((slot) => {
        const on = now >= slot.start && now < slot.end;
        return (
          '<li class="' +
          (on ? "is-now" : "") +
          '"><strong>' +
          esc(fmtTime(slot.start)) +
          "</strong> · " +
          esc(slot.place) +
          " — " +
          esc(slot.do) +
          "</li>"
        );
      })
      .join("");

    const open = pack.mine.filter((row) => !row.done);
    const done = pack.mine.filter((row) => row.done);
    const work = document.getElementById("workList");
    const empty = document.getElementById("workEmpty");
    empty.hidden = pack.mine.length > 0 || pack.rosterHits.length > 0;
    if (!pack.mine.length && pack.rosterHits.length) {
      empty.hidden = false;
      empty.textContent = "You are on the roster. Checklist jobs with your name will stack under this.";
    }
    work.innerHTML = open
      .concat(done)
      .map((row) => {
        return (
          '<button type="button" class="job' +
          (row.done ? " is-done" : "") +
          '" data-key="' +
          esc(row.key) +
          '"><b>' +
          esc(row.text) +
          "</b><span>" +
          esc(row.sectionTitle) +
          (row.cue ? " · " + row.cue : "") +
          (row.when ? " · " + row.when : "") +
          "</span><em>" +
          (row.done ? "Done" : "Mark done") +
          "</em></button>"
        );
      })
      .join("");
    work.querySelectorAll("[data-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.key;
        const current = (store ? store.readCache()[key] : {}) || {};
        if (store) {
          store.saveOne(key, {
            owner: current.owner || name,
            when: current.when || "",
            done: !current.done,
            extra: current.extra || "",
          });
        }
        render();
      });
    });

    if (window.GGSRadioFeed) {
      const feed = document.getElementById("radioFeed");
      if (feed) window.GGSRadioFeed.render(feed);
    }
    const share = document.getElementById("shareHint");
    share.textContent = "Keep this page on your phone: " + location.origin + slice.pageUrl(name);
  }

  document.getElementById("whoGo").addEventListener("click", () => {
    const typed = document.getElementById("whoInput").value;
    const number = document.getElementById("whoPhone").value;
    const need = document.getElementById("whoNeedPhone");
    if (String(typed || "").trim().length < 2) return;
    if (!slice.phoneDigits(number)) {
      need.hidden = false;
      document.getElementById("whoPhone").focus();
      return;
    }
    need.hidden = true;
    setWho(typed, number);
    render();
  });
  document.getElementById("whoInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("whoGo").click();
  });
  document.getElementById("whoPhone").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("whoGo").click();
  });
  document.getElementById("switchBtn").addEventListener("click", () => {
    writePrefs({ me: "" });
    history.replaceState(null, "", "/me/");
    document.getElementById("whoInput").value = "";
    document.getElementById("whoPhone").value = "";
    render();
  });
  const boardPhone = document.getElementById("boardPhone");
  let phoneTimer = null;
  boardPhone.addEventListener("input", () => {
    clearTimeout(phoneTimer);
    phoneTimer = setTimeout(() => {
      const me = currentName();
      if (!me) return;
      writePrefs({ phone: boardPhone.value });
      if (store && slice.phoneDigits(boardPhone.value)) slice.saveContact(store, me, boardPhone.value);
      render();
    }, 250);
  });

  if (window.GGSRadioFeed) {
    window.GGSRadioFeed.mount({
      feed: "#radioFeed",
      input: "#radioInput",
      send: "#radioSend",
      need: "#whoInput",
      getName: currentName,
    });
  }

  if (queryWho()) writePrefs({ me: queryWho() });

  window.addEventListener("ggs-prep-loaded", render);
  window.addEventListener("ggs-prep-status", (e) => {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    el.textContent =
      e.detail === "saving"
        ? "Saving to every device…"
        : e.detail === "offline"
          ? "Shared board unreachable — this phone only until it reconnects."
          : "Live. New assignments land here.";
  });
  render();
  setInterval(render, 15000);
  if (store) store.startSync();
})();
