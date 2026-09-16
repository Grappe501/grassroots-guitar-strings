(function () {
  const store = window.GGSPrepStore;
  const GEAR = [
    {
      id: "production",
      title: "Tracy / production",
      inn: [
        "Speakers",
        "Mixer",
        "Microphones + stands",
        "Instrument cables",
        "Speaker stands",
        "Stage lights + stands",
        "Power strips + extension cords",
        "Gaffer / cable tape",
        "Spare batteries",
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
        "Loaded in Tracy's vehicle — helper + 3 muscle carry",
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
      title: "$1 water + ice",
      inn: [
        "Bottled water — 120 bottles ($1 and giveaway)",
        "Ice chests / coolers",
        "Ice — 6 bags (10 lb) for bottled water",
        "Money bag",
        "Ones for change",
        "Count sheet + pen",
        "Water signs printed at HQ — 8.5 x 11 (2+)",
      ],
      out: [
        "Leftover water packed",
        "Personal coolers back to owners",
        "Money bag with Event Captain",
        "Water signs packed",
      ],
    },
    {
      id: "drinks",
      title: "Tea / lemonade",
      inn: [
        "Unsweet tea — 8 gallons",
        "Lemonade — 6 gallons",
        "Splenda, pink, and blue sweetener packets",
        "Glass serving containers / dispensers",
        "Dispensers / spigots",
        "Cups if Ben is not bringing them",
        "Ice for tea / lemonade — 4 bags (10 lb)",
        "Spare ice — 2 bags (10 lb). 12 bags total tonight",
      ],
      out: ["Glass containers collected", "Dispensers packed", "Drink station swept"],
    },
    {
      id: "tickets",
      title: "Tickets / money",
      inn: [
        "Tickets",
        "Cash box / change",
        "Pens",
        "Contribution envelopes",
        "Guest list if used",
        "$25 door signs printed at HQ — 8.5 x 11",
      ],
      out: [
        "Cash reconciled",
        "Envelopes secured",
        "Ticket inventory counted",
        "Cash box with Event Captain",
      ],
    },
    {
      id: "campaign",
      title: "Campaign + merch",
      inn: [
        "Kelly literature + cards",
        "Campaign display",
        "100 yard signs + 100 stakes",
        "Road / entrance signs",
        "Concert T-shirts",
        "Regnet Populis giveaway shirts",
        "Volunteer signs printed at HQ — 8.5 x 11",
        "Website signs printed at HQ — 8.5 x 11",
        "Print the full 8.5 x 11 sign stack at HQ",
        "Donate QR + acrylic holders",
        "Pull-up banners",
        "Push cards",
        "Buttons",
        "Candy",
        "Foldover cards",
      ],
      out: [
        "Literature packed",
        "Unused yard signs + stakes counted",
        "Road / entrance signs pulled",
        "Merch counted and packed",
        "QR stands packed",
      ],
    },
    {
      id: "room",
      title: "Room dress",
      inn: ["8 round tablecloths only", "Buffet tablecloths", "Lobby tablecloth", "Decorations / pull-up banners"],
      out: ["Tablecloths collected", "Decorations packed", "Lobby cleared"],
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
    const me = document.getElementById("meInput");
    if (me && me.value.trim()) names[me.value.trim()] = true;
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
      need: "#meInput",
      getName: function () {
        const a = document.getElementById("meInput");
        const b = document.getElementById("runMe");
        return (a && a.value) || (b && b.value) || "";
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
