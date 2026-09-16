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
      eat: "4:40 PM · 15 min. Plate before doors.",
      sit: "Watch acoustic 5:45–6:05. Watch concert 7:15–8:00.",
      leadJob: "event",
      roster: [{ kind: "event", hint: /event captain/i }],
      why: "You own the night. You also sit both shows — short — so you are a guest too.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on before you talk to anyone. Open My Night. Phone on silent, vibrate on. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Walk 8 guest tables, lobby, buffet, merch, lot. Confirm every night post is walking in: tickets, Ben + 3 servers, drink station, campaign, both floaters, Kelly Support, Photo, 3 arrival. Text anyone missing."),
        row("16:45", "eat", "EAT. 15 minutes. Plate now so you are not hungry at doors."),
        row("17:00", "work", "Ice with Ben if it is not in. 12 bags in chests, not in a car. Drink station has tea, lemonade, 120 bottles, and the donation bag."),
        row("17:15", "work", "Food doors. Tell every night person: you stay until 10. Everything is inside. Concert-only stay in cars until 6:30. Ben does not plate. We are taking donations for drinks — water, tea, or lemonade."),
        row("17:10", "work", "Doors are live. Walk tickets, food, campaign, lot. You already ate at 4:40."),
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
      arrive: "4:30 PM",
      eat: "4:40 PM · 15 min behind the table.",
      sit: "Watch acoustic 5:45–6:10. Watch concert 7:00–8:30.",
      leadJob: "tickets",
      roster: [{ kind: "event", hint: /tickets/i }],
      why: "One body at the table. Relief 1 covers so you can watch the acoustic set. After doors, you watch the concert.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Concert-only guests wait in cars until 6:30. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Dress the lobby table: cash box, envelopes, pens, $25 sign, kids $5 sign, teacher/first-responder note. No paper tickets. 10 minutes. Venue already placed the table."),
        row("16:45", "eat", "EAT. 15 minutes behind the table."),
        row("17:15", "work", "Food doors. Table is live. Dinner guests check in. Kids $5 with an adult. Cash box never sits open and empty. Envelopes stay on you."),
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
      arrive: "4:30 PM",
      eat: "4:45 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00. You do not plate. Drink station is a different person.",
      leadJob: "food",
      roster: [{ kind: "event", hint: /food service lead/i }],
      why: "You lead the serving line. Three volunteers serve with you — Sarah plus two more. You do not plate. We are taking donations for drinks — water, tea, or lemonade.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Walk the buffet. Three servers should be with you. Drink donations live at merch. Not your station. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Ice chest + scoop for tea and lemonade. Set the line. Signs: we are taking donations for drinks. You do not plate."),
        row("16:45", "eat", "EAT now. 15 minutes. Then the line owns you."),
        row("17:00", "work", "Brief Sarah and the two other servers. One line. You direct. They serve. You still do not plate."),
        row("17:05", "work", "Doors soon. Line is set. You still do not plate."),
        row("17:30", "work", "BBQ open. Keep the line moving. Refill pans. Do not plate guest plates."),
        row("17:45", "work", "Dinner show. Stay on the line. Listen from the buffet. Relief 2 gives a server a restroom only."),
        row("18:00", "work", "Check pans and ice. Wave Relief 2 if a server needs 5 minutes."),
        row("18:20", "work", "Line slows. Drink donation signs stay up. Water, tea, or lemonade."),
        row("18:30", "work", "Line closes. Thank the three servers. Merch keeps taking drink donations. You are off the line."),
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
      arrive: "4:30 PM",
      eat: "4:45 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00.",
      roster: [{ kind: "event", hint: /server 1/i }],
      why: "You are one of three volunteers on Ben’s serving line. Ben leads. He does not plate. You serve. Drink station is a different person.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Find Ben. You are Server 1 · Sarah. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Help set the line. Pans, utensils, plates at the start. Drinks are donations — water, tea, or lemonade. Do not take the merch drink bag."),
        row("16:45", "eat", "EAT now. 15 minutes."),
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
      arrive: "4:30 PM",
      eat: "4:45 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00.",
      roster: [{ kind: "event", hint: /server 2/i }],
      why: "Second volunteer on Ben’s line. Sarah is Server 1. Name this seat today. Drink station is a different person.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Find Ben. You are Server 2. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Help set the line. Drinks are donations — water, tea, or lemonade. Do not take the merch drink bag."),
        row("16:45", "eat", "EAT now. 15 minutes."),
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
      arrive: "4:30 PM",
      eat: "4:45 PM · 15 min. Then the line owns you.",
      sit: "Stay on the line 5:45–6:15. Watch the concert 7:20–8:00.",
      roster: [{ kind: "event", hint: /server 3/i }],
      why: "Third volunteer on Ben’s line. Name this seat today.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Find Ben. You are Server 3. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Help set the line. Drinks are donations — water, tea, or lemonade. Do not take the merch drink bag."),
        row("16:45", "eat", "EAT now. 15 minutes."),
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
      title: "Drink station",
      short: "Tea, lemonade, water",
      arrive: "4:30 PM",
      eat: "4:45 PM · 15 min. Then the drink area owns you.",
      sit: "Stay on drinks during the acoustic set. Watch the concert 7:20–8:00 while Relief 2 covers the station.",
      roster: [{ kind: "event", hint: /drink station|^water —|\$1 bottles only/i }],
      why: "You work the drink area. Keep tea and lemonade full. Help with ice. Hand out water. Ask for donations. Not on Ben’s serving line. Not merch.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Find the drink area. Tea, lemonade, ice, bottled water. Ask for donations. Not the serving line. Sound check is live — stay off the dance floor."),
        row("16:35", "work", "Ice in. Tea and lemonade full. 120 bottles on ice. Donation sign up. Money bag on you. Scoop stays in the ice chest."),
        row("16:45", "eat", "EAT now. 15 minutes."),
        row("17:15", "work", "Food doors. You are live. Keep tea and lemonade full. Hand out water. Script: we are taking donations for drinks — water, tea, or lemonade."),
        row("17:30", "work", "Buffet rush. Ice. Refill tea and lemonade. Water out. Bag on you, not on the cooler."),
        row("17:45", "work", "Dinner show. Stay on the drink station. Listen from here."),
        row("18:30", "work", "Line is done. You stay up. Concert-door guests will want water. Keep tea and lemonade full."),
        row("19:00", "work", "Concert starts. Stay through the first songs unless Relief 2 has already tagged you."),
        row("19:20", "sit", "SIT the concert 40 minutes. Relief 2 has the drink station."),
        row("20:00", "work", "Back on the drink station through the last song. Ice, tea, lemonade, water, donations."),
        row("20:45", "strike", "Reconcile the donation bag with Event Captain. Pack leftover water. Empty tea and lemonade. Ice chests go with Strike C if Ben wants them."),
        row("22:00", "done", "Bag is with Event Captain. You may leave."),
      ],
    },
    {
      id: "campaign",
      n: 8,
      title: "Campaign + merch",
      short: "One table",
      arrive: "10:00 AM if you dress tables · 4:30 PM for night",
      eat: "Lunch off site after 12:30 if you did morning. Night plate at 4:40.",
      sit: "Close the table and watch acoustic 5:45–6:15. Watch concert 7:15–8:00.",
      leadJob: "campaign",
      roster: [
        { kind: "event", hint: /campaign|merch/i },
        { kind: "setup", hint: /setup 3/i },
      ],
      why: "30-minute merch set. Drink donations live at this table. Close the table for David so you sit. Close it again for 45 minutes of the concert.",
      clock: [
        row("10:00", "arrive", "If you are Setup 3: arrive. Event t-shirt on. Open My Night. Three people dress 8 guest tables only."),
        row("10:25", "work", "Tables done. You set merch — 30 minutes. Campaign signs, campaign T-shirts, concert T-shirts, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes, postcards, cash envelopes. 4-ft and 6-ft cloths. Conversation cards."),
        row("11:00", "work", "Yard-sign sheet on the same table. First name + phone. No second décor pass."),
        row("12:30", "leave", "Morning work is done. Leave. Eat a real lunch off site. Be back at 4:30."),
        row("16:30", "arrive", "Night arrival by 4:30. T-shirt on. Open My Night. Table live. Drink donations live here. 120 bottles on ice. Money bag on you. Sound check is live — stay off the dance floor."),
        row("16:45", "eat", "EAT. 15 minutes. Sign: back in 10. Bottles stay on ice. Do not skip this."),
        row("17:25", "work", "Table. Talk. Take drink donations from this table. Script: we are taking donations for drinks — water, tea, or lemonade. Do not leave shirts in a pile guests have to dig. Wave Relief each hour."),
        row("17:45", "sit", "Close the table. Sign: open after David. Ice the bottles. SIT the dinner show 30 minutes."),
        row("18:15", "work", "Table back up. Water back up. People will browse after the set."),
        row("18:30", "work", "Concert doors. Stay. This is a browse window. Sell water."),
        row("19:00", "work", "Concert starts. Stay through the first songs unless Relief has you covered. They sell water from this table."),
        row("19:15", "sit", "Close the table again. SIT the concert 45 minutes. Relief comes get you if a line forms."),
        row("20:00", "work", "Table through encore. Water through the last song. Box loose shirts so strike is 20 minutes."),
        row("20:45", "strike", "Strike B. Leftover water packed. Water cash to Event Lead. Campaign signs, both shirt stacks, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes, postcards, cash / checks, both cloths, conversation cards. Count. Bins to the campaign vehicle. 20 minutes."),
        row("22:00", "done", "Merch is in a vehicle, not a hallway. You may leave."),
      ],
    },
    {
      id: "production",
      n: 9,
      title: "Help Tracy",
      short: "Everyone pitches in",
      retired: true,
      arrive: "When Tracy asks",
      eat: "Eat on your own seat.",
      sit: "Stay on your own seat. If Tracy needs hands, go help. Ask someone next to you to come too.",
      roster: [],
      why: "No named helper. Tracy has a complete system. Everyone pitches in. Ask others to help when he needs hands. 3 muscle still report at 8:45.",
      clock: [
        row("09:00", "work", "Tracy load in. No named helper. If you are free, ask him if he needs a hand. Ask someone else to come too."),
        row("16:30", "work", "Acoustic PA check. Stay off the dance floor unless Tracy asks you on it."),
        row("17:45", "work", "David acoustic. Tracy runs it. Pitch in only if he asks."),
        row("18:15", "work", "Acoustic over. If you are free, help clear the floor. Ask one more person to help."),
        row("20:40", "work", "3 muscle at the stage. Anyone else free goes to Tracy. Ask the person next to you."),
        row("20:45", "strike", "Strike D. Tracy directs. No empty hands. His vehicle. Venue tables stay."),
        row("22:00", "done", "Production is in the vehicle."),
      ],
    },
    {
      id: "relief",
      n: 10,
      title: "Relief Lead · Floater A",
      short: "Tickets cover",
      arrive: "5:30 PM if you can",
      eat: "5:30 PM · 15 min as soon as you walk in. Then you work David.",
      sit: "Cover tickets during the acoustic set. Watch the concert 7:30–8:15.",
      leadJob: "relief",
      roster: [{ kind: "event", hint: /floater a|relief lead(?! 2)/i }],
      why: "Night relief only. No morning. No setup. You give other people the dinner show. You get the concert.",
      clock: [
        row("17:30", "arrive", "Arrive by 5:30 if you can. Event t-shirt on. Open My Night. You are night relief only. No morning. No setup."),
        row("17:32", "eat", "EAT now if you have not. 15 minutes. This is your dinner. Then you work David on purpose."),
        row("17:45", "work", "Dinner show. YOU WORK. Take tickets so they can sit. Stand lobby. Listen from the door."),
        row("18:10", "work", "Hand tickets back. Loop: tickets 10, food 10, campaign 10. Ice and trash between."),
        row("18:30", "work", "Concert doors. Stand with Tickets 15 minutes. No pile-up."),
        row("18:45", "work", "Quiet loop. Trash. Ice if Food or Drink station waves."),
        row("19:30", "sit", "SIT the concert 45 minutes. Relief 2 is walking. Phone on silent."),
        row("20:15", "work", "Up. One loop: tickets, food, campaign, drink station."),
        row("20:30", "work", "Tell every post: you stay until 10. Building clear 10:00."),
        row("20:45", "strike", "Pair up when Event Captain calls it. Venue furniture stays."),
        row("22:00", "done", "Last walk with Event Captain if they ask. Then leave."),
      ],
    },
    {
      id: "relief2",
      n: 11,
      title: "Relief Lead 2 · Floater B",
      short: "Food cover",
      arrive: "5:30 PM if you can",
      eat: "5:30 PM · 15 min as soon as you walk in. Then you work David.",
      sit: "Cover the food line during the acoustic set. Watch the concert 8:00–8:40.",
      leadJob: "relief2",
      roster: [{ kind: "event", hint: /floater b|relief lead 2/i }],
      why: "Night relief only. No morning. No setup. You offset Relief 1. You cover food during David. You sit the end of the concert.",
      clock: [
        row("17:30", "arrive", "Arrive by 5:30 if you can. Event t-shirt on. Open My Night. You are night relief only. No morning. No setup. Start on FOOD so you are offset from Relief 1."),
        row("17:32", "eat", "EAT now if you have not. 15 minutes. This is your dinner. Then you work David on purpose."),
        row("17:45", "work", "Dinner show. YOU WORK. 10-minute food restrooms only. Listen from the buffet. Do not plate."),
        row("18:15", "work", "Acoustic clear. Help clear the dance floor. Then loop: food 10, campaign 10, tickets 10. Never stack on Relief 1 at the same table."),
        row("18:30", "work", "Doors. Keep the loop moving. Relief 1 is at tickets."),
        row("19:20", "work", "Cover the drink station so they can sit the concert. Check ice every 15 minutes. Keep tea and lemonade full."),
        row("20:00", "sit", "SIT the concert 40 minutes. You have the last sit. Enjoy it."),
        row("20:40", "work", "Up. Hands free for strike."),
        row("20:45", "strike", "Pair up when Event Captain calls it. If Photo Lead is empty, you already grabbed roam shots between loops."),
        row("22:00", "done", "You may leave when Event Captain releases the floor."),
      ],
    },
    {
      id: "parking",
      n: 12,
      title: "Parking",
      short: "The lot",
      arrive: "4:30 PM · lot at 5:00",
      eat: "4:40 PM · 15 min. Then you are a guest until 5:00.",
      sit: "Stay on the lot 5:45–6:45. Watch the whole 7:00 concert.",
      roster: [{ kind: "grounds", hint: /parking/i }],
      why: "Guests find a space. You miss the dinner show on purpose. You get the whole concert.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Sound check is live — stay off the dance floor."),
        row("16:40", "eat", "EAT now. 15 minutes. Then you will not eat until after 6:45."),
        row("16:55", "work", "Walk the lot once. You are not on a post yet."),
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
      arrive: "4:30 PM · path at 5:00",
      eat: "4:40 PM · 15 min.",
      sit: "Stay on your post 5:45–6:45. Watch the whole 7:00 concert.",
      roster: [{ kind: "grounds", hint: /directions/i }],
      why: "Everything is inside. Dinner guests go in at 5:00. Concert-only stay in the car until 6:30.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Sound check is live — stay off the dance floor."),
        row("16:40", "eat", "EAT. 15 minutes."),
        row("16:55", "work", "Walk the path once."),
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
      arrive: "4:30 PM · lobby at 5:00",
      eat: "4:40 PM · 15 min.",
      sit: "Stay on your post 5:45–6:45. Watch the whole 7:00 concert.",
      roster: [{ kind: "grounds", hint: /crowd|lobby/i }],
      why: "Keep the line moving. Doors stay clear. Tickets can work if people are not piled on them.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Sound check is live — stay off the dance floor."),
        row("16:40", "eat", "EAT. 15 minutes."),
        row("16:55", "work", "Walk the lobby once."),
        row("17:15", "work", "Food doors. Lobby line off the doors. Point to tickets. Do not take money. Concert-only wait in cars until 6:30."),
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
      arrive: "Come at 4:30 if you can · required 8:45 PM",
      eat: "4:40 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 4:30: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 1/i }],
      why: "Best night: eat, watch the acoustic set, watch the concert, then carry speakers when Tracy points.",
      clock: [
        row("16:30", "arrive", "Best night: arrive by 4:30 if you can. Event t-shirt on. Open My Night. EAT. 15 minutes. You are a guest until 8:45."),
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
      arrive: "Come at 4:30 if you can · required 8:45 PM",
      eat: "4:40 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 4:30: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 2/i }],
      why: "Same deal as muscle 1. Eat and sit both shows. At encore you carry lights and cases.",
      clock: [
        row("16:30", "arrive", "Best night: arrive by 4:30 if you can. Event t-shirt on. Open My Night. EAT. Then you are a guest until 8:45."),
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
      arrive: "Come at 4:30 if you can · required 8:45 PM",
      eat: "4:40 if you come early. Or eat before you arrive at 8:45.",
      sit: "If you come at 4:30: both shows. Required work is only carry-out.",
      roster: [{ kind: "strike", hint: /muscle 3/i }],
      why: "You grab whatever is left so Tracy's vehicle is full and the stage is empty.",
      clock: [
        row("16:30", "arrive", "Best night: arrive by 4:30 if you can. Event t-shirt on. Open My Night. EAT. Guest until 8:45."),
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
      why: "You own the path signs from the gate and the 90-minute room. Paul puts the yard signs out. Three dressers. Morning only. Relief is a different night seat at 5:30. You are done at 12:30 unless you also claimed a night job.",
      clock: [
        row("10:00", "arrive", "Arrive. Event t-shirt on. Open My Night. Gather the 3 dressers. Furniture is already placed. Do not rebuild."),
        row("10:05", "work", "You put yard signs along the path from the gate to the venue door. Dressers start the 8 guest tables — cloth + simple center — while you plant."),
        row("10:25", "work", "Tables done. Walk the path once. Then Setup 1+2: printed signs 15, lobby cloth 10. Setup 3: 30-minute merch set. 4-ft and 6-ft campaign cloths, two banners + bungees, conversation cards."),
        row("10:40", "work", "Tea and lemonade station. No ice. Ice waits until 4:30."),
        row("11:00", "work", "Merch done. Yard-sign giveaway sheet on that table. Path signs stay up. Walk once. Fix only what is ours."),
        row("12:00", "work", "Room is dressed. Path signs stay. Tracy is on his own system. Band is not your problem this morning."),
        row("12:30", "leave", "Release the 3 dressers. Lunch off site. They are done unless they also claimed a night seat. Relief is a different night seat at 5:30. Path signs stay until strike."),
        row("16:30", "arrive", "Come back at 4:30 only if you also claimed a night seat. Open that seat on My Night. This page is done."),
      ],
    },
    {
      id: "kelly",
      n: 19,
      title: "Kelly Support",
      short: "On the candidate",
      arrive: "4:30 PM",
      eat: "4:40 PM · 10 min with Kelly or right behind her.",
      sit: "Sit when she sits. You are never off her.",
      leadJob: "kelly",
      roster: [{ kind: "event", hint: /kelly support/i }],
      why: "You are the only staff on Kelly. Runner plus vertical photos and video. Photo Lead does not man her.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. Find Kelly. Water in your hand or on her table. Sound check is live — stay off the dance floor."),
        row("16:40", "eat", "EAT 10 minutes with her or right behind her. Then you do not leave her."),
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
      arrive: "4:30 PM",
      eat: "4:40 PM · 10 min. Then roam.",
      sit: "You roam David. Sit the last songs of the concert if you already have the closing shot.",
      leadJob: "photo",
      roster: [{ kind: "event", hint: /photo lead|photographer|photo \/ video/i }],
      why: "Journalistic photography. Action shots of Kelly and the crowd. You are not parked on her. Support staff mans her.",
      clock: [
        row("16:30", "arrive", "Arrive by 4:30. Event t-shirt on. Open My Night. You roam. You are not Kelly's minder. Sound check is live — stay off the dance floor."),
        row("16:40", "eat", "EAT 10 minutes. Then the camera owns you."),
        row("16:50", "work", "Room, merch, buffet set. Journalistic. Energy. Shoot from the edge."),
        row("17:15", "work", "Food doors. Arrivals, lot, lobby, tickets."),
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
      arrive: "4:30 PM · focus 8:30",
      eat: "Eat on your other seat's clock. If this is your only seat, plate at 4:40.",
      sit: "Sit on your other seat. Strike focus starts 8:30.",
      leadJob: "strike",
      roster: [{ kind: "event", hint: /strike|close lead|teardown captain/i }],
      why: "You own the 8:45 pairs and the 10:00 walk. Venue furniture stays. Event Lead can hold this seat too.",
      clock: [
        row("16:30", "arrive", "If this is your only seat: arrive by 4:30. Event t-shirt on. Open My Night. Walk with Event Lead. Then stay out of posts. Sound check is live — stay off the dance floor."),
        row("16:45", "eat", "If this is your only seat: EAT 15 minutes. Then you are a guest until 8:30."),
        row("17:45", "sit", "Sit David if you are not on another post."),
        row("19:00", "sit", "Sit the concert if you are not on another post."),
        row("20:30", "work", "STRIKE FOCUS. Walk every post with Event Lead. Confirm 3 muscle are coming. Tell people: you stay until 10."),
        row("20:45", "strike", "Show over. Call pairs out loud: A cloths (2), B campaign (2), C Ben + 3 servers, D Tracy + anyone who can + 3 muscle, E everyone walks last."),
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

  function prettyName(name) {
    const label = String(name || "").trim();
    if (!label) return "";
    if (global.GGSPeople) {
      const person = global.GGSPeople.findPerson(label);
      if (person && person.name) return person.name;
    }
    return label;
  }

  function ensureRosterRow(roster, spot, rule, extra) {
    if (!roster[rule.kind]) roster[rule.kind] = [];
    let row = roster[rule.kind].find((item) => rule.hint.test(String((item && item.role) || "")));
    if (row) return { row: row, created: false };
    row = {
      role: extra || spot.title,
      name: "",
      phone: "",
      arrival: spot.arrive || "",
      backup: "",
      done: false,
    };
    roster[rule.kind].push(row);
    return { row: row, created: true };
  }

  function syncRoster(store, id, name) {
    const spot = byId(id);
    if (!spot || !store) return;
    const roster = store.readDoc("volunteers") || { setup: [], event: [], strike: [], grounds: [] };
    const label = prettyName(name);
    const phone = phoneFor(label);
    let dirty = false;
    (spot.roster || []).forEach((rule, i) => {
      const got = ensureRosterRow(roster, spot, rule, i ? spot.title + " · " + rule.kind : spot.title);
      if (got.created) dirty = true;
      if (String(got.row.name || "").trim() !== label) {
        got.row.name = label;
        dirty = true;
      }
      if (phone && String(got.row.phone || "").trim() !== phone) {
        got.row.phone = phone;
        dirty = true;
      }
    });
    if (dirty) store.saveDoc("volunteers", roster);
  }

  function alignPeople(store) {
    const current = Object.assign({}, owners(store));
    if (!store) return current;
    const roster = store.readDoc("volunteers") || { setup: [], event: [], strike: [], grounds: [] };
    ["setup", "event", "strike", "grounds"].forEach((kind) => {
      if (!Array.isArray(roster[kind])) roster[kind] = [];
    });
    let spotsDirty = false;
    let rosterDirty = false;
    SPOTS.filter((spot) => !spot.retired).forEach((spot) => {
      let spotName = prettyName(current[spot.id] || "");
      const rules = spot.roster || [];
      if (!spotName) {
        rules.some((rule) => {
          const hit = (roster[rule.kind] || []).find(
            (row) => rule.hint.test(String((row && row.role) || "")) && String((row && row.name) || "").trim()
          );
          if (!hit) return false;
          spotName = prettyName(hit.name);
          return true;
        });
        if (spotName) {
          current[spot.id] = spotName;
          spotsDirty = true;
        }
      }
      rules.forEach((rule, i) => {
        const got = ensureRosterRow(roster, spot, rule, i ? spot.title + " · " + rule.kind : spot.title);
        if (got.created) rosterDirty = true;
        if (spotName && String(got.row.name || "").trim() !== spotName) {
          got.row.name = spotName;
          const phone = phoneFor(spotName);
          if (phone) got.row.phone = phone;
          rosterDirty = true;
        }
      });
    });
    if (spotsDirty) store.saveDoc("spots", { v: 1, owners: current });
    if (rosterDirty) store.saveDoc("volunteers", roster);
    if ((spotsDirty || rosterDirty) && store.flush) store.flush();
    return current;
  }

  function hydrateFromRoster(store) {
    return alignPeople(store);
  }

  function spotIdForRole(kind, role) {
    const hit = SPOTS.find(
      (spot) =>
        !spot.retired &&
        (spot.roster || []).some((rule) => rule.kind === kind && rule.hint.test(String(role || "")))
    );
    return hit ? hit.id : "";
  }

  function matchName(a, b) {
    if (global.GGSCrewSlice) return global.GGSCrewSlice.nameMatch(a, b);
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  }

  function spotForName(name) {
    if (!name) return null;
    const store = global.GGSPrepStore;
    const map = hydrateFromRoster(store);
    const hit = SPOTS.find((spot) => !spot.retired && matchName(map[spot.id], name));
    if (hit) return hit;
    if (global.GGSLeadDuties) {
      const job = global.GGSLeadDuties.jobFor(name);
      if (job) {
        const fromLead = SPOTS.find((spot) => !spot.retired && spot.leadJob === job.id);
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
    alignPeople: alignPeople,
    spotIdForRole: spotIdForRole,
    spotForName: spotForName,
  };
})(window);
