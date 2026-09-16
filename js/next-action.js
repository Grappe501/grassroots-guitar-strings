(function (global) {
  const NEED_STRIKE = 10;
  const MARK = {
    open: "2026-09-17T08:00:00",
    eventMode: "2026-09-17T16:30:00",
    bbq: "2026-09-17T17:30:00",
    doors: "2026-09-17T18:30:00",
    show: "2026-09-17T19:00:00",
    strike: "2026-09-17T20:45:00",
    clear: "2026-09-17T22:00:00",
  };

  function firstName(name) {
    const s = String(name || "").trim();
    return s.split(/\s+/)[0] || s;
  }

  function phase(now) {
    if (now >= new Date(MARK.clear)) return "late";
    if (now >= new Date(MARK.strike)) return "strike";
    if (now >= new Date(MARK.show)) return "show";
    if (now >= new Date(MARK.doors)) return "doors";
    if (now >= new Date(MARK.bbq)) return "bbq";
    if (now >= new Date(MARK.eventMode)) return "event";
    if (now >= new Date(MARK.open)) return "setup";
    return "prep";
  }

  function weight(p, kind) {
    const table = {
      prep: { captain: 12, strike: 11, buy: 10, ice: 8, tracy: 9, signs: 7, stool: 6, tickets: 6, setup: 8 },
      setup: { tracy: 11, setup: 10, buy: 10, ice: 9, signs: 8, stool: 8, strike: 7, captain: 8 },
      event: { ice: 13, water: 12, food: 10, tickets: 10, setup: 6, stool: 8, strike: 7, buy: 8 },
      bbq: { ice: 12, water: 12, food: 10, stool: 7, strike: 8 },
      doors: { tickets: 11, stool: 6, strike: 8, water: 7 },
      show: { strike: 10, water: 6 },
      strike: { strike: 20, clear: 16 },
      late: { clear: 20, strike: 12 },
    };
    return (table[p] && table[p][kind]) || 0;
  }

  function harvest(state) {
    const sections = global.GGS_PREP_SECTIONS || [];
    if (global.GGSCrewSlice && global.GGSCrewSlice.harvest) {
      return global.GGSCrewSlice.harvest(state || {}, sections);
    }
    return [];
  }

  function undone(list, re) {
    return list.filter((row) => !row.done && re.test(row.text || ""));
  }

  function named(list, re) {
    const hit = list.find((row) => re.test(row.text || "") && String(row.owner || "").trim());
    return hit ? firstName(hit.owner) : "";
  }

  function strikeCount(roster) {
    const seen = [];
    ((roster && roster.strike) || []).forEach((row) => {
      const name = String((row && row.name) || "").trim();
      if (!name) return;
      const dup = seen.some((item) =>
        global.GGSCrewSlice ? global.GGSCrewSlice.nameMatch(item, name) : item.toLowerCase() === name.toLowerCase()
      );
      if (!dup) seen.push(name);
    });
    return seen.length;
  }

  function clockMeta(now, p) {
    const labels = {
      prep: "Before Thursday doors",
      setup: "Venue access / setup",
      event: "Shift to event mode",
      bbq: "BBQ / social hour",
      doors: "Concert doors",
      show: "Concert is live",
      strike: "STRIKE · clear by 10:00 PM",
      late: "Past 10:00 PM",
    };
    return (
      "Live from the board · " +
      now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) +
      " · " +
      (labels[p] || "")
    );
  }

  function compute(now, state, roster) {
    const t = now || new Date();
    const list = harvest(state);
    const p = phase(t);
    const iceWho = named(list, /water \+ ice captain|ice captain/i) || "Ice captain";
    const facts = [];

    if (undone(list, /ice for 120 bottled waters/i).length && weight(p, "ice")) {
      facts.push({
        kind: "ice",
        score: weight(p, "ice") + 3,
        href: "/prep/#food",
        line: iceWho + ": 6 bags still not on the water table.",
      });
    } else if (undone(list, /ice for tea\/lemonade/i).length && weight(p, "ice")) {
      facts.push({
        kind: "ice",
        score: weight(p, "ice") + 2,
        href: "/prep/#food",
        line: iceWho + ": 4 bags still not at the tea station.",
      });
    } else if (undone(list, /spare ice/i).length && weight(p, "ice")) {
      facts.push({
        kind: "ice",
        score: weight(p, "ice"),
        href: "/prep/#food",
        line: iceWho + ": spare 2 bags of ice still not staged.",
      });
    } else if (undone(list, /12 bags ice|12 bags \/ 120/i).length && weight(p, "ice")) {
      facts.push({
        kind: "ice",
        score: weight(p, "ice") + 1,
        href: "/prep/#food",
        line: iceWho + ": 12 bags of ice are still on the buy list.",
      });
    }

    if (
      !facts.some((f) => f.kind === "ice") &&
      undone(list, /stock 120 bottled waters on ice/i).length &&
      weight(p, "water")
    ) {
      facts.push({
        kind: "water",
        score: weight(p, "water"),
        href: "/prep/#food",
        line: iceWho + ": 120 bottles are not on ice yet.",
      });
    }

    if (undone(list, /buy 8 gal unsweet tea/i).length && weight(p, "buy")) {
      facts.push({
        kind: "buy",
        score: weight(p, "buy"),
        href: "/prep/#overview",
        line: "Buy 8 gal unsweet tea, 6 gal lemonade, 120 bottles, and 12 bags of ice.",
      });
    }

    const short = NEED_STRIKE - strikeCount(roster);
    if (short > 0 && weight(p, "strike")) {
      facts.push({
        kind: "strike",
        score: weight(p, "strike") + short,
        href: "/volunteers/",
        line: "Strike crew is " + short + " short.",
      });
    }

    if (undone(list, /^choose event captain$/i).length && !named(list, /choose event captain|^event captain$/i) && weight(p, "captain")) {
      facts.push({ kind: "captain", score: weight(p, "captain"), href: "/prep/#overview", line: "Name an Event Captain." });
    }

    if (
      undone(list, /name the campaign volunteer helper|campaign volunteer to assist tracy/i).length &&
      !named(list, /tracy production helper|name the campaign volunteer helper|assist tracy/i) &&
      weight(p, "tracy")
    ) {
      facts.push({
        kind: "tracy",
        score: weight(p, "tracy"),
        href: "/prep/#production",
        line: "Tracy still needs the campaign helper named.",
      });
    }

    if (undone(list, /bar stool/i).length && weight(p, "stool")) {
      facts.push({
        kind: "stool",
        score: weight(p, "stool"),
        href: "/prep/#production",
        line: "Someone still needs to bring the bar stool for David.",
      });
    }

    if (undone(list, /print all 8\.5 x 11 signs at hq/i).length && weight(p, "signs")) {
      facts.push({ kind: "signs", score: weight(p, "signs"), href: "/signs/", line: "Print the 8.5 x 11 signs at HQ." });
    }

    const setupOpen = undone(list, /^assign setup person/i);
    if (setupOpen.length && weight(p, "setup")) {
      facts.push({
        kind: "setup",
        score: weight(p, "setup") + setupOpen.length,
        href: "/volunteers/",
        line: "Setup crew is " + setupOpen.length + " short.",
      });
    }

    if (undone(list, /primary ticket\/check-in person/i).length && !named(list, /primary ticket/i) && weight(p, "tickets")) {
      facts.push({ kind: "tickets", score: weight(p, "tickets"), href: "/prep/#tickets", line: "Ticket table still needs a lead." });
    }

    if (p === "strike" || p === "late") {
      const openStrike = list.filter((row) => row.section === "breakdown" && !row.done);
      if (openStrike.length) {
        facts.push({
          kind: "clear",
          score: weight(p, "clear") + 2,
          href: "/prep/#breakdown",
          line:
            p === "late"
              ? "Still in the building. Finish the last walkthrough and lock up."
              : "STRIKE NOW. " + openStrike.length + " strike jobs still open. Clear by 10:00.",
        });
      }
    }

    facts.sort((a, b) => b.score - a.score);
    if (!facts.length) {
      return { line: "Board is covered. Stay on the clock.", meta: clockMeta(t, p), href: "/prep/#run" };
    }
    function family(kind) {
      return /strike|setup|captain|tracy|tickets/.test(kind) ? "people" : "stuff";
    }
    const top = facts[0];
    const next =
      facts.find((f) => family(f.kind) !== family(top.kind) && f.score >= 7) ||
      facts.find((f) => f.kind !== top.kind && f.score >= 10);
    const line = next ? top.line.replace(/\.$/, "") + ". " + next.line : top.line;
    return { line: line, meta: clockMeta(t, p), href: top.href };
  }

  function paint(state, roster) {
    const next = compute(new Date(), state, roster);
    const title = document.getElementById("criticalTitle") || document.getElementById("nextTitle");
    const meta = document.getElementById("criticalMeta") || document.getElementById("nextMeta");
    const link = document.getElementById("criticalLink");
    if (title) title.textContent = next.line;
    if (meta) meta.textContent = next.meta;
    if (link) {
      link.href = next.href;
      link.textContent = next.href.indexOf("volunteers") >= 0 ? "Open volunteer command →" : "Open this job →";
    }
    return next;
  }

  global.GGSNextAction = { compute, paint };
})(window);
