(function () {
  function load(src) {
    return new Promise(function (ok, bad) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = bad;
      document.head.appendChild(s);
    });
  }

  async function download(el, name) {
    if (!window.html2canvas) {
      await load("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
    }
    var canvas = await html2canvas(el, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: "#000066",
      logging: false,
    });
    var a = document.createElement("a");
    a.download = name + ".jpg";
    a.href = canvas.toDataURL("image/jpeg", 0.96);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-download-jpg]");
    if (!b) return;
    var sel = b.getAttribute("data-download-jpg");
    var nodes = document.querySelectorAll(sel);
    if (!nodes.length) return;
    var base = b.getAttribute("data-filename") || "grassroots-guitar-strings-sign";
    b.disabled = true;
    var old = b.textContent;
    b.textContent = "BUILDING JPG…";
    (async function () {
      for (var i = 0; i < nodes.length; i += 1) {
        var name = nodes.length === 1 ? base : base + "-" + (i + 1);
        await download(nodes[i], name);
      }
    })()
      .catch(function () {
        alert("JPG download could not be created. Try Print / Save as PDF instead.");
      })
      .finally(function () {
        b.disabled = false;
        b.textContent = old;
      });
  });
})();
