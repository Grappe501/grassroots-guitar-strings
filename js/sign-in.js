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

  function digits(raw) {
    if (global.GGSCrewSlice) return String(global.GGSCrewSlice.phoneDigits(raw) || "").replace(/\D/g, "");
    return String(raw || "").replace(/\D/g, "");
  }

  function identity() {
    const prefs = readPrefs();
    const rawName = String(prefs.me || "").trim();
    const name = global.GGSPeople && global.GGSPeople.canonName ? global.GGSPeople.canonName(rawName) : rawName;
    const raw = String(prefs.phone || "").trim();
    return { name, phone: raw, ok: name.length >= 2 && digits(raw).length >= 7 };
  }

  function pretty(phone) {
    if (global.GGSPeople) return global.GGSPeople.prettyPhone(phone);
    if (global.GGSCrewSlice) return global.GGSCrewSlice.displayPhone(phone);
    return String(phone || "").trim();
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
    paintGate(who.name);
  }

  function paintGate(name) {
    const card = document.querySelector(".signin__card");
    if (!card) return;
    const dir = global.GGSPeople;
    const person = dir ? dir.findPerson(name) : null;
    const h1 = card.querySelector("h1");
    const p = card.querySelector("h1 + p");
    const go = document.getElementById("gateGo");
    const eyebrow = card.querySelector(".eyebrow");
    if (person) {
      if (eyebrow) eyebrow.textContent = "YOUR NIGHT";
      if (h1) h1.textContent = "Hey " + person.first;
      if (p) p.textContent = "Confirm this is the phone in your hand. That opens your night.";
      if (go) go.textContent = "Continue";
    } else if (String(name || "").trim()) {
      const first = String(name).trim().split(/\s+/)[0];
      if (eyebrow) eyebrow.textContent = "YOUR NIGHT";
      if (h1) h1.textContent = "Hey " + first;
      if (p) p.textContent = "Confirm this is the phone in your hand. That opens your night.";
      if (go) go.textContent = "Continue";
    } else if (h1 && !String(name || "").trim()) {
      if (eyebrow && /kelly|sign in/i.test(eyebrow.textContent || "KELLY GRAPPE")) eyebrow.textContent = "KELLY GRAPPE";
      if (h1) h1.textContent = "Who are you?";
    }
  }

  function ensureExtras(card) {
    if (card.querySelector("#gateVerify")) return;
    const go = document.getElementById("gateGo");
    const wrap = document.createElement("div");
    wrap.id = "gateVerify";
    wrap.className = "signin__verify";
    wrap.hidden = true;
    wrap.innerHTML =
      '<p id="gateVerifyText">Is this the phone you are on today?</p>' +
      '<div class="signin__verify-actions">' +
      '<button type="button" id="gateYes">Yes, this phone</button>' +
      '<button type="button" id="gateNo" class="signin__ghost">Different number</button>' +
      "</div>";
    const wifi = document.createElement("button");
    wifi.type = "button";
    wifi.id = "gateWifi";
    wifi.className = "signin__wifi";
    wifi.hidden = true;
    wifi.textContent = "Connect to Wi-Fi";
    if (go) {
      go.parentNode.insertBefore(wrap, go);
      go.parentNode.insertBefore(wifi, go);
    } else {
      card.appendChild(wrap);
      card.appendChild(wifi);
    }
  }

  function setVerified(on) {
    const card = document.querySelector(".signin__card");
    if (card) card.classList.toggle("is-verified", !!on);
    const wifi = document.getElementById("gateWifi");
    const go = document.getElementById("gateGo");
    if (wifi) wifi.hidden = !on;
    if (go) go.hidden = !on;
  }

  function showVerify(phone) {
    const box = document.getElementById("gateVerify");
    const text = document.getElementById("gateVerifyText");
    if (!box) return;
    const shown = pretty(phone) || String(phone || "").trim();
    if (text) {
      text.textContent = shown
        ? "Is " + shown + " the phone you are on today?"
        : "Is this the phone you are on today?";
    }
    box.hidden = !shown;
    if (!shown) setVerified(false);
  }

  function applyPerson(person, nameInput, phoneInput, suggestBox) {
    if (!person) return;
    nameInput.value = person.name;
    if (person.phone) phoneInput.value = pretty(person.phone);
    if (suggestBox) suggestBox.hidden = true;
    paintGate(person.name);
    setVerified(false);
    showVerify(phoneInput.value);
  }

  function bindNames(input, phoneInput) {
    if (!input || !global.GGSPeople) return;
    let list = document.getElementById("crewNameList");
    if (!list) {
      list = document.createElement("datalist");
      list.id = "crewNameList";
      document.body.appendChild(list);
    }
    list.innerHTML = global.GGSPeople.names()
      .map((n) => '<option value="' + n.replace(/"/g, "") + '"></option>')
      .join("");
    input.setAttribute("list", "crewNameList");
    input.setAttribute("placeholder", "Start typing your name");
    input.setAttribute("autocomplete", "off");
    let box = document.getElementById("crewSuggest");
    if (!box) {
      box = document.createElement("div");
      box.id = "crewSuggest";
      box.className = "signin__suggest";
      input.parentNode.appendChild(box);
    }
    function paintSuggest() {
      const typed = String(input.value || "").trim();
      const unique = global.GGSPeople.uniquePerson(typed);
      if (unique) {
        applyPerson(unique, input, phoneInput, box);
        return;
      }
      const hits = global.GGSPeople.suggestions(typed).slice(0, 8);
      box.innerHTML = hits
        .map((p) => '<button type="button" data-name="' + p.name.replace(/"/g, "") + '">' + p.name + "</button>")
        .join("");
      box.hidden = !typed || !hits.length;
      box.querySelectorAll("[data-name]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const person = global.GGSPeople.findPerson(btn.dataset.name);
          applyPerson(person, input, phoneInput, box);
        });
      });
      paintGate(input.value);
      setVerified(false);
      const person = global.GGSPeople.findPerson(typed);
      if (person && person.phone && !String(phoneInput.value || "").trim()) phoneInput.value = pretty(person.phone);
      showVerify(phoneInput.value);
    }
    input.addEventListener("input", paintSuggest);
    input.addEventListener("focus", paintSuggest);
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
    const raw = String(name || "").trim();
    const person = global.GGSPeople && (global.GGSPeople.uniquePerson(raw) || global.GGSPeople.findPerson(raw));
    const clean = person ? person.name : raw;
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
    setVerified(false);
    showVerify("");
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
    const card = gate.querySelector(".signin__card");
    if (card) ensureExtras(card);
    const name = document.getElementById("gateName");
    const phone = document.getElementById("gatePhone");
    const go = document.getElementById("gateGo");
    const err = document.getElementById("gateErr");
    const yes = document.getElementById("gateYes");
    const no = document.getElementById("gateNo");
    const wifi = document.getElementById("gateWifi");
    bindNames(name, phone);
    fillKnown();
    if (name && phone && global.GGSPeople) {
      const person = global.GGSPeople.uniquePerson(name.value) || global.GGSPeople.findPerson(name.value);
      if (person) applyPerson(person, name, phone, document.getElementById("crewSuggest"));
    } else if (phone && digits(phone.value).length >= 7) {
      showVerify(phone.value);
    }
    setVerified(false);
    function ready() {
      return String((name && name.value) || "").trim().length >= 2 && digits((phone && phone.value) || "").length >= 7;
    }
    function submit() {
      if (!card || !card.classList.contains("is-verified")) {
        if (err) {
          err.textContent = "Confirm this is the phone you are on today.";
          err.hidden = false;
        }
        return;
      }
      const ok = save(name ? name.value : "", phone ? phone.value : "");
      if (err) err.hidden = ok;
      if (!ok && name && !(name.value || "").trim()) name.focus();
      else if (!ok && phone) phone.focus();
    }
    if (yes) {
      yes.addEventListener("click", function () {
        if (!ready()) {
          if (err) {
            err.textContent = "Name and a real phone first.";
            err.hidden = false;
          }
          return;
        }
        if (err) err.hidden = true;
        setVerified(true);
        const ok = save(name ? name.value : "", phone ? phone.value : "");
        if (ok && !/^\/v5\/?$/.test(location.pathname || "")) location.href = "/v5/";
      });
    }
    if (no) {
      no.addEventListener("click", function () {
        setVerified(false);
        if (phone) {
          phone.value = "";
          phone.focus();
        }
        showVerify("");
      });
    }
    if (wifi) {
      wifi.addEventListener("click", function () {
        if (!card.classList.contains("is-verified") || !ready()) return;
        save(name.value, phone.value);
        if (global.GGSWifi && global.GGSWifi.joinFromGate) global.GGSWifi.joinFromGate();
        else location.href = "/wifi/";
      });
    }
    if (go) go.addEventListener("click", submit);
    if (phone) {
      phone.addEventListener("input", function () {
        setVerified(false);
        showVerify(phone.value);
      });
    }
    [name, phone].forEach((el) => {
      if (!el) return;
      el.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (!card.classList.contains("is-verified") && ready()) setVerified(true);
        else submit();
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
