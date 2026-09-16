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
    "Julia Taylor",
    "Paul Egan",
    "Kate Stebbins",
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

  const JOB_ROLE = {
    event: "captain",
    setup: "setup",
    tickets: "tickets",
    food: "food",
    campaign: "campaign",
    production: "production",
    relief: "floater",
    relief2: "floater",
    kelly: "greeter",
    photo: "photo",
    strike: "strike",
  };

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
    const claimed = global.GGSLeadDuties && global.GGSLeadDuties.jobFor(name);
    const fromJob = claimed ? JOB_ROLE[claimed.id] : "";
    if (fromJob && slice && !ids[fromJob]) {
      const role = slice.ROLES.find((item) => item.id === fromJob);
      if (role) have.push(role);
    }
    return have.sort((a, b) => a.priority - b.priority);
  }

  function isCaptain(roles) {
    return (roles || []).some((role) => role.id === "captain" || role.id === "production" || role.id === "food" || role.id === "tickets" || role.id === "strike");
  }

  global.GGSSiteLeads = { SITE_LEADS, isLead, aliasRoleIds, rolesFor, isCaptain, match };
})(window);
