(function () {
  const art =
    '<div class="sign-art" aria-hidden="true">' +
    '<svg class="sign-strings" viewBox="0 0 200 36" preserveAspectRatio="none">' +
    '<path d="M0 6 H200"/><path d="M0 12 H200"/><path d="M0 18 H200"/>' +
    '<path d="M0 24 H200"/><path d="M0 30 H200"/>' +
    "</svg>" +
    '<svg class="sign-guitar" viewBox="0 0 80 140">' +
    '<ellipse cx="40" cy="98" rx="28" ry="32"/>' +
    '<ellipse cx="40" cy="70" rx="20" ry="20"/>' +
    '<rect x="36" y="8" width="8" height="54" rx="2"/>' +
    '<rect x="28" y="6" width="24" height="8" rx="2"/>' +
    '<circle cx="40" cy="70" r="7"/>' +
    "</svg>" +
    '<p class="sign-presents">KELLY GRAPPE PRESENTS</p>' +
    "</div>";

  document.querySelectorAll("article.sign").forEach(function (el) {
    if (el.querySelector(".sign-art")) return;
    el.insertAdjacentHTML("afterbegin", art);
  });
})();
