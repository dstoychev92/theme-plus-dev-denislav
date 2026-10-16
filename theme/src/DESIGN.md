# Analog design

Analog is a Shopify Theme Store theme by Groupthought. This file records the design system and the
rules that keep a new block, section, or style consistent with it. Read it before any design or
styling work. `AGENTS.md` explains how the theme is built.

Theme Settings hold every brand value: colors, fonts, spacing, rounding, and element styles. The
CSS reads those values through custom properties and Tailwind utilities. A design change belongs in
a setting or a token, not in a raw value in markup.

## Design position

Analog is an editorial commerce theme. Product photography carries the page. Type and color
schemes frame it. Interactive elements stay quiet until a visitor uses them.

- Schemes, not shades. A region picks a named color scheme. A token blends with its contrast
  partner. There is no numeric shade scale.
- Four font roles and thirteen type presets. A text element picks a preset. Theme Settings decide
  what the preset looks like.
- One responsive scale. `r1` to `r15` drive spacing and type. Values shrink on tablet and mobile.
- Variables through classes. A `vars-*` class sets custom properties only. Children read the
  inherited values. This is how a section passes a value to its blocks without Liquid.
- Controls do not shrink. Buttons and fields use fixed row heights, because fingers do not shrink
  on mobile.

## Store brand

Record the store's brand decisions here: what it sells, who buys, the feeling the design must
give, and the reasons behind color, type, and layout choices. Name the scheme, font, and setting
next to each decision. Keep the values in Theme Settings (`config/settings_data.json`). Grow this
section by addition. Ask before you remove or rewrite a rule.

_No store decisions recorded yet. The theme defaults at the end of this file apply._

## Color

### Schemes

A color scheme is a merchant-defined set of seven colors (`color_scheme_group`). Theme Settings
assign schemes to roles: default (`color_scheme_default`), dark (`color_scheme_dark`), light
(`color_scheme_light`), success (`color_scheme_success`), and error (`color_scheme_error`). A
section picks its scheme with its `color_scheme` setting. The default scheme applies to `<html>`.

| Token | Setting | Role | Contrast partner |
|---|---|---|---|
| `canvas` | `color_canvas` | Background | `content` |
| `content` | `color_content` | Text, icons, lines, shadows | `canvas` |
| `muted` | `color_muted` | Secondary text | `canvas` |
| `primary` | `color_primary` | Primary buttons, the action color | `color_primary_contrast` |
| `secondary` | `color_secondary` | Links, small accents, keyboard focus on fields | `canvas` |
| `sale` | `color_sale` | Sale prices and sale badges | `canvas` |

Derived tokens: `success` and `error` are the primary colors of the success and error schemes.
`black` and `white` are fixed. `stain` is the color a button or badge is painted with (see
Components).

A scheme is dark when its canvas lightness is below 50. A dark scheme uses a black shadow color and
stronger mix steps, because screens show little difference between dark colors.

### Using color

- Scheme tokens: `bg-canvas`, `text-content`, `text-muted`, `bg-primary`, `text-primary-contrast`,
  `fill-content`, `stroke-secondary`. Every token has a `-contrast` variant.
- Blends: `{token}-mix-{step}` with steps 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, and 95.
  `bg-content-mix-10` is 10 percent content blended into canvas. `bg-primary-mix-95` is 95 percent
  primary blended into its contrast color. The steps follow the scheme's `--mix-*` values, so the
  rendered percentage is tuned per scheme. A dark scheme renders the low steps much stronger.
- Lines: `border` (default), `border-line-subtle`, `border-line`, `border-line-bold`. These are
  content at a scheme alpha. Use them for every divider and outline.
- Tint: `bg-content-mix-5`. The section "Background" setting value `tint` renders it.
- Alpha: `--content-alpha-3|5|10|20|50` and `--canvas-alpha-20|30` for plain CSS. Do not write
  `oklch(var(--content-oklch) / 10%)` inline.
- Plain CSS reads `--canvas`, `--content`, `--muted`, `--muted-subtle`, `--primary`,
  `--primary-contrast`, `--secondary`, `--sale`, `--content-mix-{step}`, `--line-subtle`,
  `--line`, and `--line-bold`. These are solid colors.
