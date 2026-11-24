# Sycamore Grove Park & Ramona Hall Master Plan: website

A single scrolling page in plain HTML, CSS and JavaScript. It uses no framework and no build step, the same setup as the other master plan sites, so it deploys the same way (GitHub, then Vercel or any static host).

## Files

| File | What it does |
|---|---|
| `index.html` | All page content, in order: opening, The Park, The Plan, Process & Timeline, Get Involved, FAQ, Project Materials, footer |
| `style.css` | All styles. Colors, type and spacing are set once at the top under "Tokens" |
| `main.js` | Header, menu, language switch, timeline "Today" marker, scrolling notes, gentle image motion, forms |
| `translations.js` | Spanish, Cantonese (Traditional) and Mandarin (Simplified) for headings, buttons and the opening statement |
| `Images/` | Web-sized photos (Rio Asch Phoenix) and the recolored park map |
| `Logo/rap-logo.svg` | LA Rec & Parks logo. The page uses an inline copy so it can turn white on dark backgrounds |
| `Fonts/`, `Documents/` | Empty for now |

## Design rules

- **Colors:** RAP Sand, Green, Blue and Black, with Dark Orange as a small accent. Brand Orange and Light Orange are left out, per Stayner.
- **Contrast:** RAP Green on Sand is 4.35:1, just under the 4.5:1 that small text needs. Green is used for fills, large type and white-on-green text, never for small text on sand. Dark Orange is used only for markers and outlines.
- **Type:** CircularXX throughout. Figtree stands in until the font files arrive.
- **Images:** every image has alt text and a caption. No text is baked into images; the map labels are live text.
- **Motion:** respects the visitor's "reduce motion" setting, and everything works without JavaScript.

## Before launch

1. Delete the two blocks marked `DRAFT ONLY` in `index.html`: the review-notes dialog with its floating button, and the link in the menu.
2. Add the CircularXX `.woff2` files to `/Fonts`, uncomment the `@font-face` rules at the top of `style.css`, and remove the three Google Fonts lines from `index.html`.
3. Set `FORM_ENDPOINT` in `main.js` to the Google Apps Script URL RAP uses for the sister sites. `SITE_ID` is already `sgv`. Until then, the forms send nothing.
4. Add the Google Analytics tag if RAP confirms (see the comment in `<head>`).
5. Fill in the Ramona Hall year (search `[year]`) and the location of Public Gathering #1.
6. Confirm the timeline seasons with the team.
7. Finish the body-copy translations once the English is approved.

## Updating

- **New document:** add a row to the table in `#materials`, newest first (there's a commented example), and put the file in `/Documents`. Delete the "Documents will be posted here" row once the first document is added.
- **After a gathering:** change its date line in Get Involved, add a link to its photos, and update the timeline item.
- **Timeline:** each item in `.tl__events` has `--m` (months after October 2026) and, for spans, `--m2`. Change those numbers to move it.
