const KEY = "ggs-volunteers-2026-09-17-v1";
const NEED_STAY = 7;
const defaults = {
  setup: [
    "Setup 1 → Floater A after 4:30",
    "Setup 2 → Floater B after 4:30",
    "Setup 3 → Campaign + merch (30 min set)",
  ],
  event: [
    "Event Captain — clock + venue + strike lead",
    "Tickets — one person; floater covers breaks",
    "Food + $1 water + ice — one person (Ben is the vendor)",
    "Campaign + merch — one table, 30 min set",
    "Tracy production helper — 8:00 AM through Strike D",
    "Floater A — relief loop all night",
    "Floater B — relief loop + roam shots if no Photo Lead",
  ],
  strike: [
    "Sound/lights muscle 1 — 8:45. Carry speakers and stands. Tracy directs.",
    "Sound/lights muscle 2 — 8:45. Carry lights and cases. Tracy directs.",
    "Sound/lights muscle 3 — 8:45. Carry remaining production to Tracy's vehicle.",
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
  if (/tracy/i.test(role)) return "8:00 AM";
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
  };
ensureFloaters();
ensureMuscle();
(function seedDebiMerch() {
  const row = (state.event || []).find((item) => /campaign|merch/i.test(String(item.role || "")));
  if (row && !String(row.name || "").trim()) row.name = "Debi Martin";
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
    ["name", "phone", "role", "arrival", "backup"].forEach((c) =>
      ["input", "change"].forEach((evt) =>
      row.querySelector("." + c).addEventListener(evt, () => {
        state[kind][+row.dataset.i][c] = row.querySelector("." + c).value;
        save();
        if (c === "name" || c === "phone") {
          const name = row.querySelector(".name").value.trim();
          const phone = row.querySelector(".phone").value.trim();
          const box = row.querySelector(".person-reach");
          if (box) box.innerHTML = name ? reachHtml(name, phone) : "";
          if (store && slice && name && slice.phoneDigits(phone)) slice.saveContact(store, name, phone);
        }
      })
      )
    );
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
  ensureFloaters();
  ensureMuscle();
  ["setup", "event", "strike"].forEach(render);
  counts();
}

function stayNames() {
  const seen = [];
  ["setup", "event", "strike"].forEach((kind) => {
    (state[kind] || []).forEach((row) => {
      const name = String((row && row.name) || "").trim();
      if (!name) return;
      if (/muscle/i.test(String((row && row.role) || ""))) return;
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
  document.getElementById("eventCount").textContent = state.event.filter((x) => x.name.trim()).length + " / " + NEED_STAY;
  const n = stayNames().length;
  document.getElementById("strikeCount").textContent = n + " / " + NEED_STAY;
  document.getElementById("strikeAlert").textContent =
    n >= NEED_STAY
      ? "7 people named. Those same people stay through 10:00 PM. Do not recruit a second strike crew."
      : "Night crew is " +
        (NEED_STAY - n) +
        " short of 7. Setup 1+2 become floaters. Setup 3 becomes campaign. Everyone stays for strike.";
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
["setup", "event", "strike"].forEach(render);
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
    };
    ensureFloaters();
    ensureMuscle();
    save();
    ["setup", "event", "strike"].forEach(render);
  }
});
document.getElementById("printBtn").addEventListener("click", () => print());
if (store) {
  window.addEventListener("ggs-prep-loaded", () => applyRemote(store.readDoc("volunteers")));
  store.startSync();
}
