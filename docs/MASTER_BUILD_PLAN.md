# Grassroots & Guitar Strings — Full Website Master Build Plan

**Status:** Phases 1–4 built (static shell, home, all drill-down routes, Kelly & David story, GoodChange handoff). Phase 5 in progress (15 campaign photos organized; poster placeholder — replace with GoodChange artwork). Phase 0 governance items still open (ticket/table amounts, full address, David video approvals).  
**Lane:** `H:\SOSWebsite\grassroots-guitar-strings\`  
**Campaign listing:** [kgrappe.netlify.app/events/grassroots-guitar-strings-sherwood-2026-09-17](https://kgrappe.netlify.app/events/grassroots-guitar-strings-sherwood-2026-09-17)  
**Tickets:** [goodchange.app/donate/grass-ax](https://goodchange.app/donate/grass-ax)

---

## Executive summary

This is an **Arkansas homecoming celebration that happens to support Kelly’s campaign**, not a traditional political fundraiser.

**Emotional sequence:** Music → hometown connection → food and fellowship → celebration of democracy → invitation to participate → contribution

**Central line:** *Their roads have crossed before. This time, Arkansas is invited.*

Politics remain the frame—not the atmosphere. The site never hides that this is a campaign event.

---

## 1. Core positioning

| Field | Value |
|-------|--------|
| Public name | Grassroots & Guitar Strings |
| Subtitle | A Sherwood Homecoming and Celebration of Democracy |
| Tagline | From Bear Country to the Capitol |
| Featuring | David Adam Byrnes |
| Presented by | Kelly Grappe for Arkansas Secretary of State |
| Date | Thursday, September 17, 2026 (Constitution Day) |
| Time | 5:30 p.m. (per [David’s official tour calendar](https://www.davidadambyrnes.com)) |
| Venue | Sherwood Forest, Sherwood, Arkansas *(confirm full address)* |

**Primary message:** Kelly is coming home to Sherwood to kick off the final six weeks of her statewide campaign—bringing music, barbecue, family, friends, and a belief that Arkansas is stronger when we sit down together.

**Supporting message:** Not a night of partisan speeches. A hometown celebration: live country music, shared meal, voter registration, and democracy as something we practice together.

**Emotional promise:** *This sounds fun. I know people who’d enjoy this. I don’t have to be deeply political. Kelly feels like one of us.*

---

## 2. Kelly & David shared story (approved narrative spine)

Use real history—do not invent scenes. Steve supplies captions via [KELLY_DAVID_SHARED_HISTORY.md](./KELLY_DAVID_SHARED_HISTORY.md).

1. **Different roads, same soil** — Kelly: public service, farm, family, civic education. David: honest country songwriting, Arkansas roots, Fort Worth base.
2. **Music at Forevermost Farms** — David played the Grappe family farm festival **two separate summers**; Kelly and Steve have supported his career throughout their marriage.
3. **Rose Bud** — David played the Rose Bud hometown festival; Kelly and Steve live in Rose Bud / Forevermost Farms.
4. **Sherwood engagement** — Kelly and Steve got **engaged after a David Adam Byrnes show in Sherwood**.
5. **September 17, 2026** — Both roads lead home for the final-six-week kickoff rally.

**Framing:** David is co-anchor of the *experience*, not “entertainment booked for a fundraiser.” Confirm endorsement vs. participating-friend language with David’s team before launch copy hardens.

---

## 3. Technical architecture

| Decision | Choice |
|----------|--------|
| Stack | Static HTML, CSS, vanilla JS |
| Database | None in V1 |
| Payments | GoodChange only — **no second checkout** |
| Forms | Netlify Forms (volunteer) or link to kellygrappe.com/volunteer |
| Repo | Dedicated folder in SOSWebsite monorepo; optional dedicated GitHub repo + Netlify site |
| Suggested URL | `grassrootsguitarstrings.com` or `event.kellygrappe.com` |

**Link from campaign:** Event record `companionSiteHref` + prominent banner on `/events/grassroots-guitar-strings-sherwood-2026-09-17`.

---

## 4. Navigation

**Primary nav:** Home · Kelly & David · The Celebration · Music · Dinner · Join Us · Event Details  

**Join Us panel:** Attend · Host a Table · Bring Your People · Volunteer · Support From Home  

**Persistent CTA:** Get Tickets → GoodChange  

**Mobile sticky bar:** Get Tickets · Host a Table  

**Brand lockup:** Grassroots & Guitar Strings — *Presented by Kelly Grappe for Secretary of State*

**Utility links:** [KellyGrappe.com](https://kellygrappe.com) · [DavidAdamByrnes.com](https://www.davidadambyrnes.com)

---

## 5. Page architecture

| Route | Purpose | Video at top | Primary CTA |
|-------|---------|--------------|-------------|
| `/` | Warmth, music, participation grid | Yes — muted autoplay + “Turn Up the Music” | Get Tickets |
| `/kelly-and-david/` | Shared history photo story | Story/acoustic pick | Join Kelly and David |
| `/celebration/` | Why the night exists | Upbeat performance | Join the Celebration |
| `/music/` | David as co-anchor | Featured official video | See David Live |
| `/dinner/` | Table fellowship | Slower/home song | Reserve Dinner and a Seat |
| `/tickets/` | Ticket types → GoodChange | Energetic performance | Continue to Secure Ticketing |
| `/host-a-table/` | Individual table hosting | Social/celebratory | Host a Table |
| `/bring-your-people/` | Social spread + invitation kit | Shareable/upbeat | Get My Invitation Kit |
| `/volunteer/` | Event-night roles | Optional short clip | Join the Homecoming Team |
| `/vote/` | Civic participation links | None | Make My Voting Plan |
| `/details/` | Logistics FAQ | Optional invite clip | Reserve My Tickets |
| `/support-from-home/` | Cannot attend | Warm acoustic | Support the Homecoming |

Every drill-down: **invitation → explanation → expectations → compliance note (if money) → one CTA**.

---

## 6. Participation pathways (individual contributions only)

**Law:** Arkansas candidates may not accept business/corporate contributions. Tables are **not** corporate sponsorships.

| Path | Landing explains | GoodChange |
|------|------------------|------------|
| General admission | Entry, music, dinner, program, voter reg access | grass-ax |
| Host a table | Seats, individual attribution, guest names deadline | grass-ax |
| Bring your people | Social kit, QR, copy-paste invites | grass-ax (after reading) |
| Support from home | Ticket for someone else, tour support | grass-ax |
| Volunteer | Roles, arrival times | Form or campaign volunteer URL |

Treasurer must approve ticket tiers, table amounts, joint/couple attribution, complimentary tickets, and fair-market value before prices appear on site.

---

## 7. Video architecture

Central config: `js/event-config.js` → `eventVideos`.

| Rule | Implementation |
|------|----------------|
| Home only autoplay | Muted; overlay “Turn Up the Music”; stops on navigation |
| Drill-down pages | Large play control; no autoplay sound |
| Official videos only | `VIDEO_APPROVAL_REGISTER.json` |
| Fallback | Link to YouTube if embed fails |
| Accessibility | Captions when available; respect `prefers-reduced-motion` |

**Pending approval:** Newest full official release for home (may be “Ring in My Wranglers” audio-only — confirm embeddable video with David).

---

## 8. Visual system

Sample from event poster artwork:

| Token | Approx |
|-------|--------|
| Deep Arkansas blue | `#17466B` |
| Warm wheat gold | `#F3C979` |
| Cream | `#F7F1DF` |
| Soft white | `#FFFDF8` |
| Dark ink | `#183042` |

