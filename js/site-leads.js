(function (global) {
  const SITE_LEADS = [
    "Steve Grappe",
    "Carol Egan",
    "Jay Powell",
    "Christy Low",
    "John Duke",
    "Mark London",
    "Kelly Grappe",
    "Kristal Kuykendall",
    "Ben Hurst",
    "Sarah Hurst",
    "Chance Bradford",
    "Leeann Solice",
    "Debi Martin",
  ];

  const NAME_ROLES = [
    { who: /^ben\b|hurst/i, id: "food" },
    { who: /tracy/i, id: "production" },
    { who: /kelly/i, id: "candidate" },
    { who: /debi|martin/i, id: "campaign" },
  ];

  function match(name, other) {
    if (global.GGSCrewSlice) return global.GGSCrewSlice.nameMatch(name, other) || global.GGSCrewSlice.nameMatch(other, name);
    const a = String(name || "").trim().toLowerCase();
    const b = String(other || "").trim().toLowerCase();
    return !!a && !!b && (a === b || a.indexOf(b) === 0 || b.indexOf(a) === 0);
  }

  function isLead(name) {
    const n = String(name || "").trim();
    if (!n) return false;
    if (match(n, "Kelly Grappe")) return false;
    return SITE_LEADS.some((lead) => match(n, lead));
  }

  function aliasRoleIds(name) {
    const n = String(name || "").trim();
    return NAME_ROLES.filter((row) => row.who.test(n)).map((row) => row.id);
  }

  function rolesFor(name, pack) {
    const slice = global.GGSCrewSlice;
    const have = (pack && pack.roles ? pack.roles.slice() : []) || [];
    const ids = {};
    have.forEach((role) => {
      ids[role.id] = true;
    });
    aliasRoleIds(name).forEach((id) => {
      if (ids[id] || !slice) return;
      const role = slice.ROLES.find((item) => item.id === id);
      if (role) {
        have.push(role);
        ids[id] = true;
      }
    });
    return have.sort((a, b) => a.priority - b.priority);
  }

  function isCaptain(roles) {
    return (roles || []).some((role) => role.id === "captain" || role.id === "production" || role.id === "food" || role.id === "tickets" || role.id === "strike");
  }

  global.GGSSiteLeads = { SITE_LEADS, isLead, aliasRoleIds, rolesFor, isCaptain, match };
})(window);
