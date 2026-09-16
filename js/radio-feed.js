(function (global) {
  const PALETTE = [
    "#000066",
    "#ca913d",
    "#2f6f4e",
    "#8a4b08",
    "#6b3fa0",
    "#0b6e6e",
    "#a33b6b",
    "#3d5a1f",
    "#1f4e79",
    "#b35c00",
    "#5c3d1e",
    "#0f5c8c",
  ];

  function esc(x) {
    return String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function colorFor(name) {
    const s = String(name || "")
      .trim()
      .toLowerCase();
    if (!s) return PALETTE[0];
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return PALETTE[Math.abs(h) % PALETTE.length];
  }

  let channelFn = function () {
    return "all";
  };

  function setChannelSource(fn) {
    if (typeof fn === "function") channelFn = fn;
  }

  function activeDoc() {
    const ch = channelFn() || "all";
    return ch === "all" ? "radio" : "dm:" + ch;
  }

  function readMessages() {
    const store = global.GGSPrepStore;
    const doc = store ? store.readDoc(activeDoc()) : null;
    if (!doc) return [];
    if (Array.isArray(doc.messages)) return doc.messages;
    if (doc.note) {
      return [{ id: "legacy", by: doc.by || "Radio", text: doc.note, at: doc.at || "" }];
    }
    return [];
  }

  function stamp() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function whoFn(getName) {
    return String((typeof getName === "function" ? getName() : "") || "").trim();
  }

  const WINDOW_MS = 10 * 60 * 1000;
  let showEarlier = false;
  let lastDoc = "";

  function whenMs(row) {
    const t = row && row.at ? Date.parse(row.at) : NaN;
    return Number.isFinite(t) ? t : 0;
  }

  function recentLines(lines, now) {
    const cut = (now || Date.now()) - WINDOW_MS;
    return (lines || []).filter((row) => whenMs(row) >= cut);
  }

  function digestText(lines) {
    if (!lines.length) return "No radio in the last 10 minutes. You are caught up.";
    const bits = [];
    lines.forEach((row) => {
      const by = String(row.by || "Radio").trim().split(/\s+/)[0] || "Radio";
      const text = String(row.text || "").trim();
      if (!text) return;
      const last = bits[bits.length - 1];
      if (last && last.by === by) last.parts.push(text);
      else bits.push({ by: by, parts: [text] });
    });
    return bits.map((b) => b.by + ": " + b.parts.join(" · ") + ".").join(" ");
  }

  function ensureDigest(feed) {
    let el = document.getElementById("radioDigest");
    if (el) return el;
    el = document.createElement("div");
    el.id = "radioDigest";
    el.className = "radio-digest";
    feed.parentNode.insertBefore(el, feed);
    return el;
  }

  function myFirst() {
    const n = global.GGSSignIn ? global.GGSSignIn.identity().name : "";
    return String(n || "")
      .trim()
      .split(/\s+/)[0]
      .toLowerCase();
  }

  function mentioned(text) {
    const me = myFirst();
    if (!me || me.length < 2) return false;
    return new RegExp("\\b" + me.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(String(text || ""));
  }

  function rxHtml(row) {
    const marks = ["🔥", "🙌", "👍"];
    const rx = row.rx && typeof row.rx === "object" ? row.rx : {};
    const me = String((global.GGSSignIn && global.GGSSignIn.identity().name) || "").trim();
    return (
      '<span class="radio-rx">' +
      marks
        .map((mark) => {
          const list = Array.isArray(rx[mark]) ? rx[mark] : [];
          const mine = list.some((n) => String(n).toLowerCase() === me.toLowerCase());
          return (
            '<button type="button" class="radio-rx-btn' +
            (mine ? " is-mine" : "") +
            (list.length ? " is-on" : "") +
            '" data-rx="' +
            esc(row.id || "") +
            '" data-mark="' +
            mark +
            '">' +
            mark +
            (list.length ? "<i>" + list.length + "</i>" : "") +
            "</button>"
          );
        })
        .join("") +
      "</span>"
    );
  }

  function lineHtml(row) {
    const by = String(row.by || "Unknown").trim() || "Unknown";
    const color = colorFor(by);
    const when = row.at ? new Date(row.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
    const kind = String(row.kind || "");
    const mine = mentioned(row.text);
    return (
      '<div class="radio-line' +
      (kind ? " is-" + esc(kind) : "") +
      (mine ? " is-mention" : "") +
      '" data-id="' +
      esc(row.id || "") +
      '" style="--who:' +
      color +
      '"><span class="radio-who">' +
      esc(by) +
      '</span><span class="radio-text">' +
      esc(row.text || "") +
      '</span><span class="radio-time">' +
      esc(when) +
      "</span>" +
      (row.id ? rxHtml(row) : "") +
      "</div>"
    );
  }

  function renderFeed(root) {
    if (!root) return;
    const doc = activeDoc();
    if (doc !== lastDoc) {
      showEarlier = false;
      lastDoc = doc;
    }
    const all = readMessages();
    const recent = recentLines(all);
    const older = all.length - recent.length;
    const digest = ensureDigest(root);
    const dm = (channelFn() || "all") !== "all";
    digest.innerHTML =
      '<p class="eyebrow">LAST 10 MIN</p><p class="radio-digest-text">' +
      esc(digestText(recent)) +
      "</p>" +
      (older
        ? '<button type="button" class="radio-earlier" id="radioEarlier">' +
          (showEarlier ? "Last 10 minutes only" : "Show " + older + " earlier line" + (older === 1 ? "" : "s")) +
          "</button>"
        : "");
    const earlier = document.getElementById("radioEarlier");
    if (earlier) {
      earlier.addEventListener("click", function () {
        showEarlier = !showEarlier;
        renderFeed(root);
      });
    }
    const lines = showEarlier ? all : recent;
    if (!all.length) {
      root.innerHTML = dm
        ? '<p class="radio-empty">Private thread. Only the two of you see this.</p>'
        : '<p class="radio-empty">No traffic yet. Type a line and hit Send.</p>';
      return;
    }
    if (!lines.length) {
      root.innerHTML = '<p class="radio-empty">Nothing in the last 10 minutes. Catch up above, or show earlier traffic.</p>';
      return;
    }
    const stick = root.scrollHeight - root.scrollTop < root.clientHeight + 40;
    root.innerHTML = lines.map(lineHtml).join("");
    root.querySelectorAll("[data-rx]").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        react(btn.dataset.rx, btn.dataset.mark);
        renderFeed(root);
      });
    });
    if (stick) root.scrollTop = root.scrollHeight;
  }

  function pushLine(by, text, kind) {
    const store = global.GGSPrepStore;
    const name = String(by || "").trim();
    const body = String(text || "").trim();
    if (!body) return { ok: false, reason: "empty" };
    if (name.length < 2) return { ok: false, reason: "name" };
    const row = {
      id: stamp(),
      by: name.slice(0, 40),
      text: body.slice(0, 240),
      at: new Date().toISOString(),
    };
    if (kind) row.kind = String(kind).slice(0, 16);
    const messages = readMessages().concat(row);
    if (store) {
      store.saveDoc(activeDoc(), { v: 4, messages: messages.slice(activeDoc() === "radio" ? -80 : -60) });
      if (store.flush) store.flush();
    }
    return { ok: true };
  }

  function react(id, mark) {
    const store = global.GGSPrepStore;
    const by = String((global.GGSSignIn && global.GGSSignIn.identity().name) || "").trim();
    if (!store || !id || !by || by.length < 2) return { ok: false };
    const key = String(mark || "🔥");
    const messages = readMessages().map((row) => {
      if (String(row.id || "") !== String(id)) return row;
      const rx = Object.assign({}, row.rx && typeof row.rx === "object" ? row.rx : {});
      const list = Array.isArray(rx[key]) ? rx[key].slice() : [];
      const hit = list.findIndex((n) => String(n).toLowerCase() === by.toLowerCase());
      if (hit >= 0) list.splice(hit, 1);
      else list.push(by.slice(0, 40));
      if (list.length) rx[key] = list;
      else delete rx[key];
      return Object.assign({}, row, { rx: rx });
    });
    store.saveDoc(activeDoc(), { v: 4, messages: messages.slice(activeDoc() === "radio" ? -80 : -60) });
    if (navigator.vibrate) navigator.vibrate(8);
    return { ok: true };
  }

  function send(getName, input) {
    const text = String((input && input.value) || "").trim();
    const by = whoFn(getName);
    const result = pushLine(by, text);
    if (result.ok && input) input.value = "";
    return result;
  }

  function mount(opts) {
    const feed = typeof opts.feed === "string" ? document.querySelector(opts.feed) : opts.feed;
    const input = typeof opts.input === "string" ? document.querySelector(opts.input) : opts.input;
    const button = typeof opts.send === "string" ? document.querySelector(opts.send) : opts.send;
    const need = typeof opts.need === "string" ? document.querySelector(opts.need) : opts.need;
    if (!feed || !input || !button) return;

    function paint() {
      renderFeed(feed);
    }

    function go() {
      const hint = document.getElementById("radioBy");
      const result = send(opts.getName, input);
      if (!result.ok && result.reason === "name") {
        if (hint) hint.textContent = "Sign in first, then Send.";
        if (need) {
          need.classList.add("is-needed");
          need.focus();
        }
        return;
      }
      if (result.ok && hint) hint.textContent = "Live on every device.";
      if (result.ok) global.dispatchEvent(new CustomEvent("ggs-radio-sent"));
      paint();
      input.focus();
    }

    button.addEventListener("click", go);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        go();
      }
    });
    paint();
    global.addEventListener("ggs-prep-loaded", paint);
    return { render: paint, send: go };
  }

  global.GGSRadioFeed = {
    mount,
    render: renderFeed,
    colorFor,
    readMessages,
    recentLines,
    digestText,
    setChannelSource,
    activeDoc,
    pushLine,
    react,
  };
})(window);