- Switch a subtree with `vars-{scheme id}` (`vars-scheme-default`, `vars-scheme-opposite`),
  `vars-scheme-light`, `vars-scheme-dark`, `vars-scheme-success`, or `vars-scheme-error`. A field
  uses `vars-scheme-error-if-invalid` and `vars-scheme-success-if-valid` for its state color.
- A custom color comes from a setting. The shared color dropdown offers content, muted, primary,
  secondary, sale, and custom. A custom value becomes `--color-custom-text` with `text-custom`, or
  `--section-custom-bg` on a section.

### Color rules

- Never write a hex, rgb, or named color in markup or component CSS. The placeholder colors in
  `theme.css` are the only exception.
- Keep the OKLCH source and its RGB fallback together. Code marked `oklch-fallback` must change
  with the token it mirrors.
- Links in rich text are `secondary` unless the block sets a color.
- Check contrast on the resolved colors of every scheme the element can render in. A token name
  does not prove contrast. Body text 4.5:1. Large text and control boundaries 3:1.
- Do not add a numeric shade system or a second palette.

## Typography

### Roles and presets

Four font roles come from Theme Settings: heading, subheading, accent, and body
(`font_family_*`). Each role carries a font stack, a style, normal and bold weights, an optional
size adjustment (`font_rebalance`, `font_adjust_*`), and caps tracking (`font_caps_tracking_*`).

Thirteen presets map text to a role, a size step, and a case:

| Preset | Class | Default |
|---|---|---|
| h1 to h6 | `type-h1` to `type-h6` | heading role at r10, r8, r7, r6, r5, r4 |
| p | `type-p` | body at r4 |
| section | `type-section` | follows h2; section titles |
| kicker | `type-kicker` | accent at r4, uppercase |
| micro | `type-micro` | body at r2, uppercase |
| button | `type-btn` | follows h6 |
| accordion | `type-accordion` | follows h6 |
| tab | `type-tab` | follows h6 |

Each preset's Theme Setting (`type_preset_*`) is `preset` (the built-in table), another preset's
name (follows it), or `custom` (`type_font_*`, `type_size_*`, `type_uppercase_*`). Blocks expose
the same choice through the shared type-preset setting. `custom` on a block renders
`font-family-{role} text-r{n} type-case-uppercase|normal type-apply`.

`type-resize-xs|sm|md|lg|xl` moves a preset from two steps down to two steps up.
`type-resize-all-*` does the same for every child, for rich text.

### Scale

Sizes come from the `font_scaling_system` setting (`sm`, `md`, `lg`). Each system has a mobile, a
tablet, and a desktop value for every step. The `md` system in pixels:

| Step | r1 | r2 | r3 | r4 | r5 | r6 | r7 | r8 | r9 | r10 | r11 | r12 | r13 | r14 | r15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Desktop | 10 | 11.5 | 13 | 14.5 | 17.5 | 22 | 26 | 32 | 39 | 48 | 58 | 71 | 87 | 106 | 129 |
| Mobile | 10 | 11.3 | 12 | 13 | 15.5 | 17 | 20 | 24 | 27 | 32 | 37 | 43 | 49 | 57 | 67 |

Type steps at the `sm` and `lg` breakpoints. `text-r{n}` sets a size from the scale. It also sets
the block and prose leading for that step.

Leading follows the step. Block leading runs from 1.5 at r1 to 1 at r8 and above. Prose leading
runs from 1.625 to 1.25, and is 1 at r14 and r15. `leading-prose` applies prose leading to a
subtree. `leading-block` applies block leading. `leading-clip-safe` floors leading at 1.15 inside
a clipped wrapper, so descenders survive.

Uppercase text renders at 85 percent of its size with caps tracking (0.125em unless
`font_caps_tracking` sets a role value). `type-case-uppercase` and `type-case-normal` switch it.

### Rich text

Three levels, each a class on the wrapper:

- `inline-richtext`: bold, italic, links.
- `richtext`: adds paragraphs, h1 to h6, and lists. Headings and paragraphs take `type-*` presets.
- `prose`: adds tables, block quotes, code, images, and video. Page content and product
  descriptions use it.

