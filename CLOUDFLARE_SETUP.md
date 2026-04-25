# Cloudflare Pages Setup

Step-by-step instructions for hosting willfulbard.com on Cloudflare Pages.

## Overview

Cloudflare Pages will:
- Watch your GitHub repo
- Build the site automatically on every push to `main`
- Serve the built site globally over Cloudflare's CDN
- Handle TLS automatically
- Cost nothing (free tier)

This replaces the need for self-hosted hosting and the existing `peaceiris/actions-gh-pages` workflow that pushes to a `deploy` branch.

---

## Prerequisites

- A Cloudflare account (free — sign up at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up))
- GitHub repo accessible (already done — `willfulbard/willfulbard.com`)
- Domain `willfulbard.com` purchased somewhere (any registrar)

---

## Step 1 — Create the Pages project

1. Sign in to Cloudflare → click **Workers & Pages** in the left sidebar
2. Click **Create** → **Pages** tab → **Connect to Git**
3. Authorize Cloudflare to access your GitHub account (one-time step)
4. Select the `willfulbard.com` repository
5. Click **Begin setup**

---

## Step 2 — Configure build settings

On the build configuration screen, enter:

| Field | Value |
|---|---|
| Project name | `willfulbard-com` (or whatever you like — affects the `*.pages.dev` URL) |
| Production branch | `main` |
| Framework preset | **Astro** (Cloudflare auto-detects this) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (leave blank — defaults to repo root) |

### Environment variables (build-time)

Click **Environment variables** → add a Node version variable so builds match local development:

| Variable | Value |
|---|---|
| `NODE_VERSION` | `20` |

No additional env vars are needed for the calendar — the iCal feed URL is hardcoded in `src/lib/calendar.ts`.

Click **Save and Deploy**.

---

## Step 3 — Verify the initial deploy

Cloudflare will:
1. Clone the repo
2. Run `npm install`
3. Run `npm run build`
4. Publish `dist/` to its CDN

The first build typically takes 1–3 minutes. When done, you'll get a URL like `https://willfulbard-com.pages.dev`. Visit it to verify everything renders correctly — header, hero, projects, etc. Internal links should all work since the site is served at the root.

If the build fails, click into the failed run for full logs. The most common issues are:
- Wrong Node version (set `NODE_VERSION=20` as above)
- Missing dependency (run `npm install` locally and commit the updated `package-lock.json`)

---

## Step 4 — Set up the custom domain

In the Pages project dashboard:

1. Click the **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `willfulbard.com` → click **Continue**
4. Cloudflare will then walk you through one of two paths:

### Path A — Domain already on Cloudflare DNS

If you've previously moved `willfulbard.com` to Cloudflare nameservers (i.e., Cloudflare manages your DNS), it's automatic. Cloudflare adds the necessary records for you. Done in seconds.

### Path B — Domain on another registrar/DNS provider

You have two choices:

**Option B1 (recommended): Move DNS to Cloudflare**
1. Cloudflare gives you two nameservers (something like `lana.ns.cloudflare.com` and `walt.ns.cloudflare.com`)
2. Log into your registrar and update the domain's nameservers to those values
3. Wait 5 min – 24 hr for DNS propagation
4. Cloudflare will email you when the domain is active and the site goes live

**Option B2: Keep DNS where it is, use CNAME**
1. Cloudflare will tell you to add a CNAME record like `willfulbard.com` → `willfulbard-com.pages.dev`
2. Add that record in your registrar's DNS settings
3. Some registrars don't allow CNAME on the apex domain (the bare `willfulbard.com`); in that case you'll need ALIAS or ANAME records, or fall back to Option B1

### Add www subdomain too

Repeat the process for `www.willfulbard.com` so visitors who type `www.` also reach the site. Cloudflare Pages will redirect one to the other automatically.

### TLS

Cloudflare provisions a free Let's Encrypt or Cloudflare-issued cert automatically as soon as DNS resolves. No action needed on your part. The site will be served over HTTPS with HTTP→HTTPS redirect by default.

---