Typography: Western display (titles, sparingly) + condensed sans (nav/buttons) + readable body.

Photography: farm festivals, Rose Bud, Sherwood, David performing, tables, families, Arkansas evening light. **Avoid** podium-heavy partisan imagery.

Image intake: `docs/IMAGE_ASSET_REGISTER.json` — one record per file with permission status.

---

## 9. Compliance footer (every page)

```
Paid for by The Committee to Elect Kelly Grappe
```

Plus: contributions subject to Arkansas law; **business and corporate contributions cannot be accepted**; links to Privacy, Contribution Information, Accessibility, Contact.

GoodChange owns checkout certifications (name, address, employer, occupation per Arkansas internet contribution rules).

---

## 10. Cross-linking

| Destination | Usage |
|-------------|--------|
| kellygrappe.com | Meet Kelly, story, volunteer, voter registration |
| davidadambyrnes.com | Artist bio, music, tour |
| goodchange.app/donate/grass-ax | All ticket/table/contribution CTAs |
| Arkansas SOS / VoterView | `/vote/` official links only |

External links may open new tab with accessible notice.

---

## 11. Build phases & exit criteria

| Phase | Deliverable | Exit |
|-------|-------------|------|
| **0** Governance | EVENT_FACT_SHEET, image/video registers, treasurer sign-off | No unresolved legal/factual claims |
| **1** Story | Approved copy for all routes | KELLY_DAVID_SHARED_HISTORY complete |
| **2** Shell | Nav, footer, tokens, config, responsive CSS | All routes resolve locally |
| **3** Home | Poster hero, video, participation grid, social meta | Ticket path in ≤2 clicks |
| **4** Drill-downs | 11 content pages | Each path ends in CTA |
| **5** Sharing | Flyer PDF, QR, SMS/email/social copy | Invite in <1 minute |
| **6** Compliance audit | Footer, individual-only language, GoodChange test | Written treasurer approval |
| **7** Launch | Lighthouse, embed test, mobile Safari/Chrome | 90+ perf, 0 missing disclaimer |

---

## 12. Information still needed (do not hard-code)

- [ ] Full street address for Sherwood Forest  
- [ ] Doors / dinner / performance schedule  
- [ ] Ticket and table dollar amounts  
- [ ] Seats per table  
- [ ] Food provider + menu + dietary options  
- [ ] Kelly’s brother — name + approved bio line  
- [ ] Children’s policy, alcohol, accessibility  
- [ ] Refund / transfer policy  
- [ ] David video IDs (approved list)  
- [ ] David endorsement vs. performer language  
- [ ] Final domain + Netlify project  
- [ ] All farm/Rose Bud photo captions + permissions  

---

## 13. Analytics events (post privacy review)

`ticket_button_clicked` · `table_button_clicked` · `video_started` · `video_sound_enabled` · `invitation_downloaded` · `share_button_clicked` · `volunteer_form_started`

Funnel: Landing → video engagement → participation card → explanation page → GoodChange

---

## 14. Current implementation status

| Item | Status |
|------|--------|
| Repo folder + README | Done |
| `js/event-config.js` | Done |
| Shared nav/footer/video | Done |
| Home + all drill-down routes | Done (some copy TBD) |
| Image embeds | Waiting on files in `RedDirt/.../grassroot and guitars/` |
| Campaign event banner link | Done in RedDirt |
| Netlify deploy | Pending domain + new site |
| Treasurer-approved amounts | Pending |

---

*Last updated: build pass initiating static site + campaign cross-link.*
