# Analog agent guide

Analog is a Shopify Theme Store theme by Groupthought. This file explains how the theme is built,
the conventions every change follows, and the mistakes that are easy to make. Read `DESIGN.md`
before any design or styling work. It holds the design system, the token and class index, and the
store's brand decisions.

This file describes the theme as Shopify stores it. The stylesheet and the scripts in `assets/`
are compiled build outputs. Build and test instructions live with the theme's source repository,
not here.

## Non-negotiables

1. Every color, size, font, radius, and shadow comes from a token or a Theme Setting. Never write
   a raw value in markup or CSS. `DESIGN.md` lists the names.
2. Use only classes that already exist. The stylesheet is compiled, so a class that is not in
   `assets/theme.css` does nothing, arbitrary values included. `DESIGN.md` indexes the families
   and the runtime patterns that work.
3. Do not edit `assets/theme.css` or any `assets/*.js` file. They are compiled outputs and the
   next build replaces them.
4. Render content in Liquid. Add Alpine for interaction only. A visitor never waits for JavaScript
   to see content that is visible at load.
5. Never put translated or merchant text inside an Alpine expression. Put it in a `data-*`
   attribute and read `$el.dataset`. The browser decodes entities before Alpine parses, so
   escaping does not make it safe.
6. Every snippet and block starts with a `{% doc %}` header. Read it before you pass a parameter.
   A `core-*` snippet ignores an unknown or invalid value without an error.
7. Every theme-authored storefront string goes through the `t` filter and `locales/en.default.json`.
8. Do not hide a missing setting with a Liquid `default` filter. Fix the schema or the data.
9. Keep the keyboard, screen reader, and reduced-motion paths working. Use the theme's primitives
   (dialog, disclosure, tabs, popover, roving tab, select) instead of a second implementation.

## Composition model

```text
layout/theme.liquid
  group-header (toolbar, menu)        sections/group-header.json
  group-drawers, group-overlays       rendered at the top of body, fixed
  content_for_layout                  templates/*.json → sections → blocks
  group-footer                        sections/group-footer.json
```

- `layout/theme.liquid` renders the four section groups and the page grid. Drawers and overlays
  render first so the theme editor does not scroll when a merchant selects one.
- Templates are JSON. Each lists sections in order. `gift_card.liquid` is the one Liquid template.
- A section is a full-width region. It renders through `core-section` with `s: section.settings`,
  captures its children with `{% content_for 'blocks' %}`, and declares `"tag": "section"` and
  `"class": "section-<name>"` in its schema. Analog's CSS, the section intersection manager, and
  the Section API all select `.shopify-section`.
- A block is a merchant-editable element inside a section or another block. Blocks nest.
- A snippet is an internal utility rendered with `{% render %}`. Merchants never edit snippets.
- `sections/_blocks.liquid` is the wrapper Shopify uses for AI-generated blocks. It accepts
  `@theme` and `@app` blocks and renders them through `core-section`, so a generated block sits in
  the same page rhythm as a theme section.

### Two kinds of block

| Kind | File name | Who adds it | Schema |
|---|---|---|---|
| Public theme block | `blocks/theme-<name>.liquid` | A merchant, anywhere a parent accepts `@theme` | Has `presets` with a `category` |
| Private block | `blocks/_<name>.liquid` | Only a parent that lists it, or a static placement | Often has `presets` too, so a parent can offer it |

Public blocks: badge, button, countdown, decoration, form newsletter, group (flex, frame, row,
target, text), icon, image, link, liquid code, page content, richtext, social links, spacer,
text, video, video button. Private blocks belong to one feature: product, card, pair, header,
footer, form, grid, marquee, tabs, accordion, and section title blocks.

A parent accepts children through its schema `blocks` list: `{"type": "@theme"}` for every
public block, `{"type": "@app"}` for app blocks, or an explicit list of private types. Copy the
list from a parent with the same purpose, so the same children stay available everywhere.

### Static blocks

A section places a fixed child with `{% content_for 'block', type: '_section-title', id: 'header' %}`.
The merchant edits its settings but cannot move or remove it. `_section-title` is the common case.
The product section places `_product-layout-media` and `_product-layout-details` this way.

