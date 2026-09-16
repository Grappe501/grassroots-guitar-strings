(function (global) {
  const API = "/api/prep-assignments";
  const CACHE = "ggs-prep-2026-09-17-v2";
  let timer = null;
  const dirty = new Set();

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

  async function load() {
    try {
      const response = await fetch(API, { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error("load failed");
      const data = await response.json();
      const assignments = data.assignments || {};
      writeCache(assignments);
      global.dispatchEvent(new CustomEvent("ggs-prep-loaded", { detail: assignments }));
      return assignments;
    } catch (err) {
      const cached = readCache();
      global.dispatchEvent(new CustomEvent("ggs-prep-loaded", { detail: cached }));
      return cached;
    }
  }

  function saveOne(key, row) {
    const state = readCache();
    state[key] = {
      owner: row.owner || "",
      when: row.when || "",
      done: Boolean(row.done),
    };
    writeCache(state);
    dirty.add(key);
    clearTimeout(timer);
    timer = setTimeout(() => {
      const snapshot = readCache();
      const assignments = {};
      dirty.forEach((item) => {
        assignments[item] = snapshot[item];
      });
      dirty.clear();
      fetch(API, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assignments }),
      }).catch(() => {});
    }, 350);
  }

  async function reset() {
    writeCache({});
    try {
      await fetch(API, { method: "DELETE" });
    } catch (err) {
      /* keep going so the board can clear locally */
    }
  }

  global.GGSPrepStore = { load, saveOne, reset, readCache };
})(window);
