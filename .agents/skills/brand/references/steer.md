# Steer the look toward what the merchant wants

The sandbox starts as the store's current settings. Steering moves it toward the style the
merchant has in mind, usually one they can point at but not describe. The work is an interview
that turns taste into references, references into systems, and systems into settings, in rounds
the merchant can react to.

Never ask for CSS values, hex codes, or a style label from a list such as "minimal" or "bold".
People recognize what they like faster than they can name it. Ask for examples and reactions.

## 1. Read what is already true

- `brand/readme.md`, `brand/visual/direction.md`, and `brand/visual/signature.md`, if they exist.
  A recorded direction is the starting point. Ask before replacing it.
- `brand/facts.md`, and `PRODUCT.md` when the theme has one: who buys, what the store sells, the brand commitments that must survive (a name,
  a logo, a color the products are known by).
- The sandbox as it stands, served. Look at it before asking anything, so the first round can
  name what it does now.
- The live store's logo and product photography. A palette fights the photographs or serves them.

## 2. First round: references

Use the structured question tool. Ask at most three questions, each with room for free text, and
ask for links and names, not adjectives:

1. **Sites they love.** Two to four sites, in any category, whose look they want some of. For
   each, what they like about it in their own words: "the big serif headlines", "it feels calm",
   "the way the buttons look".
2. **What would feel wrong.** A site, a look, or a quality that is not them. This bounds the
   search as much as the likes do.
3. **What is fixed.** Fonts they own or must keep, logo colors, accessibility needs, a
   competitor to stay clear of.

Offer type as its own question only when they mention it: "Is there a typeface, or a site whose
type, you want?" When they have no references, offer three or four from their own world: the
publications, shops, and places their customers know. Never offer the category default as a
reference.

## 3. Study each reference

Open each site in the browser and read its system, not its surface. Run this on the page to read
what it actually uses:

```js
(() => {
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      font: s.fontFamily.split(',')[0].replace(/["']/g, ''), weight: s.fontWeight, size: s.fontSize,
      leading: s.lineHeight, tracking: s.letterSpacing, case: s.textTransform, color: s.color,
    };
  };
  const q = (selector) => document.querySelector(selector);
  const button = q('button, .btn, [class*="button"], a[class*="btn"]');
  const b = button ? getComputedStyle(button) : null;
  const card = q('[class*="card"], article, li img')?.closest('a, article, li, div');
  return {
    background: getComputedStyle(document.body).backgroundColor,
    text: pick(q('p')),
    h1: pick(q('h1')), h2: pick(q('h2')), h3: pick(q('h3')),
    small: pick(q('nav a, small, [class*="eyebrow"], [class*="kicker"]')),
    button: b && {
      background: b.backgroundColor, color: b.color, radius: b.borderRadius, border: b.border,
      padding: b.padding, font: b.fontFamily.split(',')[0], weight: b.fontWeight, case: b.textTransform,
    },
    cardRadius: card ? getComputedStyle(card).borderRadius : null,
    maxWidth: getComputedStyle(q('main') ?? document.body).maxWidth,
    links: pick(q('main a, p a')),
  };
})();
```

Take a desktop and a phone screenshot. Then write `brand/references/<site>.md`, short:

- **Ground and main colors**: what the page sits on, what carries text, where the accent goes and
  how much of the page it takes.
- **Type voices**: the families, which does what, weights, case, and the size jump from body to
  headline.
- **Shape and depth**: corners, lines, shadows, density.
- **Motion**: what moves, and how much.
- **The signature**: the one thing that makes it recognizable.
- **What the merchant liked**, in their words, and **what to borrow**: the qualities, never the
  logo, name, photography, or copy.

## 4. Translate into settings

Map each borrowed quality onto the levers in the settings map (`brand/sandbox/settings-map.json`):

| Quality | Levers |
|---|---|
| Type families and pairing | `--root-font-stack-{heading, subheading, accent, body}` and their weights; add each family to `fonts.css` |
| Headline scale and drama | the type scale (`--font-r1` to `--font-r15`; the theme offers three), and each preset's step, `--root-font-size-{preset}-md` |
| Caps, small labels, eyebrows | `--root-caps-transform-{preset}` and caps tracking |
| Ground, text, accent | the scheme colors `--{scheme}-{canvas, content, muted, primary, secondary}-oklch` |
| Dark sections or inverted bands | a second scheme, and the dark role `--scheme-dark-*` |
| Corners | `--radius-sm`, `-md`, `-lg`, and the role picks `--radius-btn`, `-card`, `-banner-default` |
| Density and air | `--raw-space-sm`, `-md`, `-lg`, the gutter and margin picks, `--raw-section-rhythm`, `--root-page-width` |
| Button character | the role radius, and the stroke and soft button variables |
| Accent marks | the decoration settings (Liquid only: record them under `--setting-*`) |

Check every family against Shopify's font library before choosing it. Shopify serves its own
library, not Google Fonts, and a family the library lacks cannot be a Theme Setting. Say so when a
reference's type is not available, and offer the closest family that is.

When a quality needs a lever the theme does not have (a fifth font, a shade ramp, a fourth radius,
a scale step the three scales lack), name it as a theme change and keep it out of the settings
until the user decides.

## 5. Show directions, not a blend

Make two or three directions, each a complete, coherent system with its own reason, not three
mixes of the same references. One may stay close to the strongest reference; one should take the
merchant's own world further. Write each as `brand/sandbox/directions/<name>.css`: a copy of
`settings.css` with that direction's values. A direction with other fonts starts with its own
`@import` line for them.

Each direction opens beside the others at `http://localhost:4747/?settings=directions/<name>.css`.
Send the links, with one line per direction on what it keeps from which reference. When the page
needs a concept the brand page does not show (a hero, a product grid, a band of dark color), add
that block to `index.html` in the theme's own classes, so every direction renders it.

## 6. Rounds of reaction

Ask what is right and what is wrong in each direction, in their words. Take the answer as
evidence, not orders: "too cold" can mean the canvas, the type, or the spacing. Change one family
of levers per round so the merchant can tell what moved. Stop after three rounds, or sooner when
they pick one. Endless iteration means the references disagree; say so and ask which matters
more.

The chosen direction becomes `settings.css`. Keep the others in `directions/` until export, then
delete them with the user's agreement.

## 7. Record the decision

Write `brand/visual/direction.md`: the references and what was taken from each, the direction
chosen and the reason in the merchant's words, the directions turned down and why, and the open
questions. Then run export and report its three lists, and offer the document job to write the
rules (`references/visual.md`).