Facts about static placement, verified on Shopify's renderer:

- Inside a static block, every child reports `block.type` as `@theme`. Behavior that depends on a
  child's type must come from the child itself.
- The ambient `block` object reaches a rendered snippet only for a theme block. A section-local
  loop variable does not. Pass `block: block` to a snippet that needs it in that case.

### Group blocks come in pairs

The group blocks (row, flex, frame, target, text, inline, grid auto, grid editorial, accordion,
tabs, product media) exist twice: a public `theme-group-*` for any section and a private
`_product-group-*` with product-only children. The two files share one body and differ only in
the children they accept and their presets. Change both when you change one.

## Section contract

- Read settings from `section.settings`. Pass them to snippets as `s: section.settings`.
- Render through `core-section` (or `core-section-wrapper` for a custom inner column). It applies
  the color scheme, the background, the width, the padding, the section rhythm, the device target,
  the transparent header hooks, and lazy Alpine. Do not rebuild that wrapper.
- `section.index0` decides lazy Alpine. The first section of the template and every header
  section start Alpine at load because they carry the first paint. Every other section gets
  `data-lazy-alpine` and starts when it nears the viewport. Pass `lazy_alpine: false` only when a
  section needs Alpine before it is visible. The theme editor starts everything eagerly.
- Put a section-level layout override in a `--layout-*` custom property on the section, never in
  `--root-*` or `--raw-*`.
- Schema: `"tag": "section"`, `"class": "section-<name>"`, settings, a `blocks` list, `presets`,
  and `disabled_on` for the groups the section does not belong in.
- A section whose content depends on the URL (product options, collection filters, cart) uses the
  Section API. See JavaScript.

## Block contract

- Read settings from `block.settings`. Pass them to snippets as `s: block.settings`.
- Print `{{ block.shopify_attributes }}` on the block's outer element. Most blocks set
  `"tag": null` and render their own wrapper, so the wrapper can carry classes, styles, and Alpine.
- Render children with `{% content_for 'blocks' %}` inside the wrapper.
- A block that offers a color uses the same color dropdown as `theme-text` (content, muted,
  primary, secondary, sale, custom). A custom color becomes `--color-custom-text` with
  `text-custom`. Without "Set color", print `text-default` so the block inherits the scheme.
- A block that offers text style uses the same type-preset settings as `theme-text` and renders
  through `core-text-preset` or `props-class-type-preset`.
- A block with its own heading reads the SEO tag setting the way `theme-text` does. Keep the tag
  separate from the visual preset.
- Entrance animation: add `entrance-item entrance-standard` to the wrapper, except when
  `request.visual_preview_mode` is true. The editor's visual preview reports "No preview
  available" for a block that is still animating.
- Element ids: a CamelCase or kebab base plus `section.id` or `block.id`, such as
  `{{ section.id }}-related-products` or `{{ block.id }}-search-input`. Two instances of one block
  must never share an id.
- Schema: `"name"`, `"tag": null`, settings, `blocks`, and `presets` with a `category`. Existing
  categories include Basic, Layout, Content, Media, Grid, Utility, Core, Add to cart, Additional
  product info, Featured card, Full width, and the "Try:" and "Pro:" guided sets.
- New settings: copy the shape of an existing setting group (type preset, color, rounding, gap,
  padding, width, link, media) from a block that has it. The ids, options, and `visible_if`
  rules are shared contracts that the snippets read.

## Snippet contract

Snippet families, by prefix:

| Prefix | Role | Examples |
|---|---|---|
| `core-` | Low-level, cross-domain primitives | `core-button`, `core-link`, `core-icon`, `core-image`, `core-section`, `core-text-preset`, `core-decoration`, `core-background`, `core-popover`, `core-tooltip`, `core-tabs` |
| `field-` | Form controls with labels, states, and sizes | `field-input`, `field-textarea`, `field-select`, `field-custom-select`, `field-checkbox`, `field-radio`, `field-stepper`, `field-range` |
| `props-` | Print a class or style string, no markup | `props-class-type-preset`, `props-style-gap`, `props-style-button-color`, `props-style-max-width` |
| `head-` | Head output | `head-color`, `head-type`, `head-layout`, `head-scripts` |
| feature | One domain | `card-*`, `product-*`, `cart-*`, `header-*`, `collection-*`, `swatch`, `money`, `price` |

