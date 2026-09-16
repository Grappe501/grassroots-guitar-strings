(function (global) {
  function beat(t, who, text, kind) {
    return { t: t, who: who, text: text, kind: kind || "work" };
  }

  const CLOCK = [
    beat("08:00", "Setup 1–3 · Tracy helper", "Venue open. Event t-shirts on. Furniture is already placed. Do not rebuild tables or the dance floor.", "arrive"),
    beat("08:05", "Setup 1–3", "Walk the room, exits, and lobby. Then dress the 8 guest tables only.", "work"),
    beat("08:10", "Tracy helper", "Unload one production system with Tracy. Cables, tape, fetch. Do not build a second plot.", "work"),
    beat("08:25", "Setup 3", "Tables done. Start the 30-minute merch set: pull-ups, cards, buttons, candy, shirts.", "work"),
    beat("08:25", "Setup 1 + 2", "Place printed signs. Dress the lobby ticket table.", "work"),
    beat("08:40", "Setup 1–3", "Set the tea and lemonade station. No ice yet. Ice waits until 4:30.", "work"),
    beat("09:00", "Setup 3", "Merch set done. Yard-sign sheet on the same table. First name + phone.", "work"),
    beat("09:15", "Tracy helper", "Power mapped. Dance floor cables taped. Spare batteries at the mixer.", "work"),
    beat("09:30", "Tracy helper", "Bar stool staged for David. One vocal mic and stand ready.", "work"),
    beat("10:00", "Tracy + helper", "System ready. Line check and lights. Band sound check is 4:30 — do not wait for the band this morning.", "work"),
    beat("10:30", "Setup 1–3", "Morning work is done. Leave. Eat a real lunch off site. Back at 4:30 in your night seat.", "leave"),
    beat("12:00", "Tracy helper", "Lunch off site, 45 minutes, only if Tracy can hold the system.", "eat"),
    beat("16:30", "David + band + Tracy", "SOUND CHECK. Acoustic and concert. Band is plugged in now, not at 5:00.", "show"),
    beat("16:30", "Night crew", "Night crew back. Event t-shirts on. Ice now — not later. 12 bags. Stay off the dance floor — sound check.", "arrive"),
    beat("16:32", "Ben + 3 servers", "Ice chest + scoop for tea and lemonade. Line set. Free-while-it-lasts signs up. Ben does not plate.", "work"),
    beat("16:35", "Water", "120 bottles on ice. $1 cash-only signs. Money bag on you. Not the serving line.", "work"),
    beat("16:40", "Floater A + B", "Walk every post once. Then start the relief loop.", "work"),
    beat("16:45", "Parking · directions · crowd", "Eat now if you have not. On lot, path, and lobby at 5:00.", "eat"),
    beat("16:45", "Tracy muscle", "Optional early arrival. Eat. You are a guest until 8:45.", "eat"),
    beat("16:50", "Ben + servers + water", "Eat now. 15 minutes. This is dinner before the line opens.", "eat"),
    beat("17:00", "Event Captain", "Posts live. Tell every night person: you stay until 10. Take pictures. Tag @KellyGrappeSOS. Hashtag #GrappeSOS.", "work"),
    beat("17:00", "Parking", "On the lot. Wave cars. Overflow if it fills.", "work"),
    beat("17:00", "Directions", "Lot meets the walk. BBQ inside. Concert under the pavilion.", "work"),
    beat("17:00", "Crowd", "Lobby line off the doors. Point to tickets. Do not take money.", "work"),
    beat("17:00", "Tickets", "Lobby table live: cash box, envelopes, $25 sign, educator/first-responder note.", "work"),
    beat("17:10", "Captain · tickets · campaign", "Eat now. 15 minutes. Do not start a meeting with food in your hand.", "eat"),
    beat("17:15", "Tracy helper", "Eat now. You run the acoustic set at 5:45.", "eat"),
    beat("17:25", "Tickets · campaign", "Back on posts. Table and lobby are live.", "work"),
    beat("17:30", "Ben + 3 servers", "BBQ line opens. Ben directs. Servers serve. Tea and lemonade free while they last.", "show"),
    beat("17:30", "Water", "Bottles live. $1 cash only. Tea and lemonade are free at the line — not your bag.", "work"),
    beat("17:40", "Kelly Support · Photo", "Kelly is with guests. Support stays on her, vertical. Photo Lead roams.", "work"),
    beat("17:45", "Tracy + helper · David", "Acoustic set starts. Center of the dance floor. 30 minutes. Stool, one mic, his amp only.", "show"),
    beat("17:45", "Ben + 3 servers · water · lot · lobby", "Stay on your job through this set. Listen from your post.", "work"),
    beat("17:45", "Relief 1", "Take tickets so they can watch the acoustic set.", "work"),
    beat("17:45", "Relief 2", "Cover the food line for restroom only. Do not leave the buffet empty.", "work"),
    beat("17:45", "Captain · tickets · campaign", "Watch the acoustic set if your cover is in place. Campaign table closed until David is done.", "sit"),
    beat("18:05", "Event Captain", "Stand. Quiet walk. Do not cut across the dance floor.", "work"),
    beat("18:10", "Tickets", "Back on the lobby table. Thank Relief 1.", "work"),
    beat("18:15", "David + band", "Acoustic over. Green room for 45 minutes. Concert is 7:00. Back at the stage by 6:50.", "sit"),
    beat("18:15", "Tracy helper · Floater B", "Acoustic over. Clear the floor. Stool away. Concert system up. Band is in the green room until 6:50.", "work"),
    beat("18:20", "Ben + servers", "Line slows. Second plate if you are still hungry. Then reset.", "eat"),
    beat("18:25", "Campaign", "Table back up. People will browse after the set.", "work"),
    beat("18:30", "Tickets · Floater A", "Concert doors. 15-minute rush. No pile-up. Overflow to the wall, not the door.", "show"),
    beat("18:30", "Parking · directions · crowd", "Last car and line push. Then stand down unless Event Captain keeps you.", "work"),
    beat("18:40", "Parking · directions · crowd", "Stand down. You may watch the whole concert.", "sit"),
    beat("18:45", "Event Captain · Tracy helper", "Hard checkpoint. Every post still has a body. Concert at 7:00.", "work"),
    beat("18:50", "Tickets", "Rush is over. Cash box stays on your body.", "work"),
    beat("19:00", "Whole room", "Concert starts. Floaters walk. One person always circulating. Phone on silent.", "show"),
    beat("19:15", "Captain · campaign", "Watch the concert if a floater has your post. Table can close 45 minutes.", "sit"),
    beat("19:20", "Ben + 3 servers", "Line is closed. Watch the concert. Water stays up.", "sit"),
    beat("19:20", "Water", "Watch the concert 40 minutes. Relief 2 has the bag and the cooler.", "sit"),
    beat("19:30", "Relief 1", "Watch the concert. Relief 2 is walking.", "sit"),
    beat("20:00", "Water · campaign", "Back on post. Water through the last song. Merch table through encore.", "work"),
    beat("20:00", "Relief 2", "Watch the last 40 minutes of the concert.", "sit"),
    beat("20:15", "Relief 1", "Up. One quiet loop.", "work"),
    beat("20:30", "Relief 1 · Event Captain", "Tell every post: you stay until 10. Building clear 10:00.", "work"),
    beat("20:30", "Tickets", "Back to lobby. No new sales after Event Captain closes the house.", "work"),
    beat("20:40", "Tracy muscle 1–3", "At the stage. Event t-shirts on. Find Tracy.", "arrive"),
    beat("20:45", "Event Captain", "Show over. Call pairs out loud. Send 3 muscle to Tracy. Venue tables and chairs stay.", "strike"),
    beat("20:46", "Strike A", "Two people. 8 guest cloths plus buffet and lobby cloths. Leave venue furniture.", "strike"),
    beat("20:46", "Strike B", "Campaign and merch. Bins, banners, leftover shirts. 20 minutes.", "strike"),
    beat("20:46", "Strike C", "Ben plus 3 servers. Coolers, leftover, trash. 20 minutes.", "strike"),
    beat("20:46", "Strike D", "Tracy directs. Helper plus 3 muscle. No empty hands. His vehicle.", "strike"),
    beat("20:46", "Water", "Reconcile the $1 bag with Event Captain. Pack leftover bottles.", "strike"),
    beat("21:15", "Event Captain", "Cloths packed. Campaign packed. Food packed. Production should be loading.", "strike"),
    beat("21:30", "Tracy + muscle", "Carry should be done. Stage empty.", "strike"),
    beat("21:45", "Captain + Floater B", "Final walk: restrooms, lot, pavilion, lost and found.", "strike"),
    beat("22:00", "Event Captain", "Building cleared and secured. Thank Tracy and Ben. Captain leaves last.", "done"),
  ];

  function hm(t) {
    const p = String(t || "").split(":");
    const h = Number(p[0]);
    const m = p[1] || "00";
    if (!Number.isFinite(h)) return t;
    const ampm = h >= 12 ? "PM" : "AM";
    return (h % 12 || 12) + ":" + m + " " + ampm;
  }

  function idFor(row, i) {
    return row.t + ":" + i + ":" + String(row.who || "").slice(0, 24);
  }

  const BAND = [
    beat("08:00", "Tracy · lights · sound", "Venue open. Load one system. Furniture is already placed — do not move tables or the dance floor.", "arrive"),
    beat("08:10", "Tracy · helper", "Unload speakers, mixer, mics, stands, lights. Tape as you go. One plot only.", "work"),
    beat("09:00", "Tracy · helper", "Power mapped. Dance-floor cables taped. Lights hung and aimed.", "work"),
    beat("09:30", "Tracy · helper", "Acoustic ready: bar stool, one vocal mic, stand. Concert mics staged, not live.", "work"),
    beat("10:00", "Tracy · helper", "System line check. Lights focused. Band is not required this morning.", "work"),
    beat("10:30", "Tracy", "Morning build is done. Hold the system or take lunch if a body stays on it.", "leave"),
    beat("12:00", "Tracy · helper", "Lunch off site, 45 minutes, only if the system can hold.", "eat"),
    beat("16:30", "David + band + Tracy", "SOUND CHECK. You are on site and plugged in. Acoustic patch and concert patch. Not 5:00. Not after BBQ starts.", "show"),
    beat("16:50", "David + band", "Sound check is done. Stage quiet. Eat if you want — BBQ opens at 5:30.", "eat"),
    beat("17:30", "Band", "BBQ is open. Guests in the room. Stay off the dance floor until 5:45.", "work"),
    beat("17:45", "David + Tracy", "Acoustic dinner set. 30 minutes. Center of the dance floor. Stool, one mic, his amp only.", "show"),
    beat("18:15", "David + band", "Acoustic over. Green room. You have 45 minutes until the concert. Not 15.", "sit"),
    beat("18:15", "Tracy · helper", "Clear the floor. Stool away. Concert system up. Band is off the floor until 6:50.", "work"),
    beat("18:30", "Band", "Concert doors. Stay in the green room. Not a second sound check.", "sit"),
    beat("18:45", "Tracy", "Hard checkpoint. Every concert input live. Show at 7:00.", "work"),
    beat("18:50", "David + band", "Leave the green room. On stage for 7:00.", "arrive"),
    beat("19:00", "David + band", "Concert starts. Full system. About 8:45 last song.", "show"),
    beat("20:40", "Tracy muscle 1–3", "Three carriers at the stage. Find Tracy. Event t-shirts on.", "arrive"),
    beat("20:45", "Tracy · helper · muscle", "Show over. Strike. Tracy directs. His vehicle. Venue tables and chairs stay.", "strike"),
    beat("21:30", "Tracy + muscle", "Stage empty. Cases in the vehicle.", "strike"),
    beat("22:00", "Tracy", "Building clear. Production is gone.", "done"),
  ];

  const HOUSE = [
    beat("08:00", "House", "Venue open. Load-in. Dress the room."),
    beat("10:00", "House", "Room dressed. Lights and sound ready."),
    beat("16:30", "House", "Sound check. Night crew back."),
    beat("17:00", "House", "Posts live. Parking, tickets, lobby."),
    beat("17:30", "House", "BBQ opens."),
    beat("17:45", "House", "David acoustic — dinner show."),
    beat("18:15", "House", "Acoustic over. Band to green room. Floor clear."),
    beat("18:30", "House", "Concert doors."),
    beat("19:00", "House", "Concert."),
    beat("20:45", "House", "Show over. Strike."),
    beat("22:00", "House", "Building clear."),
  ];

  global.GGSRunOfShow = { CLOCK: CLOCK, BAND: BAND, HOUSE: HOUSE, hm: hm, idFor: idFor };
})(window);
