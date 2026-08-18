# Grassroots & Guitar Strings — event microsite

Dedicated static site for the Sherwood homecoming celebration (Kelly Grappe + David Adam Byrnes).

- **Tickets / contributions:** [GoodChange — grass-ax](https://goodchange.app/donate/grass-ax)
- **Campaign:** [kellygrappe.com](https://kellygrappe.com)
- **Artist:** [davidadambyrnes.com](https://www.davidadambyrnes.com)

## Local preview

Open `index.html` in a browser, or:

```bash
npx --yes serve .
```

## Deploy (recommended)

Separate Netlify site (not the RedDirt admin build):

- Publish directory: `.` (repo root)
- Suggested URL: `grassrootsguitarstrings.com` or `event.kellygrappe.com`

After deploy, set `NEXT_PUBLIC_GRASSROOTS_EVENT_SITE_URL` on the Kelly Netlify site so the campaign event page banner points here.

## Photos

Copy approved images from:

`RedDirt/public/media/campaign-photos/grassroot and guitars/`

into:

`assets/images/shared-history/` (see `docs/IMAGE_ASSET_REGISTER.json`)

## Docs

- [MASTER_BUILD_PLAN.md](./docs/MASTER_BUILD_PLAN.md)
- [EVENT_FACT_SHEET.md](./docs/EVENT_FACT_SHEET.md)
- [KELLY_DAVID_SHARED_HISTORY.md](./docs/KELLY_DAVID_SHARED_HISTORY.md)
