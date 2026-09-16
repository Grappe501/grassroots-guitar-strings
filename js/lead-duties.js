(function (global) {
  const store = global.GGSPrepStore;
  const dir = global.GGSPeople;

  function jobs() {
    const base = (dir && dir.JOBS) || [];
    const doc = store ? store.readDoc("lead-jobs") : null;
    const saved = doc && Array.isArray(doc.jobs) ? doc.jobs : [];
    return base.map((job) => {
      const hit = saved.find((row) => row && row.id === job.id) || {};
      const owner = String(hit.owner || job.cartoon).trim() || job.cartoon;
      return Object.assign({}, job, { owner: owner });
    });
  }

  function saveOwner(id, owner) {
    if (!store) return;
    const next = jobs().map((job) => ({
      id: job.id,
      owner: job.id === id ? String(owner || job.cartoon).trim() || job.cartoon : job.owner,
    }));
    store.saveDoc("lead-jobs", { v: 1, jobs: next });
    if (store.flush) store.flush();
  }

  function jobFor(name) {
    if (!name) return null;
    return (
      jobs().find((job) => {
        if (isCartoon(job)) return false;
        return dir ? dir.match(job.owner, name) : false;
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

  function renderBoard() {
    const root = document.getElementById("leadJobList");
    if (!root || !dir) return;
    const people = dir.names();
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
          '</p><h2>' +
          esc(job.title) +
          "</h2><p class=\"lead-owns\">" +
          esc(job.owns) +
          "</p><p class=\"lead-when\">Be there " +
          esc(job.arrival) +
          '.</p><label>Who has this seat<input class="lead-owner" data-job="' +
          esc(job.id) +
          '" list="leadPeople" value="' +
          esc(job.owner) +
          '"></label><p class="lead-cartoon">Placeholder until the meeting: ' +
          esc(job.cartoon) +
          "</p><ul>" +
          job.duties.map((d) => "<li>" + esc(d) + "</li>").join("") +
          "</ul></article>"
        );
      })
      .join("");
    const list = document.getElementById("leadPeople");
    if (list) list.innerHTML = people.map((n) => '<option value="' + esc(n) + '"></option>').join("");
    root.querySelectorAll(".lead-owner").forEach((input) => {
      input.addEventListener("change", function () {
        saveOwner(input.dataset.job, input.value);
        renderBoard();
      });
    });
  }

  global.GGSLeadDuties = { jobs, saveOwner, jobFor, isCartoon, briefing, renderBoard };
  if (document.getElementById("leadJobList")) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderBoard);
    else renderBoard();
    global.addEventListener("ggs-prep-loaded", renderBoard);
  }
})(window);