Rules:

- Every snippet carries a `{% doc %}` block: a one-line summary, optional notes, and an
  alphabetical parameter list. Read it. The parameter list is the contract.
- The settings object is `s`. A snippet reads `s.<id>` as the fallback for a bare parameter:
  `assign label = label | default: s.text`. A `settings_suffix` makes it read `text_<suffix>`.
- `section` and `closest.product` reach a snippet without a parameter. Read them in the body.
  Declare them as optional parameters in `{% doc %}` so Theme Check knows. Do not pass
  `section: section` or `product: closest.product` without a stated reason.
- Use `core-image` for every image. Pass `sizes` and `widths` together or not at all. `cover` crops.
  It does not size. Pass a size class such as `size-full` when the image must fill its box.
- Use `core-button` for every button and `core-link` for every text link. They carry the color,
  appearance, size, type preset, rounding, icons, and hover effects.
- Use `core-icon` with a generated name such as `stroke-chevron-right` or `fill-art-commerce-award`.
  The icon snippets under `snippets/stroke/` and `snippets/fill/` are generated. Do not edit them.
- Treat a `core-*` change as a shared change. Check every caller.

## Settings

- Global settings live in `config/settings_schema.json`. Store values live in
  `config/settings_data.json` under `current`. Read both before you reason about a store.
- Setting ids follow these forms: `enable_*` turns on an independent feature, `set_*` turns on a
  group of controls, `show_*` shows or hides existing content, `*_custom` is the one custom value
  of a preset selector, `custom_*` holds merchant content. A device variant is a suffix:
  `layout_mobile`, `height_desktop`, `columns_sm`. A device toggle is `set_<property>_<device>`.
- `visible_if` evaluates from the right and has no parentheses: `A and B or C` means
  `A and (B or C)`. Put the escape condition on the left. Repeat every ancestor guard in a child.
- A hidden setting still has a value. Gate the Liquid with the same setting that gates the control.
- Schema labels are literal English strings. There is no `t:` label system and no schema locale
  file.
- Put resource pickers before style controls. Order controls by merchant workflow. Group under a
  sentence-case header. Limit conditional nesting to two levels.
- A schema default applies when an instance has no stored value. A preset writes values only when a
  merchant adds a new instance. Put a value in a preset only when it must differ from the default.
- A range needs at least three steps. Use a select for a two-value choice.

## Styling and tokens

- One compiled stylesheet, `assets/theme.css`, carries the Tailwind utilities, the theme's custom
  plugins, and every component style. Do not edit it.
- Tokens, scales, presets, and the full class index are in `DESIGN.md`. Use `r1` to `r15` for
  space and type, scheme tokens for color, `type-*` presets for text, role radii for corners.
- A `vars-*` class sets custom properties only. It is how a parent hands a value to its subtree
  without Liquid: `vars-scheme-dark`, `vars-btn-fill`, `vars-content-align-center`,
  `vars-placement-grid-bottom-left`.
- Runtime class patterns such as `text-{{ color }}` or `vars-{{ scheme.id }}` work only for the
  safelisted sets in `DESIGN.md`. Branch between complete literals for anything else.
- Compose a new look from existing utilities, `vars-*` classes, and the snippets. Prefer a
  setting over a new rule.
- When new rules are unavoidable, put them in a `{% stylesheet %}` tag inside that block or
  section, scoped under a class that only it uses, and read theme tokens through custom
  properties (`var(--content)`, `var(--r5)`, `var(--radius-btn)`), so Theme Settings keep control.
- Do not put a `{% stylesheet %}` tag in a section or block that the Section API refreshes:
  product, cart, collection, search, quick view, pickup, related products, and product cards.
  Shopify ships that CSS only with the initial page render, and a region update drops it, so the
  refreshed region loses its styles.
