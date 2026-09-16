(function () {
  const root = document.getElementById("tagSheets");
  if (!root) return;

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  const listed = ((window.GGSPeople && window.GGSPeople.PEOPLE) || []).map(function (person) {
    return String(person.first || person.name || "")
      .trim()
      .split(/\s+/)[0];
  }).filter(Boolean);

  const PER_PAGE = 9;
  const extras = (PER_PAGE - (listed.length % PER_PAGE)) % PER_PAGE;
  const names = listed.concat(Array.from({ length: extras }, function () {
    return "";
  }));

  function badge(first) {
    const blank = !first;
    return (
      '<article class="badge' +
      (blank ? " is-blank" : "") +
      '"><p class="badge-kicker">KELLY GRAPPE</p><p class="badge-show">GRASSROOTS<br>&amp; GUITAR STRINGS</p><hr class="badge-rule"><p class="badge-first">' +
      esc(first) +
      '</p><p class="badge-foot">SEP 17 · SHERWOOD</p></article>'
    );
  }

  const pages = [];
  for (let i = 0; i < names.length; i += PER_PAGE) {
    pages.push(names.slice(i, i + PER_PAGE));
  }

  root.innerHTML = pages
    .map(function (page) {
      return '<section class="badge-sheet">' + page.map(badge).join("") + "</section>";
    })
    .join("");
})();
