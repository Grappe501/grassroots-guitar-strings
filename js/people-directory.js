(function (global) {
  const PEOPLE = [
    {
      name: "Steve Grappe",
      first: "Steve",
      phone: "501-690-3824",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "EVENT CAPTAIN",
      title: "Event Captain",
      next: "Arrive 8:00 AM. You are at doors when they open and when they close. Last check at the end.",
      duties: [
        "8:00 AM arrive. Available for setup help from then on.",
        "There when food doors open at 5:15 and when concert doors open at 6:30.",
        "There when the house closes. You are the last one to check everything.",
        "Available all night for questions, directions, and to fill in where needed.",
      ],
    },
    {
      name: "Carol Egan",
      first: "Carol",
      phone: "847-791-8601",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "You are already in the system.",
      next: "Read Duties. Tomorrow you pick one. Steve starts at Event Lead.",
      duties: [
        "Look at Duties before the meeting.",
        "Event Lead is the heaviest. Then Setup, Tickets, Food, Campaign.",
        "Once you claim a seat, volunteers for that lane sit under you.",
      ],
    },
    {
      name: "Jay Powell",
      first: "Jay",
      phone: "501-690-0839",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Christy Low",
      first: "Christy",
      phone: "870-275-1178",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "John Duke",
      first: "John",
      phone: "501-516-2108",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Mark London",
      first: "Mark",
      phone: "541-591-2198",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
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
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Ben Hurst",
      first: "Ben",
      phone: "501-517-1690",
      gate: "Food is your lane. Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "FOOD",
      title: "You lead the serving line. You do not plate. You are not water.",
      next: "Food Service Lead is your seat. Sarah is Server 1. Name two more servers. Water is sold at merch.",
      duties: [
        "Lead the serving line. Do not plate.",
        "Three volunteers serve with you: Sarah plus two more.",
        "We are taking donations for drinks — water, tea, or lemonade. Ice chest + scoop for tea and lemonade. The drink bag lives at merch — not your station.",
        "Strike C is you plus the three servers. 20 minutes.",
      ],
    },
    {
      name: "Sarah Hurst",
      first: "Sarah",
      phone: "501-265-3446",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "SERVER 1",
      title: "You are on Ben’s serving line.",
      next: "Server 1 is your seat. Ben leads. He does not plate. Water is someone else.",
      duties: [
        "4:30 with Ben. Serve on the line. Do not plate. Do not take water.",
        "Tea and lemonade are free while they last.",
        "Stay on the line through dinner. Watch the concert when the line is closed.",
        "Strike C with Ben and the other two servers.",
      ],
    },
    {
      name: "Chance Bradford",
      first: "Chance",
      phone: "901-496-5949",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Leeann Solice",
      first: "Leeann",
      retired: true,
      phone: "512-789-1552",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "DAY-OF LEAD",
      title: "Pick a lane tomorrow.",
      next: "Duties. Steve starts at the top. Claim the one you want.",
      duties: ["Read Duties.", "Show up ready to own one lane and the people under it."],
    },
    {
      name: "Debbie Martin",
      first: "Debbie",
      aliases: ["Debi Martin", "Debbi Martin"],
      phone: "",
      gate: "You own the merch table. Phone goes in tomorrow. Confirm when we have it, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "MERCH",
      title: "You own the merch table.",
      next: "Campaign & Merch is your seat. One table. 30-minute set. Drink donations live here.",
      duties: [
        "Set merch + campaign on one table — 30 minutes.",
        "Campaign signs, campaign T-shirts, concert T-shirts, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes, postcards, cash envelopes. Plus conversation cards and the 4-ft and 6-ft cloths.",
        "Drink donations live at this table. 120 bottles. Water, tea, or lemonade. Tickets collects the money.",
        "Merch 2 arrives at 6:00 for the rush between David and the 7:00 show. They greet and hand materials.",
        "Hang the two banners. Bungee cords go with them.",
        "Yard signs from the same table. First name + phone on one sheet.",
        "Strike B is 20 minutes. Pack leftover water. Tickets collects merch and drink money. Pack campaign signs, campaign T-shirts, concert T-shirts, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes, postcards, cash / checks, conversation cards, both cloths.",
      ],
    },
    {
      name: "Julia Taylor",
      first: "Julia",
      phone: "",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "YOUR SPOT",
      title: "You are on the list.",
      next: "Your night is one page. Arrive 4:30. Open Tonight when Steve names your spot.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight.",
        "Do the job on your seat clock. Stay until 10 unless Event Captain sends you.",
      ],
    },
    {
      name: "Paul Egan",
      first: "Paul",
      phone: "",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "SETUP LEAD",
      title: "You own the morning room.",
      next: "10:00. You put yard signs along the path from the gate to the door. Then you run the 3 dressers.",
      duties: [
        "10:00 gather the 3 dressers. Concert t-shirt on. Open Tonight. Furniture is already placed. Do not rebuild.",
        "10:05 you put yard signs along the path from the gate to the venue door. Dressers start the 8 tables while you plant.",
        "10:25 walk once. Signs should mark the walk from the lot/gate to the door. Then printed signs and lobby if Setup 1+2 need a hand.",
        "10:40 tea and lemonade station. No ice. Ice waits until 4:30.",
        "11:00 merch done. Yard-sign giveaway sheet on that table. Path signs stay up.",
        "12:30 release the 3 dressers. They are done unless they also claimed a night seat. Production Manager is a different night seat at 5:30. Path signs stay until strike.",
        "You are done unless you also claimed a night seat. If you did, open that seat on My Night at 4:30.",
      ],
    },
    {
      name: "Kate Stebbins",
      first: "Kate",
      phone: "",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "YOUR SPOT",
      title: "You are on the list.",
      next: "Your night is one page. Arrive 4:30. Open Tonight when Steve names your spot.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight.",
        "Do the job on your seat clock. Stay until 10 unless Event Captain sends you.",
      ],
    },
    {
      name: "Brady McPherson",
      first: "Brady",
      phone: "",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "YOUR SPOT",
      title: "You are on the list.",
      next: "Your night is one page. Arrive 4:30. Open Tonight when Steve names your spot.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight.",
        "Do the job on your seat clock. Stay until 10 unless Event Captain sends you.",
      ],
    },
    {
      name: "Kari McPherson",
      first: "Kari",
      phone: "",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "YOUR SPOT",
      title: "You are on the list.",
      next: "Your night is one page. Arrive 4:30. Open Tonight when Steve names your spot.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight.",
        "Do the job on your seat clock. Stay until 10 unless Event Captain sends you.",
      ],
    },
    {
      name: "Robyn Maynard",
      first: "Robyn",
      phone: "",
      gate: "Confirm this is the phone you are on today, then connect to Wi-Fi.",
      go: "Open my night",
      kicker: "YOUR SPOT",
      title: "You are on the list.",
      next: "Your night is one page. Arrive 4:30. Open Tonight when Steve names your spot.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight.",
        "Do the job on your seat clock. Stay until 10 unless Event Captain sends you.",
      ],
    },
  ];

  const JOBS = [
    {
      id: "event",
      rank: 1,
      title: "Event Captain",
      weight: "Doors + last check",
      cartoon: "Mighty Mouse",
      defaultOwner: "Steve Grappe",
      arrival: "8:00 AM",
      owns: "You are at doors when they open and when they close. Last check at the end. Available for questions, directions, and to fill in.",
      duties: [
        "8:00 AM arrive. Concert t-shirt on. Open your Spot page. Available for setup help from then on.",
        "Available for questions and directions from the minute you walk in.",
        "5:15 food doors. You are there when they open. Concert-only stay in cars until 6:30.",
        "6:30 concert doors. You are there when they open.",
        "Fill in where needed. Answer questions. Point people. The Production Managers walk the loop — you are the person they send people to.",
        "When the house closes, you are there. Last one to check everything: room, lobby, lot, restrooms, our stuff gone, furniture stays.",
        "You leave last after that last check.",
      ],
    },
    {
      id: "setup",
      rank: 2,
      title: "Setup Lead",
      weight: "Heavy morning",
      cartoon: "Papa Smurf",
      defaultOwner: "Paul Egan",
      arrival: "10:00 AM",
      owns: "Paul Egan. Path yard signs from the gate. Then the 90-minute room.",
      duties: [
        "10:00 gather the 3 dressers. Concert t-shirts on. Open Tonight. Furniture is already placed. Do not rebuild.",
        "10:05 you put yard signs along the path from the gate to the venue door. Dressers start the 8 tables — cloth + simple center — while you plant.",
        "10:25 Setup 1+2: printed signs 15, lobby ticket cloth 10. Setup 3: 30-minute merch set. 4-ft and 6-ft campaign cloths, two banners + bungees, conversation cards.",
        "10:40 tea and lemonade station. No ice. Ice waits until 4:30.",
        "11:00 merch done. Yard-sign giveaway sheet on that table. Walk the path once. Signs stay up.",
        "12:00 room is dressed. Tracy is on his own system. Band is not your problem this morning.",
        "12:30 release the 3 dressers. They eat lunch off site. They are done unless they also claimed a night seat. Production Manager is a different night seat at 5:30. Path signs stay until strike.",
        "You are done unless you also claimed a night seat. If you did, open that seat on My Night at 4:30.",
      ],
    },
    {
      id: "tickets",
      rank: 3,
      title: "Tickets & Money Lead",
      weight: "Treasurer",
      cartoon: "Velma",
      arrival: "4:30 PM",
      owns: "You are the treasurer. Ticket money, merch money, and drink donations stay with you.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight. Venue already placed the 4-ft lobby table. No paper tickets.",
        "4:35 dress it: cash box, envelopes, pens, $25 sign, teacher/first-responder note. 10 minutes.",
        "4:40 eat 15 minutes behind the table.",
        "4:30 stay off the dance floor. Sound check.",
        "5:15 food doors. Table is live. Kids $5 with an adult. Money stays with you.",
        "You collect merch and drink donations. That money stays with you too.",
        "Stay on the table. Money stays with you.",
        "6:30 concert doors. 15-minute rush. Overflow to the wall, not the door.",
        "8:45 reconcile tickets, merch, and drink donations. Money stays with you. Then help Campaign bins or the final walk.",
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
        "4:30 arrive. Concert t-shirt on. Open Tonight. Walk the buffet. Three servers should be with you. Drink donations live at merch. Not your station.",
        "4:35 ice chest + scoop for tea and lemonade. Set the line. Signs: we are taking donations for drinks. You do not plate.",
        "4:45 eat 15 minutes. Then the line owns you.",
        "4:00 brief Sarah and the two other servers. One line. You direct. They serve. You still do not plate.",
        "4:30 stay off the dance floor. Sound check. Ice should already be in.",
        "5:15 BBQ open. Keep the line moving. Refill pans. Do not plate guest plates. Drinks are donations — water, tea, or lemonade.",
        "Stay on the line through dinner. A Production Manager can cover a restroom if they judge it is needed.",
        "6:20 line slows. Drink donation signs stay up. Water, tea, or lemonade.",
        "6:30 line closes. Thank the three servers. Merch keeps taking drink donations. You are off the line.",
        "Watch the concert when the line is closed.",
        "8:45 Strike C. You plus the three servers. Coolers, leftover, trash. 20 minutes. Then you may leave.",
      ],
    },
    {
      id: "campaign",
      rank: 5,
      title: "Campaign & Merch Lead",
      weight: "Medium",
      cartoon: "Wonder Woman",
      defaultOwner: "Debbie Martin",
      arrival: "10:00 AM if you dress · 4:30 PM for night",
      owns: "Debbie Martin. One table. Signs, shirts, and drink donations.",
      duties: [
        "If you dress tables: 10:00 with Setup. 10:25 you own merch — 30 minutes. Campaign signs, campaign T-shirts, concert T-shirts, push cards, foldover business cards, pull-up banner, hanging banners, pens, pins, sign stakes, postcards, cash envelopes. 4-ft and 6-ft cloths. Conversation cards.",
        "11:00 yard-sign sheet on the same table. First name + phone. Morning done 12:30. Lunch off site. Back 4:30.",
        "If you only work night: 4:30 t-shirt on. Open Tonight. Table live. Drinks live here. 120 bottles on ice. Donations for water, tea, or lemonade. Tickets collects the money.",
        "4:40 eat 15 minutes. Sign: back in 10. Bottles stay on ice.",
        "4:30 stay off the dance floor. Sound check.",
        "Drink donations live at this table. Script: we are taking donations for drinks — water, tea, or lemonade. Tickets collects the money. Do not leave shirts in a pile guests have to dig.",
        "Stay on the table unless a Production Manager relieves you. If you step away, put up a back-soon sign.",
        "6:15 table back up. Merch 2 is your extra hands for the rush. Water back up. 6:30 concert-door browse window. Stay.",
        "Stay on the table unless a Production Manager relieves you. If a line forms, you are back.",
        "8:00 table through encore. Water through the last song. Box loose shirts so strike is 20 minutes.",
        "8:45 Strike B. Leftover water packed. Tickets collects merch and drink money. Campaign signs, both shirt stacks, push cards, foldovers, pull-up, hanging banners, pens, pins, stakes, postcards, cash / checks, cloths, conversation cards. Count. Bins to the campaign vehicle.",
      ],
    },
    {
      id: "production",
      rank: 6,
      retired: true,
      title: "Production Lead",
      weight: "All day with Tracy",
      cartoon: "Scooby",
      arrival: "9:00 AM production load in",
      owns: "Retired. No named helper. Everyone pitches in. At encore, 3 muscle carry lights and sound out.",
      duties: [
        "No named helper. Tracy has a complete system. If you are free, ask him if he needs a hand. Ask someone else to come too.",
        "3 muscle still report at 8:45. Anyone else free goes to Tracy. Ask the person next to you.",
      ],
    },
    {
      id: "relief",
      rank: 4,
      title: "Production Manager 1",
      weight: "Keep the night on plan",
      cartoon: "Road Runner",
      arrival: "5:30 PM if you can",
      owns: "Fill gaps. Point people. Make sure nobody needs a break. Your page is the run of show.",
      duties: [
        "Arrive by 5:30 if you can. Concert t-shirt on. Open your Spot page. That page is the whole run of show.",
        "Your job is the plan. Fill gaps. Point people where to go. Ask if anyone needs a break before they leave a post.",
        "Stay offset from Production Manager 2. One of you is always walking.",
        "During the acoustic set, cover a gap if one opens. Tickets first if they need a break. Your call.",
        "Concert doors: stand with tickets 15 minutes. No pile-up.",
        "8:30 tell every post: you stay until 10. Building clear 10:00.",
      ],
    },
    {
      id: "relief2",
      rank: 5,
      title: "Production Manager 2",
      weight: "Keep the night on plan",
      cartoon: "Speedy Gonzales",
      arrival: "5:30 PM if you can",
      owns: "Fill gaps. Point people. Make sure nobody needs a break. Offset Production Manager 1.",
      duties: [
        "Arrive by 5:30 if you can. Concert t-shirt on. Open your Spot page. That page is the whole run of show.",
        "Your job is the plan. Fill gaps. Point people where to go. Ask if anyone needs a break before they leave a post.",
        "Stay offset from Production Manager 1. Start on FOOD so you are not stacked on the same post.",
        "During David, cover the food line for restroom only. Do not leave the buffet empty.",
        "After acoustic, help clear the floor. Then keep the loop moving.",
        "After 7:20, cover the drink station if it needs a break. Your call.",
      ],
    },
    {
      id: "kelly",
      rank: 9,
      title: "Kelly Support Lead",
      weight: "On the candidate",
      cartoon: "Robin",
      arrival: "4:30 PM",
      owns: "The only staff on Kelly. Runner plus vertical photos and video.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight. Find Kelly. You are the only staff on her.",
        "4:40 eat 10 minutes with her or right behind her. Sound check is live — stay off the dance floor.",
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
      arrival: "4:30 PM",
      owns: "Journalistic photography. Action shots of Kelly and the crowd. Not parked on her.",
      duties: [
        "4:30 arrive. Concert t-shirt on. Open Tonight. You roam. You are not Kelly's minder.",
        "4:40 eat 10 minutes. Then room and setup shots. Sound check is live — stay off the dance floor.",
        "5:00–5:30 arrivals, lot, lobby, tickets, first plates. Journalistic. Energy.",
        "5:30 BBQ line, hands, faces, volunteers working. Kelly in the room — not parked on her.",
        "5:45 David from the side. Crowd listening. Do not walk the dance floor.",
        "6:15 floor clear. 6:30 concert-door faces. 7:00 first three songs of the concert.",
        "7:20 roam: dance floor edge, merch, a quiet table, a laugh. Post as you go. Tag @KellyGrappeSOS, invite her to collaborate, hashtag #GrappeSOS.",
        "8:30 one closing group shot if Event Lead wants it. Then you are free to watch the last songs.",
        "8:45 help the walk or go. Cards and cameras in your bag, not on a table.",
        "If this seat is empty, Production Manager 2 grabs roam shots between loops. Still not Kelly Support.",
      ],
    },
    {
      id: "strike",
      rank: 11,
      title: "Strike / Close Lead",
      weight: "75 minutes, hard stop",
      cartoon: "Wreck-It Ralph",
      arrival: "4:30 PM · focus 8:30",
      owns: "8:45 pairs and the 10:00 walk. Venue furniture stays.",
      duties: [
        "4:30 arrive if this is your only seat. Stay all night on your other seat if you have one. Open Tonight. Strike focus starts 8:30.",
        "8:30 walk every post with Event Lead. Confirm 3 muscle are coming. Tell people: you stay until 10.",
        "8:45 show over. Call pairs out loud: A cloths (2), B campaign (2), C Ben + 3 servers, D Tracy + anyone who can + 3 muscle, E everyone walks last.",
        "Venue furniture stays. Leave the 8 rounds, buffet tables, lobby table, and 64 chairs.",
        "9:00 A should be folding cloths. B packing merch. C food. D loading Tracy's vehicle.",
        "9:15 walk A through D. No second speech. Just finish.",
        "9:30 restrooms, lot, main room. Our bins in vehicles. Nothing in a hallway.",
        "9:45 final walk with Event Lead. 10:00 building clear. Event Lead leaves last. You may leave when they say so.",
        "Event Lead can hold this seat too. Split only if two people want it.",
      ],
    },
    {
      id: "setup1",
      rank: 12,
      title: "Setup 1",
      weight: "Morning dresser",
      cartoon: "Smurfette",
      arrival: "10:00 AM",
      owns: "Morning only. Dress tables and printed signs. Done at 12:30 unless you also claimed a night seat.",
      duties: [
        "10:00 arrive. Concert t-shirt on. Open Tonight. Furniture is already placed. Do not rebuild.",
        "10:05 walk the room, exits, and lobby. Then dress the 8 guest tables with Setup 2 and Setup 3.",
        "10:25 tables done. You and Setup 2: printed signs 15 minutes, lobby ticket cloth 10.",
        "10:40 help set the tea and lemonade station. No ice. Ice waits until 4:30.",
        "12:30 morning work is done. Leave. Eat lunch off site. Back at 4:30 only if you also claimed a night seat.",
      ],
    },
    {
      id: "setup2",
      rank: 13,
      title: "Setup 2",
      weight: "Morning dresser",
      cartoon: "Brainy Smurf",
      arrival: "10:00 AM",
      owns: "Morning only. Dress tables and printed signs. Done at 12:30 unless you also claimed a night seat.",
      duties: [
        "10:00 arrive. Concert t-shirt on. Open Tonight. Furniture is already placed. Do not rebuild.",
        "10:05 walk the room, exits, and lobby. Then dress the 8 guest tables with Setup 1 and Setup 3.",
        "10:25 tables done. You and Setup 1: printed signs 15 minutes, lobby ticket cloth 10.",
        "10:40 help set the tea and lemonade station. No ice. Ice waits until 4:30.",
        "12:30 morning work is done. Leave. Eat lunch off site. Back at 4:30 only if you also claimed a night seat.",
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
    return (
      PEOPLE.find(
        (p) =>
          match(p.name, n) ||
          (p.aliases || []).some((alias) => match(alias, n) || norm(alias) === norm(n))
      ) || null
    );
  }

  function canonName(name) {
    const label = String(name || "").trim();
    if (!label) return "";
    if (/^venue$/i.test(label)) return "Venue";
    const person = findPerson(label);
    if (person) return person.name;
    return label.replace(/\bDebbi\b/gi, "Debbie").replace(/\bDebi\b/gi, "Debbie");
  }

  function attending() {
    return PEOPLE.filter((p) => !p.retired);
  }

  function suggestions(q) {
    const pool = attending();
    const s = norm(q);
    if (!s) return pool.slice();
    return pool.filter((p) => norm(p.name).indexOf(s) === 0 || norm(p.first).indexOf(s) === 0 || norm(p.name).indexOf(s) >= 0);
  }

  function uniquePerson(q) {
    const s = norm(q);
    if (s.length < 2) return null;
    const hits = suggestions(q);
    if (hits.length === 1) return hits[0];
    const exact = attending().filter((p) => norm(p.first) === s || norm(p.name) === s);
    return exact.length === 1 ? exact[0] : null;
  }

  function names() {
    return attending().map((p) => p.name);
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
    const sel = canonName(selected);
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

  function rewriteRowName(row) {
    if (!row || typeof row !== "object") return false;
    const next = canonName(row.name);
    if (next === String(row.name || "").trim()) return false;
    row.name = next;
    return true;
  }

  function migrateStoredNames() {
    const store = global.GGSPrepStore;
    if (!store || !store.readDoc) return;
    let dirty = false;
    const spots = store.readDoc("spots");
    if (spots && spots.owners && typeof spots.owners === "object") {
      Object.keys(spots.owners).forEach((id) => {
        const next = canonName(spots.owners[id]);
        if (next !== String(spots.owners[id] || "").trim()) {
          spots.owners[id] = next;
          dirty = true;
        }
      });
      if (dirty) store.saveDoc("spots", spots);
    }
    const roster = store.readDoc("volunteers");
    if (roster) {
      let rosterDirty = false;
      ["setup", "event", "strike", "grounds"].forEach((kind) => {
        (roster[kind] || []).forEach((row) => {
          if (rewriteRowName(row)) rosterDirty = true;
        });
      });
      if (rosterDirty) {
        store.saveDoc("volunteers", roster);
        dirty = true;
      }
    }
    const leads = store.readDoc("lead-jobs");
    if (leads && Array.isArray(leads.jobs)) {
      let leadDirty = false;
      leads.jobs.forEach((row) => {
        if (!row) return;
        const next = canonName(row.owner);
        if (next !== String(row.owner || "").trim()) {
          row.owner = next;
          leadDirty = true;
        }
      });
      if (leadDirty) {
        store.saveDoc("lead-jobs", leads);
        dirty = true;
      }
    }
    const contacts = store.readDoc("contacts");
    const book = contacts && contacts.people && typeof contacts.people === "object" ? contacts.people : contacts;
    if (book && typeof book === "object") {
      const nextBook = {};
      let contactDirty = false;
      Object.keys(book).forEach((key) => {
        if (key === "people") return;
        const canon = canonName(key) || key;
        if (canon !== key) contactDirty = true;
        nextBook[canon] = book[key];
      });
      if (contactDirty) {
        store.saveDoc("contacts", { people: nextBook });
        dirty = true;
      }
    }
    try {
      const prefs = JSON.parse(localStorage.getItem("ggs-prep-v3-prefs") || "{}");
      const me = canonName(prefs.me);
      if (me && me !== String(prefs.me || "").trim()) {
        localStorage.setItem("ggs-prep-v3-prefs", JSON.stringify(Object.assign({}, prefs, { me: me })));
      }
    } catch (err) {}
    if (dirty && store.flush) store.flush();
  }

  function seedContacts() {
    migrateStoredNames();
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

  global.GGSPeople = { PEOPLE, JOBS, findPerson, uniquePerson, suggestions, names, match, prettyPhone, seedContacts, leadSelectHtml, canonName, migrateStoredNames };
  function bootSeed() {
    seedContacts();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootSeed);
  else bootSeed();
  global.addEventListener("ggs-prep-loaded", seedContacts);
})(window);
