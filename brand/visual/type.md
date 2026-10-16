# Type

The live theme overrides the four font settings in code (`snippets/head-type.liquid`). It loads
custom fonts from the store's Files with `file_url`. The Figtree values in Theme Settings
(`font_family_*`) are only what shows if that code is gone.

| Role | Live font | Source |
|---|---|---|
| Heading, subheading | Heading Now, bold | `Heading-Now-56-Bold.woff2` in Files |
| Accent | EB Garamond, italic | `EBGaramond-Italic.woff2` in Files |
| Body | Jost, regular / bold / italic | `Jost-*.woff2` in Files |
| (Loaded, role unclear) | Boom Internal | `BoomInternal-Regular.woff2`, used in `assets/theme.css` |

Analog's settings pick fonts only from Shopify's font library, so these fonts need a theme
change. That is work item V1 in `splice/theme-plus-dev-denislav/todo.md`.

## Rules

- **Headlines are capitals.** `type_uppercase_h1`, `_h2`, `_h3`, `_h5`, `_h6`, `_section` and `_button` are on. Type the text in normal case; the settings make the caps, so the merchant can turn them off in one place
- **The accent is the soft voice.** The italic serif accent sets a calm counterpoint to the bold capital headings. Use it for kickers, labels and the "BEFORE / WITH BOOM!" pairs. Keep it to a few words
- **Kickers stay in normal case** (`type_uppercase_kicker` is off)
- `type-h2` is large (`type_size_h2`). Use it once per section
- Doses and numbers ("10g", "150mg") can take a heading preset on their own as a stat

## How it goes wrong

- The custom fonts are missing and the page falls back to Figtree: it looks like a theme demo, not BOOM!
- Capitals typed by hand: they stay capitals when the setting changes
- The italic accent used for whole paragraphs: it loses its effect and reads poorly
