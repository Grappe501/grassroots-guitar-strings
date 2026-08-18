(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slot = document.querySelector("[data-video-slot]");
  if (!slot) return;

  const key = slot.getAttribute("data-video-slot");
  const videos = window.EVENT_VIDEOS || {};
  const entry = videos[key];
  if (!entry || !entry.youtubeId) return;

  const autoplay = Boolean(entry.autoplay) && key === "home" && !reducedMotion;
  const muted = autoplay || Boolean(entry.muted);
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  });
  if (autoplay) {
    params.set("autoplay", "1");
    params.set("mute", "1");
  }

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${entry.youtubeId}?${params.toString()}`;
  iframe.title = entry.title || "David Adam Byrnes music video";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.loading = autoplay ? "eager" : "lazy";

  slot.appendChild(iframe);

  if (autoplay) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "video-unmute";
    btn.textContent = "Turn Up the Music";
    btn.addEventListener("click", () => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "unMute", args: [] }),
        "*",
      );
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
        "*",
      );
      sessionStorage.setItem("ggs-video-sound", "1");
      btn.classList.add("is-hidden");
    });
    if (sessionStorage.getItem("ggs-video-sound") === "1") {
      btn.classList.add("is-hidden");
    }
    slot.appendChild(btn);
  }
})();