- Use `{% style %}` for per-instance custom properties that a setting feeds, never for rules.
- Colors output OKLCH with an RGB fallback. Keep both when you touch a color variable. Code marked
  `oklch-fallback` is the fallback half.
- Use logical utilities (`ms-`, `pe-`, `start-`, `text-start`). The layout sets `dir="rtl"`.

## JavaScript

- Alpine.js 3 runs the storefront as ES modules through the import map in `head-scripts`.
  `theme.critical.js`, `theme.events.js`, and `theme.main.js` load on every page.
  `theme.product.js` loads on product pages and `theme.editor.js` in the theme editor. Feature
  modules load on demand through the `@theme/*` import-map names. `@shopify/events` is
  Shopify-hosted.
- The scripts are compiled. Add behavior only through the existing directives and small `x-data`
  scopes in markup. Do not add a script file, an inline `<script>` with page logic, or a window
  global.
- Directives in use, by purpose. Each is an Alpine plugin with keyboard and ARIA behavior built in:

  | Purpose | Directives |
  |---|---|
  | Show, hide, animate | `x-show`, `x-transition`, `x-cloak`, `x-collapse`, `x-intersect` |
  | Disclosure, tabs, dialog, popup | `x-disclosure`, `x-disclosure-group`, `x-tabs`, `x-dialog`, `x-popover`, `x-popup`, `x-tooltip` |
  | Selection and forms | `x-roving-tab`, `x-select`, `x-selection-group`, `x-range`, `x-stepper`, `x-product-form`, `x-clipboard` |
  | Scrolling and media | `x-overflow`, `x-carousel`, `x-slideshow`, `x-scroll-list`, `x-marquee`, `x-parallax`, `x-photoswipe`, `x-sticky-columns`, `x-scroll-lock` |
  | Shared state | `x-ensemble` (slideshow, tabs, disclosure group, carousel, hotspots in one section), `x-shared-layout` |
  | Data | `x-section-api`, `x-predictive-search`, `x-countdown`, `x-link-area`, `x-read-more`, `x-hover` |
  | Product | `x-product-card`, `x-section-related`, `x-view-event` |

- Lazy Alpine: a section after the first carries `data-lazy-alpine` and starts near the viewport.
  Do not rely on Alpine state in a section before it starts.
- Section API: a root `x-section-api` owns the fetches for its section. A named root such as
  `x-section-api="api-card-product"` fetches another section. Children navigate with
  `x-section-api:link` (`.replace`, `.nopush`) and `x-section-api:form`. The `$sectionApi` magic
  exposes `state`, `update`, `navigate`, and `load`. Every `.shopify-section` is bound, so
  `$sectionApi.update()` works inside any section.
- Render regions: `data-render-region="<name>"` marks the part of a section that an update
  replaces. `data-render-mode="morph"` (default) or `"replace"` sets how. A morph keeps the region
  root's attributes and updates only its children, so read post-update state from children.
  `data-morph-update` sets what an ancestor's morph may touch on a subtree: `all` (default),
  `attributes`, `children`, `none`, or `regions` (only the nested render regions).
  `data-morph-form-state="server"` copies a form control's value from the response. Without it
  the shopper's typed value wins. `data-morph-keep-id` keeps the live element's id.
  `data-preserve-focus-key` returns focus after a replace.
- Events are namespaced `theme:*`: `theme:cart-drawer:open`, `theme:quickview:open`,
  `theme:pickup:open`, `theme:menu-drawer:open`, `theme:cart-notification:show`,
  `theme:sibling:change`, `theme:section:navigate`, `theme:section:update`, `theme:section:enter`,
  `theme:section:leave`, and the video events. Scope a product event to its section. One page can
  hold several product forms.
- Stores: `$store.drawer` (which drawer is open), `$store.page` (scroll direction), and
  `$store.header`.
- Read storefront URLs from Liquid `routes.*` through `data-*` attributes. Never put a captured
  URL inside a JavaScript string in an Alpine handler. A capture can carry a newline that breaks
  the attribute.
- Stay a progressive enhancement. The add-to-cart form, navigation, and option selection work
  without JavaScript.

