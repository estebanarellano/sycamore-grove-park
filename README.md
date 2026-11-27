# Sycamore Grove Park & Ramona Hall Master Plan: website

A single scrolling page plus two photo-album pages, in plain HTML, CSS and JavaScript. It uses no framework and no build step, so it deploys like the other master plan sites (GitHub, then Vercel or any static host).

## Files

| File | What it does |
|---|---|
| `index.html` | The page, in order: opening, The Park, The Plan (timeline, steps, final output, team), Get Involved, FAQ, Project Materials, footer |
| `album-park.html`, `album-picnic.html` | Photo albums. They open in a new tab from The Park |
| `style.css` | All styles. Colors, type and spacing are set once at the top under "Tokens" |
| `main.js` | Menu, language switch, the highlighted values in the opening, map Today/Historic switch, timeline layout, forms |
| `translations.js` | Spanish, Cantonese (Traditional Chinese) and Mandarin (Simplified Chinese) for every piece of text, including photo descriptions |
| `Images/` | Web-sized photos (Rio Asch Phoenix), album photos in `Images/album/`, and the recolored park map |
| `Logo/rap-logo.svg` | LA Rec & Parks logo. The pages use an inline copy so it can turn white on black |
| `Fonts/`, `Documents/` | Empty for now |

## Design rules (from the team's comments)

- Only cream (RAP Sand) and black backgrounds.
- One screen per section on laptops and desktops. The page snaps from section to section. On phones it scrolls normally.
- Mostly headline-sized text.
- Photos live in albums, not scattered on the page. Each photo has a short description for screen readers and no visible caption.
- No in-page links except the top bar and menu.
- RAP colors; the timeline uses tints of RAP Green, Light Orange, Dark Orange, Blue, plus Ru's purple. Text on the timeline is always black.
- Accessible: every control works by keyboard and touch, the highlighted values work by tap and keyboard (not only hover), and motion respects "reduce motion".

## Updating

- **Moving a deadline on the timeline:** each item in `#timeline` carries its date (`data-at`, or `data-from` and `data-to`, as `YYYY-MM-DD`). Change that date and the bar or marker moves, and its date label rewrites itself in every language. `data-precision` sets how the date reads: `day`, `month` or `season` ("Spring 2027"). The "Today" line places itself from the current date, so it never needs updating.
- **New document:** add a row to the table in `#materials`, newest first (there's a commented example), and put the file in `/Documents`. Delete the "Documents will be posted here" row once the first document is added.
- **After a gathering:** add an album page for its photos (copy `album-picnic.html`), link it from The Park, and update the gathering's text in Get Involved.
- **Historic aerial:** replace the placeholder in the `data-view-panel="past"` block with an `<img>` of the historic aerial at the same framing as `Images/park-map-*.jpg`.
- **Map labels:** street and place labels are text positioned by `--x` / `--y` (percent of the map) in `index.html`.
- **Text changes:** change the English in `index.html` and the matching key in `translations.js` for each language.

## Before launch

1. Delete the blocks marked `DRAFT ONLY` in `index.html`: the review-notes dialog with its floating button, and the link in the menu.
2. Add the CircularXX `.woff2` files to `/Fonts`, uncomment the `@font-face` rules at the top of `style.css`, and remove the Google Fonts lines from the three HTML files.
3. Set `FORM_ENDPOINT` in `main.js` to the Google Apps Script URL RAP uses for the sister sites. `SITE_ID` is already `sgv`. Until then, the forms send nothing.
4. Add the Google Analytics tag if RAP confirms (see the comment in `<head>`).
5. Add the location of Public Gathering #1, confirm the map places (restrooms and concession stand) and the timeline dates.
6. Have a City translator review `translations.js`.
