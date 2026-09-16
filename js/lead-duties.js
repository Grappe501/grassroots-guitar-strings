(function (global) {
  const store = global.GGSPrepStore;
  const dir = global.GGSPeople;

  function jobs() {
    const base = (dir && dir.JOBS) || [];
    const doc = store ? store.readDoc("lead-jobs") : null;
    const saved = doc && Array.isArray(doc.jobs) ? doc.jobs : [];
    return base.filter((job) => !job.retired).map((job) => {
      const hit = saved.find((row) => row && row.id === job.id) || {};
      let owner = String(hit.owner || "").trim();
      if (dir && dir.canonName) owner = dir.canonName(owner);
      if (!owner || (dir && dir.match(owner, job.cartoon))) owner = job.defaultOwner || "";
      return Object.assign({}, job, { owner: owner });
    });
  }

  const VOL_SEATS = {
    event: { kind: "event", hint: /event captain/i },
    setup: { kind: "setup", hint: /setup lead|setup captain/i, role: "Setup Lead — 10:00 room. Path signs from the gate. Gather the 3 dressers." },
    tickets: { kind: "event", hint: /^tickets\b/i },
    food: { kind: "event", hint: /food service lead/i },
    campaign: { kind: "event", hint: /campaign \+ merch/i },
    merch2: { kind: "event", hint: /merch 2/i, role: "Merch 2 — rush helper. Acoustic over to 7:00. Donations, handouts, greet." },
    relief: { kind: "event", hint: /production manager 1|floater a|relief lead(?! 2)/i, role: "Production Manager 1 — fill gaps, point people, keep the plan." },
    relief2: { kind: "event", hint: /production manager 2|floater b|relief lead 2/i, role: "Production Manager 2 — fill gaps, point people, keep the plan." },
    kelly: { kind: "event", hint: /kelly support/i },
    photo: { kind: "event", hint: /photo lead/i },
    strike: { kind: "event", hint: /strike lead|close lead|teardown captain|^strike \/|^strike\b/i, role: "Strike Lead — call the walk. Venue furniture stays." },
    setup1: { kind: "setup", hint: /setup 1/i, role: "Setup 1 — morning dresser" },
    setup2: { kind: "setup", hint: /setup 2/i, role: "Setup 2 — morning dresser" },
    server1: { kind: "event", hint: /server 1/i },
    server2: { kind: "event", hint: /server 2/i },
    server3: { kind: "event", hint: /server 3/i },
    water: { kind: "event", hint: /drink station|^water —/i },
    parking: { kind: "grounds", hint: /parking/i },
    crowd: { kind: "grounds", hint: /crowd|lobby/i },
    muscle1: { kind: "strike", hint: /muscle 1/i },
    muscle2: { kind: "strike", hint: /muscle 2/i },
    muscle3: { kind: "strike", hint: /muscle 3/i },
  };

  function syncSpot(id, owner) {
    if (!global.GGSDaySpots || !store) return;
    const spot = global.GGSDaySpots.SPOTS.find((row) => row.leadJob === id);
    if (spot) global.GGSDaySpots.saveOwner(store, spot.id, owner, { skipLead: true });
  }

  function realOwner(id, owner) {
    const name = dir && dir.canonName ? dir.canonName(owner) : String(owner || "").trim();
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
    let name = realOwner(id, owner);
    const person = dir ? dir.findPerson(name) : null;
    if (person) name = person.name;
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
      let name = ownerName(job);
      if (global.GGSDaySpots && store) {
        const map = global.GGSDaySpots.owners(store);
        const spot = global.GGSDaySpots.SPOTS.find((row) => row.leadJob === job.id || row.id === job.id);
        if (spot && map[spot.id]) name = String(map[spot.id]).trim();
      }
      const person = dir ? dir.findPerson(name) : null;
      if (person) name = person.name;
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
    const name = dir && dir.canonName ? dir.canonName(owner) : String(owner || "").trim();
    const duty = allJobs().find((job) => job.id === id);
    if (duty && duty.spotId && global.GGSDaySpots) {
      global.GGSDaySpots.saveOwner(store, duty.spotId, name, { skipLead: true });
    }
    const leadId = (duty && duty.leadJob) || id;
    if (jobs().some((job) => job.id === leadId)) {
      const next = jobs().map((job) => ({
        id: job.id,
        owner: job.id === leadId ? name || job.defaultOwner || "" : job.owner,
      }));
      store.saveDoc("lead-jobs", { v: 1, jobs: next });
      if (name) syncSpot(leadId, name);
    }
    if (name) syncVolunteer(leadId, name);
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
      allJobs().find((job) => {
        const owner = ownerName(job);
        if (!owner) return false;
        return dir ? dir.match(owner, name) : false;
      }) || null
    );
  }

  function signedName() {
    if (global.GGSSignIn && global.GGSSignIn.identity) {
      return String(global.GGSSignIn.identity().name || "").trim();
    }
    try {
      return String(JSON.parse(localStorage.getItem("ggs-prep-v3-prefs") || "{}").me || "").trim();
    } catch (err) {
      return "";
    }
  }

  function wantsAllDuties() {
    return /(?:\?|&)all=1\b/.test(location.search || "");
  }

  function allJobs() {
    const spots = (global.GGSDaySpots && global.GGSDaySpots.SPOTS) || [];
    const leadList = jobs();
    const map = global.GGSDaySpots && store ? global.GGSDaySpots.owners(store) : {};
    const used = {};
    const fromSpots = spots
      .filter((spot) => !spot.retired)
      .map((spot) => {
        const lead = leadList.find((job) => job.id === spot.leadJob || job.id === spot.id);
        used[spot.id] = true;
        if (lead) used[lead.id] = true;
        const spotWho = String((map && map[spot.id]) || "").trim();
        const leadWho = lead ? ownerName(lead) : "";
        const owner = spotWho || leadWho;
        return {
          id: spot.id,
          rank: spot.n,
          title: spot.title,
          weight: spot.short,
          cartoon: lead ? lead.cartoon : "",
          defaultOwner: lead ? lead.defaultOwner : "",
          arrival: spot.arrive,
          owns: spot.why,
          duties: (lead && lead.duties && lead.duties.length ? lead.duties : (spot.clock || []).map((row) => row.text)),
          owner: owner,
          spotId: spot.id,
          leadJob: spot.leadJob || "",
        };
      });
    const extras = leadList
      .filter((job) => !used[job.id])
      .map((job) => Object.assign({}, job, { spotId: "" }));
    return fromSpots.concat(extras).sort((a, b) => Number(a.rank || 99) - Number(b.rank || 99));
  }

  function visibleJobs() {
    const list = allJobs();
    const me = signedName();
    if (!me || wantsAllDuties()) return list;
    const mine = list.filter((job) => {
      const owner = ownerName(job);
      return owner && dir && dir.match(owner, me);
    });
    return mine.length ? mine : list;
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
    saved.forEach((hit) => {
      if (!hit || !hit.owner) return;
      const person = dir.findPerson(hit.owner);
      if (person && String(hit.owner).trim() !== person.name) {
        hit.owner = person.name;
        dirty = true;
      }
    });
    dir.JOBS.forEach((job) => {
      if (job.retired) return;
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
    const me = signedName();
    const showing = visibleJobs();
    const personal = Boolean(me && showing.length === 1 && !wantsAllDuties());
    const title = document.getElementById("dutyTitle");
    const intro = document.getElementById("dutyIntro");
    if (title) title.textContent = personal ? "Your duty." : "Every duty. One board.";
    if (intro) {
      intro.textContent = personal
        ? "This is your job tonight. Open Tonight for the minute-by-minute clock."
        : "Overall view. Name each seat. When someone opens this page, they only see their own duty.";
    }
    const view = document.getElementById("dutyViewLink");
    if (view) {
      if (personal) {
        view.hidden = false;
        view.href = "/leads/?all=1";
        view.textContent = "See every duty";
      } else if (me && !wantsAllDuties()) {
        view.hidden = true;
      } else if (wantsAllDuties()) {
        view.hidden = false;
        view.href = "/leads/";
        view.textContent = "Just my duty";
      } else {
        view.hidden = true;
      }
    }
    root.innerHTML = showing
      .map((job) => {
        const open = isCartoon(job);
        const who = ownerName(job);
        const picker = personal
          ? "<p class=\"lead-when\">This is your duty" + (who ? " · " + esc(who) : "") + ".</p>"
          : "<label>Who has this seat" +
            dir.leadSelectHtml(open ? "" : job.owner, {
              className: "lead-owner",
              attrs: 'data-job="' + esc(job.id) + '"',
              blank: "Open — pick a name",
            }) +
            "</label>";
        return (
          '<article class="lead-job' +
          (open ? " is-open" : " is-claimed") +
          (personal ? " is-mine" : "") +
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
          ".</p>" +
          picker +
          "<ul>" +
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
    allJobs,
    visibleJobs,
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
