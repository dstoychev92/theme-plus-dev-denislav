# Color

Values: `tokens.css` and `theme-settings.json`. Extracted from the live theme.

## Schemes and their jobs

| Scheme | Job | Share of a page |
|---|---|---|
| `scheme-default` (warm cream canvas, coffee-brown content) | Most sections. The calm base | About two thirds |
| `scheme-opposite` (`color_scheme_dark`, coffee-brown canvas) | One emphasis band, such as before/after or the science block | One band per page at most |
| `scheme-header` (white canvas) | The header only | Header |
| `scheme-footer` (orange canvas) | The footer | Footer |
| `scheme-sub-footer` (deep blue canvas) | The bar under the footer | Sub-footer |
| `scheme-success` (red canvas) | Success messages, and badges that must shout | Small surfaces |
| `scheme-error` (pale cream) | Errors | Small surfaces |

## Rules

- **Primary is coffee brown** (`color_primary`) on the default scheme. It is the button colour. Use one primary button per screen, because the warm base has little contrast and a second button competes
- **Secondary is the blue** (`color_secondary`) on the default scheme. It is the second accent and the colour of Brain Coffee moments. Keep it to text accents and small marks
- **Orange, red and blue are the "BOOM!" colours.** Each sits in its own band (footer, success, sub-footer). Never put two of them side by side in one section
- Sale prices use `color_sale` (orange on the default scheme)
- Product badges use `card_badge_color_bg` and `card_badge_color_text`, set apart from the schemes

## How it goes wrong

- Every section on `scheme-default`, with no dark band: the page reads flat and beige
- Orange, red and blue in one section: it stops reading as coffee and starts reading as a sale flyer
- A blue button: blue is an accent, not an action