## Liquid

- Use `{% liquid %}` for consecutive logic. Comment with `#` inside it.
- Use `{% # ... %}` for one line and `{% comment %}` for more. Next to trimmed output, write
  `{%- # ... -%}`. The untrimmed form leaves a newline that breaks an `:empty` selector.
- Keep whitespace trims balanced: dashes on both sides or neither.
- Assign a filtered value before you pass it to `render`. A `render` argument accepts a variable,
  a literal, or a property, not a filter and not another tag.
- Do not mix `and` and `or` in one condition. Make a named boolean.
- `default` drops `false`. Add `allow_false: true` to every `default` in a chain that must keep it.
- Liquid parses `{% %}` inside `<script>` and inside JavaScript comments. Rephrase such comments.
- Put a space between a tag name and a Liquid tag: `<li {% ... %}>`.
- `closest.product` is a resolver. It walks a `content_for` setter, then a product setting on the
  block and its ancestors, then the section, then the template. A declared product setting
  captures resolution for its subtree even when it is empty, so adding a product picker to an
  existing schema changes `closest` for every stored instance.
- Do not iterate `product.variants`. Shopify supports thousands. Use the selected variant, option
  values, and `product-url`.
- Wrap mixed-direction values such as prices, SKUs, and codes in `<bdi>`.
- Use `escape_once` for text in an attribute that may already hold an entity. Do not escape
  translated output twice.
- The `{% schema %}` content must be plain JSON: no Liquid, no comments, no trailing comma.
- Comments explain a reason or a constraint, in one or two short sentences.

## Translations

- Runtime strings: `{{ 'product.sold_out' | t }}` from `locales/en.default.json`. Keys are
  grouped by the storefront area a customer sees, not by the component: `blog`, `cart`,
  `collection`, `gift_card`, `header`, `homepage`, `other`, `page`, `product`, `search`. Keys go
  three levels deep at most, in snake case. Order keys by importance, then by position on the
  page.
- Add a new key to `en.default.json` first. The other locale files (de, es, fr, it, pt) take
  the translated value when one exists.
- Schema labels are plain English in the schema itself.
- Merchant content stays merchant content. Do not translate it and do not move it to a locale
  file.

## Accessibility and right-to-left

| Interface | Primitive |
|---|---|
| Disclosure or accordion | `x-disclosure` |
| Dialog or drawer | `<dialog>` with `x-dialog` |
| Tabs | `x-tabs` with `core-tablist` and `core-tab` |
| Popup menu | `x-popover` |
| Option group | `x-roving-tab` |
| Custom select | `x-select` |
| Scroll controls | `x-overflow` or `x-carousel` |

- Semantic HTML first. One `h1`. No skipped heading level. Keep the heading tag separate from the
  visual preset.
- Every icon-only button has a translated accessible name. Decorative icons are `aria-hidden`.
- Focus rings show only while `data-keyboard-active` is on `<body>`. Do not remove an outline
  unless the component draws its own keyboard-focus style.
- Keep a 44 by 44 pixel touch target. `hit-area-*` grows the target without the element.
- Use `aria-selected`, `aria-expanded`, `data-selected`, and `data-open` as style hooks, so a
  screen reader regression is also a visible regression.
- Live regions: `polite` for a price, a count, or a carousel position. `assertive` only for direct
  feedback such as a stepper value. No nested live regions.
- Gate motion with `motion-safe:`. Hide decorative motion with `motion-reduce:`.
- `dir="rtl"` is set for right-to-left locales. Use logical properties and utilities.

## Commerce contracts

- Prices use the theme's `money` snippet and Shopify money filters.
- A product form keeps `input[name="id"]` as the selected-variant source. In JavaScript, read the
  form's id with `getAttribute('id')`: that input shadows `form.id`.
- Quantity controls honor the variant's `quantity_rule`.
- Variant, combined-listing, and selling-plan URLs come from `product-url`.
- Siblings come from metafields. `theme.siblings` points to a collection or to a metaobject with
  a `products` list and a `label`. `theme.siblings_label` names the product inside the group.
  `theme:sibling:change` announces a switch. A combined-listing child switch does not fire it.
