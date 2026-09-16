(function (global) {
  const PEOPLE = [
    {
      name: "Steve Grappe",
      first: "Steve",
      phone: "501-690-3824",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my board",
      kicker: "EVENT LEAD",
      title: "Event Lead",
      next: "You own Thursday. Arrive 3:00. Earlier if you can. The clock, every post, strike, 10:00 clear.",
      duties: [
        "Walk tickets, food, campaign, parking/crowd, and stage every 15 minutes from 5:00.",
        "6:45 hard checkpoint with Production.",
        "Call strike when the show ends. Send 3 muscle to Tracy. Venue furniture stays.",
        "Confirm the building is cleared at 10:00.",
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
        "Tea and lemonade are free while they last. Ice chest + scoop for those drinks. Water is $1 cash — not your station.",
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
        "3:00 with Ben. Earlier if you can. Serve on the line. Do not plate. Do not take water.",
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
        "T-shirts, two banners + bungee cords, conversation cards, 1 four-foot and 1 six-foot campaign tablecloth, push cards, buttons, candy, foldovers.",
        "Hang the two banners. Bungee cords go with them.",
        "Yard signs from the same table. First name + phone on one sheet.",
        "Strike B is 20 minutes. Count what is left. Return conversation cards, both banners, and the 4-ft and 6-ft campaign tablecloths.",
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
      defaultOwner: "Steve Grappe",
      arrival: "3:00 PM · earlier if you can",
      owns: "The clock, every post, strike, 10:00 PM clear.",
      duties: [
        "3:00 arrive. Earlier if you can. Event t-shirt on. Open My Night. That clock is your script.",
        "3:05 walk the room, lobby, merch, lot. Do not rebuild furniture.",
        "3:15 confirm every night post is walking in. Text anyone missing.",
        "3:20 eat 15 minutes. Then ice with Ben. 12 bags in chests, not still in a car.",
        "4:30 sound check. Stay off the dance floor.",
        "5:00 dinner doors. Tell every night person: you stay until 10. Concert-only stay in cars until 6:30.",
        "5:10 walk tickets, food, campaign, lot every 15 minutes. One sentence: you good?",
        "5:45 sit David 20 minutes. Relief has tickets. Do not radio unless something is on fire.",
        "6:15 watch the floor clear. You do not stack. 6:30 stand lobby for concert doors.",
        "6:45 hard checkpoint with Production. Every post has a body. Concert at 7:00.",
        "7:15 sit the concert 45 minutes. 8:00 walk. 8:30 Floater A tells every post: you stay.",
        "8:45 call pairs out loud. Send 3 muscle to Tracy. Venue furniture stays. You leave last at 10:00.",
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
        "8:00 gather the 3 dressers. Event t-shirts on. Open My Night. Furniture is already placed. Do not rebuild.",
        "8:05 walk room, exits, lobby. Then the 3 dress 8 guest tables only — cloth + simple center. 25 minutes.",
        "8:25 Setup 1+2: printed signs 15, lobby ticket cloth 10. Setup 3: 30-minute merch set. 4-ft and 6-ft campaign cloths, two banners + bungees, conversation cards.",
        "8:40 tea and lemonade station. No ice. Ice waits until 4:30.",
        "9:00 merch done. Yard-sign sheet on that table. Walk once. Fix only what is ours.",
        "10:00 room is dressed. Tracy is on his own system. Band is not your problem this morning.",
        "10:30 release the 3 dressers. They eat lunch off site. They come back as Floater A, Floater B, or Campaign.",
        "You are done unless you also claimed a night seat. If you did, open that seat on My Night at 3:00.",
      ],
    },
    {
      id: "tickets",
      rank: 3,
      title: "Tickets & Money Lead",
      weight: "Heavy at doors",
      cartoon: "Velma",
      arrival: "3:00 PM · earlier if you can",
      owns: "Lobby, cash, envelopes, reconcile.",
      duties: [
        "3:00 arrive. Earlier if you can. Event t-shirt on. Open My Night. Venue already placed the 4-ft lobby table.",
        "3:05 dress it: cash box, envelopes, pens, $25 sign, teacher/first-responder note. 10 minutes.",
        "3:20 eat 15 minutes behind the table.",
        "4:30 stay off the dance floor. Sound check.",
        "5:00 dinner doors. Table is live. Cash box never sits open and empty. Envelopes stay on you.",
        "5:45 hand the box to Relief 1. Sit David 25 minutes. You are in a chair, not in the lot.",
        "6:10 take the box back. Count envelopes once. Quiet.",
        "6:30 concert doors. 15-minute rush. Floater A stands with you. Overflow to the wall, not the door.",
        "6:45 rush over. Box on your body. 7:00 sit the concert. Relief peeks the lobby every 20 minutes.",
        "8:30 back to lobby. No new sales after Event Lead says the house is closed.",
        "8:45 reconcile cash and envelopes. 15 minutes. Money to Event Lead. Then help Campaign bins or the final walk.",
      ],
    },
    {
      id: "food",
      rank: 4,
      title: "Food Service Lead",
      weight: "Heavy 3:00–6:30",
      cartoon: "Remy",
      defaultOwner: "Ben Hurst",
      arrival: "3:00 PM · earlier if you can",
      owns: "Ben Hurst. The serving line. Not plates. Not water. Sarah plus two more servers.",
      duties: [
        "3:00 arrive. Earlier if you can. Event t-shirt on. Open My Night. Walk the buffet. Three servers should be with you. Water is not your station.",
        "3:10 ice chest + scoop for tea and lemonade. Set the line. Signs: tea and lemonade free while it lasts. You do not plate.",
        "3:30 eat 15 minutes. Then the line owns you.",
        "4:00 brief Sarah and the two other servers. One line. You direct. They serve. You still do not plate.",
        "4:30 stay off the dance floor. Sound check. Ice should already be in.",
        "5:30 BBQ open. Keep the line moving. Refill pans. Do not plate guest plates. Water girl sells bottles separately.",
        "5:45 dinner show. Stay on the line. Listen from the buffet. Relief 2 gives a server a restroom only.",
        "6:20 line slows. Free drinks stay up until they are gone. Then the sign comes down.",
        "6:30 line closes. Thank the three servers. Water stays up. You are off the line.",
        "7:20 sit the concert 40 minutes. Servers sit too.",
        "8:45 Strike C. You plus the three servers. Coolers, leftover, trash. 20 minutes. Then you may leave.",
      ],
    },
    {
      id: "campaign",
      rank: 5,
      title: "Campaign & Merch Lead",
      weight: "Medium",
      cartoon: "Wonder Woman",
      defaultOwner: "Debi Martin",
      arrival: "8:00 AM if you dress · 3:00 PM for night",
      owns: "Debi Martin. One table. 30-minute set. Signs and shirts.",
      duties: [
        "If you dress tables: 8:00 with Setup. 8:25 you own merch — 30 minutes. 4-ft and 6-ft campaign tablecloths, two banners + bungees, conversation cards, cards, buttons, candy, shirts.",
        "9:00 yard-sign sheet on the same table. First name + phone. Morning done 10:30. Lunch off site. Back 3:00.",
        "If you only work night: 3:00 t-shirt on. Earlier if you can. Open My Night. Table live.",
        "3:15 eat 15 minutes. Sign: back in 10.",
        "4:30 stay off the dance floor. Sound check.",
        "5:25 talk. Do not leave shirts in a pile guests have to dig. Wave Relief each hour for 10 minutes.",
        "5:45 close the table. Sign: open after David. Sit the dinner show.",
        "6:15 table back up. 6:30 concert-door browse window. Stay.",
        "7:15 close again. Sit the concert 45 minutes. Relief comes get you if a line forms.",
        "8:00 table through encore. Box loose shirts so strike is 20 minutes.",
        "8:45 Strike B. Banners, bungees, both campaign cloths, conversation cards, count, bins to the campaign vehicle.",
      ],
    },
    {
      id: "production",
      rank: 6,
      title: "Production Lead",
      weight: "All day with Tracy",
      cartoon: "Scooby",
      arrival: "8:00–10:00 AM",
      owns: "Tracy's helper all day. At encore, 3 muscle carry lights and sound out.",
      duties: [
        "8:00–10:00 wait for Tracy. He walks in with a complete lights and sound system. Ready to go. Event t-shirt on. Open My Night.",
        "Helper job is cables, tape, water, fetch if he asks. Do not build a second plot. Do not buy gear.",
        "10:00 he is on site. Band is not required this morning. 12:00 lunch 45 minutes only if he says the system can hold.",
        "2:00 band load-in. Stay out of their merch set. You stay on house production.",
        "4:30 SOUND CHECK. Acoustic patch and concert patch. Ice is not your job.",
        "5:15 eat 15 minutes. You miss the dinner show on purpose.",
        "5:45 you and Tracy run David. Center of the dance floor. Stool, one mic, his amp only.",
        "6:15 clear acoustic. Floor clear. Concert system up. 6:45 checkpoint with Event Lead.",
        "7:00 sit a stool at FOH. Watch the board. Stay through the last song.",
        "8:45 Strike D. 3 muscle report to you. Tracy directs. His vehicle. You may leave when production is loaded.",
      ],
    },
    {
      id: "relief",
      rank: 7,
      title: "Relief Lead",
      weight: "All night on your feet",
      cartoon: "Road Runner",
      arrival: "3:00 PM · earlier if you can",
      owns: "Floater A. Breaks, ice, trash. Doors with tickets.",
      duties: [
        "If you are Setup 1: 8:00 dress 8 tables. Signs + lobby. Leave 10:30. Lunch off site.",
        "3:00 night arrival. Earlier if you can. T-shirt on. Open My Night. Ice with Food. Walk every post once.",
        "3:20 eat 15 minutes. This is your dinner. You work David on purpose.",
        "4:30 sound check. Stay off the dance floor.",
        "5:00 loop starts. Every 30 minutes: tickets 10, food 10, campaign 10. Ice and trash between.",
        "5:45 take tickets so they can sit David. Stand lobby. Listen from the door.",
        "6:10 hand tickets back. Restart the loop.",
        "6:30 concert doors. Stand with Tickets 15 minutes. No pile-up.",
        "6:45 quiet loop. Trash. Ice if Food waves.",
        "7:30 sit the concert 45 minutes. Relief 2 is walking.",
        "8:15 up. One loop. 8:30 tell every post: you stay until 10. Building clear 10:00.",
        "8:45 pair up when Event Lead calls it. Venue furniture stays.",
      ],
    },
    {
      id: "relief2",
      rank: 8,
      title: "Relief Lead 2",
      weight: "All night on your feet",
      cartoon: "Speedy Gonzales",
      arrival: "3:00 PM · earlier if you can",
      owns: "Floater B. Same loop. Food breaks. Roam shots if Photo Lead is empty.",
      duties: [
        "If you are Setup 2: 8:00 dress 8 tables. Signs with Setup 1. Leave 10:30. Lunch off site.",
        "3:00 night arrival. Earlier if you can. T-shirt on. Open My Night. Start the loop on FOOD first so you are offset from Relief 1.",
        "3:20 eat 15 minutes. This is your dinner. You work David on purpose.",
        "4:30 sound check. Stay off the dance floor.",
        "5:00 loop: food 10, campaign 10, tickets 10. Never stack on Relief 1 at the same table.",
        "5:45 dinner show. You work. 10-minute food restrooms only. Listen from the buffet.",
        "6:15 help clear the dance floor. Then loop. 6:30 doors — keep the loop. Relief 1 is at tickets.",
        "7:20 take water so Food can sit the concert. Check ice every 15 minutes.",
        "8:00 sit the concert 40 minutes. You have the last sit.",
        "8:40 up. Hands free. If Photo Lead is empty, you already grabbed roam shots between loops.",
        "8:45 pair up when Event Lead calls it.",
      ],
    },
    {
      id: "kelly",
      rank: 9,
      title: "Kelly Support Lead",
      weight: "On the candidate",
      cartoon: "Robin",
      arrival: "3:00 PM · earlier if you can",
      owns: "The only staff on Kelly. Runner plus vertical photos and video.",
      duties: [
        "3:00 arrive. Earlier if you can. Event t-shirt on. Open My Night. Find Kelly. You are the only staff on her.",
        "3:20 eat 10 minutes with her or right behind her. 4:30 stay off the dance floor during sound check.",
        "Water in your hand or on her table. Intros. Move a pull-up if she asks. You do not work tickets, food, or merch.",
        "Shoot her all night — pictures and video, all vertical. Post as you go. Tag @KellyGrappeSOS, invite her to collaborate, hashtag #GrappeSOS.",
        "5:30 she works the buffet. You hold the circle. Do not park her at a table.",
        "5:45 she sits or works the room during David. You stay with her. Not in the aisle.",
        "6:30 concert doors. Keep her moving, not trapped in the lobby pile-up.",
        "7:00 she greets, then sits. You sit one chair off her. Still vertical shots.",
        "If she needs a minute, you hold the circle. Photo Lead does not take her.",
        "8:45 she may leave when she is ready. You walk her out if she wants. Then help the final walk or go.",
      ],
    },
    {
      id: "photo",
      rank: 10,
      title: "Photo / Video Lead",
      weight: "Roam the room",
      cartoon: "Jimmy Olsen",
      arrival: "3:00 PM · earlier if you can",
      owns: "Journalistic photography. Action shots of Kelly and the crowd. Not parked on her.",
      duties: [
        "3:00 arrive. Earlier if you can. Event t-shirt on. Open My Night. You roam. You are not Kelly's minder.",
        "3:15 eat 10 minutes. Then empty-room and setup shots. 4:30 stay off the dance floor.",
        "5:00–5:30 arrivals, lot, lobby, tickets, first plates. Journalistic. Energy.",
        "5:30 BBQ line, hands, faces, volunteers working. Kelly in the room — not parked on her.",
        "5:45 David from the side. Crowd listening. Do not walk the dance floor.",
        "6:15 floor clear. 6:30 concert-door faces. 7:00 first three songs of the concert.",
        "7:20 roam: dance floor edge, merch, a quiet table, a laugh. Post as you go. Tag @KellyGrappeSOS, invite her to collaborate, hashtag #GrappeSOS.",
        "8:30 one closing group shot if Event Lead wants it. Then you are free to sit the last songs.",
        "8:45 help the walk or go. Cards and cameras in your bag, not on a table.",
        "If this seat is empty, Floater B grabs roam shots between loops. Still not Kelly Support.",
      ],
    },
    {
      id: "strike",
      rank: 11,
      title: "Strike / Close Lead",
      weight: "75 minutes, hard stop",
      cartoon: "Wreck-It Ralph",
      arrival: "3:00 PM · earlier if you can · focus 8:30",
      owns: "8:45 pairs and the 10:00 walk. Venue furniture stays.",
      duties: [
        "3:00 arrive if this is your only seat. Earlier if you can. Stay all night on your other seat if you have one. Open My Night. Strike focus starts 8:30.",
        "8:30 walk every post with Event Lead. Confirm 3 muscle are coming. Tell people: you stay until 10.",
        "8:45 show over. Call pairs out loud: A cloths (2), B campaign (2), C Ben + 3 servers, D Tracy + helper + 3 muscle, E everyone walks last.",
        "Venue furniture stays. Leave the 8 rounds, buffet tables, lobby table, and 64 chairs.",
        "9:00 A should be folding cloths. B packing merch. C food. D loading Tracy's vehicle.",
        "9:15 walk A through D. No second speech. Just finish.",
        "9:30 restrooms, lot, main room. Our bins in vehicles. Nothing in a hallway.",
        "9:45 final walk with Event Lead. 10:00 building clear. Event Lead leaves last. You may leave when they say so.",
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
