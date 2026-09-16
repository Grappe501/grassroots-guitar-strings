(function (global) {
  const PEOPLE = [
    {
      name: "Steve Grappe",
      first: "Steve",
      phone: "501-690-3824",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "MEETING LEAD",
      title: "You run tomorrow from the top.",
      next: "Start with Event Lead — the heaviest seat. Walk jobs 2 through 10. People pick. Then put volunteers under each lead.",
      duties: [
        "Open /leads/ in the meeting. Heaviest job first.",
        "Do not fill seats by leftover. Let people choose.",
        "After names are on seats, each lead gets the volunteers for that lane.",
        "Your own seat can be Event Lead, or you can hand it off and stay as the closer.",
      ],
    },
    {
      name: "Carol Egan",
      first: "Carol",
      phone: "847-791-8601",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "You are already in the system.",
      next: "Read the 11 lead jobs. Tomorrow you pick one. Steve starts at Event Lead.",
      duties: [
        "Look at /leads/ before the meeting.",
        "Event Lead is the heaviest. Then Setup, Tickets, Food, Campaign.",
        "Once you claim a seat, volunteers for that lane sit under you.",
      ],
    },
    {
      name: "Jay Powell",
      first: "Jay",
      phone: "501-690-0839",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Christy Low",
      first: "Christy",
      phone: "870-275-1178",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "John Duke",
      first: "John",
      phone: "501-516-2108",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Mark London",
      first: "Mark",
      phone: "541-591-2198",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Kelly Grappe",
      first: "Kelly",
      phone: "501-690-8227",
      gate: "Confirm this is the phone you are on today. You do not run a station tonight.",
      go: "Open my night",
      kicker: "CANDIDATE",
      title: "Press flesh. That is the job.",
      next: "Only Kelly Support mans you. They also shoot vertical. Photo Lead roams for action and crowd. You greet, thank, and move.",
      duties: [
        "5:00–close: be with guests.",
        "Kelly Support is your runner and your vertical camera. They stay with you.",
        "Photo Lead is separate. They roam. They are not on you all night.",
        "If someone tries to park you at a table, send them to Event Lead.",
        "When people tag @KellyGrappeSOS and #GrappeSOS, collaborate on the post so we can pull the photos.",
      ],
    },
    {
      name: "Kristal Kuykendall",
      first: "Kristal",
      phone: "479-244-5026",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Ben Hurst",
      first: "Ben",
      phone: "501-517-1690",
      gate: "Food is your lane. Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "FOOD",
      title: "You lead the serving line. You do not plate. You are not water.",
      next: "Food Service Lead is your seat. Sarah is Server 1. Name two more servers. Water is a different person.",
      duties: [
        "Lead the serving line. Do not plate.",
        "Three volunteers serve with you: Sarah plus two more.",
        "Tea and lemonade are free while they last. Water is $1 cash — not your station.",
        "Strike C is you plus the three servers. 20 minutes.",
      ],
    },
    {
      name: "Sarah Hurst",
      first: "Sarah",
      phone: "501-265-3446",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "SERVER 1",
      title: "You are on Ben’s serving line.",
      next: "Server 1 is your seat. Ben leads. He does not plate. Water is someone else.",
      duties: [
        "4:30 with Ben. Serve on the line. Do not plate. Do not take water.",
        "Tea and lemonade are free while they last.",
        "Work the dinner show. Sit the concert at 7:20.",
        "Strike C with Ben and the other two servers.",
      ],
    },
    {
      name: "Chance Bradford",
      first: "Chance",
      phone: "901-496-5949",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Leeann Solice",
      first: "Leeann",
      phone: "512-789-1552",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Eleven lead jobs. Steve starts at the top. Claim the one you want.",
      duties: ["Read /leads/.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Debi Martin",
      first: "Debi",
      phone: "",
      gate: "You own the merch table. Phone goes in tomorrow. Confirm when we have it, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "MERCH",
      title: "You own the merch table.",
      next: "Campaign & Merch is your seat. One table. 30-minute set. Shirts, banners, cards, buttons, candy.",
      duties: [
        "Set merch + campaign on one table — 30 minutes.",
        "T-shirts, pull-ups, push cards, buttons, candy, foldovers.",
        "Yard signs from the same table. First name + phone on one sheet.",
        "Strike B is 20 minutes. Count what is left.",
      ],
    },
  ];

  const JOBS = [
    {
      id: "event",
      rank: 1,
      title: "Event Lead",
      weight: "Heaviest",
      cartoon: "Mighty Mouse",
      arrival: "4:30 PM",
      owns: "The clock, every post, strike, 10:00 PM clear.",
      duties: [
        "Walk tickets, food, campaign, parking/crowd, and stage every 15 minutes from 5:00.",
        "6:45 hard checkpoint with Production.",
        "Call strike the moment the show ends. Same 10 volunteers plus Ben on Strike C. Send 3 muscle to Tracy for sound/lights carry-out. Venue furniture stays.",
        "Confirm the building is cleared at 10:00.",
        "Do not get stuck at one table. Relief Lead covers gaps.",
      ],
    },
    {
      id: "setup",
      rank: 2,
      title: "Setup Lead",
      weight: "Heavy morning",
      cartoon: "Papa Smurf",
      arrival: "8:00 AM",
      owns: "The 90-minute room. Then hands people to night seats.",
      duties: [
        "Three dressers. 8 guest tables only — 25 minutes.",
        "Signs 15, lobby 10, drinks station 20. Ice waits until 4:30.",
        "Setup 3 does the 30-minute merch set.",
        "Morning crew may leave after 10:30. Back at 4:30 as Floater A, Floater B, or Campaign.",
      ],
    },
    {
      id: "tickets",
      rank: 3,
      title: "Tickets & Money Lead",
      weight: "Heavy at doors",
      cartoon: "Velma",
      arrival: "5:00 PM",
      owns: "Lobby, cash, envelopes, reconcile.",
      duties: [
        "One body at the table. Relief Lead covers 10-minute breaks.",
        "Floater A stands with you for the 6:30 doors rush.",
        "Cash box never sits open. Envelopes stay with you.",
        "At strike: count, then help Campaign or the final walk.",
      ],
    },
    {
      id: "food",
      rank: 4,
      title: "Food Service Lead",
      weight: "Heavy 4:30–6:30",
      cartoon: "Remy",
      defaultOwner: "Ben Hurst",
      arrival: "4:30 PM",
      owns: "Ben Hurst. The serving line. Not plates. Not water. Sarah plus two more servers.",
      duties: [
        "You lead the line. You do not plate.",
        "Three volunteers serve: Sarah is Server 1. Name two more.",
        "Tea and lemonade are free while they last. Water is a different person — $1 cash only.",
        "Strike C is you plus the three servers. 20 minutes.",
      ],
    },
    {
      id: "campaign",
      rank: 5,
      title: "Campaign & Merch Lead",
      weight: "Medium",
      cartoon: "Wonder Woman",
      defaultOwner: "Debi Martin",
      arrival: "After tables / 5:00 PM",
      owns: "Debi Martin. One table. 30-minute set. Signs and shirts.",
      duties: [
        "Pull-up banners, push cards, buttons, candy, foldovers, literature, shirts.",
        "Yard signs from the same table. First name + phone on one sheet.",
        "Wave Relief for a 10-minute break each hour.",
        "Strike B is 20 minutes. Count what is left.",
      ],
    },
    {
      id: "production",
      rank: 6,
      title: "Production Lead",
      weight: "All day with Tracy",
      cartoon: "Scooby",
      arrival: "8:00 AM",
      owns: "Tracy's helper all day. At encore, 3 muscle carry lights and sound out.",
      duties: [
        "8:00 AM with Tracy. One system. Do not build a second plot.",
        "Someone brings the bar stool. Acoustic 5:45–6:15. Clear by 6:30.",
        "6:45 checkpoint with Event Lead. Stay through the last song.",
        "Strike D: Tracy directs. Helper plus 3 muscle carry speakers, lights, and cases to his vehicle.",
      ],
    },
    {
      id: "relief",
      rank: 7,
      title: "Relief Lead",
      weight: "All night on your feet",
      cartoon: "Road Runner",
      arrival: "4:30 PM",
      owns: "Floater A. Breaks, ice, trash. Doors with tickets.",
      duties: [
        "After 4:30 you only relieve posts and run ice/trash.",
        "Every 30 minutes: tickets 10, food 10, campaign 10.",
        "At doors you stand with tickets. Relief Lead 2 keeps the loop moving.",
        "At 8:30 tell every post: you stay until 10.",
      ],
    },
    {
      id: "relief2",
      rank: 8,
      title: "Relief Lead 2",
      weight: "All night on your feet",
      cartoon: "Speedy Gonzales",
      arrival: "4:30 PM",
      owns: "Floater B. Same loop. Food breaks. Roam shots if Photo Lead is empty.",
      duties: [
        "After 4:30 you only relieve posts and run ice/trash.",
        "Every 30 minutes: tickets 10, food 10, campaign 10. Offset from Relief Lead so both are not at the same table.",
        "Cover food breaks and the 6:30 refill. Relief Lead is on tickets at doors.",
        "If Photo Lead is empty, grab roam shots between loops. Still not Kelly Support.",
      ],
    },
    {
      id: "kelly",
      rank: 9,
      title: "Kelly Support Lead",
      weight: "On the candidate",
      cartoon: "Robin",
      arrival: "5:00 PM",
      owns: "The only staff on Kelly. Runner plus vertical photos and video.",
      duties: [
        "Stay with Kelly. Water, intros, move a pull-up if she asks.",
        "You also shoot pictures and video of her — all vertical.",
        "Do not park her at tickets, food, or merch. Photo Lead does not man her.",
        "If she needs a minute, you hold the circle.",
        "You still post. Tag @KellyGrappeSOS, invite her to collaborate, hashtag #GrappeSOS.",
      ],
    },
    {
      id: "photo",
      rank: 10,
      title: "Photo / Video Lead",
      weight: "Roam the room",
      cartoon: "Jimmy Olsen",
      arrival: "5:00 PM",
      owns: "Journalistic photography. Action shots of Kelly and the crowd. Not parked on her.",
      duties: [
        "You roam. You are not Kelly's minder. Support staff mans her.",
        "Action shots: Kelly in the room, the crowd, dance floor, BBQ, arrivals, volunteers working.",
        "Journalistic frames. Energy. One closing group shot, then help the walk.",
        "If this seat is empty, Floater B grabs roam shots between loops. Still not Kelly Support.",
        "Post as you go. Tag @KellyGrappeSOS, invite her to collaborate, hashtag #GrappeSOS.",
      ],
    },
    {
      id: "strike",
      rank: 11,
      title: "Strike / Close Lead",
      weight: "75 minutes, hard stop",
      cartoon: "Wreck-It Ralph",
      arrival: "8:30 PM focus / stay all night",
      owns: "8:45 pairs and the 10:00 walk. Venue furniture stays.",
      duties: [
        "Same 10 volunteers plus Ben on Strike C plus 3 Tracy muscle. No second full teardown crew.",
        "Pairs: cloths, campaign, food, Tracy + helper + 3 muscle, then everyone walks.",
        "Leave the 8 rounds, buffet tables, lobby table, and 64 chairs.",
        "Event Lead can hold this seat too. Split only if two people want it.",
      ],
    },
  ];

  function norm(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function match(a, b) {
    if (global.GGSCrewSlice) return global.GGSCrewSlice.nameMatch(a, b) || global.GGSCrewSlice.nameMatch(b, a);
    const x = norm(a);
    const y = norm(b);
    return !!x && !!y && (x === y || x.indexOf(y) === 0 || y.indexOf(x) === 0);
  }

  function findPerson(name) {
    const n = String(name || "").trim();
    if (!n) return null;
    return PEOPLE.find((p) => match(p.name, n)) || null;
  }

  function suggestions(q) {
    const s = norm(q);
    if (!s) return PEOPLE.slice();
    return PEOPLE.filter((p) => norm(p.name).indexOf(s) === 0 || norm(p.first).indexOf(s) === 0 || norm(p.name).indexOf(s) >= 0);
  }

  function uniquePerson(q) {
    const s = norm(q);
    if (s.length < 2) return null;
    const hits = suggestions(q);
    if (hits.length === 1) return hits[0];
    const exact = PEOPLE.filter((p) => norm(p.first) === s || norm(p.name) === s);
    return exact.length === 1 ? exact[0] : null;
  }

  function names() {
    return PEOPLE.map((p) => p.name);
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function leadSelectHtml(selected, extra) {
    const cfg = extra || {};
    const sel = String(selected || "").trim();
    const cls = cfg.className || "owner";
    const attrs = cfg.attrs || "";
    const blank = cfg.blank != null ? cfg.blank : "Unassigned";
    const seen = {};
    const opts = ['<option value="">' + esc(blank) + "</option>"];
    if (cfg.includeVenue) {
      seen.Venue = true;
      opts.push('<option value="Venue"' + (sel === "Venue" ? " selected" : "") + ">Venue</option>");
    }
    names()
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .forEach((n) => {
        seen[n] = true;
        opts.push('<option value="' + esc(n) + '"' + (sel === n ? " selected" : "") + ">" + esc(n) + "</option>");
      });
    if (sel && !seen[sel]) {
      opts.push('<option value="' + esc(sel) + '" selected>' + esc(sel) + "</option>");
    }
    return "<select class=\"" + esc(cls) + "\" " + attrs + ">" + opts.join("") + "</select>";
  }

  function prettyPhone(phone) {
    if (global.GGSCrewSlice) return global.GGSCrewSlice.displayPhone(phone);
    return String(phone || "").trim();
  }

  function seedContacts() {
    const store = global.GGSPrepStore;
    const slice = global.GGSCrewSlice;
    if (!store || !slice) return;
    const book = slice.readContacts(store);
    PEOPLE.forEach((p) => {
      if (!p.phone) return;
      const key = Object.keys(book).find((item) => match(item, p.name));
      if (key && book[key]) return;
      slice.saveContact(store, p.name, p.phone);
      book[p.name] = p.phone;
    });
  }

  global.GGSPeople = { PEOPLE, JOBS, findPerson, uniquePerson, suggestions, names, match, prettyPhone, seedContacts, leadSelectHtml };
  function bootSeed() {
    seedContacts();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootSeed);
  else bootSeed();
  global.addEventListener("ggs-prep-loaded", seedContacts);
})(window);
