# TODO

Outstanding items for willfulbard.com.

## Content

### Hero & photos
- [ ] Replace placeholder hero photo on home page (currently `<div class="hero-image-placeholder">` in `src/pages/index.astro`)
- [ ] Add project photos for each of the 7 projects (set the `hero` field in each `src/content/projects/*.md`)
- [ ] Collect photographer credits for any photos used

### Project descriptions
- [ ] Refine description in `src/content/projects/forgery.md`
- [ ] Refine description in `src/content/projects/dance-dinos.md`
- [ ] Refine description in `src/content/projects/punch-party.md`
- [ ] Refine description in `src/content/projects/the-flagstones.md` (and confirm if it's a trio or quartet — currently lists 3 members but labeled quartet)
- [ ] Refine description in `src/content/projects/will-and-holly.md`
- [ ] Refine description in `src/content/projects/yellowfoot.md`
- [ ] Refine description in `src/content/projects/starry-plough-ceili-band.md` (and confirm full lineup)

## Operational setup

### Google Calendar integration
- [ ] Create Google Cloud project (free tier is fine)
- [ ] Enable the Google Calendar API in that project
- [ ] Create a service account; download its JSON key
- [ ] Designate or create a Google Calendar for gigs
- [ ] Share the calendar with the service account email (read-only)
- [ ] Add the calendar ID as GitHub Secret `GOOGLE_CALENDAR_ID`
- [ ] Add the JSON key contents as GitHub Secret `GOOGLE_CALENDAR_CREDENTIALS`
- [ ] Convert at least one upcoming gig to use the `public:` YAML block format (see SPEC.md → Calendar Integration)
- [ ] Trigger a manual workflow run to verify events render

### Hosting
- [ ] Choose self-hosted environment (VPS, home server, etc.)
- [ ] Configure server to pull from the `deploy` branch (cron-based git fetch every 5 minutes recommended)
- [ ] Configure DNS A/AAAA records for `willfulbard.com` and `www.willfulbard.com` to point to the server
- [ ] Set up TLS — Caddy is simplest (auto-provisions Let's Encrypt certs); nginx + certbot also fine
- [ ] Verify site loads correctly at https://willfulbard.com/

### GitHub Pages preview (optional)
- [ ] Decide: leave the GH Pages URL (https://willfulbard.github.io/willfulbard.com/) as build-verification only, or fix the base path so it works as a true preview
  - Note: paths break on GH Pages because the site is configured for root `/`, not `/willfulbard.com/`

## Design refinement (lower priority)

- [ ] Review color palette once real photos are in place — accent color may want to be drawn from photography
- [ ] Confirm font choices (currently Lora + Source Sans 3); swap if they don't feel right
- [ ] Mobile testing pass once content is filled in

## Future phases (not scoped now)

### Phase 2 — Enrichment
- [ ] Media gallery page (photos + videos)
- [ ] EPK page (short bios, high-res photos, tech rider, press quotes)
- [ ] Bandsintown integration (alternative to Google Calendar if it becomes useful)

### Phase 3 — Optional growth
- [ ] Teaching/lessons page (when offering them)
- [ ] Music/Discography page (when there are recordings)
- [ ] Blog (tune of the week, session notes, travel writing)
- [ ] Patreon integration

## Resolved

These were decided earlier in the planning process — keeping for reference:

- ✅ Tagline: "Living music from old roots"
- ✅ Tech stack: Astro
- ✅ Hosting: self-hosted, deployed via GitHub Actions to the `deploy` orphan branch
- ✅ Domain: willfulbard.com
- ✅ Newsletter: not doing one (Instagram for gig updates)
- ✅ Lark Camp / Starry Plough: mentioned in About bio, no dedicated section
- ✅ Contact form: FormSubmit with hashed endpoint
- ✅ Thank-you page after form submission
- ✅ About section written
- ✅ All 7 project stubs created
- ✅ GitHub repo created and pushed
- ✅ GitHub Actions building successfully
- ✅ `deploy` branch publishing
- ✅ GitHub Pages preview enabled