Bold uses the role's bold weight. `font-bold` and `font-normal` read `--font-weight-bold` and
`--font-weight-normal`.

### Type rules

- Use a preset class. Use `text-r{n}` with `font-family-{role}` only for a custom element that a
  setting controls.
- Keep the heading level (the h1 to h6 tag) separate from its preset. The SEO tag setting decides
  the tag.
- Do not add a fifth font role. Do not load a font outside Theme Settings.
- Fonts load with `font-display: swap`. The `prefonts:` and `fonts:` variants hide or show content
  around the swap.
- To center text in a control, use `my-type-center-add`, `py-type-center-add`, or
  `ty-type-center`. They use the font's baseline ratio.

## Spacing and layout

### The responsive scale

`r1` to `r15` are pixel steps with a mobile, a tablet, and a desktop value. Use them for gaps,
padding, margins, and sizes: `gap-r5`, `p-r8`, `mt-r3`, `size-r9`.

| Step | r1 | r2 | r3 | r4 | r5 | r6 | r7 | r8 | r9 | r10 | r11 | r12 | r13 | r14 | r15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Desktop | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 38 | 50 | 68 | 96 | 128 | 192 |
| Tablet | 2 | 4 | 6 | 8 | 12 | 15 | 18 | 22 | 27 | 35 | 45 | 56 | 75 | 105 | 150 |
| Mobile | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 20 | 24 | 32 | 42 | 60 | 80 | 120 |

Spacing steps at the `md` and `lg` breakpoints. Breakpoints: sm 640, md 768, lg 1024, xl 1280,
2xl 1536 pixels.

Merchant spacing settings scale with the same ratios. `--r-multiplier` is 1 on desktop, 0.83 on
tablet, and 0.62 on mobile. The page margin scales harder (`--b-multiplier` 1, 0.554, 0.315), so
content reaches closer to a phone's edge.

### Layout variables

Theme Settings feed `--raw-*` values. CSS computes `--root-*` values. A section or block replaces
`--layout-*` values for its subtree.

| Setting | Variables | Meaning |
|---|---|---|
| `grid_spacing_small`, `_medium`, `_large` | `--raw-space-*` to `--root-space-sm\|md\|lg` | The three spacing sizes a merchant picks from |
| `grid_spacing_margin` | `--raw-page-buffer` to `--root-buffer` to `--layout-buffer-x\|y` | Buffer: space outside content, the page margin |
| `grid_spacing_gutter` | `--raw-gutter` to `--root-gutter` to `--layout-gutter-x\|y` | Gutter: rhythmic space between siblings |
| `grid_spacing_card` | `--raw-gutter-card` to `--layout-gutter-card` | Gap between cards |
| `layout_site_width` | `--root-page-width` to `--page-width` | Page width, 1000 to 2000 pixels |
| `section_rhythm_default` | `--raw-section-rhythm` to `--section-rhythm` | Vertical space between sections |

Utilities read the layout layer: `gap-layout`, `gap-x-layout`, `gap-y-layout`, `p-layout`,
`px-layout`, `py-layout`, `pt-layout`, `m-layout`, and the `-gutter` forms (`p-gutter`,
`px-gutter`, `mb-gutter`). `gap-sm|md|lg` read the three spacing sizes. `vars-layout-gutter-card`
switches a subtree to the card gap. `vars-layout-like-mobile` forces mobile spacing on a narrow
desktop column.

Row heights do not scale: `--row-xs` 24, `--row-sm` 32, `--row-md` 40, `--row-lg` 50, `--row-xl`
60 pixels. Buttons, fields, steppers, and accordion rows use them. `--text-buffer` (10 pixels) is
the minimum gap between text elements.

### Page and sections

- The page is a grid (`page-grid`) with header rows, section rows, and a footer row. A section can
  opt into the header rows, so a transparent header overlays it with no layout shift.
- A section renders through `core-section`. Its wrapper applies the scheme, the background, and
  the width. Section width: `bleed` (edge to edge), `full` (inside the page margin), `page` (inside
  the page width). Content width: `full`, `page`, or custom. The section grid names its lines
  `fullbleed`, `section`, and `content`, so a background can bleed while content stays inside.
