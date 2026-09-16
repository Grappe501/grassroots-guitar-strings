(function (global) {
  const API = "/api/prep-assignments";
  const CACHE = "ggs-prep-2026-09-17-v2";
  const POLL_MS = 4000;
  let pollMs = POLL_MS;
  let timer = null;
  let pollTimer = null;
  let inflight = null;
  let lastEmit = "";
  const dirty = new Set();

  function isPicking() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = String(el.tagName || "").toLowerCase();
    return tag === "select" || tag === "input" || tag === "textarea";
  }

  function readCache() {
    try {
      return JSON.parse(localStorage.getItem(CACHE) || "{}");
    } catch (err) {
      return {};
    }
  }

  function writeCache(state) {
    localStorage.setItem(CACHE, JSON.stringify(state));
  }

  function setStatus(kind) {
    global.dispatchEvent(new CustomEvent("ggs-prep-status", { detail: kind }));
  }

  function rowFrom(value) {
    return {
      owner: value && value.owner ? String(value.owner) : "",
      when: value && value.when ? String(value.when) : "",
      done: Boolean(value && value.done),
      extra: value && value.extra ? String(value.extra) : "",
    };
  }

  function emit(state) {
    const snap = JSON.stringify(state || {});
    if (snap === lastEmit) return;
    lastEmit = snap;
    global.dispatchEvent(new CustomEvent("ggs-prep-loaded", { detail: state }));
  }

  async function load() {
    try {
      const response = await fetch(API, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("load failed");
      const data = await response.json();
      const assignments = data.assignments || {};
      const local = readCache();
      const next = Object.assign({}, assignments);
      dirty.forEach((key) => {
        if (local[key]) next[key] = local[key];
      });
      writeCache(next);
      emit(next);
      setStatus("ok");
      return next;
    } catch (err) {
      const cached = readCache();
      emit(cached);
      setStatus("offline");
      return cached;
    }
  }

  async function flush() {
    if (!dirty.size) return;
    if (inflight) return inflight;
    const snapshot = readCache();
    const assignments = {};
    const keys = Array.from(dirty);
    keys.forEach((item) => {
      assignments[item] = rowFrom(snapshot[item]);
    });
    setStatus("saving");
    inflight = fetch(API, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      keepalive: true,
      body: JSON.stringify({ assignments }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("save failed");
        keys.forEach((key) => dirty.delete(key));
        setStatus(dirty.size ? "saving" : "ok");
      })
      .catch(() => {
        setStatus("offline");
      })
      .finally(() => {
        inflight = null;
        if (dirty.size) flush();
      });
    return inflight;
  }

  function saveOne(key, row) {
    const state = readCache();
    state[key] = rowFrom(row);
    writeCache(state);
    dirty.add(key);
    setStatus("saving");
    clearTimeout(timer);
    timer = setTimeout(() => {
      flush();
    }, 200);
  }

  function readDoc(name) {
    const row = readCache()["_doc:" + name];
    if (!row || !row.extra) return null;
    try {
      return JSON.parse(row.extra);
    } catch (err) {
      return null;
    }
  }

  function saveDoc(name, payload) {
    saveOne("_doc:" + name, { extra: JSON.stringify(payload || {}) });
  }

  async function reset() {
    writeCache({});
    dirty.clear();
    try {
      await fetch(API, { method: "DELETE", cache: "no-store" });
      setStatus("ok");
    } catch (err) {
      setStatus("offline");
    }
  }

  function listDocs(prefix) {
    const state = readCache();
    const start = "_doc:" + String(prefix || "");
    const out = [];
    Object.keys(state).forEach((key) => {
      if (!key.startsWith(start)) return;
      let data = null;
      try {
        data = state[key] && state[key].extra ? JSON.parse(state[key].extra) : null;
      } catch (err) {
        data = null;
      }
      out.push({ name: key.slice(5), data: data });
    });
    return out;
  }

  function tick() {
    if (dirty.size) flush();
    else load();
  }

  function setPoll(ms) {
    pollMs = Math.max(800, Number(ms) || POLL_MS);
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = setInterval(tick, pollMs);
    }
  }

  function startSync() {
    load();
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(tick, pollMs);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") load();
      else flush();
    });
    global.addEventListener("pagehide", () => {
      flush();
    });
  }

  global.GGSPrepStore = {
    load,
    saveOne,
    saveDoc,
    readDoc,
    listDocs,
    reset,
    readCache,
    startSync,
    setPoll,
    flush,
    isPicking,
  };
})(window);
