/**
 * Single source of truth for event facts, links, and video assignments.
 * Update here — not in every HTML file.
 */
const EVENT_CONFIG = {
  name: "Grassroots & Guitar Strings",
  subtitle: "A Sherwood Homecoming",
  tagline: "From Bear Country to the Capitol",
  date: "Thursday, September 17, 2026",
  dateShort: "Sep 17, 2026",
  time: "5:30 p.m.",
  timezone: "Central",
  venueName: "Sherwood Forest",
  address: "Sherwood, Arkansas",
  addressFull: "Sherwood Forest, Sherwood, AR",
  city: "Sherwood",
  state: "Arkansas",
  ticketUrl: "https://goodchange.app/donate/grass-ax",
  kellyUrl: "https://kellygrappe.com",
  davidUrl: "https://www.davidadambyrnes.com",
  contactEmail: "",
  contactPhone: "",
  featuredArtist: "David Adam Byrnes",
  candidate: "Kelly Grappe",
  office: "Arkansas Secretary of State",
  disclaimer: "Paid for by The Committee to Elect Kelly Grappe",
  constitutionNote:
    "September 17 is Constitution Day — the anniversary of the signing of the U.S. Constitution in 1787.",
  campaignEventUrl:
    "https://kgrappe.netlify.app/events/grassroots-guitar-strings-sherwood-2026-09-17",
  publicSiteUrl: "https://grassrootsguitarstrings.netlify.app",
};

/**
 * Official YouTube IDs — confirm with David's team before launch.
 * home: newest approved full official release (placeholder: Keep Up with a Cowgirl)
 */
const EVENT_VIDEOS = {
  home: {
    youtubeId: "ySVq3eCKygg",
    title: "Keep Up with a Cowgirl — David Adam Byrnes (Official Music Video)",
    autoplay: true,
    muted: true,
  },
  kellyAndDavid: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes — Keep Up with a Cowgirl",
  },
  celebration: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes — celebration",
  },
  music: {
    youtubeId: "ySVq3eCKygg",
    title: "Keep Up with a Cowgirl — Official Music Video",
  },
  dinner: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes",
  },
  tickets: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes — live energy",
  },
  tables: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes",
  },
  bringPeople: {
    youtubeId: "ySVq3eCKygg",
    title: "Share this song with your invitation",
  },
  volunteer: {
    youtubeId: "",
    title: "",
  },
  details: {
    youtubeId: "",
    title: "",
  },
  supportFromHome: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes",
  },
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/kelly-and-david/", label: "Kelly & David" },
  { href: "/celebration/", label: "The Celebration" },
  { href: "/music/", label: "Music" },
  { href: "/dinner/", label: "Dinner" },
  { href: "/details/", label: "Event Details" },
];

const JOIN_LINKS = [
  { href: "/tickets/", label: "Attend" },
  { href: "/host-a-table/", label: "Host a Table" },
  { href: "/bring-your-people/", label: "Bring Your People" },
  { href: "/volunteer/", label: "Volunteer" },
  { href: "/support-from-home/", label: "Support From Home" },
];

if (typeof window !== "undefined") {
  window.EVENT_CONFIG = EVENT_CONFIG;
  window.EVENT_VIDEOS = EVENT_VIDEOS;
  window.NAV_LINKS = NAV_LINKS;
  window.JOIN_LINKS = JOIN_LINKS;
}
