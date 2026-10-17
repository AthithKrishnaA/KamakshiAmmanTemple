# Arulmigu Sri Kamatchi Amman Temple

A bilingual (English/Tamil) React website prepared for a later GitHub and Vercel deployment. Built with React 19, TypeScript, Vite, Lucide icons, and local copies of the photographs supplied in the temple handoff package.

## Run locally

```bash
corepack enable
pnpm install
pnpm dev
```

## Build for deployment

```bash
pnpm install --frozen-lockfile
pnpm build
```

Vite writes the production site to `dist/`. No server, database, API key, or payment backend is required.

## Publish it later from your own GitHub account

After extracting this project, create an empty repository in your GitHub account, then open a terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Build temple website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example remote with the HTTPS URL of your own repository. Then import that repository into Vercel. Vercel should detect Vite automatically; use `pnpm build` as the build command and `dist` as the output directory.

## Content and asset notes

- English is the default; the `English | தமிழ்` switch changes page content without navigation and remembers a visitor's choice in browser storage where available.
- The website uses local copies of the supplied temple photographs, and the three enhanced history images from the follow-up.
- Google Maps directions use the exact requester-provided link.
- The Special Events section currently states that no special events are listed; dates and timings can be added when provided.
- The Contact section lists Sivakumar (`+91 6382 182 841`) and Athith (`+91 7358218611`) with tap-to-call links, using the numbers supplied by the requester.
- The requester confirmed that the inscription is verified; the enhanced inscription image is displayed without a review warning.
- No address, opening hours, email, event dates, or worship schedule has been invented.

## Project layout

- `src/App.tsx` — accessible single-page layout, language state, image filtering/lightbox and map actions.
- `src/content.ts` — bilingual visitor-facing text and gallery photo data.
- `src/styles.css` — responsive visual system and interaction styles.
- `public/images/` — supplied temple photographs used by the website.
