# Naisen

A farewell feedback app for your team, running entirely on Netlify: a public form, an opt-in memory wall, and a password-protected dashboard. Responses and photos are stored in Netlify Blobs, Netlify's built-in storage, so there is no separate database or account to set up.

## What's inside

| Page | Address | Who sees it |
|---|---|---|
| Feedback form | `your-site.netlify.app/` | Everyone you share the link with |
| Memory wall | `your-site.netlify.app/wall` | Everyone (only entries whose authors opted in) |
| Dashboard | `your-site.netlify.app/admin` | Only you, with the admin password |

```
site.config.mjs        ← edit wording, questions, headcount, closing date here
public/                ← the three pages and the stylesheet
netlify/functions/     ← server code (submit, upload, photos, wall, dashboard)
lib/shared.mjs         ← shared server helpers
netlify.toml           ← Netlify settings
```

## Deploy it (about 10 minutes)

Netlify's drag-and-drop deploy does not run server functions, so use one of these two routes.

### Option A: through GitHub (recommended)

1. Create a free GitHub account if you don't have one, then create a new **private** repository.
2. Upload the contents of this folder to the repository (on GitHub: **Add file > Upload files**, then drag everything in, including the `netlify` and `lib` folders).
3. Sign in to Netlify and choose **Add new site > Import an existing project > GitHub**, then pick the repository.
4. Leave the build settings as they are (Netlify reads `netlify.toml`) and click **Deploy**.
5. Set your passwords (see "Set your passwords" below), then trigger a redeploy under **Deploys > Trigger deploy**.

Any later change you make to the files on GitHub redeploys the site automatically.

### Option B: from your computer with the Netlify CLI

You need Node.js 18 or newer installed.

```bash
cd naisen
npm install
npx netlify-cli login
npx netlify-cli init          # creates the site; accept the defaults
npx netlify-cli env:set ADMIN_PASSWORD "choose-a-long-password"
npx netlify-cli env:set ACCESS_CODE "Pramod2026"     # optional
npx netlify-cli deploy --prod
```

## Set your passwords

In Netlify, open your site and go to **Site configuration > Environment variables**, then add:

| Name | Required | What it does |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Unlocks the dashboard at `/admin`. Use something long; this protects named feedback. |
| `ACCESS_CODE` | Recommended | If set, people must enter this code to submit, which keeps out anyone who stumbles on the link. It isn't case-sensitive. Put it in your invite message. |

Redeploy after adding or changing these.

Optional: under **Domain management** you can rename the site (for example `naisen.netlify.app`, if available) before you share the link.

## Customise it

Everything you're likely to change is in `site.config.mjs`:

- `appName`: the name shown on every page (Naisen).
- `headline` and `farewell`: your farewell message at the top of the form (greeting, paragraphs, the three points, closing and sign-off).
- `formIntro`: the short note just above the questions.
- `contact`: your LinkedIn and personal email, shown on the form and the thank-you page.
- `inviteMessage`: the message to post in the group. `{link}` becomes your form's address on the dashboard's Share tab, ready to copy.
- `questions`: the wording of each question. Keep the `id` values unchanged once responses start arriving.
- `headcount`: used for the response-rate figure (set to 800).
- `closesOn`: a date like `"2026-11-30"` after which the form stops accepting entries (end of that day, India time).
- `teams`: a list of teams or service lines to show as a dropdown. Leave it empty to let people type their team.
- `wallEnabled`: set to `false` to turn off the memory wall.

Redeploy after editing.

## Using the dashboard

- **Overview**: totals, response rate against your headcount, entries per day, answers per question, and breakdowns by team and years together (named entries only).
- **Word clouds**: one per question, plus "All answers". Filter to named or anonymous entries. Select any word to see every answer that uses it.
- **Entries**: search, filter and sort. Star the ones you want to come back to, hide an entry from the memory wall, or delete spam. **Export CSV** downloads the current view.
- **Photos**: every photo, with **Download all photos (.zip)** organised into a folder per person.
- **Stay in touch**: everyone who left a LinkedIn profile or email, with CSV export.
- **Keepsake**: builds a printable book of entries and photos. Choose "Save as PDF" in the print window.
- **Share**: your links, a ready-to-edit invite message and a QR code for your farewell event.

## Privacy, as built

- Anonymous entries store no name, email, device details, IP address or exact time, only the date.
- Photos are resized and re-encoded in the browser before upload, which removes location and camera metadata.
- The version 2.0 patch, never told me and advice answers never appear on the memory wall. The other answers and photos appear only if the person ticks the opt-in box, and you can hide any entry.
- Search engines are told not to index any page.

## Keep a copy

Your data lives in this Netlify site. **If you delete the site, the responses and photos are deleted with it.** Once feedback has come in, download the CSV and the photo zip from the dashboard and keep them somewhere safe.

Netlify's free plan includes Functions and Blobs with monthly usage limits. Several hundred entries with compressed photos typically fit, but check the limits on your plan under **Usage** in Netlify if you expect heavy photo uploads.

## Test it locally (optional)

```bash
npm install
npx netlify-cli dev
```

Then open http://localhost:8888. Set `ADMIN_PASSWORD` in a `.env` file first to try the dashboard.
