(function () {
  const root = document.getElementById("tagSheets");
  if (!root) return;

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // Use the exact same live roster as the crew dropdown. GGSPeople.names()
  // already excludes retired people, so the printable badges cannot drift from it.
  const listed =
    window.GGSPeople && typeof window.GGSPeople.names === "function"
      ? window.GGSPeople.names().slice()
      : ((window.GGSPeople && window.GGSPeople.PEOPLE) || [])
          .filter(function (person) {
            return !person.retired;
          })
          .map(function (person) {
            return String(person.name || "").trim();
          })
          .filter(Boolean);

  listed.sort(function (a, b) {
    return a.localeCompare(b);
  });

  const PER_PAGE = 9;
  const extras = (PER_PAGE - (listed.length % PER_PAGE)) % PER_PAGE;
  const names = listed.concat(
    Array.from({ length: extras }, function () {
      return "";
    })
  );

  function badge(name) {
    const blank = !name;
    return (
      '<article class="badge' +
      (blank ? " is-blank" : "") +
      '"><p class="badge-kicker">KELLY GRAPPE</p><p class="badge-show">GRASSROOTS<br>&amp; GUITAR STRINGS</p><hr class="badge-rule"><p class="badge-first">' +
      esc(name) +
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
