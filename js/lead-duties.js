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

  function syncSpot(id, owner) {
    if (!global.GGSDaySpots || !store) return;
    const spot = global.GGSDaySpots.SPOTS.find((row) => row.leadJob === id);
    if (spot) global.GGSDaySpots.saveOwner(store, spot.id, owner, { skipLead: true });
  }

  function saveOwner(id, owner) {
    if (!store) return;
    const next = jobs().map((job) => ({
      id: job.id,
      owner: job.id === id ? String(owner || job.cartoon).trim() || job.cartoon : job.owner,
    }));
    store.saveDoc("lead-jobs", { v: 1, jobs: next });
    const claimed = next.find((row) => row.id === id);
    if (claimed && claimed.owner) syncSpot(id, claimed.owner);
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
  }

  function renderBoard() {
    const root = document.getElementById("leadJobList");
    if (!root || !dir) return;
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

  global.GGSLeadDuties = { jobs, saveOwner, jobFor, isCartoon, briefing, renderBoard, seedDefaults, ownerName };
  global.addEventListener("ggs-prep-loaded", seedDefaults);
  if (document.getElementById("leadJobList")) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderBoard);
    else renderBoard();
    global.addEventListener("ggs-prep-loaded", renderBoard);
  }
})(window);