- Section rhythm is the vertical space between sections (`set_rhythm`). A contained section with a
  background adds it as padding.
- Heights use small viewport units: `--height-screen`, `--height-screen-three-quarters`,
  `--height-screen-one-half`, `--height-screen-one-third`, `--height-screen-one-quarter`.
- Alignment flows through `--content-align` (start, center, end), set by `vars-content-align-*`.
  Read it with `text-content-align`, `items-content-align`, and `justify-content-align`.
  `--content-gravity` is the vertical counterpart. A banner places its content with
  `vars-placement-grid-{top|middle|bottom|full}-{left|center|right}`.
- Groups compose content: frame, row, flex, grid, inline, and text groups. A width setting renders
  `w-layout`. `cq-width` names a container-query context. Add `cq-width-unsafe` to an ancestor
  that shrink-wraps its content.

### Layout rules

- Pick a scale step before a new value: `gap-r5`, not `gap-[13px]`.
- Put a section-level override in `--layout-*`. Never write a section value into `--root-*` or
  `--raw-*`.
- Use logical utilities (`ms-`, `pe-`, `start-`, `text-start`). The layout sets `dir="rtl"` for
  right-to-left locales. `text-left` and `text-right` are aliases for start and end.
- Keep a 44 by 44 pixel touch target. `hit-area-r{n}` and `hit-area-after-r{n}` grow the target
  without growing the element.

## Shape

Theme Settings define three radii: `rounding_sm`, `rounding_md`, `rounding_lg`
(`--radius-sm|md|lg`), plus `none` and `pill`. Each element role picks one:

| Role | Setting | Class or variable |
|---|---|---|
| Buttons | `button_rounding` | `rounded-btn` |
| Tabs | `tab_rounding` | `rounded-tab` |
| Small elements and badges | `element_default_rounding` | `rounded-element` |
| Form fields | `form_field_rounding` | `rounded-form-field`, capped at half the field height |
| Cards | `card_rounding` | `--radius-card` |
| Banners and large media | `banner_default_rounding` | `rounded-banner` |

`vars-btn-rounding-*`, `vars-tab-rounding-*`, and `vars-element-rounding-*` override a role for a
subtree. `rounded-sm|md|lg` use the raw radii. Dialogs are square unless a card radius applies.
Swatches are circles or squares (`swatch_shape`).

Media shapes: `shape-rounded-rect`, `shape-keyhole`, `shape-blob-1` to `shape-blob-4`,
`shape-hexagon`, `shape-octagon`, `shape-sunburst`, `shape-parallelogram`, `shape-stamp-sharp`,
`shape-stamp-rounded`, `shape-ticket-stub`. Masks: `mask-fill-{diamond|circle|triangle|square|dot|plus|sparkle}`
and `mask-mark-{cross|asterisk}`.

Decoration is a global accent (`decoration_type` shape or image, `decoration_shape`,
`decoration_color`, `decoration_width`, `decoration_opacity`). Blocks render it through
`core-decoration`. Text highlights: `highlight`, `highlight-partial`, and `highlight-underline`
with `--highlight-color`.

## Depth

Analog is flat by default. Depth comes from lines and tints, not shadows.

- Lines: `border-line-subtle`, `border-line`, `border-line-bold`.
- Tints: `bg-content-mix-5` for a tinted surface. `bg-content-mix-10` for a badge background.
- Shadows: `shadow-low`, `shadow`, and `shadow-high` are layered and tinted with the scheme's
  content color (black in a dark scheme). Dialogs and floating panels use them. Cards and media
  do not.
- Glass: `frosted-glass` blurs behind a 20 percent content tint. `border-highlight` draws a 10
  percent gradient border. `vars-btn-blur` and the soft button style blur behind buttons on media.
- Drop shadows (`drop-shadow-low|DEFAULT|high`) follow `--light-source-angle` and
  `--light-source-distance`.

## Components

### Buttons

`core-button` renders every button. A button has a color, an appearance, and a size.

- Color (`vars-btn-{color}`): primary (default), secondary, white, black, canvas, content, muted,
  sale, custom, or a custom gradient. The color sets `--stain` and `--stain-contrast`. The
  appearance paints with them.
