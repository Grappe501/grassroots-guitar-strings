(function (global) {
  const WEAR =
    "Event t-shirt we hand you. Wear it from the minute you arrive until you walk out. Closed shoes. Dark comfortable pants. You will stand, carry, and sit on grass or a chair — dress for that, not a dinner party.";

  const SHOWS = {
    dinner: "David acoustic · 5:45–6:15 PM · dinner show",
    concert: "Concert · 7:00–about 8:45 PM",
  };

  const SOCIAL =
    "Take pictures and video all night. Post to your social media. Tag @KellyGrappeSOS and invite her to collaborate on the post. Hashtag every photo and video #GrappeSOS. We download tagged posts to put on the site.";

  function row(t, kind, text) {
    return { t: t, kind: kind, text: text };
  }

  const SPOTS = [
    {
      id: "captain",
      n: 1,
      title: "Event Captain",
      short: "The clock",
      arrive: "4:30 PM",
      eat: "5:10 PM · 15 min. Plate before guests.",
      sit: "Dinner show 5:45–6:05. Concert 7:15–8:00.",
      leadJob: "event",
      roster: [{ kind: "event", hint: /event captain/i }],
      why: "You own the night. You also sit both shows — short — so you are a guest too.",
      clock: [
        row("16:30", "arrive", "Arrive. Put the event t-shirt on before you talk to anyone."),
        row("16:32", "work", "Open this page. That is your script. Phone on silent, vibrate on."),
        row("16:35", "work", "Walk 8 guest tables, lobby, buffet, merch, lot. 5 minutes. Do not fix furniture."),
        row("16:40", "work", "Confirm the 7 night people are on site. Text anyone missing. Name the 3 arrival people if the lot is empty."),
        row("16:50", "work", "Ice check with Food. 12 bags should be going in, not still in a car."),
        row("17:00", "work", "Tell every night person: you stay until 10. Take pictures. Post. Tag @KellyGrappeSOS, invite her to collaborate, hashtag #GrappeSOS. Floaters cover breaks. Arrival people own lot, path, lobby until 6:45."),
        row("17:10", "eat", "EAT. Plate now. 15 minutes. Sit in the back. Do not start a meeting with food in your hand."),
        row("17:25", "work", "On your feet. Walk tickets, food, campaign, lot. One sentence each: you good?"),
        row("17:30", "work", "BBQ opens. Smile. Do not plate for guests. Ben serves. You keep walking."),
        row("17:45", "sit", "SIT the dinner show. 20 minutes. Relief 1 has tickets. Do not radio unless something is on fire."),
        row("18:05", "work", "Stand. Quiet walk while David is still playing. Do not cut across the dance floor."),
        row("18:15", "work", "Acoustic over. Floater B helps clear the floor. You watch, you do not stack."),
        row("18:30", "work", "Concert doors. Stand lobby 10 minutes. Then leave Tickets and Floater A to it."),
        row("18:45", "work", "Hard checkpoint with Production. Every post still has a body. Concert at 7:00."),
        row("19:00", "work", "Concert starts. Walk once. Then get out of the aisles."),
        row("19:15", "sit", "SIT the concert. 45 minutes. You are a guest. Relief is walking."),
        row("20:00", "work", "Up. Walk every post. Thank people by name. Confirm 3 muscle are coming at 8:45."),
        row("20:30", "work", "Floater A tells each post: you stay. Building clear 10:00."),
        row("20:45", "strike", "Show over. Call pairs out loud. Send 3 muscle to Tracy. Venue tables and chairs stay."),
        row("21:30", "strike", "Walk A through E. Restrooms, lot, pavilion. No second speech. Just finish."),
        row("22:00", "done", "Confirm clear. Thank Tracy and Ben. You leave last."),
      ],
    },
    {
      id: "tickets",
      n: 2,
      title: "Tickets",
      short: "Lobby money",
      arrive: "5:00 PM",
      eat: "5:10 PM · 15 min behind the table.",
      sit: "Dinner show 5:45–6:10. Concert 7:00–8:30.",
      leadJob: "tickets",
      roster: [{ kind: "event", hint: /tickets/i }],
      why: "One body at the table. Relief 1 covers so you sit David. After doors, you sit the concert.",
      clock: [
        row("17:00", "arrive", "Arrive. Event t-shirt on. This page stays open."),
        row("17:02", "work", "Dress the lobby table: cash box, envelopes, $25 sign, teacher/first-responder note. 10 minutes. Venue already placed the table."),
        row("17:10", "eat", "EAT. 15 minutes behind the table. If a guest walks up, take them, then go back to the plate."),
        row("17:25", "work", "Table is live. BBQ guests check in. Cash box never sits open and empty."),
        row("17:45", "sit", "Hand the box to Relief 1. SIT the dinner show. 25 minutes. You are in a chair, not in the lot."),
        row("18:10", "work", "Back. Thank Relief 1. Count envelopes once. Quiet."),
        row("18:30", "work", "Concert doors. 15-minute rush. Floater A stands with you. No pile-up. Point overflow to the wall, not the door."),
        row("18:45", "work", "Rush is over. Box stays on your body."),
        row("19:00", "sit", "SIT the concert. Relief 1 peeks the lobby every 20 minutes. They come get you if a line forms."),
        row("20:30", "work", "Back to lobby. No new sales after Event Lead says the house is closed."),
        row("20:45", "strike", "Reconcile cash and envelopes. 15 minutes. Then help Campaign bins or the final walk."),
        row("22:00", "done", "Money is with Event Lead. You may leave."),
      ],
    },
    {
      id: "food",
      n: 3,
      title: "Food + $1 water",
      short: "Ice, tea, water",
      arrive: "4:30 PM",
      eat: "4:50 PM · 15 min before BBQ. Second plate at 6:20 if you want it.",
      sit: "You work the dinner show. Concert 7:20–8:00 while Relief 2 has water.",
      leadJob: "food",
      roster: [{ kind: "event", hint: /food|\$1 water|ice/i }],
      why: "You are the one person who cannot sit David — that is when the buffet is live. You sit the concert. You still eat first.",
      clock: [
        row("16:30", "arrive", "Arrive. Event t-shirt on. Ice now, not later."),
        row("16:32", "work", "12 bags of ice in. Tea and lemonade out. 120 bottles staged. Water sign: $1 cash only."),
        row("16:50", "eat", "EAT your dinner now. 15 minutes. This is the meal. Do not wait for BBQ guests."),
        row("17:05", "work", "Money bag on you. Ben check: pans, heat, one line. Guests serve themselves. You refill."),
        row("17:30", "work", "BBQ is open. Stay on the line. Smile. Do not plate for people unless they cannot."),
        row("17:45", "work", "Dinner show is on. You stay. Listen from the buffet. Relief 2 gives you 10 minutes only for a restroom."),
        row("18:20", "eat", "Buffet slows. Second plate if you are still hungry. Standing is fine. Then ice refresh."),
        row("18:30", "work", "Move to water. Concert doors are not your job."),
        row("19:00", "work", "Concert. Watch from the water spot until Relief 2 taps you."),
        row("19:20", "sit", "SIT the concert. 40 minutes. Relief 2 has water. They come get you if ice dies."),
        row("20:00", "work", "Back on water through the last song."),
        row("20:45", "strike", "Strike C. Coolers and leftover with Ben. 20 minutes. Then trash."),
        row("22:00", "done", "Food area is clean. You may leave."),
      ],
    },
    {
      id: "campaign",
      n: 4,
      title: "Campaign + merch",
      short: "One table",
      arrive: "8:00 AM if you dress tables · 5:00 PM for night",
      eat: "Lunch off site after 10:30 if you did morning. Night plate at 5:10.",
      sit: "Dinner show 5:45–6:15 (table closed). Concert 7:15–8:00.",
      leadJob: "campaign",
      roster: [
        { kind: "event", hint: /campaign|merch/i },
        { kind: "setup", hint: /setup 3/i },
      ],
      why: "30-minute merch set. Close the table for David so you sit. Close it again for 45 minutes of the concert.",
      clock: [
        row("08:00", "arrive", "If you are Setup 3: arrive. Event t-shirt on. Three people dress 8 guest tables only."),
        row("08:25", "work", "Tables done. You set merch — 30 minutes. Pull-ups, push cards, buttons, candy, foldovers, shirts."),
        row("09:00", "work", "Yard-sign sheet on the same table. First name + phone. No second décor pass."),
        row("10:30", "leave", "Morning work is done. Leave. Eat a real lunch off site. Be back at 5:00."),
        row("17:00", "arrive", "Night arrival. T-shirt on. Table live. This page stays open."),
        row("17:10", "eat", "EAT. 15 minutes. Put a sign: back in 10. Do not skip this."),
        row("17:25", "work", "Table. Talk. Do not leave shirts in a pile guests have to dig."),
        row("17:45", "sit", "Close the table. Sign: open after David. SIT the dinner show. 30 minutes."),
        row("18:15", "work", "Table back up. People will browse after the set."),
        row("18:30", "work", "Concert doors. Stay. This is a browse window."),
        row("19:15", "sit", "Close the table again. SIT the concert. 45 minutes. Relief will come get you if a line forms."),
        row("20:00", "work", "Table through encore. Start boxing loose shirts so strike is 20 minutes."),
        row("20:45", "strike", "Strike B. Count what is left. Bins to the campaign vehicle. 20 minutes."),
        row("22:00", "done", "Merch is in a vehicle, not a hallway. You may leave."),
      ],
    },
    {
      id: "production",
      n: 5,
      title: "Tracy helper",
      short: "One system",
      arrive: "8:00 AM",
      eat: "Lunch off site ~12:00. Night plate at 5:15 — before David.",
      sit: "You run the dinner show. Sit a stool at FOH for the concert.",
      leadJob: "production",
      roster: [{ kind: "event", hint: /tracy production helper|tracy/i }],
      why: "You stay with Tracy. You cannot sit David — you are running him. The concert is your sit, from the deck.",
      clock: [
        row("08:00", "arrive", "Arrive. Event t-shirt on. Find Tracy. One system. Do not build a second plot."),
        row("08:10", "work", "Unload: speakers, mixer, mics, stands, lights. Helper job is cables, tape, water, fetch."),
        row("09:00", "work", "Map outlets. One safe power plan. Tape the dance floor clear."),
        row("10:00", "work", "Sound and light check. Spare batteries at the mixer. Bar stool staged for David."),
        row("10:30", "work", "Room dressers may leave. You stay or take a short break if Tracy says so."),
        row("12:00", "eat", "LUNCH off site. 45 minutes. Tell Tracy when you walk. Come back."),
        row("16:30", "work", "Night crew is back. Ice is not your job. Stay on the system."),
        row("17:15", "eat", "EAT now. 15 minutes. You will miss the dinner show on purpose."),
        row("17:45", "show", "David acoustic. You and Tracy. 30 minutes. Center of the dance floor. Do not sit."),
        row("18:15", "work", "Clear acoustic. Stool away. Floor clear. Floater B helps. Concert system up."),
        row("18:45", "work", "Checkpoint with Event Lead. You stay through the last song."),
        row("19:00", "sit", "Concert. Sit a stool at FOH. That is your show. Watch the board, enjoy the band."),
        row("20:45", "strike", "Strike D. Tracy directs. 3 muscle report to you. No empty hands. His vehicle."),
        row("22:00", "done", "Production is in the vehicle. You may leave with Tracy."),
      ],
    },
    {
      id: "relief",
      n: 6,
      title: "Relief Lead · Floater A",
      short: "Tickets cover",
      arrive: "8:00 AM if you dress · 4:30 PM for night",
      eat: "Lunch off site after 10:30. Night plate at 4:45 — you work David.",
      sit: "You work the dinner show (you have tickets). Concert 7:30–8:15.",
      leadJob: "relief",
      roster: [
        { kind: "event", hint: /floater a/i },
        { kind: "setup", hint: /setup 1/i },
      ],
      why: "You give other people the dinner show. You get the concert. Eat before 5:00 or you will not eat.",
      clock: [
        row("08:00", "arrive", "If you are Setup 1: arrive. Event t-shirt on. Dress 8 guest tables with Setup 2 and 3."),
        row("08:25", "work", "Tables done. Signs with Setup 2. 15 minutes. Lobby cloth 10."),
        row("10:30", "leave", "Morning done. Leave. Eat lunch off site. Back at 4:30."),
        row("16:30", "arrive", "Night arrival. T-shirt on. Ice with Food. Walk every post once."),
        row("16:45", "eat", "EAT. 15 minutes. This is your dinner. You will be working David."),
        row("17:00", "work", "Loop starts. Every 30 minutes: tickets 10, food 10, campaign 10. That is the job."),
        row("17:45", "work", "Dinner show. YOU WORK. Take tickets so they can sit. Stand lobby. Listen from the door."),
        row("18:10", "work", "Hand tickets back. Restart the loop."),
        row("18:30", "work", "Concert doors. Stand with Tickets. 15 minutes. No pile-up."),
        row("18:45", "work", "Quiet loop. Trash. Ice if Food waves."),
        row("19:30", "sit", "SIT the concert. 45 minutes. Relief 2 is walking. Phone on silent."),
        row("20:15", "work", "Up. One loop."),
        row("20:30", "work", "Tell every post: you stay until 10. Building clear 10:00."),
        row("20:45", "strike", "Pair up when Event Lead calls it. Venue furniture stays."),
        row("22:00", "done", "Last walk with Event Lead if they ask. Then leave."),
      ],
    },
    {
      id: "relief2",
      n: 7,
      title: "Relief Lead 2 · Floater B",
      short: "Food cover",
      arrive: "8:00 AM if you dress · 4:30 PM for night",
      eat: "Lunch off site after 10:30. Night plate at 4:45 — you work David.",
      sit: "You work the dinner show (you have food). Concert 8:00–8:40.",
      leadJob: "relief2",
      roster: [
        { kind: "event", hint: /floater b/i },
        { kind: "setup", hint: /setup 2/i },
      ],
      why: "You offset Relief 1 so two people are never at the same table. You cover food during David. You sit the end of the concert.",
      clock: [
        row("08:00", "arrive", "If you are Setup 2: arrive. Event t-shirt on. Dress 8 guest tables with Setup 1 and 3."),
        row("08:25", "work", "Tables done. Signs with Setup 1. Help lobby if they need 10 minutes."),
        row("10:30", "leave", "Morning done. Leave. Eat lunch off site. Back at 4:30."),
        row("16:30", "arrive", "Night arrival. T-shirt on. Start the loop on FOOD first so you are offset from Relief 1."),
        row("16:45", "eat", "EAT. 15 minutes. This is your dinner. You will be working David."),
        row("17:00", "work", "Loop: food 10, campaign 10, tickets 10. Never stack on Relief 1 at the same table."),
        row("17:45", "work", "Dinner show. YOU WORK. 10-minute food breaks only. Listen from the buffet."),
        row("18:15", "work", "Acoustic clear. Help Floater the dance floor. Then loop."),
        row("18:30", "work", "Doors. Keep the loop moving. Relief 1 is at tickets."),
        row("19:20", "work", "Take water so Food can sit the concert. Check ice every 15 minutes."),
        row("20:00", "sit", "SIT the concert. 40 minutes. You have the last sit. Enjoy it."),
        row("20:40", "work", "Up. Hands free for strike."),
        row("20:45", "strike", "Pair up when Event Lead calls it. If Photo Lead is empty, you already grabbed roam shots between loops."),
        row("22:00", "done", "You may leave when Event Lead releases the floor."),
      ],
    },
    {
      id: "parking",
      n: 8,
      title: "Parking",
      short: "The lot",
      arrive: "4:45 PM · eat · lot at 5:00",
      eat: "4:45 PM · 15 min before the first car you care about.",
      sit: "You work David (cars still coming). Whole concert 7:00–8:45.",
      roster: [{ kind: "grounds", hint: /parking/i }],
      why: "Guests find a space. You miss the dinner show on purpose. You get the whole concert.",
      clock: [
        row("16:45", "arrive", "Arrive. Event t-shirt on. EAT now. 15 minutes. Then you will not eat until after 6:45."),
        row("17:00", "work", "On the lot. Wave cars. Overflow if it fills — Event Lead already walked this with you."),
        row("17:30", "work", "BBQ rush. Keep the lane moving. Do not leave the lot to greet inside."),
        row("17:45", "work", "Dinner show. Stay on the lot. Listen if you can hear it. Cars still arriving."),
        row("18:30", "work", "Concert-door cars. Last push. Point people to the door person, not into traffic."),
        row("18:45", "leave", "Stand down unless Event Lead keeps you. Thank the last driver."),
        row("19:00", "sit", "SIT the whole concert. You are a guest. Phone on silent."),
        row("20:45", "done", "You may leave. Help the final walk only if you want to. Not required."),
      ],
    },
    {
      id: "directions",
      n: 9,
      title: "Directions",
      short: "Lot to door",
      arrive: "4:45 PM · eat · path at 5:00",
      eat: "4:45 PM · 15 min.",
      sit: "You work David. Whole concert 7:00–8:45.",
      roster: [{ kind: "grounds", hint: /directions/i }],
      why: "BBQ is inside. Concert is under the pavilion. People will guess wrong without you.",
      clock: [
        row("16:45", "arrive", "Arrive. Event t-shirt on. EAT. 15 minutes."),
        row("17:00", "work", "Stand where the lot meets the walk. Point: BBQ inside, concert under the pavilion."),
        row("17:30", "work", "Dinner guests. Same two sentences. Smile. Do not walk each person to a table."),
        row("17:45", "work", "Dinner show. Stay on the path. Late cars still need the door."),
        row("18:30", "work", "Concert doors. Point to lobby tickets, then the pavilion. Do not block the door."),
        row("18:45", "leave", "Stand down unless Event Lead keeps you."),
        row("19:00", "sit", "SIT the whole concert. You earned it."),
        row("20:45", "done", "You may leave. Optional last walk."),
      ],
    },
    {
      id: "crowd",
      n: 10,
      title: "Crowd / lobby",
      short: "The line",
      arrive: "4:45 PM · eat · lobby at 5:00",
      eat: "4:45 PM · 15 min.",
      sit: "You work David. Whole concert 7:00–8:45.",
      roster: [{ kind: "grounds", hint: /crowd|lobby/i }],
      why: "Keep the line moving. Doors stay clear. Tickets can work if people are not piled on them.",
      clock: [
        row("16:45", "arrive", "Arrive. Event t-shirt on. EAT. 15 minutes."),
        row("17:00", "work", "Lobby. Keep the line off the doors. Point to tickets. Do not take money."),
        row("17:30", "work", "BBQ rush. Smile. One line. No cluster in the doorway."),
        row("17:45", "work", "Dinner show. Stay. Quiet voices. Late guests still check in."),
        row("18:30", "work", "Concert doors. 15-minute pile-up risk. Hold people off Tickets until there is a gap."),
        row("18:45", "leave", "Stand down unless Event Lead keeps you."),
        row("19:00", "sit", "SIT the whole concert. You are done working."),
        row("20:45", "done", "You may leave."),
      ],
    },
    {
      id: "muscle1",
      n: 11,
      title: "Sound / lights muscle 1",
      short: "Speakers + stands",
      arrive: "Come at 4:45 if you can · required 8:45 PM",
      eat: "4:45 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 4:45: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 1/i }],
      why: "The best version of this job is: eat, sit David, sit the concert, then carry speakers when Tracy points.",
      clock: [
        row("16:45", "arrive", "Best night: arrive now. Event t-shirt on. EAT. 15 minutes. You are a guest until 8:45."),
        row("17:00", "sit", "You have no post. Walk, greet, sit. Do not take over a table."),
        row("17:45", "sit", "SIT the dinner show. Whole set. That is allowed. That is the point."),
        row("19:00", "sit", "SIT the concert. Whole show. Phone on silent. Be by the stage at 8:40."),
        row("20:45", "strike", "Required if you did not come early: arrive now in the event t-shirt. Find Tracy. He directs."),
        row("20:46", "strike", "You carry speakers and stands. No empty hands. His vehicle."),
        row("21:30", "done", "Carry is done. Help the walk or go. Building clear 10:00."),
      ],
    },
    {
      id: "muscle2",
      n: 12,
      title: "Sound / lights muscle 2",
      short: "Lights + cases",
      arrive: "Come at 4:45 if you can · required 8:45 PM",
      eat: "4:45 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 4:45: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 2/i }],
      why: "Same deal as muscle 1. Eat and sit both shows. At encore you carry lights and cases.",
      clock: [
        row("16:45", "arrive", "Best night: arrive now. Event t-shirt on. EAT. Then you are a guest until 8:45."),
        row("17:45", "sit", "SIT the dinner show. Whole set."),
        row("19:00", "sit", "SIT the concert. Be by the stage at 8:40."),
        row("20:45", "strike", "Required arrival if you were not already here. Event t-shirt. Find Tracy."),
        row("20:46", "strike", "You carry lights and cases. Tracy directs. His vehicle."),
        row("21:30", "done", "Carry is done. Help the walk or go."),
      ],
    },
    {
      id: "muscle3",
      n: 13,
      title: "Sound / lights muscle 3",
      short: "Everything else",
      arrive: "Come at 4:45 if you can · required 8:45 PM",
      eat: "4:45 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 4:45: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 3/i }],
      why: "You grab whatever is left so Tracy's vehicle is full and the stage is empty.",
      clock: [
        row("16:45", "arrive", "Best night: arrive now. Event t-shirt on. EAT. Guest until 8:45."),
        row("17:45", "sit", "SIT the dinner show. Whole set."),
        row("19:00", "sit", "SIT the concert. Be by the stage at 8:40."),
        row("20:45", "strike", "Required arrival if you were not already here. Event t-shirt. Find Tracy."),
        row("20:46", "strike", "Carry remaining production to his vehicle. No empty hands."),
        row("21:30", "done", "Stage is empty. Help the walk or go."),
      ],
    },
  ];

  SPOTS.forEach((spot) => {
    if (spot.clock.some((block) => /#GrappeSOS/.test(block.text))) return;
    const first = spot.clock[0];
    spot.clock.splice(1, 0, row(first ? first.t : "17:00", "work", SOCIAL));
  });

  function byId(id) {
    return SPOTS.find((spot) => spot.id === id) || null;
  }

  function owners(store) {
    const doc = store && store.readDoc("spots");
    return doc && doc.owners && typeof doc.owners === "object" ? doc.owners : {};
  }

  function saveOwner(store, id, name) {
    if (!store) return;
    const next = Object.assign({}, owners(store), { [id]: String(name || "").trim() });
    store.saveDoc("spots", { v: 1, owners: next });
    syncRoster(store, id, next[id]);
    const spot = byId(id);
    if (spot && spot.leadJob && global.GGSLeadDuties && next[id]) {
      global.GGSLeadDuties.saveOwner(spot.leadJob, next[id]);
    }
    if (store.flush) store.flush();
  }

  function phoneFor(name) {
    if (!name) return "";
    if (global.GGSPeople) {
      const person = global.GGSPeople.findPerson(name);
      if (person && person.phone) return person.phone;
    }
    if (global.GGSCrewSlice && global.GGSPrepStore) {
      return global.GGSCrewSlice.phoneFor(global.GGSPrepStore, name) || "";
    }
    return "";
  }

  function syncRoster(store, id, name) {
    const spot = byId(id);
    if (!spot || !store) return;
    const roster = store.readDoc("volunteers");
    if (!roster) return;
    const label = String(name || "").trim();
    const phone = phoneFor(label);
    (spot.roster || []).forEach((rule) => {
      const rows = roster[rule.kind] || [];
      rows.forEach((row) => {
        if (rule.hint.test(String(row.role || ""))) {
          row.name = label;
          if (phone) row.phone = phone;
        }
      });
    });
    store.saveDoc("volunteers", roster);
  }

  function hydrateFromRoster(store) {
    const roster = store && store.readDoc("volunteers");
    if (!roster) return owners(store);
    const current = Object.assign({}, owners(store));
    let dirty = false;
    SPOTS.forEach((spot) => {
      if (current[spot.id]) return;
      (spot.roster || []).some((rule) => {
        const hit = (roster[rule.kind] || []).find((row) => rule.hint.test(String(row.role || "")) && String(row.name || "").trim());
        if (hit) {
          current[spot.id] = String(hit.name).trim();
          dirty = true;
          return true;
        }
        return false;
      });
    });
    if (dirty) store.saveDoc("spots", { v: 1, owners: current });
    return current;
  }

  function matchName(a, b) {
    if (global.GGSCrewSlice) return global.GGSCrewSlice.nameMatch(a, b);
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  }

  function spotForName(name) {
    if (!name) return null;
    const store = global.GGSPrepStore;
    const map = hydrateFromRoster(store);
    const hit = SPOTS.find((spot) => matchName(map[spot.id], name));
    if (hit) return hit;
    if (global.GGSLeadDuties) {
      const job = global.GGSLeadDuties.jobFor(name);
      if (job) {
        const fromLead = SPOTS.find((spot) => spot.leadJob === job.id);
        if (fromLead) return fromLead;
      }
    }
    return null;
  }

  global.GGSDaySpots = {
    WEAR: WEAR,
    SHOWS: SHOWS,
    SOCIAL: SOCIAL,
    SPOTS: SPOTS,
    byId: byId,
    owners: owners,
    saveOwner: saveOwner,
    hydrateFromRoster: hydrateFromRoster,
    spotForName: spotForName,
  };
})(window);
