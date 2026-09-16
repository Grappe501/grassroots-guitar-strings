(function () {
  const show = window.GGSRunOfShow;
  const store = window.GGSPrepStore;
  const EVENT_DAY = "2026-09-17";

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function marks() {
    const doc = store && store.readDoc("run-clock");
    return doc && doc.marks && typeof doc.marks === "object" ? doc.marks : {};
  }

  function saveMark(id, state) {
    if (!store) return;
    const next = Object.assign({}, marks());
    if (!state) delete next[id];
    else next[id] = { state: state, at: new Date().toISOString() };
    store.saveDoc("run-clock", { v: 1, marks: next });
    if (store.flush) store.flush();
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
    return (show.CLOCK || []).map(function (row, i) {
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
    const here = live(list);
    const book = marks();
    const face = document.getElementById("rosFace");
    const mode = document.getElementById("rosMode");
    const nowEl = document.getElementById("rosNow");
    const listEl = document.getElementById("rosList");
    if (face) face.textContent = here.now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (mode) {
      mode.textContent = isEventDay(new Date())
        ? "Thursday. This phone’s clock is live."
        : "Preview: this phone’s time, laid on Thursday’s run of show.";
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
          : "<p>That is the last line on the clock.</p>") +
        '<div class="ros-actions">' +
        same
          .map(function (row) {
            return (
              '<button type="button" data-mark="done" data-id="' +
              esc(row.id) +
              '">Done · ' +
              esc(row.who.split("·")[0].trim()) +
              '</button><button type="button" data-mark="late" data-id="' +
              esc(row.id) +
              '">Late</button>'
            );
          })
          .join("") +
        "</div>";
    }
    if (listEl) {
      listEl.innerHTML = list
        .map(function (row) {
          const mark = book[row.id] || {};
          const cls = [
            "ros-row",
            "is-" + row.kind,
            mark.state ? "is-" + mark.state : "",
            here.current && row.t === here.current.t ? "is-now" : "",
            here.next && row.id === here.next.id ? "is-next" : "",
            here.now >= atTime(row.t) && (!here.current || row.t !== here.current.t) ? "is-past" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            '<li class="' +
            cls +
            '" data-id="' +
            esc(row.id) +
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
      if (on && !window.__rosDidScroll) {
        window.__rosDidScroll = true;
        on.scrollIntoView({ block: "center" });
      }
    }
  }

  async function pulse() {
    const box = document.getElementById("rosPulseBody");
    if (box) box.textContent = "Reading the clock…";
    const list = rows();
    const here = live(list);
    const book = marks();
    const marked = list
      .filter(function (row) {
        return book[row.id];
      })
      .map(function (row) {
        return { t: row.t, who: row.who, text: row.text, state: book[row.id].state };
      });
    const upcoming = list.filter(function (row) {
      return here.now < atTime(row.t);
    }).slice(0, 6);
    try {
      const response = await fetch("/api/show-pulse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          now: here.now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
          marks: marked,
          upcoming: upcoming.map(function (row) {
            return { t: row.t, who: row.who, text: row.text };
          }),
        }),
      });
      const data = await response.json();
      if (!box) return;
      box.innerHTML =
        "<p>" +
        esc(data.line || "No pulse.") +
        "</p>" +
        (data.moves && data.moves.length
          ? '<ol class="ros-moves">' + data.moves.map(function (item) {
              return "<li>" + esc(item) + "</li>";
            }).join("") + "</ol>"
          : "");
    } catch (err) {
      if (box) box.textContent = "Pulse could not reach the server. Keep using the highlighted row.";
    }
  }

  function bind() {
    document.body.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-mark]");
      if (!btn) return;
      saveMark(btn.getAttribute("data-id"), btn.getAttribute("data-mark"));
      paint();
    });
    const ask = document.getElementById("rosAsk");
    if (ask) ask.addEventListener("click", pulse);
  }

  function start() {
    if (store && store.startSync) store.startSync();
    paint();
    bind();
  }

  window.addEventListener("ggs-prep-loaded", paint);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  setInterval(paint, 15000);
})();