- Appearance (`vars-btn-{appearance}`): `fill` (default; stain background, contrast text, hover
  lightens), `stroke` (stain text and border; `btn_stroke_*` settings control border width, border
  opacity, background opacity, and blur), `soft` (stain text on a stain tint; `btn_soft_*`
  settings), `bare` (text only, a tint on hover), `blur` (frosted), `none`.
- Size (`vars-btn-{size}`): xs, sm, md (default), lg, and xl map to the row heights. `auto`
  matches the current control size. Horizontal padding is twice `--btn-padding`.
- Type: the `btn` preset. Font and case come from Theme Settings.
- Rounding: `rounded-btn`.
- Hover: a cursor-following glow (`hover-effect-bg-highlight`) on fine pointers. A gradient button
  (`btn-gradient`) moves its light toward the cursor.
- Disabled: 50 percent opacity.
- Controls on media (slider arrows, overlay buttons) use the `slider_control_style` and
  `overlay_controls_style` settings.

### Badges

`vars-badge-fill|stroke|soft` reuse the button stain and the stroke and soft settings. Badges use
`rounded-element`. Product card badges use the `card_badge_color_*` colors. The sale badge can use
its own colors (`sale_badge_color_*`).

### Links

`core-link` renders a text link. `vars-link-clean`: the underline appears on hover.
`vars-link-line`: the underline slides out and back in. `vars-link-both`: both. `link-line` draws
the animated underline on multi-line text. Rich text links are `secondary`.

### Fields and controls

Controls share the row heights through `vars-control-{xs|sm|md|lg|xl}`. `md` is the default.
Inputs keep a 16 pixel minimum font size on mobile, so iOS does not zoom.

- Text fields (`field-input`, `field-textarea`, `field-select`, `field-custom-select`): a
  `vars-field` wrapper with a floating label that shrinks to r1. The border is `line-subtle`,
  `line-bold` on focus, and `secondary` on keyboard focus. The background is canvas. The radius
  follows `form_field_rounding`, capped at half the height.
- Checkbox and radio: 18 pixels on mobile, 16 on desktop. The border is `content-mix-20`. The
  checked state fills with a content gradient.
- An invalid field switches to the error scheme through `vars-scheme-error-if-invalid`. Status
  messages use the success and error schemes.
- Steppers, ranges, and custom selects follow the same control size.

### Cards

- Product, collection, and article cards come in sizes `lg` (grid and slider cards), `md`, `sm`,
  and `xs` (compact rows).
- A `lg` card is `normal` (flat, transparent, text under the media) or `framed` (`content-mix-5`
  background, card radius, r5 text inset).
- `md` and `sm` cards sit on canvas with a `line-subtle` border and a radius no larger than
  `--radius-md`.
- The media aspect ratio comes from `card_aspect_ratio`. The fit is `crop`, `scale` (with a scale
  color), or `uneven`.
- A card shows up to five media, swatches at the top or bottom, badges, an optional rating, quick
  add, and quick view. Titles can truncate.
- Card lists are grids, sliders, or showcases. A mobile slider shows `slider_columns_mobile` cards.
  The card gutter separates cards.

### Icons

Icons are 24 by 24 SVGs, rendered inline by `core-icon`. A stroke icon draws with `currentColor`
and no fill. A fill icon fills with `currentColor`.

- Sizes in em: `vars-icon-size-xs` 0.6, `sm` 0.8, `md` 1, `lg` 1.4, `xl` 1.6. Icons follow the
  text size around them.
- Stroke weight: light 1, regular 1.5 (default), bold 2. A container query raises the weight at
  small sizes (1.2 at 32 pixels, 1.5 at 22, 2 at 16 for medium and simple icons, 3 at 13 for
  simple icons), so a small chevron stays legible. `vars-icon-grade-*` requests a grade. A section
  can shift the whole tier.
- Art icons are decorative fill icons with a second tone at 50 percent opacity.
- The cart icon is a setting: bag, basket, or cart.

### Tabs, accordions, hotspots

- Tabs: `tab_style` underline or outline, `tab_rounding`. Tabs use the `tab` preset.
- Accordions: `accordion_button_style` chevron or plus-minus. Rows use the `accordion` preset and
  the row heights.
