const KEY = "ggs-volunteers-2026-09-17-v1";
const NEED_STAY = 10;
const NEED_EVENT = 11;
const defaults = {
  setup: [
    "Setup 1 → Floater A after 4:30",
    "Setup 2 → Floater B after 4:30",
    "Setup 3 → Campaign + merch (30 min set)",
  ],
  event: [
    "Event Captain — clock + venue + strike lead",
    "Tickets — one person; floater covers breaks",
    "Food service lead — Ben. Line, not plates, not water.",
    "Server 1 — Sarah. Serving line with Ben.",
    "Server 2 — serving line with Ben.",
    "Server 3 — serving line with Ben.",
    "Water — $1 bottles only. Tea and lemonade are free while they last.",
    "Campaign + merch — one table, 30 min set",
    "Tracy production helper — with Tracy 8:00–10:00 AM through Strike D",
    "Floater A — relief loop all night",
    "Floater B — relief loop + roam shots if no Photo Lead",
  ],
  strike: [
    "Sound/lights muscle 1 — 8:45. Carry speakers and stands. Tracy directs.",
    "Sound/lights muscle 2 — 8:45. Carry lights and cases. Tracy directs.",
    "Sound/lights muscle 3 — 8:45. Carry remaining production to Tracy's vehicle.",
  ],
  grounds: [
    "Parking — 5:00–7:00. Dinner guests go in. Concert-only stay in cars until 6:30.",
    "Directions — 5:00–7:00. Lot to door. Everything is inside. Concert-only stay in cars until 6:30.",
    "Crowd / lobby — 5:00–7:00. Dinner doors at 5:00. Concert-only at 6:30. Keep the line moving. Point to tickets.",
  ],
};
const teams = [
  "A · Tables / Chairs",
  "B · Campaign / Signs / Merch",
  "C · Food / Drinks / Coolers",
  "D · Tracy + helper + 3 muscle",
  "E · Venue / Final Sweep",
];
const store = window.GGSPrepStore;
const slice = window.GGSCrewSlice;

function arrivalFor(role, kind) {
  if (kind === "setup") return "8:00 AM";
  if (kind === "strike") return "After show";
  if (/muscle/i.test(role)) return "8:45 PM";
  if (/parking|directions|crowd/i.test(role)) return "5:00 PM";
  if (/tracy/i.test(role)) return "8:00–10:00 AM";
  if (/floater/i.test(role)) return "4:30 PM";
  return "5:00 PM";
}

function emptyRow(role, kind) {
  return { role, name: "", phone: "", arrival: arrivalFor(role, kind), backup: "", done: false };
}

function ensureFloaters() {
  if (!state.event) state.event = [];
  [
    "Floater A — relief loop all night",
    "Floater B — relief loop + roam shots if no Photo Lead",
  ].forEach((role) => {
    const hint = /floater a/i.test(role) ? /floater a/i : /floater b/i;
    if (!state.event.some((row) => hint.test(String(row.role || "")))) {
      state.event.push(emptyRow(role, "event"));
    }
  });
}

function ensureGrounds() {
  if (!state.grounds) state.grounds = [];
  defaults.grounds.forEach((role) => {
    const key = role.split(" — ")[0];
    const hint = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (!state.grounds.some((row) => hint.test(String(row.role || "")))) {
      state.grounds.push(emptyRow(role, "event"));
    }
  });
}

