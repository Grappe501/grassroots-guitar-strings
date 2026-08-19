/**
 * Single source of truth for event facts, links, branding, and video assignments.
 */
const EVENT_CONFIG = {
  name: "Grassroots & Guitar Strings",
  subtitle: "David Adam Byrnes Live in Sherwood",
  tagline: "Live country. Hometown night.",
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
  brandLogo: "/assets/brand/dab-logo-wide.png",
  brandLogoAlt: "David Adam Byrnes",
  ogImage: "/assets/images/live/live-01.jpg",
};

/** Official YouTube IDs from David Adam Byrnes official channel */
const MUSIC_VIDEOS = [
  {
    youtubeId: "ySVq3eCKygg",
    title: "Keep Up with a Cowgirl",
    subtitle: "Official music video",
  },
  {
    youtubeId: "bM4G0ERNpzo",
    title: "She Don't",
    subtitle: "Official music video",
  },
  {
    youtubeId: "krLeI9ivyO0",
    title: "Last Cowboy Standing",
    subtitle: "Official release",
  },
];

const EVENT_VIDEOS = {
  home: {
    src: "/assets/video/promo-wide.mov",
    poster: "/assets/images/live/live-01.jpg",
    title: "David Adam Byrnes — Grassroots & Guitar Strings promo",
    autoplay: true,
    muted: true,
  },
  david: {
    src: "/assets/video/promo-square.mov",
    poster: "/assets/images/live/live-05.jpg",
    title: "David Adam Byrnes promo",
  },
  celebration: {
    youtubeId: "ySVq3eCKygg",
    title: "Keep Up with a Cowgirl — David Adam Byrnes",
  },
  music: {
    youtubeId: "ySVq3eCKygg",
    title: "Keep Up with a Cowgirl — Official Music Video",
  },
  dinner: {
    youtubeId: "bM4G0ERNpzo",
    title: "She Don't — David Adam Byrnes",
  },
  tickets: {
    src: "/assets/video/promo-vertical.mov",
    poster: "/assets/images/live/live-03.jpg",
    title: "David Adam Byrnes — Sherwood, September 17",
  },
  tables: {
    youtubeId: "krLeI9ivyO0",
    title: "Last Cowboy Standing — David Adam Byrnes",
  },
  bringPeople: {
    youtubeId: "ySVq3eCKygg",
    title: "Share the show — Keep Up with a Cowgirl",
  },
  volunteer: {
    youtubeId: "bM4G0ERNpzo",
    title: "David Adam Byrnes — She Don't",
  },
  details: {
    youtubeId: "krLeI9ivyO0",
    title: "Last Cowboy Standing — David Adam Byrnes",
  },
  supportFromHome: {
    youtubeId: "ySVq3eCKygg",
    title: "David Adam Byrnes — Keep Up with a Cowgirl",
  },
};

const LIVE_PHOTOS = [
  { src: "/assets/images/live/live-01.jpg", alt: "David Adam Byrnes performing live on stage" },
  { src: "/assets/images/live/live-02.jpg", alt: "David Adam Byrnes live concert energy" },
  { src: "/assets/images/live/live-03.jpg", alt: "David Adam Byrnes on stage with guitar" },
  { src: "/assets/images/live/live-04.jpg", alt: "David Adam Byrnes live show" },
  { src: "/assets/images/live/live-05.jpg", alt: "David Adam Byrnes performing for a crowd" },
  { src: "/assets/images/live/live-06.jpg", alt: "David Adam Byrnes live country performance" },
  { src: "/assets/images/live/live-07.jpg", alt: "David Adam Byrnes on tour" },
  { src: "/assets/images/live/live-19.jpg", alt: "David Adam Byrnes live in concert" },
  { src: "/assets/images/live/live-20.jpg", alt: "David Adam Byrnes stage performance" },
  { src: "/assets/images/live/live-21.jpg", alt: "David Adam Byrnes live show moment" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/david/", label: "The Artist" },
  { href: "/music/", label: "Music & Videos" },
  { href: "/tickets/", label: "Tickets" },
  { href: "/celebration/", label: "The Evening" },
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
  window.MUSIC_VIDEOS = MUSIC_VIDEOS;
  window.LIVE_PHOTOS = LIVE_PHOTOS;
  window.NAV_LINKS = NAV_LINKS;
  window.JOIN_LINKS = JOIN_LINKS;
}
