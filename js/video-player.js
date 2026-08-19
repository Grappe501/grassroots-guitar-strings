(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const videos = window.EVENT_VIDEOS || {};

  function mountVideo(slot, entry) {
    if (!entry) return;

    if (entry.src) {
      const video = document.createElement("video");
      video.src = entry.src;
      video.title = entry.title || "David Adam Byrnes";
      video.controls = true;
      video.playsInline = true;
      video.preload = entry.autoplay ? "auto" : "metadata";
      if (entry.poster) video.poster = entry.poster;

      const autoplay = Boolean(entry.autoplay) && !reducedMotion;
      if (autoplay) {
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
      } else if (entry.muted) {
        video.muted = true;
      }

      slot.appendChild(video);

      if (autoplay) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "video-unmute";
        btn.textContent = "Turn Up the Music";
        btn.addEventListener("click", () => {
          video.muted = false;
          video.volume = 1;
          sessionStorage.setItem("ggs-video-sound", "1");
          btn.classList.add("is-hidden");
        });
        if (sessionStorage.getItem("ggs-video-sound") === "1") {
          video.muted = false;
          btn.classList.add("is-hidden");
        }
        slot.appendChild(btn);
      }
      return;
    }

    if (!entry.youtubeId) return;

    const autoplay = Boolean(entry.autoplay) && !reducedMotion;
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
  }

  document.querySelectorAll("[data-video-slot]").forEach((slot) => {
    const key = slot.getAttribute("data-video-slot");
    mountVideo(slot, videos[key]);
  });

  const gallery = document.querySelector("[data-video-gallery]");
  if (gallery && Array.isArray(window.MUSIC_VIDEOS)) {
    window.MUSIC_VIDEOS.forEach((item) => {
      const block = document.createElement("article");
      block.className = "video-gallery__item";
      block.innerHTML = `
        <div class="video-frame" aria-label="${item.title}"></div>
        <h3>${item.title}</h3>
        <p class="muted">${item.subtitle || ""}</p>
      `;
      gallery.appendChild(block);
      mountVideo(block.querySelector(".video-frame"), item);
    });
  }

  const photoGrid = document.querySelector("[data-live-photo-grid]");
  if (photoGrid && Array.isArray(window.LIVE_PHOTOS)) {
    window.LIVE_PHOTOS.forEach((photo) => {
      const figure = document.createElement("figure");
      figure.className = "live-photo";
      figure.innerHTML = `<img src="${photo.src}" alt="${photo.alt}" loading="lazy" />`;
      photoGrid.appendChild(figure);
    });
  }
})();