function ensureFoodLine() {
  if (!state.event) state.event = [];
  (state.event || []).forEach((row) => {
    if (/food \+ \$1 water|one person \(Ben/i.test(String(row.role || ""))) {
      row.role = "Food service lead — Ben. Line, not plates, not water.";
      if (!String(row.name || "").trim()) row.name = "Ben Hurst";
    }
  });
  [
    "Food service lead — Ben. Line, not plates, not water.",
    "Server 1 — Sarah. Serving line with Ben.",
    "Server 2 — serving line with Ben.",
    "Server 3 — serving line with Ben.",
    "Water — $1 bottles only. Tea and lemonade are free while they last.",
  ].forEach((role) => {
    const key = role.split(" — ")[0];
    const hint = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (!state.event.some((row) => hint.test(String(row.role || "")))) {
      const row = emptyRow(role, "event");
      if (/food service lead/i.test(role)) row.name = "Ben Hurst";
      if (/server 1/i.test(role)) row.name = "Sarah Hurst";
      state.event.push(row);
    }
  });
}

function ensureMuscle() {
  if (!state.strike) state.strike = [];
  [
    "Sound/lights muscle 1 — 8:45. Carry speakers and stands. Tracy directs.",
    "Sound/lights muscle 2 — 8:45. Carry lights and cases. Tracy directs.",
    "Sound/lights muscle 3 — 8:45. Carry remaining production to Tracy's vehicle.",
  ].forEach((role, i) => {
    const hint = new RegExp("muscle " + (i + 1), "i");
    if (!state.strike.some((row) => hint.test(String(row.role || "")))) {
      state.strike.push(emptyRow(role, "strike"));
    }
  });
}

let state =
  (store && store.readDoc("volunteers")) ||
  JSON.parse(localStorage.getItem(KEY) || "null") || {
    setup: defaults.setup.map((role) => emptyRow(role, "setup")),
    event: defaults.event.map((role) => emptyRow(role, "event")),
    strike: [],
    grounds: defaults.grounds.map((role) => emptyRow(role, "event")),
  };
ensureFloaters();
ensureMuscle();
ensureGrounds();
ensureFoodLine();
(function seedNamedSeats() {
  const debi = (state.event || []).find((item) => /campaign|merch/i.test(String(item.role || "")));
  if (debi && !String(debi.name || "").trim()) debi.name = "Debi Martin";
  const ben = (state.event || []).find((item) => /food service lead/i.test(String(item.role || "")));
  if (ben && !String(ben.name || "").trim()) ben.name = "Ben Hurst";
  const sarah = (state.event || []).find((item) => /server 1/i.test(String(item.role || "")));
  if (sarah && !String(sarah.name || "").trim()) sarah.name = "Sarah Hurst";
})();
const esc = (x) =>
  String(x ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function reachHtml(name, phone) {
  if (slice) return slice.contactHtml(name, phone);
  return name
    ? '<a class="person-page" href="/v5/?who=' + encodeURIComponent(name) + '">Phone page</a>'
    : "";
}

function render(kind) {
  const el = document.getElementById(kind + "List");
  const rows = state[kind];
  el.innerHTML = rows.length
    ? rows
        .map((p, i) => {
          const name = String(p.name || "").trim();
          const phone = String(p.phone || "").trim();
          return (
            '<div class="person" data-kind="' +
            kind +
            '" data-i="' +
            i +
            '"><div class="person-name">' +
            (window.GGSPeople
              ? window.GGSPeople.leadSelectHtml(p.name, { className: "name", blank: "Pick a lead" })
              : '<input class="name" value="' + esc(p.name) + '" placeholder="Person name">') +
            '<span class="person-reach">' +
            (name ? reachHtml(name, phone) : "") +
            '</span></div><input class="phone" type="tel" inputmode="tel" value="' +
            esc(p.phone) +
            '" placeholder="Phone"><input class="role" value="' +
            esc(p.role) +
            '" placeholder="Assignment"><input class="arrival" value="' +
            esc(p.arrival) +
            '" placeholder="Arrival"><select class="backup"><option value="">Backup: none</option>' +
            state[kind]
              .map(
                (q, j) =>
                  '<option value="' +
                  j +
                  '" ' +
                  (String(p.backup) === String(j) ? "selected" : "") +
                  ">Backup: " +
                  esc(q.name || q.role || "unassigned") +
                  "</option>",
              )
              .join("") +
            '</select><button class="remove" title="Remove">×</button></div>'
          );
        })
        .join("")
    : '<div class="empty">No people assigned yet. Add someone above.</div>';
  el.querySelectorAll(".person").forEach((row) => {
    ["name", "phone", "role", "arrival", "backup"].forEach((c) => {
      const field = row.querySelector("." + c);
      if (!field) return;
      const evts = field.tagName === "SELECT" ? ["change"] : ["input", "change"];
      evts.forEach((evt) =>
        field.addEventListener(evt, () => {
          state[kind][+row.dataset.i][c] = field.value;
          save();
          if (c === "name" || c === "phone") {
            const name = row.querySelector(".name").value.trim();
            const phone = row.querySelector(".phone").value.trim();
            const box = row.querySelector(".person-reach");
            if (box) box.innerHTML = name ? reachHtml(name, phone) : "";
            if (store && slice && name && slice.phoneDigits(phone)) slice.saveContact(store, name, phone);
          }
        })
      );
    });
    row.querySelector(".remove").addEventListener("click", () => {
      state[kind].splice(+row.dataset.i, 1);
      save();
      render(kind);
    });
  });
}

function add(kind) {
  state[kind].push({
    role: kind === "strike" ? teams[state[kind].length % teams.length] : "New assignment",
    name: "",
    phone: "",
    arrival: arrivalFor(kind === "strike" ? "strike" : "New assignment", kind),
    backup: "",
    done: false,
  });
  save();
  render(kind);
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  if (store) store.saveDoc("volunteers", state);
  counts();
}

function applyRemote(data) {
  if (!data || !data.setup || !data.event) return;
  const active = document.activeElement;
  if (active && active.closest && active.closest(".person")) return;
  state = data;
  if (!state.event.some((row) => /tracy/i.test(String(row.role || "")))) {
    state.event.push({
      role: "Tracy production helper — stays through Strike D",
      name: "",
      phone: "",
      arrival: "8:00 AM",
      backup: "",
      done: false,
    });
  }
  if (!state.grounds) state.grounds = [];
  ensureFloaters();
  ensureMuscle();
  ensureGrounds();
  ensureFoodLine();
  ["setup", "event", "strike", "grounds"].forEach(render);
  counts();
}

function stayNames() {
  const seen = [];
  ["setup", "event", "strike"].forEach((kind) => {
    (state[kind] || []).forEach((row) => {
      const name = String((row && row.name) || "").trim();
      if (!name) return;
      if (/muscle|food service lead/i.test(String((row && row.role) || ""))) return;
      const dup = seen.some((item) =>
        slice ? slice.nameMatch(item, name) : item.toLowerCase() === name.toLowerCase()
      );
      if (!dup) seen.push(name);
    });
  });
  return seen;
}

function counts() {
  document.getElementById("setupCount").textContent = state.setup.filter((x) => x.name.trim()).length + " / 3";
  document.getElementById("eventCount").textContent = state.event.filter((x) => x.name.trim()).length + " / " + NEED_EVENT;
  const groundsEl = document.getElementById("groundsCount");
  if (groundsEl) {
    groundsEl.textContent = (state.grounds || []).filter((x) => String(x.name || "").trim()).length + " / 3";
  }
  const n = stayNames().length;
  document.getElementById("strikeCount").textContent = n + " / " + NEED_STAY;
  document.getElementById("strikeAlert").textContent =
    n >= NEED_STAY
      ? "16 volunteers: 10 night + 3 arrival + 3 Tracy muscle. Ben leads the serving line — he does not plate and he is not water. Sarah is Server 1. Name 2 more servers and the water person."
      : "Night volunteers are " +
        (NEED_STAY - n) +
        " short of 10 (3 servers + water + the old 6 posts). Ben leads the line and is not counted here. Also name 3 arrival people and 3 Tracy muscle.";
  if (window.GGSNextAction && window.GGSNextAction.paintTexts) {
    window.GGSNextAction.paintTexts(store ? store.readCache() : {}, state);
  }
}

if (!state.event.some((row) => /tracy/i.test(String(row.role || "")))) {
  state.event.push({
    role: "Tracy production helper — stays through Strike D",
    name: "",
    phone: "",
    arrival: "8:00 AM",
    backup: "",
    done: false,
  });
}
["setup", "event", "strike", "grounds"].forEach(render);
counts();
document.querySelectorAll("[data-add]").forEach((b) =>
  b.addEventListener("click", () => {
    add(b.dataset.add);
  }),
);
document.getElementById("saveBtn").addEventListener("click", () => {
  save();
  if (store && store.flush) store.flush();
  alert(store ? "Roster saved to the shared board." : "Roster saved on this device.");
});
document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Clear the shared volunteer roster?")) {
    state = {
      setup: defaults.setup.map((role) => emptyRow(role, "setup")),
      event: defaults.event.map((role) => emptyRow(role, "event")),
      strike: defaults.strike.map((role) => emptyRow(role, "strike")),
      grounds: defaults.grounds.map((role) => emptyRow(role, "event")),
    };
    ensureFloaters();
    ensureMuscle();
    ensureGrounds();
    ensureFoodLine();
    save();
    ["setup", "event", "strike", "grounds"].forEach(render);
  }
});
document.getElementById("printBtn").addEventListener("click", () => print());
if (store) {
  window.addEventListener("ggs-prep-loaded", () => applyRemote(store.readDoc("volunteers")));
  store.startSync();
}