- Recently viewed products record through `@theme/recent` on product pages.

## Gotchas

- A region refreshed through the Section API loses any CSS that only a `{% stylesheet %}` tag
  supplied. Styles for those sections live in the compiled stylesheet.
- A Section API morph never updates the region root's attributes. Observe the children.
- `block.type` is `@theme` for every child inside a static block.
- `visible_if` groups from the right. `A and B or C` is `A and (B or C)`.
- A hidden setting keeps its stored value. Gate the Liquid.
- `{% # %}` next to trimmed output still leaves a newline. Use `{%- # -%}`.
- `default` swallows `false` unless `allow_false: true` is on every link of the chain.
- A `core-*` snippet accepts an unknown parameter value silently. Read the `{% doc %}`.
- `closest.product` is nil inside a subtree with an empty product picker. It does not fall back
  to the template product.
- The first section of the template and header sections run Alpine at load. Every other section
  waits for the viewport. The editor runs everything at load, so a lazy-start defect hides there.
- Entrance animations must be off in `request.visual_preview_mode`, or the editor preview fails.
- In the theme editor, fonts are not preloaded and image placeholders render even when
  placeholder mode is off. Verify on the storefront, not only in the editor.
- The scheme mix steps are perceptual. `bg-content-mix-10` renders stronger in a dark scheme.
- Input font size floors at 16 pixels on mobile. A smaller control height can overflow its row.
- `w-layout` caps a width at 100 percent of its parent. Inside a row group or a marquee row the
  cap is removed, so a frame keeps its literal width and the row scrolls.
- `cq-width` containment needs an extrinsically sized element. Add `cq-width-unsafe` to a
  shrink-wrapping ancestor or the box collapses.
- The group blocks exist in pairs (`theme-group-*` and `_product-group-*`). A change to one
  without the other splits their behavior.

## Decision guide

| Question | Answer |
|---|---|
| Block or snippet? | Merchant-editable storefront element: block. Internal utility: snippet. |
| Public or private block? | Any parent may offer it: `theme-*`. One feature owns it: `_*`. |
| Section or block for new content? | A block inside an existing section, usually `section-custom`. A section only for a new full-width region with its own layout rules. |
| Where does a setting go? | On the block that renders it. Global only when every instance must match. |
| Setting or inherited value? | Merchant content and per-instance choices: setting. A value the parent decides: a `vars-*` class or custom property the child inherits. |
| Read a setting inside a block? | `block.settings.<id>`, passed to snippets as `s`. |
| Color for a new element? | A scheme token utility or the shared color dropdown. Never a hex. |
| Text for a new element? | A `type-*` preset through `core-text-preset`. |
| Space for a new element? | `r1` to `r15` or a layout utility. |
| A new class value from Liquid? | A complete literal in a branch, or a safelisted pattern. |
| A new look that needs CSS? | First existing utilities and `vars-*` classes. Then a scoped `{% stylesheet %}` in the block that reads theme custom properties. Never in a Section API section. |
| New interaction? | An existing directive from the table above, composed in markup. |
| Server-backed refresh? | `x-section-api` with a `data-render-region`. |
| Open the cart, quick view, pickup, or menu drawer? | Dispatch the matching `theme:*:open` event. |
| A URL in JavaScript? | A `data-*` attribute from `routes.*` or `product-url`, read through `dataset`. |
| A string a shopper reads? | The `t` filter and `en.default.json`. |
| A string a merchant reads in the editor? | A plain English schema label. |
| Verify a change? | Preview the storefront at desktop and mobile widths, test the keyboard path, and check the browser console. The theme editor hides lazy-start and preload behavior. |

## Maintaining this file

- Update this file in the same change that adds a pattern, a primitive, a contract, or a gotcha.
- Update `DESIGN.md` in the same change that adds, renames, or removes a token, a `vars-*` class,
  a preset, or a look-changing Theme Setting. Record a merchant's design decision under its
  Store brand section.
- Write rules, not tutorials. Give the reason with the rule.
- Keep each file under 50 KB.
