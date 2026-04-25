# Will Wheeler – Music Website Spec

## Overview

A static promotional website for Will Wheeler, a folk/traditional musician. The site should establish a professional online presence for booking, fan discovery, and press, with a warm aesthetic appropriate to the folk tradition.

**Will's instruments:** Guitar (primary), fiddle, nyckelharpa, percussive step dance ("feet"). Does not sing.
**Traditions:** Irish, Contradance, Scandinavian, and many others
**Role:** Performer + community figure. Artistic Director of [Lark Camp](https://www.larkcamp.org) (week-long world folk music & dance gathering, Mendocino CA). Committee member running the Monday Night Irish Ceili at the Starry Plough pub, Berkeley, CA.

**Tech stack:** Astro (confirmed)

---

## Tech Stack Recommendation

### Primary Recommendation: Astro

While Gatsby was the initial consideration, **Astro** is the stronger choice for this project in 2026:

| | Astro | Gatsby |
|---|---|---|
| Performance | Ships zero JS by default ("islands" architecture) | Requires JS hydration for all pages |
| Complexity | Simple file-based routing, no GraphQL layer | GraphQL data layer adds friction for simple content sites |
| Build speed | Very fast | Slower, especially as content grows |
| Ecosystem | Active, purpose-built for content sites | Less active post-Netlify acquisition |
| React support | Can use React components where interactivity is needed | React-only |
| Hosting | Netlify, Vercel, GitHub Pages — all first-class | Same |

Gatsby remains a solid choice if you have a strong preference for the React/GraphQL ecosystem. Either can produce an excellent result.

**Hosting:** Cloudflare Pages (auto-builds on push to `main`); see [Build & Deployment](#build--deployment) and [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)

---

## Site Structure

### Pages

| Page | URL | Phase | Purpose |
|---|---|---|---|
| Home | `/` | 1 | First impression — hero, quick bio, upcoming events |
| About | `/about` | 1 | Full biography and background |
| Events | `/events` | 1 | Upcoming performances |
| Projects | `/projects` | 1 | Named ensembles and collaborations |
| Contact | `/contact` | 1 | Contact form + booking info |
| Media | `/media` | 2 | Photo gallery + videos |
| EPK | `/epk` | 2 | Electronic Press Kit for bookers and press |
| Music | `/music` | future | Discography and streaming links (when Will has recordings) |
| Teaching | `/teaching` | future | Lessons/workshop offerings (when ready) |
| Blog | `/blog` | future | Tune of the week, session notes, travel writing |

---

## Page-by-Page Content Plan

### Home `/`

**Hero section**
- Full-width or large portrait photo
- Name: Will Wheeler
- Tagline: "Living music from old roots"
- Two CTAs: "About Will" → `/about` and "Upcoming Shows" → `/events`

**About teaser**
- 2–3 sentence bio excerpt with "Read More" link to `/about`

**Upcoming events**
- Next 3–5 shows with date, venue, location, info link
- "All Events" link to `/events`

**Featured projects**
- 2–3 highlighted projects with photo and short description
- "All Projects" link to `/projects`

**Social links**
- Icons linking to Facebook, Instagram, YouTube, Bandcamp, Spotify (whichever apply)
- Note: gig updates are pushed via Instagram (no newsletter on the site)

---

### About `/about`

- Full biography (several paragraphs)
- Instrument(s) and traditions covered
- Influences, teachers, musical lineage
- Notable collaborators or ensembles
- 1–2 supporting photos
- Press quotes/reviews if available
- Link to full EPK

---

### Events `/events`

**Upcoming shows** (primary section)
- Date, time, venue name, city/state, info link
- Mark "FREE" events clearly
- Include session/dance events, not just concerts

**Past shows** (collapsible or secondary section)
- Archive for credibility

**Content management:** Events are pulled from Will's private Google Calendar at build time using the Google Calendar API. See the [Calendar Integration](#calendar-integration) section below for full details.

---

### Projects `/projects`

A showcase of Will's named ensembles and collaborations.

**Index page** (`/projects`)
- Grid or list of all projects with name, one-line description, and cover photo
- Click through to individual project page

**Individual project page** (`/projects/[slug]`)
- Project name and description
- Members / collaborators
- Genre / style notes
- Recordings (links to releases)
- Photos
- Upcoming events tagged to this project (cross-referenced from events data)
- Video embeds

**Known projects (as of April 2026):**

| Project | Members | Style |
|---|---|---|
| Forgery | Ben Jackson (fiddle), Will (guitar, feet) | Contra dance — duo |
| Dance Dinos | Lisa Miklós-Illés (winds), Leah Wollenberg (fiddle), Will (guitar, feet); sometimes Dorsey Crocker (bass) | Contra dance — trio/quartet |
| Punch Party | Lisa Miklós-Illés (winds), Peter Mellinger (fiddle), Will (guitar, feet) | Contra dance — trio |
| The Flagstones | Anne Goess (fiddle), Charlie Hancock (accordion), Will (guitar, feet) | Contra dance — quartet |
| Will and Holly | Holly Sternberg-Kozan (fiddle), Will (guitar) | Folk / world music — duo |
| Yellowfoot | Mahati Chintapalli (fiddle), Will (guitar) | Irish ceili — duo; plays for Irish set dancing |
| The Starry Plough Ceili Band | Full ceili band lineup TBD | Irish ceili — house band for Monday Night Irish Ceili at the Starry Plough, Berkeley |

**Content management:** Each project stored as a Markdown/MDX file in a `src/content/projects/` directory — add a new file to add a new project.

---

### Media `/media`

**Photos**
- Responsive grid gallery
- Performance shots, portraits, candids
- Source: Facebook/Instagram (download high-res originals)
- Credit photographers

**Videos**
- Embedded YouTube or Vimeo players
- Grid layout with thumbnail + title

---

### EPK `/epk`

Electronic Press Kit for booking agents, festival programmers, and press.

- Short bio (100-word and 250-word versions)
- High-res photo downloads
- Technical rider / stage requirements (PDF download)
- Press quotes
- Select embedded tracks
- Booking contact info (email)
- Links to social/streaming profiles

---

### Contact `/contact`

- Contact form (name, email, subject, message) — handled by FormSubmit (no backend needed)
- Note on typical response time
- Booking inquiry prompt ("For bookings, please include date, venue, event type, and location")
- Social media links
- Do NOT list email address in plain text (use the form to reduce spam)

---

## Design Direction

### Visual Style

Inspired by the warmth and craft of the folk tradition — not rustic or kitschy, but **clean and grounded**.

- **Color palette:** Warm neutrals (cream, warm white, soft charcoal) with one or two accent colors drawn from your photography — deep forest green, aged gold, or terracotta are all period-appropriate
- **Typography:**
  - Headings: A serif or slab-serif (e.g. Playfair Display, Lora, Libre Baskerville) — conveys tradition and craft
  - Body: A clean readable sans-serif or humanist serif (e.g. Source Sans 3, Inter, or Crimson Pro)
- **Photography:** Large, prominent. The site lives or dies on great photography. Invest in one good press photo shoot if possible. Pull candidly authentic shots from Facebook/Instagram in the meantime.
- **Whitespace:** Generous. Let content breathe.
- **No dark mode initially** — the warm palette doesn't lend itself to it.

### References by element

| Element | Inspiration |
|---|---|
| Navigation | Colin Cotter — clean horizontal nav, 5–7 items |
| Hero | Darcy Noonan — large artist photo, simple overlay text |
| Streaming links | Alex Sturbaum — icon-based platform links |
| Events | Amelia Hogan — date/venue/location/tickets in clean rows |
| EPK | Amelia Hogan — dedicated EPK page for press/booking |
| Bio | Devon Léger — storytelling-first biography |

---

## Features & Integrations

| Feature | Tool / Approach |
|---|---|
| Contact form | FormSubmit (hashed endpoint, free, no account required) |
| Newsletter | None planned (using Instagram for gig updates) |
| Music embeds | Bandcamp player widget |
| Video embeds | YouTube iframe |
| Event calendar | Public Google Calendar iCal feed parsed at build time — see [Calendar Integration](#calendar-integration) |
| Analytics | Plausible or Fathom (privacy-respecting, simple) |
| SEO | Astro's built-in meta tags + sitemap plugin |
| Accessibility | Semantic HTML, `alt` text on all images, keyboard nav |
| Photo gallery | Astro image optimization + CSS grid |

---

## Content Required From You

Before or during development, you'll need to provide:

- [ ] Biography (draft — can be edited iteratively)
- [ ] Tagline / short descriptor
- [ ] High-resolution photos (download originals from Facebook/Instagram)
- [ ] Photographer credits
- [ ] Upcoming events list (date, venue, city, ticket URL) — added to Google Calendar with `public:` YAML blocks
- [ ] Social media profile URLs
- [ ] Booking contact email
- [ ] Any press quotes or reviews
- [ ] Tech rider / stage requirements PDF (for EPK; phase 2)
- [ ] Public Google Calendar created for gigs, with public iCal URL captured

---

## Development Phases

### Phase 1 — Core Site (Launch)
- Home, About, Events, Projects, Contact
- Mobile-responsive
- Deployed via Cloudflare Pages on willfulbard.com
- Google Calendar integration for events
- Basic SEO (title tags, meta descriptions, Open Graph)

### Phase 2 — Enrichment
- Media gallery (photos + video)
- EPK page
- Bandsintown integration for events
- Blog/tune-of-the-week

### Phase 3 — Optional Growth
- Teaching/lessons page (when Will is ready to offer them)
- Patreon integration
- Online store (Bandcamp handles this well independently)

---

## Domain & Hosting

- **Domain:** `willfulbard.com` (confirmed)
- **Source code:** GitHub repository (`willfulbard/willfulbard.com`)
- **Build & hosting:** Cloudflare Pages (auto-builds on push to `main`)
- **Nightly rebuild:** Optional GitHub Actions cron triggers a Cloudflare deploy hook (so calendar changes go live without a code push)
- **DNS:** Managed through Cloudflare (or via CNAME from your registrar)

See [Build & Deployment](#build--deployment) for full implementation details.

---

## Calendar Integration

The Events page is generated at build time from a dedicated public Google Calendar. Only events with an explicitly-marked `public:` block in the description are rendered — everything else is filtered out.

### Approach

A separate public Google Calendar is created specifically for gigs. Its iCal feed URL is fetched at build time, parsed, and used to render the Events page.

**Important:** Anyone with the iCal URL can subscribe to and read every event on this calendar. Therefore, **only put information you're comfortable being publicly visible on this calendar.** Pay info, private contacts, etc. should NOT go on this calendar at all.

### One-time setup

1. In Google Calendar, create a new calendar (e.g. "Will Wheeler — Gigs")
2. Open the calendar's settings → **Access permissions** → check **Make available to public** (with permission set to "See all event details")
3. Scroll to **Integrate calendar** → copy the value labeled **Public address in iCal format** (a URL ending in `/public/basic.ics`)
4. Store that URL as a Cloudflare Pages environment variable named `GOOGLE_CALENDAR_ICAL_URL`

### Event format

Calendar events are rendered as-is — every event on this calendar will appear on the website. The mapping is straightforward:

| Calendar field | Renders as |
|---|---|
| Title (SUMMARY) | Event title |
| Start / End | Date and time range |
| Location | Venue text |
| Description | Public description (URLs auto-link) |

**Example calendar event:**

```
Title: Forgery at Friday Night Contra
Date: Friday, May 15, 2026, 8:00 PM – 11:00 PM
Location: Christian Church, Berkeley
Description:
  Forgery plays for the Berkeley Contra Dance.
  Tickets at the door, $15 sliding scale.
  More info: https://berkeleycontradance.org
```

The website renders:

> **Fri, May 15, 2026** — 8:00 PM–11:00 PM
> **Forgery at Friday Night Contra**
> Christian Church, Berkeley
> Forgery plays for the Berkeley Contra Dance.
> Tickets at the door, $15 sliding scale.
> More info: https://berkeleycontradance.org *(auto-linked)*

Line breaks in the description are preserved on the rendered page. URLs in the description are automatically converted to clickable links.

### Build-time Parsing

See `src/lib/calendar.ts` for the implementation. It uses the [`node-ical`](https://www.npmjs.com/package/node-ical) library to fetch and parse the iCal feed and renders each upcoming event directly.

### Operational Notes

- **What happens on a parse error?** The build logs a warning and skips that event rather than failing the whole build. Will should periodically check build logs for warnings.
- **Past events:** The fetcher filters to upcoming events only at build time.
- **Caching:** The iCal feed is fetched once per build; no runtime fetches.
- **Public visibility:** Every event on this calendar (title, time, location, description) appears on the public website. Don't put anything on this calendar that you don't want publicly visible — use a separate calendar for private notes (pay, contacts, etc.).

---

## Build & Deployment

The site is hosted on **Cloudflare Pages**, which auto-builds and deploys on every push to `main`. Optionally, a GitHub Actions cron job triggers a Cloudflare deploy hook nightly so calendar updates flow through without code changes.

See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for full setup instructions including:
- Creating the Pages project
- Configuring the build (`npm run build`, output `dist/`, Node 20)
- Custom domain and TLS
- Optional nightly rebuild trigger

---

## Tagline

**"Living music from old roots"**

This appears in the hero section of the homepage (beneath your name, overlaid on or adjacent to your main photo) and in the browser tab/social sharing metadata.

---

## Questions to Decide

- [ ] **Content for projects** — Photos and descriptions for each of the 7 projects
- [ ] **"Feet" / step dance** — Worth highlighting this explicitly in bio and project descriptions
- [ ] **Hero image** — Selecting from Facebook/Instagram photos

## Resolved Decisions

- **Domain:** willfulbard.com
- **Tech stack:** Astro (self-hosted)
- **Teaching:** Deferred to phase 3
- **Projects page:** Phase 1, with individual pages per project
- **Tagline:** "Living music from old roots"
- **Newsletter:** Not yet; using Instagram for monthly gig updates
- **EPK:** Phase 2
- **Lark Camp:** Mention in bio, no dedicated section
