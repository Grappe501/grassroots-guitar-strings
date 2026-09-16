const KEY = "ggs-volunteers-2026-09-17-v1";
const defaults = {
  setup: ["Setup Captain", "Setup Person 2", "Setup Person 3"],
  event: [
    "Event Captain",
    "Primary ticket/check-in",
    "Ticket backup",
    "BBQ/food service 1",
    "BBQ/food service 2",
    "Water/ice/cooler captain",
    "Guest greeter 1",
    "Campaign + sign distribution",
    "Photography/video — vertical only",
    "Kelly/guest-relations support",
    "David/performer support",
    "Venue/facilities",
    "Runner/floater",
  ],
  strike: [],
};
const teams = [
  "A · Tables / Chairs",
  "B · Campaign / Signs / Merch",
  "C · Food / Drinks / Coolers",
  "D · Production / Load-out",
  "E · Venue / Final Sweep",
];
const store = window.GGSPrepStore;
const slice = window.GGSCrewSlice;
let state =
  (store && store.readDoc("volunteers")) ||
  JSON.parse(localStorage.getItem(KEY) || "null") || {
    setup: defaults.setup.map((role) => ({ role, name: "", phone: "", arrival: "8:00 AM", backup: "", done: false })),
    event: defaults.event.map((role) => ({ role, name: "", phone: "", arrival: "5:00 PM", backup: "", done: false })),
    strike: [],
  };
const esc = (x) =>
  String(x ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function reachHtml(name, phone) {
  if (slice) return slice.contactHtml(name, phone);
  return name
    ? '<a class="person-page" href="/me/?who=' + encodeURIComponent(name) + '">Phone page</a>'
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
            '"><div class="person-name"><input class="name" value="' +
            esc(p.name) +
            '" placeholder="Person name"><span class="person-reach">' +
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
      row.querySelector("." + c).addEventListener("input", () => {
        state[kind][+row.dataset.i][c] = row.querySelector("." + c).value;
        save();
        if (c === "name" || c === "phone") {
          const name = row.querySelector(".name").value.trim();
          const phone = row.querySelector(".phone").value.trim();
          const box = row.querySelector(".person-reach");
          if (box) box.innerHTML = name ? reachHtml(name, phone) : "";
          if (store && slice && name && slice.phoneDigits(phone)) slice.saveContact(store, name, phone);
        }
      }),
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
    arrival: kind === "setup" ? "8:00 AM" : kind === "event" ? "5:00 PM" : "After show",
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
  ["setup", "event", "strike"].forEach(render);
  counts();
}

function counts() {
  document.getElementById("setupCount").textContent = state.setup.filter((x) => x.name.trim()).length + " / 3";
  document.getElementById("eventCount").textContent = state.event.filter((x) => x.name.trim()).length + " / 13";
  const n = state.strike.filter((x) => x.name.trim()).length;
  document.getElementById("strikeCount").textContent = n + " / 10";
  document.getElementById("strikeAlert").textContent =
    n >= 12
      ? "Teardown roster has 12+ committed people. Keep the team together through final clearance."
      : n >= 10
        ? "Minimum teardown roster reached. Keep recruiting toward 12+ for a safer 10:00 PM clear."
        : "Teardown is short by " + (10 - n) + ". Recruit 10 people minimum; target 12+ so the building can be cleared by 10:00 PM.";
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
      setup: defaults.setup.map((role) => ({ role, name: "", phone: "", arrival: "8:00 AM", backup: "", done: false })),
      event: defaults.event.map((role) => ({ role, name: "", phone: "", arrival: "5:00 PM", backup: "", done: false })),
      strike: [],
    };
    save();
    ["setup", "event", "strike"].forEach(render);
  }
});
document.getElementById("printBtn").addEventListener("click", () => print());
if (store) {
  window.addEventListener("ggs-prep-loaded", () => applyRemote(store.readDoc("volunteers")));
  store.startSync();
}
