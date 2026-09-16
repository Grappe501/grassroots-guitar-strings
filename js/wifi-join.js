(function (global) {
  function esc(x) {
    return String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function xml(x) {
    return String(x ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function wifiEscape(value) {
    return String(value || "").replace(/[\\;,:"']/g, "\\$&");
  }

  function readWifi() {
    const store = global.GGSPrepStore;
    const doc = store ? store.readDoc("wifi") : null;
    if (!doc) return { ssid: "", password: "", security: "WPA" };
    return {
      ssid: String(doc.ssid || "").trim(),
      password: String(doc.password || "").trim(),
      security: String(doc.security || "WPA").trim() || "WPA",
    };
  }

  function saveWifi(ssid, password, security) {
    const store = global.GGSPrepStore;
    if (!store) return;
    store.saveDoc("wifi", {
      v: 1,
      ssid: String(ssid || "").trim(),
      password: String(password || "").trim(),
      security: String(security || "WPA").trim() || "WPA",
      at: new Date().toISOString(),
    });
    if (store.flush) store.flush();
  }

  function wifiUri(cfg) {
    return (
      "WIFI:T:" +
      (cfg.security || "WPA") +
      ";S:" +
      wifiEscape(cfg.ssid) +
      ";P:" +
      wifiEscape(cfg.password) +
      ";H:false;;"
    );
  }

  function uuid() {
    if (global.crypto && crypto.randomUUID) return crypto.randomUUID().toUpperCase();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16).toUpperCase();
    });
  }

  function isApple() {
    const ua = navigator.userAgent || "";
    return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function profileXml(cfg) {
    const id1 = uuid();
    const id2 = uuid();
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
      '<plist version="1.0"><dict>' +
      "<key>PayloadContent</key><array><dict>" +
      "<key>AutoJoin</key><true/>" +
      "<key>EncryptionType</key><string>" +
      xml(cfg.security === "nopass" ? "None" : "WPA") +
      "</string>" +
      "<key>HIDDEN_NETWORK</key><false/>" +
      "<key>Password</key><string>" +
      xml(cfg.password) +
      "</string>" +
      "<key>PayloadDescription</key><string>Woody's venue Wi-Fi for Grassroots crew</string>" +
      "<key>PayloadDisplayName</key><string>Woody's Wi-Fi</string>" +
      "<key>PayloadIdentifier</key><string>com.ggs.wifi.woodys</string>" +
      "<key>PayloadType</key><string>com.apple.wifi.managed</string>" +
      "<key>PayloadUUID</key><string>" +
      id1 +
      "</string>" +
      "<key>PayloadVersion</key><integer>1</integer>" +
      "<key>SSID_STR</key><string>" +
      xml(cfg.ssid) +
      "</string>" +
      "</dict></array>" +
      "<key>PayloadDisplayName</key><string>Woody's Wi-Fi</string>" +
      "<key>PayloadIdentifier</key><string>com.ggs.wifi</string>" +
      "<key>PayloadRemovalDisallowed</key><false/>" +
      "<key>PayloadType</key><string>Configuration</string>" +
      "<key>PayloadUUID</key><string>" +
      id2 +
      "</string>" +
      "<key>PayloadVersion</key><integer>1</integer>" +
      "</dict></plist>"
    );
  }

  function joinNow(cfg) {
    if (!cfg.ssid || !cfg.password) return;
    if (isApple()) {
      const xmlText = profileXml(cfg);
      const href = "data:application/x-apple-aspen-config;base64," + btoa(unescape(encodeURIComponent(xmlText)));
      location.href = href;
      return;
    }
    location.href = wifiUri(cfg);
  }

  function copyText(text, btn) {
    const done = function () {
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(function () {
        btn.textContent = old;
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {});
    }
  }

  function paintJoin() {
    const ready = document.getElementById("wifiReady");
    const missing = document.getElementById("wifiMissing");
    if (!ready || !missing) return;
    const cfg = readWifi();
    const ok = !!(cfg.ssid && cfg.password);
    ready.hidden = !ok;
    missing.hidden = ok;
    const name = document.getElementById("wifiName");
    const pass = document.getElementById("wifiPass");
    if (name) name.textContent = cfg.ssid || "";
    if (pass) pass.textContent = cfg.password || "";
    const ssidIn = document.getElementById("wifiSsid");
    const passIn = document.getElementById("wifiPassword");
    if (ssidIn && document.activeElement !== ssidIn) ssidIn.value = cfg.ssid;
    if (passIn && document.activeElement !== passIn) passIn.value = cfg.password;
    const banner = document.getElementById("wifiBanner");
    if (banner) {
      banner.hidden = !ok;
      banner.href = "/wifi/";
    }
  }

  function bindPage() {
    const join = document.getElementById("wifiJoin");
    if (join) {
      join.addEventListener("click", function (e) {
        e.preventDefault();
        joinNow(readWifi());
      });
    }
    const save = document.getElementById("wifiSave");
    if (save) {
      save.addEventListener("click", function () {
        const ssid = document.getElementById("wifiSsid");
        const password = document.getElementById("wifiPassword");
        saveWifi(ssid ? ssid.value : "", password ? password.value : "", "WPA");
        paintJoin();
      });
    }
    const copyName = document.getElementById("wifiCopyName");
    const copyPass = document.getElementById("wifiCopyPass");
    if (copyName) {
      copyName.addEventListener("click", function () {
        copyText(readWifi().ssid, copyName);
      });
    }
    if (copyPass) {
      copyPass.addEventListener("click", function () {
        copyText(readWifi().password, copyPass);
      });
    }
    if (isApple()) {
      const hint = document.getElementById("wifiJoinHint");
      if (hint) hint.textContent = "iPhone: tap Join, then Install. Allow the profile. The phone joins Woody's Wi-Fi.";
      if (join) join.textContent = "Join Woody's Wi-Fi";
    }
    paintJoin();
  }

  function mountBanner() {
    if (document.getElementById("wifiBanner")) return;
    const cfg = readWifi();
    const a = document.createElement("a");
    a.id = "wifiBanner";
    a.className = "wifi-banner";
    a.href = "/wifi/";
    a.textContent = cfg.ssid && cfg.password ? "Join Woody's Wi-Fi — tap to connect" : "Get Woody's Wi-Fi — enter it so crew can tap to join";
    a.hidden = false;
    const host = document.querySelector(".v5-top, .topbar, .me-top, .wrap");
    if (host && host.parentNode) host.parentNode.insertBefore(a, host.nextSibling);
    else document.body.insertBefore(a, document.body.firstChild);
  }

  function joinFromGate() {
    const cfg = readWifi();
    if (cfg.ssid && cfg.password) {
      joinNow(cfg);
      return true;
    }
    location.href = "/wifi/";
    return false;
  }

  global.GGSWifi = { readWifi, saveWifi, joinNow, joinFromGate, paintJoin, wifiUri };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.getElementById("wifiPage")) bindPage();
      else mountBanner();
    });
  } else if (document.getElementById("wifiPage")) bindPage();
  else mountBanner();
  global.addEventListener("ggs-prep-loaded", function () {
    if (document.getElementById("wifiPage")) paintJoin();
    const banner = document.getElementById("wifiBanner");
    if (banner) {
      const cfg = readWifi();
      banner.textContent = cfg.ssid && cfg.password ? "Join Woody's Wi-Fi — tap to connect" : "Get Woody's Wi-Fi — enter it so crew can tap to join";
    }
  });
})(window);
