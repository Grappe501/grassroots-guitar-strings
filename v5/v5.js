(function () {
  const store = window.GGSPrepStore;
  const PREFS = "ggs-prep-v3-prefs";

  const HOUSE =
    "Arrive 4:30. Food doors 5:15. Buffet 5:30. David 5:45–6:15. Concert-only stay in cars until 6:30. Concert 7:00–about 8:45. Stay until 10 unless Event Captain sends you.";

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
    const min = p[1] || "00";
    if (!Number.isFinite(h)) return t;
    return (h % 12 || 12) + ":" + min + " " + (h >= 12 ? "PM" : "AM");
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

  function seatFor(name) {
    if (window.GGSLeadDuties && window.GGSLeadDuties.jobFor) {
      const job = window.GGSLeadDuties.jobFor(name);
      if (job) return job;
    }
    const jobs = (window.GGSPeople && window.GGSPeople.JOBS) || [];
    const match = window.GGSPeople && window.GGSPeople.match;
    return (
      jobs.find(function (job) {
        return !job.retired && job.defaultOwner && match && match(job.defaultOwner, name);
      }) || null
    );
  }

  function spotFor(name) {
    const named = window.GGSDaySpots && window.GGSDaySpots.spotForName(name);
    if (named) return named;
    const job = seatFor(name);
    if (job && window.GGSDaySpots) {
      return (
        window.GGSDaySpots.SPOTS.find(function (spot) {
          return !spot.retired && spot.leadJob === job.id;
        }) || null
      );
    }
    return null;
  }

  function liveClock(spot) {
    if (window.GGSDaySpots && window.GGSDaySpots.clockFor) return window.GGSDaySpots.clockFor(spot);
    return (spot && spot.clock) || [];
  }

  function paintClock(spot) {
    const root = document.getElementById("nightClock");
    if (!root) return;
    const clock = liveClock(spot);
    if (!clock.length) {
      root.innerHTML = "";
      root.removeAttribute("data-spot");
      return;
    }
    const idx = clockIndex(clock);
    if (root.dataset.spot !== (spot && spot.id) || root.children.length !== clock.length) {
      root.dataset.spot = spot && spot.id ? spot.id : "";
      root.innerHTML = clock
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

  function paintDay() {
    const root = document.getElementById("dayClock");
    const ros = window.GGSRunOfShow;
    if (!root || !ros || !ros.CLOCK) return;
    const clock = ros.CLOCK;
    const idx = clockIndex(clock);
    const stamp = String(clock.length);
    if (root.dataset.ros !== stamp || root.children.length !== clock.length) {
      root.dataset.ros = stamp;
      root.innerHTML = clock
        .map(function (block) {
          return (
            '<li class="is-' +
            esc(block.kind) +
            '"><b>' +
            esc(hm(block.t)) +
            "</b><em>" +
            esc(block.who) +
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

  function paintNow(spot) {
    const card = document.getElementById("nowCard");
    const kicker = document.getElementById("nowKicker");
    const place = document.getElementById("nowPlace");
    const doit = document.getElementById("nowDo");
    const nextEl = document.getElementById("nowNext");
    if (!card) return;
    const clock = liveClock(spot);
    if (!clock.length) {
      card.classList.remove("is-strike");
      if (kicker) kicker.textContent = "Be here first";
      if (place) place.textContent = "Arrive 4:30";
      if (doit) doit.textContent = "Your spot is not named yet. Concert t-shirt on. Open this page when you get there. Steve or Event Captain will put you on a seat.";
      if (nextEl) nextEl.textContent = HOUSE;
      return;
    }
    const now = clockNow();
    const i = clockIndex(clock);
    const current = clock[i];
    const next = clock[i + 1] || null;
    const waiting = now < atTime(clock[0].t, now);
    card.classList.toggle("is-strike", current.kind === "strike");
    if (kicker) kicker.textContent = current.kind === "strike" ? "STRIKE" : waiting ? "Be here first" : kindLabel(current.kind).toUpperCase() + " · " + hm(current.t);
    if (place) place.textContent = spot.title;
    if (doit) doit.textContent = current.text;
    if (nextEl) nextEl.textContent = next ? "Next · " + hm(next.t) + " — " + next.text : "That is the last line on this page.";
  }

  function render() {
    try {
      if (store && store.isPicking && store.isPicking()) return;
      if (window.GGSSignIn) window.GGSSignIn.applyLock();
      const name = meName();
      if (!name) return;
      if (window.GGSLeadDuties && window.GGSLeadDuties.seedDefaults) {
        try {
          window.GGSLeadDuties.seedDefaults();
        } catch (err) {
          /* keep the page even if the shared board is late */
        }
      }
      const spot = spotFor(name);
      const person = window.GGSPeople && (window.GGSPeople.uniquePerson(name) || window.GGSPeople.findPerson(name));
      const first = person && person.first ? person.first : String(name).trim().split(/\s+/)[0];
      const whoEl = document.getElementById("v5Who");
      const helloEl = document.getElementById("v5Hello");
      const kickerEl = document.getElementById("v5Kicker");
      const seatEl = document.getElementById("v5Seat");
      const roleEl = document.getElementById("v5Role");
      if (whoEl) whoEl.textContent = name;
      if (kickerEl) kickerEl.textContent = "GRASSROOTS & GUITAR STRINGS";
      if (seatEl) seatEl.textContent = "Hey " + first;
      if (helloEl) {
        helloEl.textContent = spot
          ? spot.ros
            ? "Thank you for volunteering, " + first + ". Tonight is going to be a great night. You are " + spot.title + ". Fill gaps. Point people where to go. Make sure nobody needs a break. Keep the plan. Take pictures."
            : "Thank you for volunteering, " + first + ". Tonight is going to be a great night. Your job is " + spot.title + ". Keep things fun and lively. Take pictures."
          : "Thank you for volunteering, " + first + ". Tonight is going to be a great night. Keep things fun and lively. Take pictures. Your seat gets your name today.";
      }
      if (roleEl) {
        roleEl.textContent = spot
          ? spot.title + " · Arrive " + spot.arrive + ". Eat — " + spot.eat + ". Sit — " + spot.sit
          : "Arrive 4:30. Your spot gets named today.";
      }
      const facts = document.getElementById("nightFacts");
      const wear = document.getElementById("nightWear");
      const shows = document.getElementById("nightShows");
      const social = document.getElementById("nightSocial");
      if (facts) facts.textContent = spot ? spot.why : HOUSE;
      if (wear) wear.textContent = window.GGSDaySpots ? window.GGSDaySpots.WEAR : "";
      if (shows) {
        shows.textContent = window.GGSDaySpots
          ? window.GGSDaySpots.SHOWS.dinner + " · " + window.GGSDaySpots.SHOWS.concert
          : "";
      }
      if (social) social.textContent = window.GGSDaySpots ? window.GGSDaySpots.SOCIAL : "";
      paintNow(spot);
      paintClock(spot);
      paintDay();
      const night = document.getElementById("nightBlock");
      const day = document.getElementById("dayBlock");
      const live = window.GGSDaySpots && window.GGSDaySpots.clockFor ? window.GGSDaySpots.clockFor(spot) : (spot && spot.clock) || [];
      if (night) night.hidden = !live.length;
      if (day) day.hidden = Boolean(spot && spot.ros);
      const nightEyebrow = night && night.querySelector(".eyebrow");
      const nightH2 = night && night.querySelector("h2");
      if (spot && spot.ros) {
        if (nightEyebrow) nightEyebrow.textContent = "THE PLAN";
        if (nightH2) nightH2.textContent = "The whole night, in order. Gold is now. Fill gaps. Point people. Keep it on plan.";
      }
    } catch (err) {
      const seatEl = document.getElementById("v5Seat");
      if (seatEl && !seatEl.textContent) seatEl.textContent = "Your night";
    }
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
