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

  function youtubeWatchUrl(id) {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  function appendReleaseBlock(root, item, className) {
    if (!item?.youtubeId) return;
    const block = document.createElement("article");
    block.className = className;
    const watchUrl = youtubeWatchUrl(item.youtubeId);
    block.innerHTML = `
      <div class="video-frame" aria-label="${item.title}"></div>
      <h3><a href="${watchUrl}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
      <p class="muted">${item.subtitle || ""}</p>
      <p><a href="${watchUrl}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
    `;
    root.appendChild(block);
    mountVideo(block.querySelector(".video-frame"), item);
  }

  document.querySelectorAll("[data-video-slot]").forEach((slot) => {
    const key = slot.getAttribute("data-video-slot");
    mountVideo(slot, videos[key]);
  });

  const gallery = document.querySelector("[data-video-gallery]");
  if (gallery && Array.isArray(window.MUSIC_VIDEOS)) {
    window.MUSIC_VIDEOS.forEach((item) => {
      appendReleaseBlock(gallery, item, "video-gallery__item");
    });
  }

  const releases = document.querySelector("[data-recent-releases]");
  if (releases && Array.isArray(window.RECENT_RELEASES)) {
    window.RECENT_RELEASES.forEach((item) => {
      appendReleaseBlock(releases, item, "release-video");
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
