(function (global) {
  const store = global.GGSPrepStore;
  const dir = global.GGSPeople;

  function jobs() {
    const base = (dir && dir.JOBS) || [];
    const doc = store ? store.readDoc("lead-jobs") : null;
    const saved = doc && Array.isArray(doc.jobs) ? doc.jobs : [];
    return base.map((job) => {
      const hit = saved.find((row) => row && row.id === job.id) || {};
      let owner = String(hit.owner || "").trim();
      if (!owner || (dir && dir.match(owner, job.cartoon))) owner = job.defaultOwner || job.cartoon;
      return Object.assign({}, job, { owner: owner });
    });
  }

  const VOL_SEATS = {
    event: { kind: "event", hint: /event captain/i },
    setup: { kind: "setup", hint: /setup lead|setup captain/i, role: "Setup Lead — 10:00 room. Gather the 3 dressers." },
    tickets: { kind: "event", hint: /^tickets\b/i },
    food: { kind: "event", hint: /food service lead/i },
    campaign: { kind: "event", hint: /campaign \+ merch|^campaign\b|\bmerch\b/i },
    production: { kind: "event", hint: /tracy production helper|\btracy\b/i },
    relief: { kind: "event", hint: /floater a/i },
    relief2: { kind: "event", hint: /floater b/i },
    kelly: { kind: "event", hint: /kelly support/i },
    photo: { kind: "event", hint: /photo lead/i },
    strike: { kind: "strike", hint: /strike lead/i, role: "Strike Lead — call the walk. Venue furniture stays." },
  };

  function syncSpot(id, owner) {
    if (!global.GGSDaySpots || !store) return;
    const spot = global.GGSDaySpots.SPOTS.find((row) => row.leadJob === id);
    if (spot) global.GGSDaySpots.saveOwner(store, spot.id, owner, { skipLead: true });
  }

  function realOwner(id, owner) {
    const name = String(owner || "").trim();
    if (!name) return "";
    const job = ((dir && dir.JOBS) || []).find((row) => row.id === id);
    if (job && dir && dir.match(name, job.cartoon)) return String(job.defaultOwner || "").trim();
    return name;
  }

  function phoneFor(name) {
    const person = dir ? dir.findPerson(name) : null;
    return person && person.phone ? String(person.phone).trim() : "";
  }

  function jobArrival(id) {
    const job = ((dir && dir.JOBS) || []).find((row) => row.id === id);
    return job ? String(job.arrival || "").trim() : "";
  }

  function syncVolunteer(id, owner) {
    if (!store) return false;
    const seat = VOL_SEATS[id];
    if (!seat) return false;
    const name = realOwner(id, owner);
    if (!name) return false;
    const doc = store.readDoc("volunteers") || { setup: [], event: [], strike: [], grounds: [] };
    if (!doc[seat.kind]) doc[seat.kind] = [];
    let row = doc[seat.kind].find((item) => seat.hint.test(String((item && item.role) || "")));
    if (!row) {
      row = {
        role: seat.role || String(id),
        name: "",
        phone: "",
        arrival: jobArrival(id),
        backup: "",
        done: false,
      };
      if (seat.kind === "setup" || seat.kind === "strike") doc[seat.kind].unshift(row);
      else doc[seat.kind].push(row);
    }
    const same = dir ? dir.match(row.name, name) : String(row.name || "").trim() === name;
    const phone = phoneFor(name);
    let dirty = false;
    if (!same) {
      row.name = name;
      dirty = true;
    } else if (!String(row.name || "").trim()) {
      row.name = name;
      dirty = true;
    }
    if (phone && String(row.phone || "").trim() !== phone) {
      row.phone = phone;
      dirty = true;
    }
    if (!String(row.arrival || "").trim() && jobArrival(id)) {
      row.arrival = jobArrival(id);
      dirty = true;
    }
    if (dirty) store.saveDoc("volunteers", doc);
    return dirty;
  }

  function applyToVolunteers(state) {
    if (!state) return false;
    let dirty = false;
    jobs().forEach((job) => {
      const seat = VOL_SEATS[job.id];
      if (!seat) return;
      const name = ownerName(job);
      if (!name) return;
      if (isCartoon(job) && !job.defaultOwner) return;
      if (!state[seat.kind]) state[seat.kind] = [];
      let row = state[seat.kind].find((item) => seat.hint.test(String((item && item.role) || "")));
      if (!row) {
        row = {
          role: seat.role || job.title,
          name: "",
          phone: "",
          arrival: job.arrival || "",
          backup: "",
          done: false,
        };
        if (seat.kind === "setup" || seat.kind === "strike") state[seat.kind].unshift(row);
        else state[seat.kind].push(row);
        dirty = true;
      }
      const same = dir ? dir.match(row.name, name) : String(row.name || "").trim() === name;
      if (!same) {
        row.name = name;
        dirty = true;
      }
      const phone = phoneFor(name);
      if (phone && String(row.phone || "").trim() !== phone) {
        row.phone = phone;
        dirty = true;
      }
      if (!String(row.arrival || "").trim() && job.arrival) {
        row.arrival = job.arrival;
        dirty = true;
      }
    });
    return dirty;
  }

  function jobIdForVolunteer(kind, role) {
    const text = String(role || "");
    return (
      Object.keys(VOL_SEATS).find((id) => {
        const seat = VOL_SEATS[id];
        return seat.kind === kind && seat.hint.test(text);
      }) || ""
    );
  }

  function saveOwner(id, owner) {
    if (!store) return;
    const next = jobs().map((job) => ({
      id: job.id,
      owner: job.id === id ? String(owner || job.cartoon).trim() || job.cartoon : job.owner,
    }));
    store.saveDoc("lead-jobs", { v: 1, jobs: next });
    const claimed = next.find((row) => row.id === id);
    if (claimed && claimed.owner) {
      syncSpot(id, claimed.owner);
      syncVolunteer(id, claimed.owner);
    }
    if (store.flush) store.flush();
  }

  function ownerName(job) {
    if (!job) return "";
    const owner = String(job.owner || "").trim();
    if (owner && !isCartoon(job)) return owner;
    return String(job.defaultOwner || "").trim();
  }

  function jobFor(name) {
    if (!name) return null;
    return (
      jobs().find((job) => {
        const owner = ownerName(job);
        if (!owner) return false;
        return dir ? dir.match(owner, name) : false;
      }) || null
    );
  }

  function isCartoon(job) {
    if (!job) return true;
    return dir ? dir.match(job.owner, job.cartoon) : true;
  }

  function briefing(name) {
    const person = dir ? dir.findPerson(name) : null;
    const claimed = jobFor(name);
    if (claimed) {
      return {
        kicker: "YOUR SEAT · " + claimed.title.toUpperCase(),
        title: claimed.title,
        next: claimed.owns,
        duties: claimed.duties,
        job: claimed,
        person: person,
      };
    }
    if (person) {
      return {
        kicker: person.kicker,
        title: person.title,
        next: person.next,
        duties: person.duties,
        job: null,
        person: person,
      };
    }
    return {
      kicker: "YOUR NIGHT",
      title: "You are on the board.",
      next: "When a lead puts your name on a job, this page fills in.",
      duties: [],
      job: null,
      person: null,
    };
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function seedDefaults() {
    if (!store || !dir) return;
    const doc = store.readDoc("lead-jobs") || {};
    const saved = Array.isArray(doc.jobs) ? doc.jobs.slice() : [];
    let dirty = false;
    dir.JOBS.forEach((job) => {
      if (!job.defaultOwner) return;
      const hit = saved.find((row) => row && row.id === job.id);
      const current = hit ? String(hit.owner || "").trim() : "";
      if (current && !dir.match(current, job.cartoon)) return;
      if (hit) hit.owner = job.defaultOwner;
      else saved.push({ id: job.id, owner: job.defaultOwner });
      dirty = true;
    });
    if (dirty) {
      store.saveDoc("lead-jobs", { v: 1, jobs: saved });
      saved.forEach((row) => {
        if (row && row.owner) syncSpot(row.id, row.owner);
      });
    }
    jobs().forEach((job) => {
      const name = ownerName(job);
      if (name) syncVolunteer(job.id, name);
    });
  }

  function renderBoard() {
    const root = document.getElementById("leadJobList");
    if (!root || !dir) return;
    if (store && store.isPicking && store.isPicking()) return;
    seedDefaults();
    root.innerHTML = jobs()
      .map((job) => {
        const open = isCartoon(job);
        return (
          '<article class="lead-job' +
          (open ? " is-open" : " is-claimed") +
          '"><p class="eyebrow">' +
          job.rank +
          " · " +
          esc(job.weight) +
          "</p><h2>" +
          esc(job.title) +
          "</h2><p class=\"lead-owns\">" +
          esc(job.owns) +
          "</p><p class=\"lead-when\">Be there " +
          esc(job.arrival) +
          '.</p><label>Who has this seat' +
          dir.leadSelectHtml(open ? "" : job.owner, {
            className: "lead-owner",
            attrs: 'data-job="' + esc(job.id) + '"',
            blank: "Open — pick a lead",
          }) +
          "</label><p class=\"lead-cartoon\">Was a placeholder: " +
          esc(job.cartoon) +
          "</p><ul>" +
          job.duties.concat(global.GGSDaySpots && global.GGSDaySpots.SOCIAL ? [global.GGSDaySpots.SOCIAL] : []).map((d) => "<li>" + esc(d) + "</li>").join("") +
          "</ul></article>"
        );
      })
      .join("");
    root.querySelectorAll(".lead-owner").forEach((input) => {
      input.addEventListener("change", function () {
        saveOwner(input.dataset.job, input.value);
        renderBoard();
      });
    });
  }

  global.GGSLeadDuties = {
    jobs,
    saveOwner,
    jobFor,
    isCartoon,
    briefing,
    renderBoard,
    seedDefaults,
    ownerName,
    applyToVolunteers,
    jobIdForVolunteer,
    syncVolunteer,
    VOL_SEATS,
  };
  global.addEventListener("ggs-prep-loaded", seedDefaults);
  if (document.getElementById("leadJobList")) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderBoard);
    else renderBoard();
    global.addEventListener("ggs-prep-loaded", renderBoard);
  }
})(window);
