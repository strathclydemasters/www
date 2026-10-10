# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static site for the Strathclyde Masters basketball tournament, built with Eleventy 3 (Liquid templates) and Tailwind CSS 4, deployed to Netlify. There is no test suite or linter.

## Commands

- `npm start` — wipe `_site/` and run the Eleventy dev server (`--serve`) with `src/` as input
- `npm run build` — one-off build into `_site/` (what Netlify runs, per `netlify.toml`)

Netlify builds on Node 22, set by `NODE_VERSION` in `netlify.toml`. Node 22 is the minimum: `@11ty/eleventy-img` 7 requires it.

## Environment and live data

`ELEVENTY_ENV` controls where season data is fetched from. The local `.env` sets it to `development`; Netlify sets `production`.

The current season's teams and fixtures are not stored in the repo. `src/_data/<year>/teams.js`, `fixtures.js` and `competitionFixtures.js` are one-liners that call the shared helper `src/_lib/portal.js` with a `<year>/teams`-style path. It fetches JSON at build time from the Masters Basketball Tournaments portal API (v1, tournament slug `strathclyde-masters`) with `@11ty/eleventy-fetch` (cache `duration: '0s'`, so every build refetches). Requests send `Authorization: Bearer $PORTAL_API_KEY`, which is set in `.env` locally and in Netlify's environment variables:

- `development` → tries the local portal at `http://localhost:5178/api/v1/strathclyde-masters/...` (2 second timeout). If it isn't running, the helper logs `[portal] Local API unavailable…` and falls back to production.
- anything else → `https://portal.mastersbasketballtournaments.com/api/v1/strathclyde-masters/...`

The API's schema is at `https://portal.mastersbasketballtournaments.com/api/v1/openapi.json`. Teams give the pool separately (`competition: 'M50+'`, `pool: 'Group 1'`), and `components/teams-card.html` joins them.

Past seasons mostly use static JSON in `src/_data/<year>/`.

## How seasons are structured

- `src/_data/site.js` holds `site.season`, the current tournament year (used in the footer download links to `/resources/<season>/...pdf`).
- Data files are namespaced by year folder, so templates read them as `2026.fixtures`, `2026.teams`, `2026.gallery`, etc.
- **Underscore-prefixed data files are disabled on purpose.** Renaming `gallery.json` to `_gallery.json` changes its key to `2026._gallery`, so the template's `2026.gallery` is empty and the "coming soon" branch renders. Toggle a section on or off by renaming the file, not by editing templates.
- `src/_includes/<year>/content/{teams,fixtures,venues,rules,gallery}.html` render each section for that year; each has an empty-data fallback.
- The current season's pages live in `src/season/<current year>/*.html` with top-level permalinks (`/teams/`, `/fixtures/`, `/venues/`, `/rules/`, `/gallery/`) that include the matching content partial.
- Past seasons are a single `src/season/<year>/index.html` (permalink `/<year>/`) that includes that year's partials.
- `src/index.html` is the homepage; tournament dates and cost are in its front matter.

Rolling over to a new season (`<old>` is the season ending, `<new>` the next one):

1. Create `src/_data/<new>/` from `<old>`'s files, changing the year in the `portal( '…/<year>' )` paths. Start sections not yet published with an underscore prefix (e.g. `_gallery.json`).
2. Create `src/_includes/<new>/content/` from `<old>`'s partials, changing the data references (e.g. `<old>.teams` → `<new>.teams`).
3. Move `src/season/<old>/*.html` to `src/season/<new>/` and set `season: <new>` in each page's front matter.
4. Add `src/season/<old>/index.html` (permalink `/<old>/`) built from `components/season-hero.html` plus `<old>`'s teams, fixtures and gallery partials. Copy an existing past season such as `src/season/2025/index.html`.
5. Bump `season` in `src/_data/site.js`.
6. Update the tournament number, `startDate`, `endDate` and `cost` in `src/index.html`.
7. Add `<old>` to the start of the `pastSeasons` list in `src/_includes/layout/default/header.html`.
8. Add the season's PDFs to `src/resources/<new>/`. The footer links to the Fixtures, Rules and Liability Waiver files by name.

## Styling and scripts

- `src/css/site.css` is the Tailwind entry point. Eleventy compiles it through `@tailwindcss/postcss` via `addExtension( 'css' )` in `.eleventy.js` (minified when `ELEVENTY_ENV=production`) and outputs `/css/site.css`. No separate CSS build step.
- The `@theme` block recreates the original Unify/Bootstrap 4 look: purple `primary` (#91268f), Unify's default green `accent` (still used for the contact button and sub-menu hover), Open Sans, Bootstrap breakpoints (576/768/992/1200), and a `container` override with Bootstrap widths (540/720/960/1140, 15px gutters). Many classes use exact px values (e.g. `pb-12.5` = 50px, `mb-[14px]`) because the original theme used a 14px root.
- Repeated patterns are `@layer components` classes in `site.css`: `section-title`, `hero`, `btn-pill`, `rule-heading`, `rules`, `table-teams`, `table-results`, `table-fixtures`.
- `src/js/site.js` is plain JS with no dependencies. It handles the header (translucent once scrolled; on `lg` it hides on scroll down and shows on scroll up), the mobile menu and "Past Tournaments" sub-menu, the home page slideshow (`data-slideshow`), gallery carousels (`data-carousel`), the `<dialog>` lightbox (`data-lightbox`) and back-to-top. State is exposed as data attributes (`data-open`, `data-scrolled`, `data-hidden`, `data-visible`) and styled with Tailwind `data-*` variants.
- Icons are inline SVGs in `src/_includes/icons/`, sized with `1em`, so they follow `text-*` and `currentColor`.

## Templates and config

- Layout: `src/_layouts/default.html` with partials in `src/_includes/layout/default/`. The "Past Tournaments" year list in `header.html` is a comma-separated string to update each season.
- Shared components in `src/_includes/components/` take parameters via `{% include 'components/x.html', key: value %}` (documented in each file's opening comment): `season-hero`, `announce` (the "to be announced" banner), `teams-card`, `fixtures-court` (its `format` param handles the 2023/2024/2025+ score layouts), `venue`, `gallery`, `gallery-item`, `lightbox`. Build text params with `{% capture %}` first, because include parameters don't take filters.
- Setting `displayMap: true` in front matter loads Leaflet and the `displayMap()` helper used by `components/venue.html`.
- `.eleventy.js` also defines:
  - `optimisedImage` async filter: resizes a photo with `@11ty/eleventy-img` to 900px WebP under `/images/optimised/` and returns its URL. Used by galleries whose data holds `./src/images/...` paths (2024 onwards, `optimise: true`); older galleries pass `folder` and use the original files.
  - `{% year %}` shortcode
  - `where` filter (`array | where: 'prop', value`)
  - `dateFormat` filter (Moment.js format strings, e.g. `'ddd, Do MMMM'`)
- `src/js`, `src/images`, `src/favicon` and `src/resources` (season PDFs) are passthrough-copied.
- The footer contact form is a Netlify form (`data-netlify="true"` with reCAPTCHA).
