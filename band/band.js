(function () {
  const show = window.GGSRunOfShow;
  const EVENT_DAY = "2026-09-17";

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function isEventDay(now) {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d === EVENT_DAY;
  }

  function clockDate() {
    const now = new Date();
    if (isEventDay(now)) return now;
    const mapped = new Date(EVENT_DAY + "T00:00:00");
    mapped.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return mapped;
  }

  function atTime(t) {
    const p = String(t || "").split(":");
    const d = clockDate();
    d.setSeconds(0, 0);
    d.setHours(Number(p[0]) || 0, Number(p[1]) || 0, 0, 0);
    return d;
  }

  function rows() {
    return (show.BAND || []).map(function (row, i) {
      return Object.assign({ id: show.idFor(row, i) }, row);
    });
  }

  function live(list) {
    const now = clockDate();
    let current = list[0];
    let next = list[1] || null;
    list.forEach(function (row, i) {
      if (now >= atTime(row.t)) {
        current = row;
        next = list[i + 1] || null;
      }
    });
    return { current: current, next: next, now: now };
  }

  function paint() {
    const list = rows();
    if (!list.length) return;
    const here = live(list);
    const face = document.getElementById("bandFace");
    const mode = document.getElementById("bandMode");
    const nowEl = document.getElementById("bandNow");
    const listEl = document.getElementById("bandList");
    if (face) face.textContent = here.now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (mode) {
      mode.textContent = isEventDay(new Date())
        ? "Thursday. This phone’s clock is live."
        : "Preview: this phone’s time, laid on Thursday’s band clock.";
    }
    if (nowEl && here.current) {
      const same = list.filter(function (row) {
        return row.t === here.current.t;
      });
      nowEl.className = "ros-now is-" + here.current.kind;
      nowEl.innerHTML =
        '<p class="eyebrow">NOW · ' +
        show.hm(here.current.t) +
        "</p>" +
        same
          .map(function (row) {
            return "<h2>" + esc(row.text) + "</h2><p>" + esc(row.who) + "</p>";
          })
          .join("") +
        (here.next
          ? "<p>Next · " + show.hm(here.next.t) + " — " + esc(here.next.text) + "</p>"
          : "<p>That is the last line on the band clock.</p>");
    }
    if (listEl) {
      listEl.innerHTML = list
        .map(function (row) {
          const cls = [
            "ros-row",
            "is-" + row.kind,
            here.current && row.t === here.current.t ? "is-now" : "",
            here.next && row.id === here.next.id ? "is-next" : "",
            here.now >= atTime(row.t) && (!here.current || row.t !== here.current.t) ? "is-past" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            '<li class="' +
            cls +
            '"><b>' +
            show.hm(row.t) +
            "</b><div><small>" +
            esc(row.who) +
            "</small><span>" +
            esc(row.text) +
            "</span></div></li>"
          );
        })
        .join("");
      const on = listEl.querySelector(".is-now");
      if (on && !window.__bandDidScroll) {
        window.__bandDidScroll = true;
        on.scrollIntoView({ block: "center" });
      }
    }
  }

  function greenDoc() {
    const store = window.GGSPrepStore;
    const doc = store && store.readDoc("green-room");
    return doc && typeof doc === "object" ? doc : {};
  }

  function paintGreen() {
    const room = String(greenDoc().room || "").trim();
    const title = document.getElementById("greenRoomTitle");
    const body = document.getElementById("greenRoomBody");
    const input = document.getElementById("greenRoomInput");
    if (title) title.textContent = room ? room : "Not set yet";
    if (body) {
      body.textContent = room
        ? "Band green room from 6:15–7:00, and after acoustic PA check if they want it. Preshow is 6:30. Back for the 7:00 set."
        : "Call Tommy at Woody’s and ask what room the band can have from 6:15–7:00 — and after acoustic PA check if he has something earlier.";
    }
    if (input && !input.value) input.value = room;
  }

  function saveGreen() {
    const store = window.GGSPrepStore;
    const input = document.getElementById("greenRoomInput");
    const room = input ? String(input.value || "").trim() : "";
    if (!store) return;
    store.saveDoc("green-room", { v: 1, room: room });
    if (store.flush) store.flush();
    paintGreen();
  }

  function start() {
    const store = window.GGSPrepStore;
    if (store && store.startSync) store.startSync();
    paint();
    paintGreen();
    const save = document.getElementById("greenRoomSave");
    if (save) save.addEventListener("click", saveGreen);
  }

  window.addEventListener("ggs-prep-loaded", paintGreen);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  setInterval(paint, 15000);
})();
