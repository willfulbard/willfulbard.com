# willfulbard.com

Source code for [willfulbard.com](https://willfulbard.com), the website of musician Will Wheeler.

Built with [Astro](https://astro.build).

**Live preview (GitHub Pages):** https://willfulbard.github.io/willfulbard.com/

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
├── astro.config.mjs           Astro config
└── .github/workflows/         GitHub Actions CI/CD
```

## Calendar integration

Events are pulled from a dedicated public Google Calendar at build time. The iCal feed URL is hardcoded in `src/lib/calendar.ts` (see [SPEC.md](SPEC.md#calendar-integration) for context).

**Important:** The calendar is publicly readable. Use it exclusively for public-facing gigs — private notes (pay, contacts, etc.) belong on a different calendar.

### Adding events

Just add events to the calendar normally. Title, date/time, location, and description all render as-is on the events page. URLs in the description are auto-linked.

Every event on the calendar appears on the site, so use this calendar exclusively for public-facing gigs.

## Deployment

Builds run on GitHub Actions:
- On push to `main`
- Nightly at 6:00 AM UTC (picks up new calendar events)
- On manual workflow dispatch

The built site is force-pushed to the `deploy` branch as an orphan branch. The self-hosted server pulls from `deploy` to serve the site.

## TODO

- [ ] Replace temporary hero photo at `public/images/hero_alt.jpg` with a better landscape-oriented shot
- [ ] Add project photos and refine descriptions in `src/content/projects/`
- [ ] Add upcoming gigs to the public Google Calendar (URL hardcoded in `src/lib/calendar.ts`)
