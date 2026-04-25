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

Events are pulled from a private Google Calendar at build time. See [SPEC.md](SPEC.md#calendar-integration) for the full setup.

To run with real events locally:

```bash
export GOOGLE_CALENDAR_CREDENTIALS="$(cat path/to/service-account.json)"
export GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"
npm run dev
```

Without these env vars, the events page will render an empty state.

### Adding a public event

In your calendar event description, include a `public:` YAML block:

```
[private notes here]

public:
  title: Forgery at Friday Night Contra
  time: 8:00pm-11:00pm
  info: https://berkeleycontradance.org
  description: Forgery plays for the Berkeley Contra Dance.
```

Only events with a `public:` block appear on the site. Date and location come from the calendar event's standard fields.

## Deployment

Builds run on GitHub Actions:
- On push to `main`
- Nightly at 6:00 AM UTC (picks up new calendar events)
- On manual workflow dispatch

The built site is force-pushed to the `deploy` branch as an orphan branch. The self-hosted server pulls from `deploy` to serve the site.

## TODO

- [ ] Replace temporary hero photo at `public/images/hero_alt.jpg` with a better landscape-oriented shot
- [ ] Add project photos and refine descriptions in `src/content/projects/`
- [ ] Configure Google Calendar service account
