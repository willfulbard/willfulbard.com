# willwheelermusic.com

Source code for [willwheelermusic.com](https://willwheelermusic.com), the website of musician Will Wheeler.

Built with [Astro](https://astro.build).

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Available scripts

| Command | Action |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Type-check Astro files |

## Project structure

```
.
├── src/
│   ├── content/projects/      Project markdown files (one per ensemble)
│   ├── layouts/               Page layout(s)
│   ├── components/            Reusable components
│   ├── pages/                 File-based routes
│   ├── lib/calendar.ts        Google Calendar integration
│   └── styles/global.css      Theme tokens and base styles
├── public/                    Static assets (favicon, images)
└── astro.config.mjs           Astro config
```

## Project content

Each project lives in its own markdown file under `src/content/projects/`. The frontmatter is validated by the schema in `src/content/config.ts`.

### Required fields

```yaml
---
name: Forgery                 # display name
slug: forgery                 # URL slug (must be unique; matches the filename)
style: Contra dance           # genre / context label shown above the title
ensemble: Duo                 # group size / format label
order: 1                      # ordering on the projects index
featured: true                # if true, appears in the home page "Featured projects"
members:                      # at least one member
  - name: Will Wheeler
    instruments: [guitar, feet]
    note: Optional note shown under the instruments
---
```

### Optional fields

#### `hero` — cover image

Path to a hero image for the project's cover header. Falls back to a colored block if omitted.

```yaml
hero: /images/projects/forgery.jpg
```

#### `links` — streaming / web links

Any combination of the four supported platforms; renders a "Listen & Follow" section.

```yaml
links:
  bandcamp: https://forgery.bandcamp.com
  spotify: https://open.spotify.com/artist/...
  youtube: https://youtube.com/@forgery
  website: https://forgery.example.com
```

#### `gallery` — image gallery

Renders a responsive grid of images with optional photographer credits.

```yaml
gallery:
  - src: /images/projects/forgery/photo1.jpg
    alt: Forgery performing at the Forge Garden
    credit: Photo by Sarah Martin    # optional
  - src: /images/projects/forgery/photo2.jpg
    alt: Forgery at the Northwest Folklife Festival
```

#### `videos` — linked videos

Renders a grid of clickable video cards. YouTube thumbnails are auto-generated; Instagram requires a manual `thumbnail` path.

```yaml
videos:
  - url: https://www.youtube.com/watch?v=abc123XYZ
    title: Forgery — Reels at the Berkeley Contra
    # YouTube thumbnails fetched from img.youtube.com/vi/{id}/hqdefault.jpg
  - url: https://www.instagram.com/reel/ABC123/
    title: Live at the Forge Garden
    thumbnail: /images/projects/forgery/video-thumbs/ig-1.jpg
```

### Suggested file layout

```
public/images/projects/{slug}/
  ├── hero.jpg                  (or named however the `hero:` field references)
  ├── gallery/
  │   └── photo1.jpg
  └── video-thumbs/
      └── ig-1.jpg
```

Convention only — the actual paths in frontmatter can point anywhere under `public/`.

## Calendar integration

Events are pulled from a dedicated public Google Calendar at build time. The iCal feed URL is hardcoded in `src/lib/calendar.ts` (see [SPEC.md](SPEC.md#calendar-integration) for context).

**Important:** The calendar is publicly readable. Use it exclusively for public-facing gigs — private notes (pay, contacts, etc.) belong on a different calendar.

### Adding events

Just add events to the calendar normally. Title, date/time, location, and description all render as-is on the events page. URLs in the description are auto-linked.

Every event on the calendar appears on the site, so use this calendar exclusively for public-facing gigs.

## Deployment

Hosted on Cloudflare Pages, which auto-builds on every push to `main`. See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for setup instructions.

## TODO

- [ ] Replace temporary hero photo at `public/images/hero_alt.jpg` with a better landscape-oriented shot
- [ ] Add project photos and refine descriptions in `src/content/projects/`
- [ ] Add upcoming gigs to the public Google Calendar (URL hardcoded in `src/lib/calendar.ts`)
