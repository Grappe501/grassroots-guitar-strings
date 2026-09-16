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
      arrive: "3:00 PM · earlier if you can",
      eat: "3:20 PM · 15 min. Plate before sound check.",
      sit: "Watch acoustic 5:45–6:05. Watch concert 7:15–8:00.",
      leadJob: "event",
      roster: [{ kind: "event", hint: /event captain/i }],
      why: "You own the night. You also sit both shows — short — so you are a guest too.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on before you talk to anyone. Open My Night. Phone on silent, vibrate on."),
        row("15:05", "work", "Walk 8 guest tables, lobby, buffet, merch, lot. Do not fix venue furniture."),
        row("15:15", "work", "Confirm every night post is walking in: tickets, Ben + 3 servers, water, campaign, both floaters, Kelly Support, Photo, 3 arrival. Text anyone missing."),
        row("15:20", "eat", "EAT. 15 minutes. Plate now so you are not hungry at doors."),
        row("15:40", "work", "Ice with Ben. 12 bags in chests, not in a car. Water girl has 120 bottles and the money bag."),
        row("16:30", "work", "SOUND CHECK on the dance floor. Do not walk it. Stand the edge. Confirm Tracy and the band have what they need."),
        row("17:00", "work", "Dinner doors. Tell every night person: you stay until 10. Everything is inside. Concert-only stay in cars until 6:30. Ben does not plate. Water is $1 cash. Tea and lemonade are free while they last."),
        row("17:10", "work", "Doors are live. Walk tickets, food, campaign, lot. You already ate at 3:20."),
        row("17:25", "work", "On your feet. Tickets, food, campaign, lot. One sentence each: you good?"),
        row("17:30", "work", "Buffet opens. Smile. Do not plate. Ben serves. You keep walking."),
        row("17:45", "sit", "SIT David 20 minutes. Relief 1 has tickets. Do not radio unless something is on fire."),
        row("18:05", "work", "Stand. Quiet walk while David is still playing. Do not cut the dance floor."),
        row("18:15", "work", "Acoustic over. Floater B clears the floor. You watch. You do not stack."),
        row("18:30", "work", "Concert doors. Stand lobby 10 minutes. Then leave Tickets and Floater A to the rush."),
        row("18:45", "work", "Hard checkpoint with Production. Every post still has a body. Concert at 7:00."),
        row("19:00", "work", "Concert starts. Walk once. Then get out of the aisles."),
        row("19:15", "sit", "SIT the concert 45 minutes. You are a guest. Relief is walking."),
        row("20:00", "work", "Up. Walk every post. Thank people by name. Confirm 3 muscle are coming at 8:45."),
        row("20:15", "work", "One more loop: tickets money, food leftover, merch boxing, lot empty."),
        row("20:30", "work", "Floater A tells each post: you stay. Building clear 10:00."),
        row("20:45", "strike", "Show over. Call pairs out loud: A cloths, B campaign, C food, D Tracy + 3 muscle. Venue tables and chairs stay."),
        row("21:00", "strike", "Band load-out has started. Do not put house production in a band case. Tracy's vehicle is D."),
        row("21:15", "strike", "Walk A through D. Bins in vehicles. Nothing in a hallway."),
        row("21:30", "strike", "Restrooms, lot, main room. No second speech. Just finish."),
        row("21:45", "strike", "Final walk with Strike Lead if that is a second person. Our stuff is gone. Furniture stays."),
        row("22:00", "done", "Confirm clear. Thank Tracy and Ben. You leave last."),
      ],
    },
    {
      id: "tickets",
      n: 2,
      title: "Tickets",
      short: "Lobby money",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:20 PM · 15 min behind the table.",
      sit: "Watch acoustic 5:45–6:10. Watch concert 7:00–8:30.",
      leadJob: "tickets",
      roster: [{ kind: "event", hint: /tickets/i }],
      why: "One body at the table. Relief 1 covers so you can watch the acoustic set. After doors, you watch the concert.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Concert-only guests wait in cars until 6:30."),
        row("15:05", "work", "Dress the lobby table: cash box, envelopes, pens, $25 sign, teacher/first-responder note. No paper tickets. 10 minutes. Venue already placed the table."),
        row("15:20", "eat", "EAT. 15 minutes behind the table."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Table can wait. You are dressed."),
        row("17:00", "work", "Dinner doors. Table is live. Dinner guests check in. Cash box never sits open and empty. Envelopes stay on you."),
        row("17:30", "work", "Buffet rush. Keep the line one-deep. Point overflow to the wall. Do not leave the box."),
        row("17:45", "sit", "Hand the box to Relief 1. SIT David 25 minutes. You are in a chair, not in the lot."),
        row("18:10", "work", "Take the box back. Thank Relief 1. Count envelopes once. Quiet."),
        row("18:30", "work", "Concert doors. 15-minute rush. Floater A stands with you. Overflow to the wall, not the door."),
        row("18:45", "work", "Rush is over. Box on your body. Late walk-ups only."),
        row("19:00", "sit", "SIT the concert. Relief 1 peeks the lobby every 20 minutes. They come get you if a line forms."),
        row("20:20", "work", "One peek. If the lobby is empty, sit back down."),
        row("20:30", "work", "Back to lobby. No new sales after Event Lead says the house is closed."),
        row("20:45", "strike", "Reconcile cash and envelopes. 15 minutes. Money to Event Lead."),
        row("21:00", "strike", "Help Campaign bins or the final walk. Venue table stays."),
        row("22:00", "done", "Money is with Event Lead. You may leave."),
      ],
    },
    {
      id: "food",
      n: 3,
      title: "Food service lead · Ben",
      short: "The line",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:30 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00. You do not plate. You are not water.",
      leadJob: "food",
      roster: [{ kind: "event", hint: /food service lead/i }],
      why: "You lead the serving line. Three volunteers serve with you — Sarah plus two more. You do not plate. Water is a different person. Tea and lemonade are free while they last.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Walk the buffet. Three servers should be with you. Water is not your station."),
        row("15:10", "work", "Ice chest + scoop for tea and lemonade. Set the line. Signs: free while it lasts. You do not plate."),
        row("15:30", "eat", "EAT now. 15 minutes. Then the line owns you."),
        row("16:00", "work", "Brief Sarah and the two other servers. One line. You direct. They serve. You still do not plate."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Ice should already be in."),
        row("17:05", "work", "Doors soon. Line is set. You still do not plate."),
        row("17:30", "work", "BBQ open. Keep the line moving. Refill pans. Do not plate guest plates."),
        row("17:45", "work", "Dinner show. Stay on the line. Listen from the buffet. Relief 2 gives a server a restroom only."),
        row("18:00", "work", "Check pans and ice. Wave Relief 2 if a server needs 5 minutes."),
        row("18:20", "work", "Line slows. Free drinks stay up until they are gone. Then the sign comes down."),
        row("18:30", "work", "Line closes. Thank the three servers. Water stays up. You are off the line."),
        row("18:40", "work", "Cover pans. Trash out of the guest path. Ice chest stays if drinks remain."),
        row("19:20", "sit", "SIT the concert 40 minutes. Servers sit too."),
        row("20:45", "strike", "Strike C. You plus the three servers. Coolers, leftover, trash. 20 minutes."),
        row("21:05", "strike", "Food area clean. Personal coolers to owners. Nothing in a hallway."),
        row("22:00", "done", "Food area is clean. You may leave."),
      ],
    },
    {
      id: "server1",
      n: 4,
      title: "Server 1 · Sarah",
      short: "Serving line",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:30 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00.",
      roster: [{ kind: "event", hint: /server 1/i }],
      why: "You are one of three volunteers on Ben’s serving line. Ben leads. He does not plate. You serve. Water is not your job.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Find Ben. You are Server 1 · Sarah."),
        row("15:10", "work", "Help set the line. Pans, utensils, plates at the start. Tea and lemonade are free while they last. Do not take the water station."),
        row("15:30", "eat", "EAT now. 15 minutes."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:05", "work", "Stand your spot on the line. Ben briefs. You serve. You do not plate in the back."),
        row("17:30", "work", "Line is open. Serve. Smile. Ben directs."),
        row("17:45", "work", "Dinner show. Stay on the line. Listen from here. Restroom only if Relief 2 tags you."),
        row("18:00", "work", "Still serving. If a pan is low, tell Ben. Do not leave the line to hunt food."),
        row("18:30", "work", "Line closes. Wipe, stack, help Ben reset."),
        row("19:20", "sit", "SIT the concert 40 minutes."),
        row("20:45", "strike", "Strike C with Ben and the other two servers. Coolers, leftover, trash."),
        row("22:00", "done", "You may leave."),
      ],
    },
    {
      id: "server2",
      n: 5,
      title: "Server 2",
      short: "Serving line",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:30 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00.",
      roster: [{ kind: "event", hint: /server 2/i }],
      why: "Second volunteer on Ben’s line. Sarah is Server 1. Name this seat today. Water is a different person.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Find Ben. You are Server 2."),
        row("15:10", "work", "Help set the line. Tea and lemonade are free while they last. Do not take the water station."),
        row("15:30", "eat", "EAT now. 15 minutes."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:05", "work", "Stand your spot. Ben briefs. You serve. You do not plate. You do not sell water."),
        row("17:30", "work", "Line is open. Serve. Smile. Ben directs."),
        row("17:45", "work", "Dinner show. Stay on the line. Restroom only if Relief 2 tags you."),
        row("18:00", "work", "Still serving. If a pan is low, tell Ben."),
        row("18:30", "work", "Line closes. Wipe, stack, help Ben reset."),
        row("19:20", "sit", "SIT the concert 40 minutes."),
        row("20:45", "strike", "Strike C with Ben and the other servers."),
        row("22:00", "done", "You may leave."),
      ],
    },
    {
      id: "server3",
      n: 6,
      title: "Server 3",
      short: "Serving line",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:30 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00.",
      roster: [{ kind: "event", hint: /server 3/i }],
      why: "Third volunteer on Ben’s line. Name this seat today.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Find Ben. You are Server 3."),
        row("15:10", "work", "Help set the line. Tea and lemonade are free while they last. Do not take the water station."),
        row("15:30", "eat", "EAT now. 15 minutes."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:05", "work", "Stand your spot. Ben briefs. You serve. You do not plate. You do not sell water."),
        row("17:30", "work", "Line is open. Serve. Smile. Ben directs."),
        row("17:45", "work", "Dinner show. Stay on the line. Restroom only if Relief 2 tags you."),
        row("18:00", "work", "Still serving. If a pan is low, tell Ben."),
        row("18:30", "work", "Line closes. Wipe, stack, help Ben reset."),
        row("19:20", "sit", "SIT the concert 40 minutes."),
        row("20:45", "strike", "Strike C with Ben and the other servers."),
        row("22:00", "done", "You may leave."),
      ],
    },
    {
      id: "water",
      n: 7,
      title: "Water",
      short: "$1 bottles",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:30 PM · 15 min. Then you own the bottles.",
      sit: "Stay on bottles during the acoustic set. Watch the concert 7:20–8:00 while Relief 2 covers.",
      roster: [{ kind: "event", hint: /\$1 bottles only/i }],
      why: "You are the water girl. Bottled water is $1 cash only. You are not on Ben’s serving line. Tea and lemonade are free at the drink station — not your money bag.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. You are water. Not the serving line."),
        row("15:10", "work", "120 bottles on ice. $1 cash-only signs up. Money bag on you. Ones for change. Tea and lemonade are free over there — leave them alone."),
        row("15:30", "eat", "EAT now. 15 minutes."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Bottles can wait on ice."),
        row("17:00", "work", "Dinner doors. You are live. Script: water is a $1 donation, cash only — or take free tea and lemonade while it lasts."),
        row("17:30", "work", "Buffet rush. Keep the bag on you. Do not set cash on the cooler."),
        row("17:45", "work", "Dinner show. Stay on bottles. Listen from the cooler."),
        row("18:30", "work", "Line is done. You stay up. Concert-door guests will want water."),
        row("19:00", "work", "Concert starts. Stay through the first songs unless Relief 2 has already tagged you."),
        row("19:20", "sit", "SIT the concert 40 minutes. Relief 2 has the bag and the cooler."),
        row("20:00", "work", "Back on water through the last song."),
        row("20:45", "strike", "Reconcile the water bag with Event Lead. Pack leftover bottles."),
        row("22:00", "done", "Bag is with Event Lead. You may leave."),
      ],
    },
    {
      id: "campaign",
      n: 8,
      title: "Campaign + merch",
      short: "One table",
      arrive: "10:00 AM if you dress tables · 3:00 PM for night",
      eat: "Lunch off site after 12:30 if you did morning. Night plate at 3:15.",
      sit: "Close the table and watch acoustic 5:45–6:15. Watch concert 7:15–8:00.",
      leadJob: "campaign",
      roster: [
        { kind: "event", hint: /campaign|merch/i },
        { kind: "setup", hint: /setup 3/i },
      ],
      why: "30-minute merch set. Close the table for David so you sit. Close it again for 45 minutes of the concert.",
      clock: [
        row("10:00", "arrive", "If you are Setup 3: arrive. Event t-shirt on. Open My Night. Three people dress 8 guest tables only."),
        row("10:25", "work", "Tables done. You set merch — 30 minutes. Campaign signs, campaign T-shirts, concert T-shirts, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes. 4-ft and 6-ft cloths. Conversation cards."),
        row("11:00", "work", "Yard-sign sheet on the same table. First name + phone. No second décor pass."),
        row("12:30", "leave", "Morning work is done. Leave. Eat a real lunch off site. Be back at 3:00."),
        row("15:00", "arrive", "Night arrival by 3:00. Earlier if you can. T-shirt on. Open My Night. Table live."),
        row("15:15", "eat", "EAT. 15 minutes. Sign: back in 10. Do not skip this."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:25", "work", "Table. Talk. Do not leave shirts in a pile guests have to dig. Wave Relief each hour."),
        row("17:45", "sit", "Close the table. Sign: open after David. SIT the dinner show 30 minutes."),
        row("18:15", "work", "Table back up. People will browse after the set."),
        row("18:30", "work", "Concert doors. Stay. This is a browse window."),
        row("19:00", "work", "Concert starts. Stay through the first songs unless Relief has you covered."),
        row("19:15", "sit", "Close the table again. SIT the concert 45 minutes. Relief comes get you if a line forms."),
        row("20:00", "work", "Table through encore. Box loose shirts so strike is 20 minutes."),
        row("20:45", "strike", "Strike B. Campaign signs, both shirt stacks, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes, both cloths, conversation cards. Count. Bins to the campaign vehicle. 20 minutes."),
        row("22:00", "done", "Merch is in a vehicle, not a hallway. You may leave."),
      ],
    },
    {
      id: "production",
      n: 9,
      title: "Tracy helper",
      short: "One system",
      arrive: "With Tracy · 8:00–10:00 AM",
      eat: "Lunch off site ~12:00. Night plate at 5:15 — before David.",
      sit: "Sound check 4:30. Run the acoustic set with Tracy. Watch the concert from a stool at the sound board.",
      leadJob: "production",
      roster: [{ kind: "event", hint: /tracy production helper|tracy/i }],
      why: "Tracy brings a complete lights and sound system. You stay with him. Acoustic 5:45. Concert from the deck.",
      clock: [
        row("08:00", "arrive", "Tracy window opens. He arrives 8:00–10:00 with a complete lights and sound system. Ready to go. Event t-shirt on. Open My Night. Find him when he walks in."),
        row("08:10", "work", "He has everything. Helper job is cables, tape, water, fetch if he asks. Do not build a second plot."),
        row("10:00", "work", "Tracy is on site. Band is not required this morning. They load in at 2:00. Sound check is 4:30."),
        row("12:30", "work", "Room dressers may leave. You stay with Tracy or take a short break if he says so."),
        row("12:00", "eat", "LUNCH off site. 45 minutes. Tell Tracy when you walk. Come back."),
        row("14:00", "work", "Band load-in. Stay out of their merch set. You stay on house production. Bar stool staged for David if it is not already."),
        row("16:30", "show", "SOUND CHECK. Acoustic patch and concert patch. Ice is not your job. Stay on the system."),
        row("16:50", "work", "Sound check done. Stage quiet. Confirm stool, one vocal mic, his amp only for 5:45."),
        row("17:15", "eat", "EAT now. 15 minutes. You miss the dinner show on purpose."),
        row("17:45", "show", "David acoustic. You and Tracy. 30 minutes. Center of the dance floor. Do not sit."),
        row("18:15", "work", "Clear acoustic. Stool away. Floor clear. Floater B helps. Concert system up. Band is in the green room until 6:50."),
        row("18:45", "work", "Checkpoint with Event Lead. Every concert input live. You stay through the last song."),
        row("19:00", "sit", "Concert. Sit a stool at FOH. That is your show. Watch the board."),
        row("20:40", "work", "3 muscle should be at the stage. Point them to Tracy."),
        row("20:45", "strike", "Strike D. Tracy directs. No empty hands. His vehicle. Venue tables stay."),
        row("21:30", "strike", "Stage empty. Cases in his vehicle."),
        row("22:00", "done", "Production is in the vehicle. You may leave with Tracy."),
      ],
    },
    {
      id: "relief",
      n: 10,
      title: "Relief Lead · Floater A",
      short: "Tickets cover",
      arrive: "10:00 AM if you dress · 3:00 PM for night",
      eat: "Lunch off site after 12:30. Night plate at 3:20 — you stay on your post during the acoustic set.",
      sit: "Cover tickets during the acoustic set. Watch the concert 7:30–8:15.",
      leadJob: "relief",
      roster: [
        { kind: "event", hint: /floater a/i },
        { kind: "setup", hint: /setup 1/i },
      ],
      why: "You give other people the dinner show. You get the concert. Eat before 5:00 or you will not eat.",
      clock: [
        row("10:00", "arrive", "If you are Setup 1: arrive. Event t-shirt on. Open My Night. Dress 8 guest tables with Setup 2 and 3."),
        row("10:25", "work", "Tables done. Signs with Setup 2. 15 minutes. Lobby cloth 10."),
        row("12:30", "leave", "Morning done. Leave. Eat lunch off site. Back at 3:00."),
        row("15:00", "arrive", "Night arrival by 3:00. Earlier if you can. T-shirt on. Open My Night. Ice with Food. Walk every post once."),
        row("15:20", "eat", "EAT. 15 minutes. This is your dinner. You work David on purpose."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:00", "work", "Loop starts. Every 30 minutes: tickets 10, food 10, campaign 10. Ice and trash between."),
        row("17:30", "work", "Buffet rush. Keep the loop. Do not get stuck plating."),
        row("17:45", "work", "Dinner show. YOU WORK. Take tickets so they can sit. Stand lobby. Listen from the door."),
        row("18:10", "work", "Hand tickets back. Restart the loop."),
        row("18:30", "work", "Concert doors. Stand with Tickets 15 minutes. No pile-up."),
        row("18:45", "work", "Quiet loop. Trash. Ice if Food waves."),
        row("19:30", "sit", "SIT the concert 45 minutes. Relief 2 is walking. Phone on silent."),
        row("20:15", "work", "Up. One loop: tickets, food, campaign."),
        row("20:30", "work", "Tell every post: you stay until 10. Building clear 10:00."),
        row("20:45", "strike", "Pair up when Event Lead calls it. Venue furniture stays."),
        row("22:00", "done", "Last walk with Event Lead if they ask. Then leave."),
      ],
    },
    {
      id: "relief2",
      n: 11,
      title: "Relief Lead 2 · Floater B",
      short: "Food cover",
      arrive: "10:00 AM if you dress · 3:00 PM for night",
      eat: "Lunch off site after 12:30. Night plate at 3:20 — you stay on your post during the acoustic set.",
      sit: "Cover the food line during the acoustic set. Watch the concert 8:00–8:40.",
      leadJob: "relief2",
      roster: [
        { kind: "event", hint: /floater b/i },
        { kind: "setup", hint: /setup 2/i },
      ],
      why: "You offset Relief 1 so two people are never at the same table. You cover food during David. You sit the end of the concert.",
      clock: [
        row("10:00", "arrive", "If you are Setup 2: arrive. Event t-shirt on. Open My Night. Dress 8 guest tables with Setup 1 and 3."),
        row("10:25", "work", "Tables done. Signs with Setup 1. Help lobby if they need 10 minutes."),
        row("12:30", "leave", "Morning done. Leave. Eat lunch off site. Back at 3:00."),
        row("15:00", "arrive", "Night arrival by 3:00. Earlier if you can. T-shirt on. Open My Night. Start the loop on FOOD first so you are offset from Relief 1."),
        row("15:20", "eat", "EAT. 15 minutes. This is your dinner. You work David on purpose."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:00", "work", "Loop: food 10, campaign 10, tickets 10. Never stack on Relief 1 at the same table."),
        row("17:30", "work", "Buffet rush. Stay on food cover. Do not plate."),
        row("17:45", "work", "Dinner show. YOU WORK. 10-minute food restrooms only. Listen from the buffet."),
        row("18:15", "work", "Acoustic clear. Help clear the dance floor. Then loop."),
        row("18:30", "work", "Doors. Keep the loop moving. Relief 1 is at tickets."),
        row("19:20", "work", "Take water so Food can sit the concert. Check ice every 15 minutes."),
        row("20:00", "sit", "SIT the concert 40 minutes. You have the last sit. Enjoy it."),
        row("20:40", "work", "Up. Hands free for strike."),
        row("20:45", "strike", "Pair up when Event Lead calls it. If Photo Lead is empty, you already grabbed roam shots between loops."),
        row("22:00", "done", "You may leave when Event Lead releases the floor."),
      ],
    },
    {
      id: "parking",
      n: 12,
      title: "Parking",
      short: "The lot",
      arrive: "3:00 PM · earlier if you can · lot at 5:00",
      eat: "3:20 PM · 15 min. Then you are a guest until 5:00.",
      sit: "Stay on the lot 5:45–6:45. Watch the whole 7:00 concert.",
      roster: [{ kind: "grounds", hint: /parking/i }],
      why: "Guests find a space. You miss the dinner show on purpose. You get the whole concert.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night."),
        row("15:20", "eat", "EAT now. 15 minutes. Then you will not eat until after 6:45."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Walk the lot once. You are not on a post yet."),
        row("17:00", "work", "On the lot. Dinner guests go in. Concert-only: stay in the car until 6:30. Overflow if it fills."),
        row("17:30", "work", "Buffet rush. Keep the lane moving. Concert-only stay in cars. Do not leave the lot to greet inside."),
        row("17:45", "work", "David is playing inside. Stay on the lot. Dinner cars still arriving. Concert-only stay in cars."),
        row("18:15", "work", "Acoustic is ending inside. Stay. Concert-only still wait in cars until 6:30."),
        row("18:30", "work", "Concert doors. Concert-only may leave the cars. Point people to the door person, not into traffic."),
        row("18:45", "leave", "Stand down unless Event Lead keeps you. Thank the last driver."),
        row("19:00", "sit", "SIT the whole concert. You are a guest. Phone on silent."),
        row("20:45", "done", "You may leave. Help the final walk only if you want to. Not required."),
      ],
    },
    {
      id: "directions",
      n: 13,
      title: "Directions",
      short: "Lot to door",
      arrive: "3:00 PM · earlier if you can · path at 5:00",
      eat: "3:20 PM · 15 min.",
      sit: "Stay on your post 5:45–6:45. Watch the whole 7:00 concert.",
      roster: [{ kind: "grounds", hint: /directions/i }],
      why: "Everything is inside. Dinner guests go in at 5:00. Concert-only stay in the car until 6:30.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night."),
        row("15:20", "eat", "EAT. 15 minutes."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Walk the path once."),
        row("17:00", "work", "Stand where the lot meets the walk. Dinner guests: go in. Concert-only: stay in the car until 6:30. Everything is inside."),
        row("17:30", "work", "Dinner guests. Same two sentences. Smile. Do not walk each person to a table."),
        row("17:45", "work", "Dinner show. Stay on the path. Late dinner cars still need the door. Concert-only stay in cars."),
        row("18:15", "work", "Stay. Path still has late dinner walk-ins."),
        row("18:30", "work", "Concert doors. Concert-only may leave the cars. Point to lobby tickets. Same room. Do not block the door."),
        row("18:45", "leave", "Stand down unless Event Lead keeps you."),
        row("19:00", "sit", "SIT the whole concert. You earned it."),
        row("20:45", "done", "You may leave. Optional last walk."),
      ],
    },
    {
      id: "crowd",
      n: 14,
      title: "Crowd / lobby",
      short: "The line",
      arrive: "3:00 PM · earlier if you can · lobby at 5:00",
      eat: "3:20 PM · 15 min.",
      sit: "Stay on your post 5:45–6:45. Watch the whole 7:00 concert.",
      roster: [{ kind: "grounds", hint: /crowd|lobby/i }],
      why: "Keep the line moving. Doors stay clear. Tickets can work if people are not piled on them.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night."),
        row("15:20", "eat", "EAT. 15 minutes."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Walk the lobby once."),
        row("17:00", "work", "Dinner doors. Lobby line off the doors. Point to tickets. Do not take money. Concert-only wait in cars until 6:30."),
        row("17:30", "work", "Buffet rush. Smile. One line. No cluster in the doorway."),
        row("17:45", "work", "David starts inside. Stay. Quiet voices. Late dinner guests still check in."),
        row("18:15", "work", "Stay. Acoustic is ending. Do not let a lobby pile start early."),
        row("18:30", "work", "Concert doors. Concert-only come in. 15-minute pile-up risk. Hold people off Tickets until there is a gap."),
        row("18:45", "leave", "Stand down unless Event Lead keeps you."),
        row("19:00", "sit", "SIT the whole concert. You are done working."),
        row("20:45", "done", "You may leave."),
      ],
    },
    {
      id: "muscle1",
      n: 15,
      title: "Sound / lights muscle 1",
      short: "Speakers + stands",
      arrive: "Come at 3:00 if you can · required 8:45 PM",
      eat: "3:20 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 3:00: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 1/i }],
      why: "Best night: eat, watch the acoustic set, watch the concert, then carry speakers when Tracy points.",
      clock: [
        row("15:00", "arrive", "Best night: arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. EAT. 15 minutes. You are a guest until 8:45."),
        row("17:00", "sit", "You have no post. Walk, greet, sit. Do not take over a table."),
        row("17:45", "sit", "SIT the dinner show. Whole set. That is allowed. That is the point."),
        row("19:00", "sit", "SIT the concert. Whole show. Phone on silent."),
        row("20:40", "arrive", "Be by the stage. Event t-shirt on. Find Tracy."),
        row("20:45", "strike", "Required if you did not come early: arrive now. Find Tracy. He directs."),
        row("20:46", "strike", "You carry speakers and stands. No empty hands. His vehicle."),
        row("21:30", "done", "Carry is done. Help the walk or go. Building clear 10:00."),
      ],
    },
    {
      id: "muscle2",
      n: 16,
      title: "Sound / lights muscle 2",
      short: "Lights + cases",
      arrive: "Come at 3:00 if you can · required 8:45 PM",
      eat: "3:20 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 3:00: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 2/i }],
      why: "Same deal as muscle 1. Eat and sit both shows. At encore you carry lights and cases.",
      clock: [
        row("15:00", "arrive", "Best night: arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. EAT. Then you are a guest until 8:45."),
        row("17:00", "sit", "No post. Walk, greet, sit. Do not take over a table."),
        row("17:45", "sit", "SIT the dinner show. Whole set."),
        row("19:00", "sit", "SIT the concert. Phone on silent."),
        row("20:40", "arrive", "Be by the stage. Event t-shirt on. Find Tracy."),
        row("20:45", "strike", "Required arrival if you were not already here. Find Tracy."),
        row("20:46", "strike", "You carry lights and cases. Tracy directs. His vehicle."),
        row("21:30", "done", "Carry is done. Help the walk or go."),
      ],
    },
    {
      id: "muscle3",
      n: 17,
      title: "Sound / lights muscle 3",
      short: "Everything else",
      arrive: "Come at 3:00 if you can · required 8:45 PM",
      eat: "3:20 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 3:00: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 3/i }],
      why: "You grab whatever is left so Tracy's vehicle is full and the stage is empty.",
      clock: [
        row("15:00", "arrive", "Best night: arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. EAT. Guest until 8:45."),
        row("17:00", "sit", "No post. Walk, greet, sit. Do not take over a table."),
        row("17:45", "sit", "SIT the dinner show. Whole set."),
        row("19:00", "sit", "SIT the concert. Phone on silent."),
        row("20:40", "arrive", "Be by the stage. Event t-shirt on. Find Tracy."),
        row("20:45", "strike", "Required arrival if you were not already here. Find Tracy."),
        row("20:46", "strike", "Carry remaining production to his vehicle. No empty hands."),
        row("21:30", "done", "Stage is empty. Help the walk or go."),
      ],
    },
    {
      id: "setup",
      n: 18,
      title: "Setup Lead",
      short: "Morning room",
      arrive: "10:00 AM",
      eat: "Lunch off site after 12:30. Night only if you also claimed a night seat.",
      sit: "You sit a night show only if you also hold a night seat.",
      leadJob: "setup",
      roster: [{ kind: "setup", hint: /setup captain|setup lead/i }],
      why: "You own the 90-minute room. Three dressers. Then they become night seats. You are done at 12:30 unless you also claimed a night job.",
      clock: [
        row("10:00", "arrive", "Arrive. Event t-shirt on. Open My Night. Gather the 3 dressers. Furniture is already placed. Do not rebuild."),
        row("10:05", "work", "Walk room, exits, lobby. Then the 3 dress 8 guest tables only — cloth + simple center. 25 minutes."),
        row("10:25", "work", "Tables done. Setup 1+2: signs 15, lobby cloth 10. Setup 3: 30-minute merch set. 4-ft and 6-ft campaign cloths, two banners + bungees, conversation cards."),
        row("10:40", "work", "Tea and lemonade station. No ice. Ice waits until 4:30."),
        row("11:00", "work", "Merch done. Yard-sign sheet on that table. Walk once. Fix only what is ours."),
        row("12:00", "work", "Room is dressed. Tracy is on his own system. Band is not your problem this morning."),
        row("12:30", "leave", "Release the 3 dressers. Lunch off site. They come back as Floater A, Floater B, or Campaign."),
        row("15:00", "arrive", "Come back at 3:00 only if you also claimed a night seat. Open that seat on My Night. This page is done."),
      ],
    },
    {
      id: "kelly",
      n: 19,
      title: "Kelly Support",
      short: "On the candidate",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:20 PM · 10 min with Kelly or right behind her.",
      sit: "Sit when she sits. You are never off her.",
      leadJob: "kelly",
      roster: [{ kind: "event", hint: /kelly support/i }],
      why: "You are the only staff on Kelly. Runner plus vertical photos and video. Photo Lead does not man her.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Find Kelly. Water in your hand or on her table."),
        row("15:20", "eat", "EAT 10 minutes with her or right behind her. Then you do not leave her."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Stay with Kelly at the edge."),
        row("17:20", "work", "She works the room. Intros. Move a pull-up if she asks. You do not work tickets, food, or merch."),
        row("17:30", "work", "Buffet. Hold the circle. Do not park her at a table. Vertical photos and video as you go."),
        row("17:45", "work", "David. Stay with her. Sit if she sits. Do not stand in the aisle."),
        row("18:15", "work", "Acoustic over. Keep her moving. Not trapped at merch."),
        row("18:30", "work", "Concert doors. Walk her through the lobby pile-up. Do not stop at tickets unless she wants to greet."),
        row("19:00", "work", "Concert. One chair off her. Still vertical shots. Post. Tag @KellyGrappeSOS. Hashtag #GrappeSOS."),
        row("20:00", "work", "Still with her. If she needs a minute, you hold the circle. Photo Lead does not take her."),
        row("20:45", "done", "She may leave when she is ready. Walk her out if she wants. Then help the final walk or go."),
      ],
    },
    {
      id: "photo",
      n: 20,
      title: "Photo / Video",
      short: "Roam the room",
      arrive: "3:00 PM · earlier if you can",
      eat: "3:15 PM · 10 min. Then roam.",
      sit: "You roam David. Sit the last songs of the concert if you already have the closing shot.",
      leadJob: "photo",
      roster: [{ kind: "event", hint: /photo lead|photographer|photo \/ video/i }],
      why: "Journalistic photography. Action shots of Kelly and the crowd. You are not parked on her. Support staff mans her.",
      clock: [
        row("15:00", "arrive", "Arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. You roam. You are not Kelly's minder."),
        row("15:15", "eat", "EAT 10 minutes. Then the camera owns you."),
        row("15:30", "work", "Empty room, merch, buffet set. Journalistic. Energy."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor. Shoot from the edge."),
        row("17:00", "work", "Dinner doors. Arrivals, lot, lobby, tickets."),
        row("17:30", "work", "BBQ line, hands, faces, volunteers working. Kelly in the room — not parked on her."),
        row("17:45", "show", "David from the side. Crowd listening. Do not walk the dance floor."),
        row("18:15", "work", "Floor clear. Faces. Then reset for doors."),
        row("18:30", "work", "Concert-door faces. The rush. Then first three songs of the concert."),
        row("19:00", "show", "Concert open. Wide room. Then roam: dance floor edge, merch, a quiet table, a laugh."),
        row("19:30", "work", "Post as you go. Tag @KellyGrappeSOS. Invite her to collaborate. Hashtag #GrappeSOS."),
        row("20:30", "work", "One closing group shot if Event Lead wants it."),
        row("20:40", "sit", "You may sit the last songs. Cards and cameras in your bag, not on a table."),
        row("20:45", "done", "Help the walk or go. If this seat had been empty, Floater B would have grabbed roam shots."),
      ],
    },
    {
      id: "strike",
      n: 21,
      title: "Strike / Close Lead",
      short: "10:00 clear",
      arrive: "3:00 PM · earlier if you can · focus 8:30",
      eat: "Eat on your other seat's clock. If this is your only seat, plate at 3:20.",
      sit: "Sit on your other seat. Strike focus starts 8:30.",
      leadJob: "strike",
      roster: [{ kind: "event", hint: /strike|close lead|teardown captain/i }],
      why: "You own the 8:45 pairs and the 10:00 walk. Venue furniture stays. Event Lead can hold this seat too.",
      clock: [
        row("15:00", "arrive", "If this is your only seat: arrive by 3:00. Earlier if you can. Event t-shirt on. Open My Night. Walk with Event Lead. Then stay out of posts."),
        row("15:20", "eat", "If this is your only seat: EAT 15 minutes. Then you are a guest until 8:30."),
        row("16:30", "work", "SOUND CHECK. Stay off the dance floor."),
        row("17:45", "sit", "Sit David if you are not on another post."),
        row("19:00", "sit", "Sit the concert if you are not on another post."),
        row("20:30", "work", "STRIKE FOCUS. Walk every post with Event Lead. Confirm 3 muscle are coming. Tell people: you stay until 10."),
        row("20:45", "strike", "Show over. Call pairs out loud: A cloths (2), B campaign (2), C Ben + 3 servers, D Tracy + helper + 3 muscle, E everyone walks last."),
        row("20:46", "strike", "Venue furniture stays. Leave the 8 rounds, buffet tables, lobby table, and 64 chairs."),
        row("21:00", "strike", "A folding cloths. B packing merch. C food. D loading Tracy's vehicle. Band load-out is separate."),
        row("21:15", "strike", "Walk A through D. No second speech. Just finish. Bins in vehicles."),
        row("21:30", "strike", "Restrooms, lot, main room."),
        row("21:45", "strike", "Final walk with Event Lead. Our stuff is gone. Furniture stays."),
        row("22:00", "done", "Building clear. Event Lead leaves last. You leave when they say so."),
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

  function saveOwner(store, id, name, opts) {
    if (!store) return;
    const next = Object.assign({}, owners(store), { [id]: String(name || "").trim() });
    store.saveDoc("spots", { v: 1, owners: next });
    syncRoster(store, id, next[id]);
    const spot = byId(id);
    if (!opts || !opts.skipLead) {
      if (spot && spot.leadJob && global.GGSLeadDuties && next[id]) {
        global.GGSLeadDuties.saveOwner(spot.leadJob, next[id]);
      }
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
