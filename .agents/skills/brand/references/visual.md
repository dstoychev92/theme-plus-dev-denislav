# Write the visual rules

The visual rules say how to use the values the sandbox settled, and why. A person or an agent who
has never seen the store reads them and builds a page that looks like the store. Write them after
steering, or to record a brand that already exists in the settings.

## Sources

- `brand/sandbox/index.html` and `settings.css`, served and looked at, desktop and phone.
- `brand/visual/direction.md` for the reasons, when it exists.
- `brand/sandbox/settings-map.json` for the setting, variable, and class behind each value.
- The theme's `DESIGN.md` for the system the brand sits on. The brand rules narrow it; they never
  contradict it. A rule that needs the theme to behave differently is a theme change, not a rule.

## Files

Write only what the brand has decided. A file that would restate the theme's defaults is left out
and listed in `readme.md` as undecided.

| File | Holds |
|---|---|
| `signature.md` | The one move that makes a surface this brand's: what it is, why it is the signature, where it lives, the rules that keep it working, and how to get it right the first time |
| `color.md` | Which scheme does what, the proportion of each color on a surface, pairings, what never goes on what |
| `type.md` | What each role and preset is for, how to pick a level, case, and the moments that get the accent or the caps |
| `layout.md` | Width, rhythm, spacing sizes, corners, depth, and how sections follow each other |
| `components.md` | Buttons, links, badges, fields, and cards: which variant for which job |
| `motion.md` | What moves and what holds still |
| `checklist.md` | Five to eight questions that catch an off-brand page, each one answerable by looking |

## How to write a rule

- **Name the token, setting, or class.** `bg-canvas`, `type-h2`, `rounded-btn`,
  `color_scheme_dark`. Never a hex value, a pixel size, or a weight: those live in `tokens.css`, and a
  copy in prose goes stale the day a setting changes.
- **Give the reason.** "Primary appears once per screen, on the action that matters, because it is
  the only saturated color and the eye goes to it" survives cases the rule did not foresee. "Use
  primary for buttons" does not.
- **Make it checkable.** "One `type-h1` per page" can be checked. "Keep headlines elegant" cannot.
  Vague words read differently to every model and every person.
- **Proportion, not only permission.** Say how much of a surface a color or element takes, not
  just that it is allowed.
- **Name the failure.** Each file ends with the two or three ways a correct-looking page goes
  wrong for this brand, such as every section on the same scheme, or buttons in every band.
- **Point at the page.** Refer to the brand page's section for each example rather than copying
  markup into the doc.

## signature.md

Every brand needs one move that a competent default would not make: a type pairing used in a
specific way, a color that arrives once, a crop, a rhythm of dark and light bands. Find it in the
direction, or ask the merchant what they would miss if it were gone. Write it as a rule with
limits: where it appears, how often, and what it never does. When the brand has none yet, say so
in `readme.md`. Do not invent one to fill the file.

The signature is a look. The delight (`brand/delight.md`) is a moment. They often share one idea:
the delight carries the signature into something a shopper does. Write the delight with
[delight.md](delight.md), not here.

## After writing

Update `brand/readme.md`: the brand in five lines, the files and what each is for, and what is
undecided. Then update the **Store brand** section of the theme's `DESIGN.md` to a short summary
that names the schemes, fonts, and signature and points to `brand/`.
