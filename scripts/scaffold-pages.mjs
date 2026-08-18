/**
 * Generates inner pages from PAGE_CONTENT. Run: node scripts/scaffold-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const PAGE_CONTENT = [
  {
    dir: "kelly-and-david",
    title: "Kelly & David | Grassroots & Guitar Strings",
    eyebrow: "Different roads. Common ground.",
    h1: "Their roads have crossed before",
    video: "kellyAndDavid",
    body: `
      <p>Kelly Grappe and David Adam Byrnes share more than Arkansas roots. Music, family farms, hometown festivals, and years of friendship came long before this campaign moment.</p>
      <h2>Music at Forevermost Farms</h2>
      <p>David played the Grappe family farm festival during two separate summers. Kelly and Steve have supported his career throughout their marriage — watching him play, sharing his songs, and welcoming neighbors around the same Arkansas evenings.</p>
      <div class="photo-rail">
        <article class="photo-card"><div class="photo-card__img"><img src="/assets/images/shared-history/farm-festival-one/01.jpg" alt="David Adam Byrnes performing at Forevermost Farms — photo 1" onerror="this.parentElement.textContent='Farm festival photo — coming soon'"></div><div class="photo-card__body"><h3>The first farm festival</h3><p class="muted">Caption and year — Steve to supply.</p></div></article>
        <article class="photo-card"><div class="photo-card__img"><img src="/assets/images/shared-history/farm-festival-two/01.jpg" alt="David Adam Byrnes performing at Forevermost Farms — second summer" onerror="this.parentElement.textContent='Second summer photo — coming soon'"></div><div class="photo-card__body"><h3>He came back</h3><p class="muted">A friendship that continued — not a one-time booking.</p></div></article>
        <article class="photo-card"><div class="photo-card__img"><img src="/assets/images/shared-history/rose-bud-festival/01.jpg" alt="David Adam Byrnes at Rose Bud hometown festival" onerror="this.parentElement.textContent='Rose Bud festival photo — coming soon'"></div><div class="photo-card__body"><h3>Rose Bud heard the music</h3><p class="muted">Rose Bud is home — where Kelly and Steve built Forevermost Farms and family life.</p></div></article>
        <article class="photo-card"><div class="photo-card__img"><img src="/assets/images/shared-history/kelly-and-david/01.jpg" alt="Kelly, Steve, and David through the years" onerror="this.parentElement.textContent='Kelly and David photo — coming soon'"></div><div class="photo-card__body"><h3>Engaged after a Sherwood show</h3><p class="muted">Kelly and Steve got engaged after a David Adam Byrnes show in Sherwood.</p></div></article>
      </div>
      <h2>Together again — September 17</h2>
      <p>David's road carried his music across the country. Kelly's road carried her into communities across Arkansas. This September, both roads lead home for Grassroots &amp; Guitar Strings at Sherwood Forest — Constitution Day.</p>
    `,
    cta: { label: "Join Kelly and David", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "celebration",
    title: "The Celebration | Grassroots & Guitar Strings",
    eyebrow: "Why this night",
    h1: "A celebration of democracy — not a debate",
    video: "celebration",
    body: `
      <h2>Kelly is coming home</h2>
      <p>Kelly grew from an Arkansas daughter, wife, mother, grandmother, farmer, and civic educator into a candidate for Secretary of State. She is returning to Sherwood before the final six-week statewide tour — not to argue, but to gather.</p>
      <h2>Why September 17 matters</h2>
      <p>September 17 is Constitution Day — the anniversary of the signing of the United States Constitution in 1787. Democracy does not belong to a party. It belongs to people willing to protect it, participate in it, and pass it forward.</p>
      <h2>What this evening is — and is not</h2>
      <ul class="clean"><li>Live music, dinner, family, friendship</li><li>Voter registration and community</li><li>A campaign homecoming</li></ul>
      <p class="muted">This evening is <strong>not</strong> a political debate, partisan confrontation, or a room where everyone must agree.</p>
    `,
    cta: { label: "Join the Celebration", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "music",
    title: "Music | Grassroots & Guitar Strings",
    eyebrow: "David Adam Byrnes",
    h1: "The sound of the evening",
    video: "music",
    body: `
      <p>David Adam Byrnes combines modern country energy with storytelling rooted in love, perseverance, and staying grounded — the same values this hometown night is built around.</p>
      <p>He has played Forevermost Farms, Rose Bud, and stages across the country. <a href="https://www.davidadambyrnes.com" target="_blank" rel="noopener noreferrer">Visit DavidAdamByrnes.com</a> for music, tour dates, and official videos.</p>
      <p class="muted">Performance selections and appearance details subject to change. Confirm with official channels.</p>
    `,
    cta: { label: "See David Live in Sherwood", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "dinner",
    title: "Dinner & Fellowship | Grassroots & Guitar Strings",
    eyebrow: "Break bread together",
    h1: "Dinner around the table",
    video: "dinner",
    body: `
      <p>Before there were campaign events, there were church suppers, family reunions, and folding tables filled with people who did not agree about everything — but still belonged to one another.</p>
      <p>Kelly's brother and friends will prepare a hometown meal meant to be shared. Details on menu, dietary options, children's meals, and serving times will be posted as the host confirms.</p>
    `,
    cta: { label: "Reserve Dinner and a Seat", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "tickets",
    title: "Tickets | Grassroots & Guitar Strings",
    eyebrow: "Secure your place",
    h1: "Tickets & contributions",
    video: "tickets",
    body: `
      <p>All ticket purchases and table support are campaign contributions processed securely through GoodChange. The event website does not collect payment information.</p>
      <h2>General admission</h2>
      <p>Includes entry, live music, dinner, celebration program, and access to voter-registration resources. <strong>Amount TBD — treasurer approval.</strong></p>
      <h2>Cannot attend?</h2>
      <p>You can still contribute to help send Kelly into the final six weeks strong.</p>
      <div class="compliance-note">Ticket purchases and sponsorships are campaign contributions to The Committee to Elect Kelly Grappe. Contributions must be made by permissible contributors and are subject to Arkansas campaign-finance limits and reporting requirements. <strong>Business and corporate contributions cannot be accepted.</strong></div>
    `,
    cta: { label: "Continue to Secure Ticketing", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "host-a-table",
    title: "Host a Table | Grassroots & Guitar Strings",
    eyebrow: "Bring your people together",
    h1: "Host a table",
    video: "tables",
    body: `
      <p>Hosting a table is not about buying access. It is about making sure the people in your life have a place in the room.</p>
      <h2>Individual contributions only</h2>
      <p>Table support must come from permissible <strong>individual</strong> contributors. Business, corporate, or organizational funds cannot be accepted under Arkansas law.</p>
      <h2>Table options (names — amounts TBD)</h2>
      <ul class="clean"><li>Gathering Table</li><li>Community Table</li><li>Homecoming Table</li><li>Democracy Table</li></ul>
      <p class="muted">Seats per table, guest-name deadlines, and contribution amounts require treasurer approval before publication.</p>
    `,
    cta: { label: "Host a Table", href: "https://goodchange.app/donate/grass-ax", track: "table_button_clicked" },
  },
  {
    dir: "bring-your-people",
    title: "Bring Your People | Grassroots & Guitar Strings",
    eyebrow: "The best invitation is personal",
    h1: "Bring your people",
    video: "bringPeople",
    body: `
      <p>The best invitation will not come from an advertisement. It will come from someone people already trust.</p>
      <ul class="clean"><li>Invite five friends, relatives, or neighbors</li><li>Fill a table for people who would enjoy dinner and music</li><li>Bring a first-time voter</li><li>Bring someone who has given up on politics — to welcome, not argue</li><li>Share David's music video with your invitation</li></ul>
      <h2>Sample text message</h2>
      <div class="copy-block">Come sit with us in Sherwood on Sep 17 — live music with David Adam Byrnes, dinner, and a hometown night with Kelly Grappe. Not a debate — just community. Tickets: goodchange.app/donate/grass-ax</div>
    `,
    cta: { label: "Get My Invitation Kit", href: "/tickets/" },
  },
  {
    dir: "volunteer",
    title: "Volunteer | Grassroots & Guitar Strings",
    eyebrow: "Homecoming team",
    h1: "Volunteer that evening",
    video: "volunteer",
    body: `
      <p>Event-night roles may include welcome team, check-in, seating, dinner support, voter-registration table, parking, accessibility assistance, and guest hospitality.</p>
      <p>Each role will list arrival time and time commitment when the volunteer lead confirms the run-of-show.</p>
      <p>You can also join the statewide field team at <a href="https://kellygrappe.com/volunteer">kellygrappe.com/volunteer</a>.</p>
    `,
    cta: { label: "Join the Homecoming Team", href: "https://kellygrappe.com/volunteer" },
  },
  {
    dir: "vote",
    title: "Register & Vote | Grassroots & Guitar Strings",
    eyebrow: "Your voice",
    h1: "Register and make a plan",
    body: `
      <p>This evening includes voter-registration support — because democracy works when ordinary people participate.</p>
      <ul class="clean">
        <li><a href="https://kellygrappe.com/voter-registration" target="_blank" rel="noopener noreferrer">Check registration — Kelly Grappe voter hub</a></li>
        <li><a href="https://www.voterview.ar-nova.org/voterview" target="_blank" rel="noopener noreferrer">Arkansas VoterView (official)</a></li>
      </ul>
      <p class="muted">Election rules and dates can change — always confirm with official Arkansas sources.</p>
    `,
    cta: { label: "Make My Voting Plan", href: "https://kellygrappe.com/voter-registration" },
  },
  {
    dir: "details",
    title: "Event Details | Grassroots & Guitar Strings",
    eyebrow: "Practical info",
    h1: "When & where",
    body: `
      <ul class="clean">
        <li><strong>Date:</strong> Thursday, September 17, 2026 (Constitution Day)</li>
        <li><strong>Time:</strong> 5:30 p.m. Central (confirm with host)</li>
        <li><strong>Venue:</strong> Sherwood Forest, Sherwood, Arkansas</li>
        <li><strong>Full address:</strong> TBD</li>
      </ul>
      <p class="muted">Doors, dinner service, performance times, parking, accessibility, dress, and refund policies will be posted when confirmed.</p>
      <p><a href="https://kgrappe.netlify.app/events/grassroots-guitar-strings-sherwood-2026-09-17">Campaign calendar listing</a></p>
    `,
    cta: { label: "Reserve My Tickets", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "support-from-home",
    title: "Support From Home | Grassroots & Guitar Strings",
    eyebrow: "Not in the room?",
    h1: "Support from home",
    video: "supportFromHome",
    body: `
      <p>You do not have to be in Sherwood to help send Kelly into the final six weeks strong.</p>
      <ul class="clean"><li>Purchase a ticket for someone else</li><li>Help seat a student or first-time voter</li><li>Make an individual contribution</li><li>Share the event with your network</li></ul>
    `,
    cta: { label: "Support the Homecoming", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "contribution-information",
    title: "Contribution Information",
    eyebrow: "Legal",
    h1: "Contribution information",
    body: `
      <p>All ticket purchases and table contributions are campaign contributions to The Committee to Elect Kelly Grappe, processed through GoodChange.</p>
      <p>Contributions must be made by permissible contributors under Arkansas law. <strong>Business and corporate contributions cannot be accepted.</strong></p>
      <p>Complete certifications (name, address, employer, occupation) are collected at checkout on GoodChange.</p>
    `,
    cta: { label: "Go to GoodChange", href: "https://goodchange.app/donate/grass-ax", track: "ticket_button_clicked" },
  },
  {
    dir: "privacy",
    title: "Privacy",
    eyebrow: "Legal",
    h1: "Privacy",
    body: `<p>This event site uses minimal analytics when enabled. Payment data is handled only by GoodChange. Contact the campaign with privacy questions.</p>`,
  },
  {
    dir: "accessibility",
    title: "Accessibility",
    eyebrow: "Legal",
    h1: "Accessibility",
    body: `<p>We are committed to an accessible experience. Contact the campaign for accommodation requests for the September 17 event.</p>`,
  },
];

function pageHtml(p) {
  const videoBlock = p.video
    ? `<div class="video-frame" data-video-slot="${p.video}" aria-label="David Adam Byrnes music video"></div>`
    : "";
  const track = p.cta?.track ? ` data-track="${p.cta.track}"` : "";
  const ctaBlock = p.cta
    ? `<div class="cta-band"><a class="btn btn--primary" href="${p.cta.href}"${track}>${p.cta.label}</a></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${p.title}</title>
<link rel="stylesheet" href="/css/components.css"/>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div id="site-header"></div>
<main id="main">
<section class="page-hero"><div class="container">
<p class="eyebrow">${p.eyebrow}</p>
<h1>${p.h1}</h1>
</div></section>
<section class="section"><div class="container prose">
${videoBlock}
${p.body}
${ctaBlock}
</div></section>
</main>
<div id="site-footer"></div>
<script src="/js/event-config.js"></script>
<script src="/js/site-shell.js"></script>
<script src="/js/video-player.js"></script>
</body>
</html>`;
}

for (const p of PAGE_CONTENT) {
  const dir = path.join(root, p.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(p), "utf8");
  console.log("wrote", p.dir);
}

// Asset dirs for photos
const assetDirs = [
  "assets/images/shared-history/farm-festival-one",
  "assets/images/shared-history/farm-festival-two",
  "assets/images/shared-history/rose-bud-festival",
  "assets/images/shared-history/kelly-and-david",
  "assets/images/kelly/hometown",
  "assets/images/david/approved-promotional",
];
for (const d of assetDirs) {
  fs.mkdirSync(path.join(root, d), { recursive: true });
}

console.log("done");
