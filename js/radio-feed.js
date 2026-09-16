(function (global) {
  const PALETTE = [
    "#c0172a",
    "#17466b",
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

  function readMessages() {
    const store = global.GGSPrepStore;
    const doc = store ? store.readDoc("radio") : null;
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

  function renderFeed(root) {
    if (!root) return;
    const lines = readMessages();
    if (!lines.length) {
      root.innerHTML = '<p class="radio-empty">No traffic yet. Type a line and hit Send.</p>';
      return;
    }
    const stick = root.scrollHeight - root.scrollTop < root.clientHeight + 40;
    root.innerHTML = lines
      .map((row) => {
        const by = String(row.by || "Unknown").trim() || "Unknown";
        const color = colorFor(by);
        const when = row.at
          ? new Date(row.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          : "";
        return (
          '<div class="radio-line" style="--who:' +
          color +
          '"><span class="radio-who">' +
          esc(by) +
          '</span><span class="radio-text">' +
          esc(row.text || "") +
          '</span><span class="radio-time">' +
          esc(when) +
          "</span></div>"
        );
      })
      .join("");
    if (stick) root.scrollTop = root.scrollHeight;
  }

  function send(getName, input) {
    const store = global.GGSPrepStore;
    const text = String((input && input.value) || "").trim();
    const by = whoFn(getName);
    if (!text) return { ok: false, reason: "empty" };
    if (by.length < 2) return { ok: false, reason: "name" };
    const messages = readMessages().concat({
      id: stamp(),
      by: by.slice(0, 40),
      text: text.slice(0, 240),
      at: new Date().toISOString(),
    });
    if (store) {
      store.saveDoc("radio", { v: 4, messages: messages.slice(-80) });
      if (store.flush) store.flush();
    }
    if (input) input.value = "";
    return { ok: true };
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
        if (hint) hint.textContent = "Type your name in I am, then Send.";
        if (need) {
          need.classList.add("is-needed");
          need.focus();
        }
        return;
      }
      if (result.ok && hint) hint.textContent = "Live on every device.";
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

  global.GGSRadioFeed = { mount, render: renderFeed, colorFor, readMessages };
})(window);