- Hotspots: `hotspot_style` solid, ring, or crosshair.
- Carousel pagination: `carousel_pagination_style` counter, dots, or lines.

### Dialogs and drawers

A dialog fades in on mobile. On desktop it slides in from the bottom or a side, or scales in. The
backdrop fades first. A drawer slides in from a side and is 25rem wide on desktop. Both use the
sharp ease. The cart drawer, quick view, pickup drawer, and header drawer share the drawer
primitive.

### Header

The header stacks a toolbar and a menu. It can be transparent over the first section. A
transparent header picks light or dark text from that section's scheme. Muted text in a
transparent header becomes semi-transparent content. The header blurs its background by
`--header-bg-blur` (10 pixels).

## Motion

- Easings: `--ease-in-out` cubic-bezier(0.215, 0.61, 0.355, 1) is the default for every
  transition. `--ease-in-out-sharp` is for dialogs and drawers. `--ease-out-fast` is for quick
  exits.
- Duration: 300 milliseconds by default. `duration-*` and `delay-*` utilities offer 50 to 3000
  milliseconds.
- Entrance: `entrance-container` with `entrance-item` children fades and raises content when the
  section enters the viewport. Stagger 150 milliseconds, duration 1000 milliseconds, rise 15
  pixels, tuned per container with `--entrance-animation-*`. Variants: `entrance-standard`,
  `entrance-fade`, `entrance-draw` (strokes SVG paths). `no-children-entrance` stops nested
  entrances. Animations stay paused until the section intersects.
- Reduced motion: entrances complete at once. Swatch, option button, and pending animations stop.
  Gate new motion with `motion-safe:`. Hide decorative motion with `motion-reduce:`.
- Navigation uses view transitions. Old content fades out in 100 milliseconds. New content fades
  in over 300.
- Parallax on image tiles follows the `parallax` setting.
- Hover effects (the cursor glow, the text highlight, and focus-group dimming of siblings to 50
  percent) run only on fine pointers at `md` and above.
- Slideshow progress indicators animate over the slide duration. A slide transition takes 600
  milliseconds.
- A button transitions color, background, border, and blur over 300 milliseconds.

## Visual states

