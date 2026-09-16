(function (global) {
  const ICE = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
  const LIVE_MS = 22000;
  const AWAY_MS = 180000;
  const READ_KEY = "ggs-radio-read-v1";
  const peers = {};
  const seenSig = {};
  const appliedIce = {};
  let selected = "all";
  let attached = false;
  let talking = false;
  let micReady = false;
  let local = null;
  let heartTimer = null;
  let bc = null;

  function esc(x) {
    return String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function store() {
    return global.GGSPrepStore;
  }

  function who() {
    return global.GGSSignIn ? global.GGSSignIn.identity() : { name: "", phone: "", ok: false };
  }

  function digits() {
    const raw = who().phone;
    if (global.GGSCrewSlice) return String(global.GGSCrewSlice.phoneDigits(raw) || "").replace(/\D/g, "");
    return String(raw || "").replace(/\D/g, "");
  }

  function myId() {
    const d = digits();
    if (d.length >= 7) return "p" + d.slice(-10);
    return "";
  }

  function myName() {
    return String(who().name || "").trim().slice(0, 40);
  }

  function pair(a, b) {
    return [a, b].sort().join(".");
  }

  function channelToken() {
    if (selected === "all") return "all";
    return pair(myId(), selected);
  }

  function readPref() {
    try {
      return JSON.parse(localStorage.getItem(READ_KEY) || "{}");
    } catch (err) {
      return {};
    }
  }

  function markRead(token) {
    const next = readPref();
    next[token] = Date.now();
    localStorage.setItem(READ_KEY, JSON.stringify(next));
  }

  function hint(text) {
    const el = document.getElementById("radioTalkHint");
    if (el) el.textContent = text;
  }

  function channelLabel() {
    const el = document.getElementById("radioChannel");
    const input = document.getElementById("radioInput");
    const talk = document.getElementById("radioTalk");
    const people = livePeople();
    const them = people.find((p) => p.id === selected);
    const name = them ? them.name : "All radios";
    if (el) el.textContent = selected === "all" ? "All radios" : "Private · " + name;
    if (input) {
      input.placeholder =
        selected === "all"
          ? "Ben is 15 out. Need two more teardown people."
          : "Private to " + name + "…";
    }
    if (talk) talk.textContent = selected === "all" ? "Hold to talk — ALL" : "Hold to talk — " + name;
  }

  function livePeople() {
    const db = store();
    if (!db || !db.listDocs) return [];
    const now = Date.now();
    const me = myId();
    return db
      .listDocs("here:")
      .map((row) => row.data || {})
      .filter((p) => p && p.id && p.id !== me && p.seen && now - p.seen < AWAY_MS && !p.gone)
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  }

  function unreadCount(id) {
    const db = store();
    if (!db) return 0;
    const token = pair(myId(), id);
    const doc = db.readDoc("dm:" + token);
    const lines = doc && Array.isArray(doc.messages) ? doc.messages : [];
    if (!lines.length) return 0;
    const last = readPref()[token] || 0;
    return lines.filter((row) => {
      const at = row.at ? Date.parse(row.at) : 0;
      return at > last && String(row.by || "") !== myName();
    }).length;
  }

  function paintPeople() {
    const root = document.getElementById("radioPeople");
    if (!root) return;
    const people = livePeople();
    const now = Date.now();
    const color = global.GGSRadioFeed ? global.GGSRadioFeed.colorFor : function () { return "#000066"; };
    const buttons = [
      '<button type="button" class="radio-person is-all' +
        (selected === "all" ? " is-active" : "") +
        '" data-radio-to="all"><span>All</span><em>open</em></button>',
    ];
    if (myId()) {
      buttons.push(
        '<button type="button" class="radio-person is-you" disabled><span>You</span><em>' +
          esc((myName() || "signed in").split(" ")[0]) +
          "</em></button>"
      );
    }
    people.forEach((p) => {
      const live = now - p.seen < LIVE_MS;
      const unread = unreadCount(p.id);
      const first = String(p.name || "Radio").trim().split(/\s+/)[0] || "Radio";
      buttons.push(
        '<button type="button" class="radio-person' +
          (selected === p.id ? " is-active" : "") +
          (live ? " is-live" : " is-away") +
          (p.talk ? " is-talk" : "") +
          (unread ? " is-unread" : "") +
          '" data-radio-to="' +
          esc(p.id) +
          '" style="--who:' +
          color(p.name) +
          '"><span>' +
          esc(first) +
          "</span><em>" +
          (p.talk ? (p.talk === "all" ? "ALL" : "PTT") : live ? "live" : "away") +
          "</em>" +
          (unread ? '<i class="radio-badge">' + unread + "</i>" : "") +
          "</button>"
      );
    });
    if (people.length === 0) {
      buttons.push('<p class="radio-people-empty">Other signed-in phones land here.</p>');
    }
    root.innerHTML = buttons.join("");
    root.querySelectorAll("[data-radio-to]").forEach((btn) => {
      btn.addEventListener("click", () => pick(btn.dataset.radioTo));
    });
    channelLabel();
  }

  function pick(id) {
    selected = id === "all" ? "all" : String(id || "all");
    if (selected !== "all") markRead(pair(myId(), selected));
    channelLabel();
    paintPeople();
    const feed = document.getElementById("radioFeed");
    if (feed && global.GGSRadioFeed) global.GGSRadioFeed.render(feed);
  }

  function beat(talkTo) {
    const db = store();
    const id = myId();
    if (!db || !id || !who().ok) return;
    db.saveDoc("here:" + id, {
      v: 1,
      id: id,
      name: myName(),
      seen: Date.now(),
      talk: talkTo || "",
      gone: false,
    });
  }

  function leave() {
    const db = store();
    const id = myId();
    if (!db || !id) return;
    db.saveDoc("here:" + id, {
      v: 1,
      id: id,
      name: myName(),
      seen: 0,
      talk: "",
      gone: true,
    });
    if (db.flush) db.flush();
  }

  function audioBox() {
    let box = document.getElementById("radioAudio");
    if (!box) {
      box = document.createElement("div");
      box.id = "radioAudio";
      box.hidden = true;
      document.body.appendChild(box);
    }
    return box;
  }

  function unlockOut() {
    const ping = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
    );
    ping.play().catch(function () {});
  }

  function playRemote(id, stream) {
    const box = audioBox();
    let el = document.getElementById("radioOut-" + id);
    if (!el) {
      el = document.createElement("audio");
      el.id = "radioOut-" + id;
      el.autoplay = true;
      el.playsInline = true;
      el.setAttribute("playsinline", "");
      el.setAttribute("webkit-playsinline", "");
      box.appendChild(el);
    }
    el.srcObject = stream;
    el.play().catch(function () {});
  }

  async function localStream() {
    if (local) return local;
    local = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });
    local.getTracks().forEach((t) => {
      t.enabled = false;
    });
    return local;
  }

  function targets() {
    if (selected === "all") return livePeople().map((p) => p.id);
    return selected ? [selected] : [];
  }

  function signal(to, payload) {
    const db = store();
    const from = myId();
    if (!from || !to || from === to) return;
    const row = Object.assign({ t: Date.now(), v: 1, from: from, to: to }, payload);
    if (payload.kind === "ice" && db) {
      const prev = db.readDoc("sig:" + from + ":" + to);
      if (prev && prev.kind === "ice" && Date.now() - prev.t < 4000) {
        row.ice = (prev.ice || []).concat(payload.ice || []).slice(-24);
      }
    }
    if (db) db.saveDoc("sig:" + from + ":" + to, row);
    if (bc) bc.postMessage(row);
  }

  function polite(remoteId) {
    return myId() < remoteId;
  }

  async function ensurePeer(remoteId) {
    if (peers[remoteId]) return peers[remoteId];
    const pc = new RTCPeerConnection(ICE);
    const rec = { pc: pc, makingOffer: false, ignoreOffer: false, senders: [] };
    pc.onicecandidate = function (e) {
      if (e.candidate) signal(remoteId, { kind: "ice", ice: [e.candidate.toJSON()] });
    };
    pc.ontrack = function (e) {
      playRemote(remoteId, e.streams[0] || new MediaStream([e.track]));
    };
    pc.onnegotiationneeded = async function () {
      try {
        rec.makingOffer = true;
        await pc.setLocalDescription(await pc.createOffer());
        signal(remoteId, { kind: "offer", sdp: pc.localDescription.sdp });
      } catch (err) {
        /* glare or closed */
      } finally {
        rec.makingOffer = false;
      }
    };
    pc.onconnectionstatechange = function () {
      paintPeople();
    };
    peers[remoteId] = rec;
    return rec;
  }

  async function attachTracks(remoteId) {
    const rec = await ensurePeer(remoteId);
    if (rec.senders.length) return rec;
    const stream = await localStream();
    const clone = stream.clone();
    clone.getTracks().forEach((t) => {
      t.enabled = false;
      rec.senders.push(rec.pc.addTrack(t, clone));
    });
    rec.clone = clone;
    return rec;
  }

  function setSend(remoteId, on) {
    const rec = peers[remoteId];
    if (!rec || !rec.clone) return;
    rec.clone.getTracks().forEach((t) => {
      t.enabled = on;
    });
  }

  async function handleSignal(from, data) {
    if (!from || !data || from === myId()) return;
    const token = from + ":" + data.t + ":" + data.kind;
    if (data.kind !== "ice" && seenSig[token]) return;
    if (data.kind !== "ice") seenSig[token] = true;
    const rec = await ensurePeer(from);
    const pc = rec.pc;
    try {
      if (data.kind === "offer" && data.sdp) {
        const glare = rec.makingOffer || pc.signalingState !== "stable";
        rec.ignoreOffer = !polite(from) && glare;
        if (rec.ignoreOffer) return;
        await pc.setRemoteDescription({ type: "offer", sdp: data.sdp });
        await pc.setLocalDescription(await pc.createAnswer());
        signal(from, { kind: "answer", sdp: pc.localDescription.sdp });
      }
      if (data.kind === "answer" && data.sdp && pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
      }
      if (data.kind === "ice" && data.ice) {
        if (!appliedIce[from]) appliedIce[from] = {};
        for (let i = 0; i < data.ice.length; i += 1) {
          const c = data.ice[i];
          const key = (c && c.candidate) || JSON.stringify(c);
          if (appliedIce[from][key]) continue;
          appliedIce[from][key] = true;
          try {
            await pc.addIceCandidate(c);
          } catch (err) {
            /* remote desc not set yet */
          }
        }
      }
    } catch (err) {
      /* drop a bad signal */
    }
  }

  function scanSignals() {
    const db = store();
    const me = myId();
    if (!db || !db.listDocs || !me) return;
    db.listDocs("sig:").forEach((row) => {
      const parts = String(row.name || "").split(":");
      if (parts.length < 3 || parts[2] !== me) return;
      const data = row.data;
      if (!data || !data.t || Date.now() - data.t > 60000) return;
      handleSignal(parts[1], data);
    });
  }

  async function startTalk() {
    const ids = targets();
    if (!ids.length) {
      hint("No other radios on yet. They appear when someone opens this page signed in.");
      return;
    }
    talking = true;
    document.getElementById("radioTalk") && document.getElementById("radioTalk").classList.add("is-hot");
    hint(selected === "all" ? "You are on ALL radios." : "You are talking private.");
    beat(selected === "all" ? "all" : selected);
    if (store() && store().flush) store().flush();
    for (let i = 0; i < ids.length; i += 1) {
      try {
        await attachTracks(ids[i]);
        setSend(ids[i], true);
      } catch (err) {
        hint("Could not reach that phone. Same Wi-Fi works best.");
      }
    }
  }

  function stopTalk() {
    if (!talking) return;
    talking = false;
    document.getElementById("radioTalk") && document.getElementById("radioTalk").classList.remove("is-hot");
    Object.keys(peers).forEach((id) => setSend(id, false));
    beat("");
    hint("Released. Hold to talk again. Headset or phone mic both work.");
  }

  async function pressTalk(e) {
    if (e) e.preventDefault();
    if (talking) return;
    if (!myId()) {
      hint("Sign in with name and phone first.");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      hint("This phone browser cannot open the mic.");
      return;
    }
    try {
      await localStream();
      unlockOut();
      micReady = true;
      await startTalk();
    } catch (err) {
      hint("Allow the microphone, then hold Talk. A headset is optional.");
    }
  }

  function bindTalk() {
    const btn = document.getElementById("radioTalk");
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = "1";
    let held = false;
    const down = function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      if (held) return;
      held = true;
      pressTalk(e);
    };
    const up = function () {
      if (!held) return;
      held = false;
      stopTalk();
    };
    btn.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    btn.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
    window.addEventListener("keydown", function (e) {
      if (e.code !== "Space" || e.repeat) return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      if (!held) {
        held = true;
        pressTalk(e);
      }
    });
    window.addEventListener("keyup", function (e) {
      if (e.code !== "Space") return;
      if (!held) return;
      held = false;
      stopTalk();
    });
  }

  function attach() {
    const desk = document.getElementById("radioDesk");
    if (!desk) return;
    if (global.GGSRadioFeed && global.GGSRadioFeed.setChannelSource) {
      global.GGSRadioFeed.setChannelSource(channelToken);
    }
    if (store() && store().setPoll) store().setPoll(1200);
    if (!attached) {
      attached = true;
      try {
        bc = new BroadcastChannel("ggs-radio-signal");
        bc.onmessage = function (e) {
          const msg = e.data || {};
          if (msg.to === myId()) handleSignal(msg.from, msg);
        };
      } catch (err) {
        bc = null;
      }
      bindTalk();
      desk.addEventListener("pointerdown", unlockOut);
      window.addEventListener("ggs-radio-sent", function () {
        if (selected !== "all") markRead(pair(myId(), selected));
        paintPeople();
      });
      window.addEventListener("ggs-prep-loaded", function () {
        scanSignals();
        paintPeople();
        const feed = document.getElementById("radioFeed");
        if (feed && global.GGSRadioFeed) global.GGSRadioFeed.render(feed);
      });
      window.addEventListener("ggs-signed-in", function () {
        beat("");
        paintPeople();
      });
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") beat(talking ? (selected === "all" ? "all" : selected) : "");
        else if (!talking) leave();
      });
      global.addEventListener("pagehide", leave);
      heartTimer = setInterval(function () {
        if (document.visibilityState === "visible") beat(talking ? (selected === "all" ? "all" : selected) : "");
      }, 6000);
    }
    beat("");
    paintPeople();
    scanSignals();
    hint("Join Woody's Wi-Fi first. Then tap Talk once to open the mic. Hold to talk.");
  }

  global.GGSRadioNight = { attach, pick };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach);
  else attach();
})(window);
