(function () {
  const store = window.GGSPrepStore;
  const GEAR = [
    {
      id: "production",
      title: "Tracy / production",
      inn: [
        "Speakers — Tracy brings them",
        "Mixer — Tracy brings it",
        "Microphones + stands — Tracy brings them",
        "Instrument cables — Tracy brings them",
        "Speaker stands — Tracy brings them",
        "Stage lights + stands — Tracy brings them",
        "Power strips + extension cords — Tracy brings them",
        "Gaffer / cable tape — Tracy brings it",
        "Spare batteries — Tracy brings them",
        "Bar stool — someone must bring it (venue does not have one)",
        "David water",
      ],
      out: [
        "Sound shut down",
        "Lights shut down",
        "Cables coiled",
        "Mics / stands packed",
        "Speakers packed",
        "Mixer packed",
        "Lights packed",
        "Loaded in Tracy's vehicle — anyone free + 3 muscle carry",
        "Bar stool goes home with the person who brought it",
        "Stage floor clear",
      ],
    },
    {
      id: "food",
      title: "Food / BBQ",
      inn: [
        "Ben food for 100",
        "Serving pans + utensils",
        "Plates / forks / knives / napkins (125)",
        "Buffet tablecloths",
        "Food covers",
        "Trash cans + bags at buffet",
      ],
      out: [
        "Leftovers handled",
        "Buffet tables cleared",
        "Tablecloths collected",
        "Serving gear packed or returned",
        "Food trash out",
      ],
    },
    {
      id: "water",
      title: "Drinks + ice — donations at merch",
      inn: [
        "Bottled water — 120 bottles. Donations at the merch table. Water, tea, or lemonade.",
        "Ice chests / coolers",
        "Ice — 6 bags (10 lb) for bottled water",
        "Money bag",
        "Ones for change",
        "Count sheet + pen",
        "Drink donation signs printed at HQ — 8.5 x 11 (2+)",
      ],
      out: [
        "Leftover water packed",
        "Personal coolers back to owners",
        "Money bag with Event Captain",
        "Drink donation signs packed",
      ],
    },
    {
      id: "drinks",
      title: "Tea / lemonade — donations",
      inn: [
        "Unsweet tea — 8 gallons",
        "Lemonade — 6 gallons",
        "Splenda, pink, and blue sweetener packets",
        "Glass serving containers / dispensers",
        "Dispensers / spigots",
        "Cups if Ben is not bringing them",
        "Ice chest for scooping ice into tea and lemonade — not the bottle coolers",
        "Ice scoop — stays in that tea/lemonade chest",
        "Ice for tea / lemonade — 4 bags (10 lb)",
        "Spare ice — 2 bags (10 lb). 12 bags total tonight",
      ],
      out: ["Glass containers collected", "Dispensers packed", "Drink station swept"],
    },
    {
      id: "tickets",
      title: "Tickets / money",
      inn: [
        "No paper tickets — door is check-in and $25 cash only",
        "Cash box / change",
        "Pens",
        "Cash envelopes",
        "Guest list if used",
        "$25 door signs printed at HQ — 8.5 x 11",
      ],
      out: [
        "Cash / checks",
        "Envelopes secured",
        "Door money counted — no ticket stubs",
        "Cash box with Event Captain",
      ],
    },
    {
      id: "campaign",
      title: "Campaign + merch",
      inn: [
        "Kelly literature + cards",
        "Pull-up banner",
        "Campaign signs",
        "Road / entrance signs — Setup Lead (Paul) plants them on the path from the gate",
        "Concert T-shirts",
        "Campaign T-shirts",
        "Volunteer signs printed at HQ — 8.5 x 11",
        "Website signs printed at HQ — 8.5 x 11",
        "Print the full 8.5 x 11 sign stack at HQ",
        "Donate QR + acrylic holders",
        "Hanging banners",
        "Bungee cords — they go with the hanging banners",
        "Push cards",
        "Pins",
        "Candy",
        "Foldover business cards",
        "Table conversation cards — bring them",
        "Campaign tablecloth — 4 ft",
        "Campaign tablecloth — 6 ft",
        "Sign stakes",
        "Pens",
        "Postcards",
        "Cash envelopes",
        "Bottled water — 120 bottles. Drink donations at this table.",
      ],
      out: [
        "Literature packed",
        "Campaign signs packed",
        "Road / entrance signs pulled",
        "Concert T-shirts packed",
        "Campaign T-shirts packed",
        "Hanging banners packed",
        "Table conversation cards returned",
        "4-ft campaign tablecloth packed",
        "6-ft campaign tablecloth packed",
        "Pull-up banner packed",
        "Push cards packed",
        "Foldover business cards packed",
        "Pins packed",
        "Sign stakes packed",
        "Pens packed",
        "Bungee cords packed",
        "Postcards packed",
        "Cash / checks",
        "Leftover water packed",
        "Water cash / bag with Event Lead",
      ],
    },
    {
      id: "room",
      title: "Room dress",
      inn: ["8 round tablecloths only", "Buffet tablecloths", "Lobby tablecloth", "Decorations. Two banners + bungee cords — Campaign hangs them."],
      out: ["Tablecloths collected", "Decorations packed", "Two banners + bungee cords down", "Lobby cleared"],
    },
    {
      id: "tote",
      title: "Event tote",
      inn: [
        "Pens + Sharpies",
        "Gaffer tape + duct tape",
        "Zip ties + scissors",
        "Trash bags",
        "Hand sanitizer + wipes",
        "First-aid kit",
        "Phone chargers / battery packs",
      ],
      out: ["Tote packed and in a known vehicle"],
    },
  ];

  function esc(x) {
    return String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function gearKey(side, id, i) {
    return "gear:" + side + ":" + id + ":" + i;
  }

  function row(key) {
    const state = store ? store.readCache() : {};
    return state[key] || {};
  }

  function renderGear() {
    const root = document.getElementById("gearBoard");
    if (!root) return;
    const state = store ? store.readCache() : {};
    let inDone = 0;
    let inAll = 0;
    let outDone = 0;
    let outAll = 0;
    root.innerHTML = GEAR.map((sec) => {
      function col(side, items) {
        return (
          '<ul class="gear-list">' +
          items
            .map((label, i) => {
              const k = gearKey(side, sec.id, i);
              const x = state[k] || {};
              if (side === "in") {
                inAll += 1;
                if (x.done) inDone += 1;
              } else {
                outAll += 1;
                if (x.done) outDone += 1;
              }
              return (
                '<li class="gear-item' +
                (x.done ? " is-done" : "") +
                '"><label><input type="checkbox" data-gear="' +
                esc(k) +
                '"' +
                (x.done ? " checked" : "") +
                "><span>" +
                esc(label) +
                "</span></label></li>"
              );
            })
            .join("") +
          "</ul>"
        );
      }
      return (
        '<article class="gear-card"><h3>' +
        esc(sec.title) +
        '</h3><div class="gear-cols"><div><p class="eyebrow">Load in</p>' +
        col("in", sec.inn) +
        '</div><div><p class="eyebrow">Load out</p>' +
        col("out", sec.out) +
        "</div></div></article>"
      );
    }).join("");
    const inn = document.getElementById("gearInCount");
    const out = document.getElementById("gearOutCount");
    if (inn) inn.textContent = inDone + " / " + inAll;
    if (out) out.textContent = outDone + " / " + outAll;
    const barIn = document.getElementById("gearInBar");
    const barOut = document.getElementById("gearOutBar");
    if (barIn) barIn.style.width = inAll ? Math.round((inDone / inAll) * 100) + "%" : "0%";
    if (barOut) barOut.style.width = outAll ? Math.round((outDone / outAll) * 100) + "%" : "0%";
    root.querySelectorAll("[data-gear]").forEach((box) => {
      box.addEventListener("change", () => {
        const k = box.dataset.gear;
        const next = Object.assign({}, row(k), { done: box.checked });
        if (store) store.saveOne(k, next);
        box.closest(".gear-item").classList.toggle("is-done", box.checked);
        renderGear();
      });
    });
  }

  function knownNames() {
    const names = {};
    document.querySelectorAll(".owner").forEach((el) => {
      const n = el.value.trim();
      if (n) names[n] = true;
    });
    const roster = store ? store.readDoc("volunteers") : null;
    ["setup", "event", "strike"].forEach((kind) => {
      ((roster && roster[kind]) || []).forEach((row) => {
        const n = String((row && row.name) || "").trim();
        if (n) names[n] = true;
      });
    });
    let me = "";
    if (window.GGSSignIn) me = window.GGSSignIn.identity().name || "";
    if (me) names[me] = true;
    if (window.GGSPeople && window.GGSPeople.names) {
      window.GGSPeople.names().forEach((n) => {
        if (n) names[n] = true;
      });
    }
    return Object.keys(names).sort((a, b) => a.localeCompare(b));
  }

  function fillOwnerList() {
    const list = document.getElementById("ownerNames");
    if (!list) return;
    list.innerHTML = knownNames()
      .map((n) => '<option value="' + esc(n) + '"></option>')
      .join("");
  }

  function hardenOwners() {
    document.querySelectorAll(".owner").forEach((el) => {
      el.setAttribute("list", "ownerNames");
      el.setAttribute("autocomplete", "off");
    });
    fillOwnerList();
  }

  if (window.GGSRadioFeed) {
    window.GGSRadioFeed.mount({
      feed: "#radioFeed",
      input: "#radioInput",
      send: "#radioSend",
      getName: function () {
        if (window.GGSSignIn) return window.GGSSignIn.identity().name || "";
        try {
          return JSON.parse(localStorage.getItem("ggs-prep-v3-prefs") || "{}").me || "";
        } catch (err) {
          return "";
        }
      },
    });
  }

  window.addEventListener("ggs-prep-rendered", () => {
    hardenOwners();
    renderGear();
  });
  window.addEventListener("ggs-prep-loaded", () => {
    hardenOwners();
    renderGear();
  });
  document.getElementById("meInput") &&
    document.getElementById("meInput").addEventListener("change", fillOwnerList);

  renderGear();
  hardenOwners();
  window.GGSPrepV4 = { renderGear, fillOwnerList };
})();