- Focus: a 2 pixel outline in `--focus-outline-color` (the scheme's content color), shown only
  while `data-keyboard-active` is on `<body>`. Do not remove an outline unless the component draws
  its own keyboard-focus style. The `keyboard-active:` and `keyboard-focus:` variants style the
  keyboard case.
- Pointer: the `touch:` and `mouse:` variants separate touch from hover devices. Required content
  never depends on hover.
- Selection: `aria-selected`, `aria-expanded`, `data-selected`, and `data-open` are the style
  hooks for selected and open states, so a screen reader regression is also a visible regression.
- Loading: a placeholder uses `--placeholder-bg` and `--placeholder-fill`. A pending swatch or
  option button pulses.
- Disabled: 50 percent opacity and `cursor: not-allowed`.
- Hidden: `[hidden]` always hides.

## Do and don't

Do:

- Use scheme token utilities for every color.
- Use a `type-*` preset for every text element.
- Use `r1` to `r15` and the layout utilities for every space.
- Use the role radii (`rounded-btn`, `rounded-element`, `rounded-banner`) for every corner.
- Use `core-button`, `core-link`, `core-icon`, `core-image`, and the `field-*` snippets instead of
  hand-written controls.
- Switch a region's colors with its `color_scheme` setting or a `vars-scheme-*` class.
- Write every class name as a complete literal.

Don't:

- Don't write a raw color, pixel size, or font family in markup or component CSS.
- Don't add a shadow to a card or to media.
- Don't invent a token, utility, or `vars-*` class that this file does not list. Add it to the
  theme and to this file first.
- Don't add a fifth font role or a numeric color shade.
- Don't add a physical-direction utility (`ml-`, `left-`, `text-left`) for direction-dependent
  layout.
- Don't reveal required content on hover only.
- Don't add motion without a reduced-motion path.

## Theme defaults

Schema defaults from `config/settings_schema.json`. A store's values are in
`config/settings_data.json` under `current`. Read them before you reason about a store's look.

| Area | Default |
|---|---|
| Default scheme | canvas #ffffff, content #383838, muted #707070, primary #006be5 on #ffffff, secondary #38bc54, sale #de3000 |
| Fonts | Figtree: heading 500, subheading 600, body 400, accent 700 |
| Type scale | `md`; h1 r10, h2 r8, h3 r7, h4 r6, h5 r5, h6 r4, p r4 |
| Spacing | small 10, medium 20, large 40 pixels; page margin large; gutter medium; card gutter small |
| Page | width 1400; section rhythm 60 |
| Rounding | sm 3, md 12, lg 24 pixels; buttons, fields, elements, cards, and banners `sm`; tabs pill |
| Elements | tabs outline; accordion chevron; hotspot solid; pagination counter; swatches circle |
| Cards | aspect ratio 0.9; crop; 1.6 columns in a mobile slider |
| Decoration | diamond, muted, 10 pixels, 30 percent |
| Cart | bag icon; the cart drawer opens on add |

The shipped presets differ from the schema defaults. The Analog preset uses Figtree, the `sm`
scale, spacing 8, 24, and 36, a 1450 pixel page, rhythm 80, pill buttons and fields, `md`
banners, a 15 percent stroke border, underline tabs, plus-minus accordions, ring hotspots, line
pagination, a 0.7 card aspect ratio, an asterisk decoration, and a dark scheme `scheme-opposite`
(black canvas, white content, muted #c6c6c6, primary #483ddf). The Anthem preset uses Outfit for
headings and accent with Inter for body and subheading.

## Token and class index

Pattern rows. `{token}` is canvas, content, muted, primary, secondary, sale, success, error,
black, white, stain, or one of those with `-contrast`. `{n}` is 1 to 15. `{role}` is heading,
subheading, accent, or body.

| Family | Patterns |
|---|---|
| Color | `bg-{token}`, `text-{token}`, `border-{token}`, `fill-{token}`, `stroke-{token}`, `{token}-mix-{5…95}`, `border-line-subtle\|line\|line-bold`, `text-muted-subtle`, `bg-sale-bg`, `bg-page-canvas`, `text-page-content`, `text-custom`, `bg-custom`, `bg-btn`, `text-btn`, `border-btn` |
| Scheme | `vars-{scheme id}`, `vars-scheme-light\|dark\|success\|error`, `vars-scheme-error-if-invalid`, `vars-scheme-success-if-valid`, `vars-stain-{token}` |
| Type | `type-{p\|h1…h6\|section\|kicker\|micro\|btn\|accordion\|tab}`, `type-apply`, `type-resize-{xs…xl}`, `type-resize-all-{xs…xl}`, `type-case-uppercase\|normal`, `text-r{n}`, `font-family-{role}`, `vars-font-family-{role}`, `vars-type-{preset}`, `font-normal\|bold`, `leading-prose\|block\|control\|clip-safe`, `inline-richtext`, `richtext`, `prose`, `my\|py-type-center-add\|swap`, `ty-type-center` |
| Space | `{p\|m\|gap\|size\|w\|h\|inset}-r{n}` and every other spacing utility with `r{n}`, `gap-layout`, `gap-x\|y-layout`, `gap-sm\|md\|lg`, `{p\|px\|py\|pt\|pb\|ps\|pe\|m\|mx\|my\|mt\|mb\|ms\|me}-layout\|gutter`, `{p\|m}-{sm\|md\|lg}`, `{p\|m}-row-{xs…xl}`, `h\|min-h\|size-btn\|control`, `p-btn`, `px-btn-x`, `p-control`, `px-control-x`, `vars-layout-gutter-card`, `vars-layout-gutter-reset`, `vars-layout-like-mobile` |
| Layout | `section-grid`, `vars-section-width-bleed\|full\|page`, `vars-section-content-width-full\|page\|custom`, `col-section\|section-content\|section-bg\|fullbleed`, `row-section-content\|section-bg`, `page-grid`, `w-layout`, `cq-width`, `cq-width-unsafe`, `placement-grid`, `vars-placement-grid-{top\|middle\|bottom\|full}-{left\|center\|right}`, `vars-content-align-start\|center\|end`, `text-content-align`, `items-content-align`, `justify-content-align`, `justify-self-content-align`, `items-content-gravity`, `flex-center`, `flex-row-center`, `grid-stack`, `grid-stack-item`, `sticky-column` |
| Shape | `rounded-{none\|sm\|md\|lg\|pill\|full\|btn\|tab\|element\|banner\|form-field}`, `vars-btn\|tab\|element-rounding-{none\|sm\|md\|pill}`, `shape-*`, `mask-fill-*`, `mask-mark-*`, `clip-path-shape-*`, `edge-mask-*`, `bg-mask-*` |
| Depth | `shadow-none\|low\|DEFAULT\|high`, `drop-shadow-low\|DEFAULT\|high`, `frosted-glass`, `border-highlight`, `border-gradient`, `blur-{sm\|md\|lg\|xl}` |
| Buttons | `btn`, `btn-layout`, `btn-appearance`, `btn-gradient`, `vars-btn-{primary\|secondary\|white\|black\|canvas\|content\|muted\|sale}`, `vars-btn-{fill\|stroke\|soft\|bare\|blur\|none}`, `vars-btn-{xs\|sm\|md\|lg\|xl\|auto}`, `vars-btn-height-{xs…xl}`, `badge-appearance`, `vars-badge-{fill\|stroke\|soft}`, `slider-control` |
| Links | `vars-link-clean\|line\|both`, `link-line`, `link-line-all` |
| Controls | `vars-control-{xs…xl}`, `vars-field`, `checkbox`, `radio`, `text-size-input\|control\|apply`, `hide-search-clear`, `reset-webkit-autofill` |
| Cards | `vars-card-{lg\|md\|sm\|xs}`, `vars-card-lg-appearance-normal\|framed`, `vars-card-list-*`, `swatch` |
| Icons | `vars-icon-size-{xs…xl}`, `vars-icon-grade-{light\|regular\|bold}`, `icon-stroke`, `icon-fill`, `w-icon`, `size-icon` |
| Effects | `entrance-container`, `entrance-item`, `entrance-standard\|fade\|draw`, `no-children-entrance`, `animate-in\|out`, `fade-in\|out`, `slide-in-from-*`, `slide-out-to-*`, `scale-in\|out`, `blur-in\|out`, `draw-in\|out`, `stagger-*`, `animate-duration\|delay\|ease-*`, `animate-spin\|pulse\|bounce\|wiggle\|text-shimmer`, `highlight`, `highlight-partial`, `highlight-underline`, `hover-effect-target`, `hover-effect-bg-highlight`, `hover-effect-text-highlight`, `focus-group`, `focus-group-item`, `text-shimmer-*`, `text-stroke-*`, `transition-discrete` |
| Variants | `keyboard-active:`, `keyboard-focus:`, `keyboard-focus-within:`, `touch:`, `mouse:`, `fine:`, `coarse:`, `fonts:`, `prefonts:`, `motion-safe:`, `motion-reduce:`, `rtl:`, `supports-{subgrid\|container\|color-mix\|oklch-from\|popover\|svh\|aspect}:`, `no-{feature}:`, `@sm:`, `@md:`, `@lg:` container queries |

Runtime class patterns that work, because they are safelisted: `bg-` and `text-` with canvas,
content, secondary, primary, muted, sale, or custom; `bg|text-canvas|content-mix-{step}`; every
`vars-*` class; `text-r{n}`; `font-family-{role}`; `type-{preset}`; `font-normal|bold`;
`rounded-sm|md|lg`; `text-left|right|start|end|center` with `sm:`, `md:`, or `lg:`. Every other
class exists only when the compiled stylesheet already contains it as a complete literal.

## Maintaining this file

- Update this file in the same change that adds, renames, or removes a token, a `vars-*` class, a
  preset, or a Theme Setting that changes the look.
- Record a merchant's design decision under Store brand, with the setting or scheme it changes.
  Record a dislike as a Don't.
- When this file and the code disagree, the code is right. Fix the file.
- Keep the file under 50 KB. Name tokens and settings. Do not list computed values.
