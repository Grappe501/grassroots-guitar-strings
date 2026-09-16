(function (global) {
  const PREFS = "ggs-prep-v3-prefs";

  function norm(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function nameMatch(owner, me) {
    const a = norm(owner);
    const b = norm(me);
    if (!a || !b || b.length < 2) return false;
    if (a === b) return true;
    const at = a.split(" ");
    const bt = b.split(" ");
    if (bt.length === 1) {
      return at.some((token) => token === bt[0] || (bt[0].length >= 3 && token.startsWith(bt[0])));
    }
    return bt.every((token) => at.includes(token));
  }

  function pageUrl(name) {
    return "/me/?who=" + encodeURIComponent(String(name || "").trim());
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function phoneDigits(phone) {
    const raw = String(phone || "").trim();
    if (!raw) return "";
    const plus = raw[0] === "+";
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 7) return "";
    if (plus) return "+" + digits;
    if (digits.length === 11 && digits[0] === "1") return "+1" + digits.slice(1);
    if (digits.length === 10) return "+1" + digits;
    return digits;
  }

  function telHref(phone) {
    const digits = phoneDigits(phone);
    return digits ? "tel:" + digits : "";
  }

  function smsHref(phone) {
    const digits = phoneDigits(phone);
    return digits ? "sms:" + digits : "";
  }

  function displayPhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    const ten = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
    if (ten.length === 10) return "(" + ten.slice(0, 3) + ") " + ten.slice(3, 6) + "-" + ten.slice(6);
    return String(phone || "").trim();
  }

  function contactHtml(name, phone, opts) {
    const extra = opts && opts.extra ? String(opts.extra) : "";
    const showPage = !opts || opts.page !== false;
    const tel = telHref(phone);
    const sms = smsHref(phone);
    if (!tel) {
      return (
        '<span class="who-contact is-bare">' +
        (showPage
          ? '<a class="who-page" href="' + pageUrl(name) + '">' + esc(name) + "</a>"
          : '<span class="who-call">' + esc(name) + "</span>") +
        (extra ? '<span class="who-extra">' + esc(extra) + "</span>" : "") +
        "</span>"
      );
    }
    return (
      '<span class="who-contact">' +
      '<a class="who-call" href="' +
      tel +
      '">' +
      esc(name) +
      "</a>" +
      '<a class="who-num" href="' +
      tel +
      '">' +
      esc(displayPhone(phone)) +
      "</a>" +
      '<a class="who-sms" href="' +
      sms +
      '">Text</a>' +
      (showPage ? '<a class="who-page" href="' + pageUrl(name) + '">Page</a>' : "") +
      (extra ? '<span class="who-extra">' + esc(extra) + "</span>" : "") +
      "</span>"
    );
  }

  function readContacts(store) {
    const people = {};
    const doc = (store && store.readDoc("contacts")) || {};
    const src = doc.people && typeof doc.people === "object" && !Array.isArray(doc.people) ? doc.people : doc;
    Object.keys(src || {}).forEach((key) => {
      if (key === "people") return;
      const value = src[key];
      if (typeof value === "string" && value.trim()) people[key] = value.trim();
    });
    const roster = (store && store.readDoc("volunteers")) || {};
    ["setup", "event", "strike"].forEach((kind) => {
      (roster[kind] || []).forEach((row) => {
        const name = String(row.name || "").trim();
        const phone = String(row.phone || "").trim();
        if (!name || !phone) return;
        const key = Object.keys(people).find((item) => nameMatch(item, name)) || name;
        if (!people[key]) people[key] = phone;
      });
    });
    return people;
  }

  function phoneFor(name, contacts) {
    const map = contacts || {};
    const hit = Object.keys(map).find((key) => nameMatch(key, name));
    return hit ? map[hit] : "";
  }

  function saveContact(store, name, phone) {
    if (!store) return;
    const cleanName = String(name || "").trim();
    if (!cleanName) return;
    const cleanPhone = String(phone || "").trim();
    const people = readContacts(store);
    const key = Object.keys(people).find((item) => nameMatch(item, cleanName)) || cleanName;
    if (cleanPhone) people[key] = cleanPhone;
    else delete people[key];
    store.saveDoc("contacts", { people: people });
    const roster = store.readDoc("volunteers");
    if (!roster) return;
    let changed = false;
    ["setup", "event", "strike"].forEach((kind) => {
      (roster[kind] || []).forEach((row) => {
        if (nameMatch(row.name, cleanName) && String(row.phone || "") !== cleanPhone) {
          row.phone = cleanPhone;
          changed = true;
        }
      });
    });
    if (changed) store.saveDoc("volunteers", roster);
  }

  function harvest(state, sections) {
    const rows = [];
    (sections || []).forEach((s) => {
      const id = s[0];
      const title = s[1];
      const cards = s[3];
      const timeline = s[4];
      if (timeline) {
        timeline.forEach((r, i) => {
          const key = id + ":timeline:" + i;
          const row = (state && state[key]) || {};
          rows.push({
            key,
            section: id,
            sectionTitle: title,
            card: "Timeline",
            text: r[1],
            cue: r[0],
            owner: row.owner || "",
            done: !!row.done,
            when: row.when || "",
          });
        });
      }
      (cards || []).forEach((c, ci) => {
        (c[1] || []).forEach((t, ti) => {
          const key = id + ":" + ci + ":" + ti;
          const row = (state && state[key]) || {};
          rows.push({
            key,
            section: id,
            sectionTitle: title,
            card: c[0],
            text: t,
            cue: "",
            owner: row.owner || "",
            done: !!row.done,
            when: row.when || "",
          });
        });
      });
    });
    return rows;
  }

  const ROLES = [
    {
      id: "captain",
      label: "Event Captain",
      priority: 1,
      test: /event captain|choose event captain|hard checkpoint|announce teardown/i,
      roster: /event captain/i,
      day: [
        { start: "2026-09-17T16:30:00", end: "2026-09-17T17:00:00", place: "Main room", do: "Shift the building from setup to event mode." },
        { start: "2026-09-17T17:00:00", end: "2026-09-17T18:45:00", place: "Whole room", do: "Walk stations. Tickets, buffet, campaign, and stage all have an owner." },
        { start: "2026-09-17T18:45:00", end: "2026-09-17T19:00:00", place: "Stage + lobby", do: "Hard checkpoint. Concert starts at 7:00." },
        { start: "2026-09-17T19:00:00", end: "2026-09-17T20:45:00", place: "Show floor", do: "Stay visible. Call strike the moment the show ends." },
        { start: "2026-09-17T20:45:00", end: "2026-09-17T22:00:00", place: "Whole building", do: "Strike now. Confirm the building is cleared by 10:00 PM." },
      ],
    },
    {
      id: "setup",
      label: "Setup crew",
      priority: 5,
      test: /setup person|tables|chairs|horseshoe|tablecloth|lobby ticket setup|position 8 round/i,
      roster: /setup/i,
      day: [
        { start: "2026-09-17T08:00:00", end: "2026-09-17T16:30:00", place: "Main room · horseshoe", do: "Tables, 64 chairs, buffet, lobby table, signs, campaign display." },
        { start: "2026-09-17T16:30:00", end: "2026-09-17T17:00:00", place: "Main room", do: "Room ready for guests. Then hand off to event crew." },
      ],
    },
    {
      id: "production",
      label: "Tracy + production",
      priority: 3,
      test: /tracy|sound|speaker|microphone|mixer|stage light|extension cord|acoustic|bar stool/i,
      roster: /david\/performer|tracy/i,
      day: [
        { start: "2026-09-17T08:00:00", end: "2026-09-17T17:30:00", place: "Stage + dance floor", do: "Sound, lights, power, full check." },
        { start: "2026-09-17T17:45:00", end: "2026-09-17T18:15:00", place: "Center dance floor", do: "David acoustic set. Clear the floor by 6:30 doors." },
        { start: "2026-09-17T18:15:00", end: "2026-09-17T19:00:00", place: "Stage", do: "Concert set. 6:45 hard checkpoint." },
        { start: "2026-09-17T19:00:00", end: "2026-09-17T20:45:00", place: "Stage", do: "Show. Stay on sound and lights." },
        { start: "2026-09-17T20:45:00", end: "2026-09-17T22:00:00", place: "Strike D · stage", do: "Pack production. Load Tracy's vehicle." },
      ],
    },
    {
      id: "tickets",
      label: "Tickets + money",
      priority: 2,
      test: /ticket|cash|envelope|reconcile|payment|guest list/i,
      roster: /ticket|check-in/i,
      day: [
        { start: "2026-09-17T17:00:00", end: "2026-09-17T18:30:00", place: "Lobby · ticket table", do: "Table live before BBQ guests. QR, cash, envelopes." },
        { start: "2026-09-17T18:30:00", end: "2026-09-17T19:15:00", place: "Lobby · ticket table", do: "Concert doors. Keep the line moving." },
        { start: "2026-09-17T19:15:00", end: "2026-09-17T20:45:00", place: "Lobby or nearby", do: "Late arrivals. Hold the cash box." },
        { start: "2026-09-17T20:45:00", end: "2026-09-17T22:00:00", place: "Lobby · then secure", do: "Reconcile tickets, cash, and envelopes. Do not leave money on a table." },
      ],
    },
    {
      id: "food",
      label: "Food + drinks",
      priority: 3,
      test: /bbq|buffet|tea|lemonade|cooler|pulled pork|ben |plates|serving/i,
      roster: /bbq|food|water|ice|cooler/i,
      day: [
        { start: "2026-09-17T17:00:00", end: "2026-09-17T17:30:00", place: "Buffet + $1 water / ice", do: "Receive food. Ice stocked. Water signs and money bag out." },
        { start: "2026-09-17T17:30:00", end: "2026-09-17T18:30:00", place: "Buffet + $1 water", do: "BBQ / social hour. Sell water for a $1 donation. Cards scan GoodChange." },
        { start: "2026-09-17T18:30:00", end: "2026-09-17T20:45:00", place: "Coolers · $1 water", do: "Keep ice and water up. Cash in the bag. Cards to the GGS QR." },
        { start: "2026-09-17T20:45:00", end: "2026-09-17T22:00:00", place: "Strike C · food", do: "Clear food, drinks, coolers, trash." },
      ],
    },
    {
      id: "campaign",
      label: "Campaign + merch",
      priority: 4,
      test: /yard sign|merch|qr|literature|regnet|campaign display|t-shirt/i,
      roster: /campaign|sign/i,
      day: [
        { start: "2026-09-17T17:00:00", end: "2026-09-17T20:45:00", place: "Merch + campaign display", do: "Signs, literature, shirts, QR. Stay at the table." },
        { start: "2026-09-17T20:45:00", end: "2026-09-17T22:00:00", place: "Strike B · campaign", do: "Pack signs, merch, literature. Count what is left." },
      ],
    },
    {
      id: "photo",
      label: "Vertical photo / video",
      priority: 4,
      test: /photo|video|vertical|photographer/i,
      roster: /photo|video/i,
      day: [
        { start: "2026-09-17T17:00:00", end: "2026-09-17T20:45:00", place: "Roam the room", do: "Vertical only. Guests, Kelly, David, the room, the work." },
        { start: "2026-09-17T20:45:00", end: "2026-09-17T21:15:00", place: "Closing shot", do: "One group / closing frame. Then help strike if you can." },
      ],
    },
    {
      id: "greeter",
      label: "Guest greeter",
      priority: 4,
      test: /greeter|welcome guests|kelly\/guest|guest-relations/i,
      roster: /greeter|kelly\/guest/i,
      day: [
        { start: "2026-09-17T17:00:00", end: "2026-09-17T19:15:00", place: "Lobby + room entry", do: "Meet people. Point them to tickets, food, and seats." },
      ],
    },
    {
      id: "strike",
      label: "Strike / teardown",
      priority: 2,
      test: /strike|teardown|load-out|final venue|building cleared/i,
      roster: /tables \/ chairs|campaign \/ signs|food \/ drinks|production \/ load|venue \/ final/i,
      day: [
        { start: "2026-09-17T20:45:00", end: "2026-09-17T22:00:00", place: "Your strike zone", do: "Start immediately when the show ends. Building clear by 10:00 PM." },
      ],
    },
  ];

  function inferRoles(mine, rosterHits) {
    const found = [];
    ROLES.forEach((role) => {
      const fromTasks = (mine || []).some((row) => role.test.test(row.text) || role.test.test(row.sectionTitle || ""));
      const fromRoster = (rosterHits || []).some((row) => role.roster.test(String(row.role || "")) || role.test.test(String(row.role || "")));
      if (fromTasks || fromRoster) found.push(role);
    });
    return found.sort((a, b) => a.priority - b.priority);
  }

  function cueAt(roles, now) {
    const strike = new Date("2026-09-17T20:45:00");
    const clear = new Date("2026-09-17T22:00:00");
    if (now >= clear) {
      return { place: "Done", do: "Building should be cleared. If you are still inside, finish the last walkthrough.", next: null, strike: true };
    }
    const windows = [];
    (roles || []).forEach((role) => {
      (role.day || []).forEach((slot) => {
        windows.push({
          role: role.label,
          start: new Date(slot.start),
          end: new Date(slot.end),
          place: slot.place,
          do: slot.do,
        });
      });
    });
    windows.sort((a, b) => a.start - b.start);
    const current = windows.filter((w) => now >= w.start && now < w.end);
    const upcoming = windows.find((w) => w.start > now);
    if (now >= strike && roles.some((r) => r.id === "strike" || r.id === "captain" || r.id === "production" || r.id === "food" || r.id === "campaign" || r.id === "tickets")) {
      const strikeWin = current.find((w) => w.start >= strike) || current[0];
      if (strikeWin) {
        return { place: strikeWin.place, do: strikeWin.do, next: null, strike: true, role: strikeWin.role };
      }
    }
    if (current.length) {
      const pick = current[0];
      return {
        place: pick.place,
        do: pick.do,
        role: pick.role,
        next: upcoming ? { when: upcoming.start, place: upcoming.place, do: upcoming.do } : null,
        strike: now >= strike,
      };
    }
    if (upcoming) {
      return {
        place: upcoming.place,
        do: "First post: " + upcoming.do,
        role: upcoming.role,
        next: upcoming,
        waiting: true,
      };
    }
    if (!(roles || []).length) {
      return { place: "Not on the board yet", do: "When someone puts your name on a job, this page fills in.", next: null, empty: true };
    }
    return { place: "Stand by", do: "Your jobs are on this page. Wait for your next cue.", next: null };
  }

  function peopleFrom(state, roster, sections) {
    const names = {};
    harvest(state, sections).forEach((row) => {
      const name = String(row.owner || "").trim();
      if (name) names[name] = true;
    });
    Object.keys(state || {}).forEach((key) => {
      if (key.indexOf("_doc:") === 0) return;
      const name = String((state[key] && state[key].owner) || "").trim();
      if (name) names[name] = true;
    });
    ["setup", "event", "strike"].forEach((kind) => {
      ((roster && roster[kind]) || []).forEach((row) => {
        const name = String(row.name || "").trim();
        if (name) names[name] = true;
      });
    });
    return Object.keys(names).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }

  function sliceFor(name, state, roster, sections) {
    const mine = harvest(state, sections).filter((row) => nameMatch(row.owner, name));
    const rosterHits = [];
    ["setup", "event", "strike"].forEach((kind) => {
      ((roster && roster[kind]) || []).forEach((row) => {
        if (nameMatch(row.name, name)) rosterHits.push(Object.assign({ kind }, row));
      });
    });
    const roles = inferRoles(mine, rosterHits);
    return { mine, rosterHits, roles };
  }

  global.GGSCrewSlice = {
    PREFS,
    nameMatch,
    pageUrl,
    harvest,
    inferRoles,
    cueAt,
    peopleFrom,
    sliceFor,
    ROLES,
    esc,
    phoneDigits,
    telHref,
    smsHref,
    displayPhone,
    contactHtml,
    readContacts,
    phoneFor,
    saveContact,
  };
})(window);