## Step 5 — Verify the live site

After DNS propagates:

- Visit `https://willfulbard.com` — should load the site
- Visit `https://www.willfulbard.com` — should redirect to non-www (or vice versa, depending on Cloudflare's auto-config)
- Open DevTools → Network tab → verify the response headers include `cf-cache-status` and similar Cloudflare headers (confirms it's being served via Cloudflare)

---

## Step 6 — Set up nightly rebuilds (for calendar updates)

Cloudflare Pages only rebuilds on git pushes by default. To pick up new calendar events without code changes, you need to trigger nightly rebuilds.

### Option A — Cloudflare Deploy Hook + GitHub Actions cron

This is the simplest setup that works with what you already have.

1. In Pages project → **Settings** → **Builds & deployments** → **Deploy hooks**
2. Click **Add deploy hook** → name it `nightly-rebuild` → branch `main` → save
3. Cloudflare gives you a unique URL like `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/abc123...`
4. **Treat this URL as a secret** — anyone with it can trigger your builds
5. In your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: `CLOUDFLARE_DEPLOY_HOOK`
   - Value: paste the deploy hook URL
6. Replace `.github/workflows/build-and-deploy.yml` with this minimal workflow:

```yaml
name: Trigger nightly Cloudflare Pages build

on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC = 10 PM Pacific previous day
  workflow_dispatch:

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare deploy hook
        run: curl -X POST "${{ secrets.CLOUDFLARE_DEPLOY_HOOK }}"
```

That's it — every night, GitHub fires a POST to Cloudflare which triggers a fresh build.

### Option B — Cloudflare Workers Cron Trigger

More elegant but requires writing a small Worker. Skip unless you're already comfortable with Workers.

---

## Step 7 — Disable the old `peaceiris/actions-gh-pages` workflow

The old workflow pushed builds to a `deploy` branch for self-hosting. It's no longer needed — Cloudflare Pages handles building and deploying directly.

If you're using Option A in Step 6, you've already replaced the workflow file with the trigger-only version.

If you skipped Step 6, just delete `.github/workflows/build-and-deploy.yml` (or comment it out) so it doesn't keep pushing to `deploy` unnecessarily.

You can also disable GitHub Pages in the repo settings (**Settings** → **Pages** → set source to "None"), since Cloudflare Pages now serves the live site.

---

## Operational notes

### Build minutes
Free tier allows 500 builds/month. Your usage will be:
- 1 build per push to `main`
- 1 build per nightly cron
- That's ~30/month for nightly + however often you push code → well within limits

### Preview deploys
Every push to a non-`main` branch (or pull request) gets its own preview URL like `https://abc123.willfulbard-com.pages.dev`. Useful for reviewing changes before they hit production.

### Rolling back
If a deploy is broken, the Pages dashboard has a **Rollback** button on any prior deploy. Reverts the live site to that build instantly.

### Logs
Each deploy has a build log accessible from the Pages dashboard. Useful for debugging build failures.

---

## Troubleshooting

**The site builds but `dist/` is empty**
- Verify `Build output directory` is `dist` (not `./dist` or `/dist`)

**Build fails with "Cannot find module 'astro'"**
- Verify `NODE_VERSION` env var is set to `20`
- Verify `package-lock.json` is committed to the repo

**Custom domain shows "DNS error" or doesn't resolve**
- Wait — DNS can take up to 24 hours to fully propagate
- Check your domain's nameservers match Cloudflare's (Path A) or CNAME points to `*.pages.dev` (Path B)
- Use `dig willfulbard.com` from the command line to verify resolution

**Calendar events still not showing**
- Trigger a manual rebuild — calendar changes don't auto-deploy until the next build
- Confirm the calendar referenced in `src/lib/calendar.ts` is still set to public
- Confirm there's at least one upcoming event on the calendar
- Check the build logs for `[calendar]` warning lines indicating fetch failures

**The `*.pages.dev` URL works but `willfulbard.com` doesn't**
- Custom domain setup hasn't completed — check the **Custom domains** tab for status
- May need to wait for DNS propagation
