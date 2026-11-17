# Sycamore Grove Park Master Plan website

A one-page, four-language project site for the Sycamore Grove Park Master Plan, built on the same template as the Elysian Park and South Griffith Park sites.

**Status:** draft mockup for review, November 18, 2026.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page. Every piece of text carries a `data-i18n` key. |
| `style.css` | The shared template's styles, plus a Sycamore Grove section at the end. |
| `main.js` | The shared template's script: language menu, carousels, accordions, forms. |
| `translations.js` | Text for English, Spanish, Cantonese (粤, Traditional characters), and Mandarin (普, Simplified characters). |
| `mockup.css`, `mockup.js` | Review notes and placeholders. Mockup only. |
| `Logo/`, `Images/`, `Documents/`, `Fonts/` | Empty for now. |

## Changes from the shared template

- **Then and Now section** (`#history`): a new section about the Western sycamores and the North Branch creek, built from existing template parts.
- **Get Involved:** a survey placeholder and an "online version of each workshop" block.
- **Footer:** a proposed park accent color (`--park`, RAP brand green #127C4E).
- **Fixes:** the footer stacks on phones (the template's runs off-screen with a long note), long button labels wrap, accordion buttons use the site font, and photo credits stay clear of the carousel dots.
- **Fonts:** `'Figtree'` is added to the font stack as a stand-in until the CircularXX files are in `Fonts/`.

## Before this becomes the real site

1. Delete `mockup.css`, `mockup.js`, and everything marked `MOCKUP ONLY` in `index.html`, including the `mock-note` asides.
2. Replace the placeholders. Each one has a comment showing the file it expects:
   - RAP logos in `Logo/`
   - the park map, visual timeline graphic, and photos in `Images/`
   - the Sycamore Grove footer wordmark in `Logo/`
3. Copy the CircularXX font files into `Fonts/` and remove the Figtree link from `index.html`.
4. Set `FORM_ENDPOINT` at the top of `main.js` to Sycamore Grove's Google Apps Script web app. It is empty on purpose, so the mockup never sends data to the sister sites' sheet.
5. Add the Google Analytics tag and the share image (`og:image`, `og:url`) if RAP confirms them.
6. Finish `translations.js`: Spanish, Cantonese, and Mandarin currently cover only the shared labels.
7. Write the drafts marked `[Draft: …]` in the FAQ with the project team.
