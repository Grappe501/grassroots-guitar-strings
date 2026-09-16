(function (global) {
  const PREFS = "ggs-prep-v3-prefs";

  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS) || "{}");
    } catch (err) {
      return {};
    }
  }

  function writePrefs(patch) {
    const next = Object.assign(readPrefs(), patch);
    localStorage.setItem(PREFS, JSON.stringify(next));
    return next;
  }

  function identity() {
    const prefs = readPrefs();
    const name = String(prefs.me || "").trim();
    const raw = String(prefs.phone || "").trim();
    const phone = global.GGSCrewSlice ? global.GGSCrewSlice.phoneDigits(raw) : raw.replace(/\D/g, "");
    return { name, phone: raw, ok: name.length >= 2 && String(phone || "").length >= 7 };
  }

  function fillKnown() {
    const who = identity();
    const nameEls = ["gateName", "meInput", "runMe", "whoInput"];
    const phoneEls = ["gatePhone", "mePhone", "whoPhone", "boardPhone"];
    nameEls.forEach((id) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = who.name;
    });
    phoneEls.forEach((id) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = who.phone;
    });
  }

  function applyLock() {
    const ok = identity().ok;
    document.body.classList.toggle("is-locked", !ok);
    const gate = document.getElementById("signInGate");
    if (gate) gate.hidden = ok;
    document.querySelectorAll("[data-needs-identity]").forEach((el) => {
      el.setAttribute("aria-hidden", ok ? "false" : "true");
      if ("inert" in el) el.inert = !ok;
    });
    const who = document.getElementById("whoOnBoard");
    if (who) who.textContent = ok ? identity().name : "Not signed in";
    fillKnown();
    return ok;
  }

  function save(name, phone) {
    const clean = String(name || "").trim();
    const number = String(phone || "").trim();
    writePrefs({ me: clean, phone: number });
    if (global.GGSPrepStore && global.GGSCrewSlice && global.GGSCrewSlice.phoneDigits(number)) {
      global.GGSCrewSlice.saveContact(global.GGSPrepStore, clean, number);
    }
    applyLock();
    global.dispatchEvent(new CustomEvent("ggs-signed-in", { detail: { me: clean, phone: number } }));
    return identity().ok;
  }

  function signOut() {
    writePrefs({ me: "", phone: "" });
    applyLock();
    const name = document.getElementById("gateName");
    const phone = document.getElementById("gatePhone");
    if (name) name.value = "";
    if (phone) phone.value = "";
    if (name) name.focus();
  }

  function ensurePhoto(gate) {
    const card = gate.querySelector(".signin__card");
    if (!card || card.querySelector(".signin__photo")) return;
    const img = document.createElement("img");
    img.className = "signin__photo";
    img.src = "/assets/images/host/kelly-grappe.jpg";
    img.alt = "Kelly Grappe, candidate for Arkansas Secretary of State";
    img.width = 720;
    img.height = 320;
    card.insertBefore(img, card.firstChild);
  }

  function bind() {
    const gate = document.getElementById("signInGate");
    if (!gate) {
      applyLock();
      return;
    }
    ensurePhoto(gate);
    const name = document.getElementById("gateName");
    const phone = document.getElementById("gatePhone");
    const go = document.getElementById("gateGo");
    const err = document.getElementById("gateErr");
    fillKnown();
    function submit() {
      const ok = save(name ? name.value : "", phone ? phone.value : "");
      if (err) err.hidden = ok;
      if (!ok && name && !(name.value || "").trim()) name.focus();
      else if (!ok && phone) phone.focus();
    }
    if (go) go.addEventListener("click", submit);
    [name, phone].forEach((el) => {
      if (!el) return;
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
    });
    document.querySelectorAll("[data-sign-out]").forEach((btn) => {
      btn.addEventListener("click", signOut);
    });
    applyLock();
  }

  global.GGSSignIn = { identity, applyLock, save, signOut, bind };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})(window);
