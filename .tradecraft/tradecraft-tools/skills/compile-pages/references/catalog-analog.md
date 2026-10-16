# Analog section and block catalog

Use this catalog to choose Analog sections and blocks for a page. It covers what each
component does for the shopper, and what it accepts. It describes structure, not
designs to copy: compose each page from the store's own brief and assets.

Re-check the theme's schema before you rely on a range or an option value. Schemas
change between releases.

## 1. How Analog composes

### The tree

- A template is a list of sections. A section holds blocks. A container block holds more blocks.
- A block file that starts with `_` is private. It appears only where a parent lists it by name.
- A `theme-*` block is a theme block. A parent that lists `@theme` accepts all 21 theme blocks:
  `theme-badge`, `theme-button`, `theme-countdown`, `theme-decoration`, `theme-form-newsletter`,
  `theme-group-flex`, `theme-group-frame`, `theme-group-row`, `theme-group-target`,
  `theme-group-text`, `theme-icon`, `theme-image`, `theme-link`, `theme-liquid-code`,
  `theme-page-content`, `theme-richtext`, `theme-social-links`, `theme-spacer`, `theme-text`,
  `theme-video`, `theme-video-button`.
- Most content containers (`section-custom`, `section-banner`, `_pair-custom`, `_pair-banner`,
  `_slide`, `_tile-image`, `_accordion`, `theme-group-frame`, `_section-content`, `_content`)
  accept `@theme`, `@app`, and the "extended" private set: `_callout`, `_callout-group`,
  `_grid-editorial`, `_grid-auto`, `_card-showcase`, `_form-contact`, `_marquee`,
  `_accordion-group`, `_tabs`. Some exclude one of these (for example `_tab` has no `_tabs`,
  `_marquee-frame` and `theme-group-frame`'s `_grid-auto` include no `_marquee`). Check the
  parent's `blocks` list.
- `theme-group-row` accepts only `@theme`, `@app`, and `_callout`. Put an accordion or a callout
  group in a Frame, not in a Row.
- Product form blocks (`_product-*`) work only inside the product page, Featured product, and
  quickview Details blocks, and inside the `_product-group-*` containers.

### Static blocks

A static block is rendered by the parent with `content_for 'block'` and a fixed id. In JSON it
lives under `blocks` with `"static": true`. It is never in `block_order`. Set
`"disabled": true` on it to hide it (for example, to hide a card section title).

| Parent | Static id | Type |
|---|---|---|
| `section-card-grid`, `section-card-slider`, `section-card-slider-tabs`, `related` | `header` | `_section-title` |
| `blog`, `list-collections` | `section-title` | `_section-title` |
| `list-collections` | `collection-card` | `_card-collection` |
| `product`, `section-featured-product` | `media`, `details` | `_product-layout-media`, `_product-layout-details` |
| `product-quickview-drawer` | `media`, `details` | `_product-layout-media-quickview`, `_product-layout-details-quickview` |
| `section-pro-banner` | `content` | `_section-content` |
| `_pair-pro-banner` | `content` | `_content` |
| `_card-custom` | `overlay`, `details` | `_card-custom-overlay`, `_card-custom-details` |
| `_pair-card-grid` / `_pair-card-slider` / `_pair-card-showcase` | `card-grid-title` / `card-slider-title` / `card-showcase-title` | `_section-title` |
| `password` | `content-password` | `theme-group-frame` |

`product` has no `blocks` list in its schema. All product content goes inside the static
`details` block.

### Color schemes

- Every environment defines four schemes, in this order: `scheme-default`, `scheme-opposite`,
  `scheme-success`, `scheme-error`. Use only these ids unless the environment's
  `config/settings_data.json` defines more. A value such as `scheme-dark` that the store
  does not define falls back as described below.
- Shopify resolves an empty or invalid `color_scheme` value to the setting's schema `default`.
  When the setting has no default, Shopify uses the first scheme in the group
  (`scheme-default`). It does not inherit the parent's scheme. (Shopify input-settings docs.)
- Defaults that matter: `section-banner`, `section-pro-banner`, `section-slideshow`,
  `section-video`, `section-before-after`, `footer`, `footer-sub`, and `password` default to
  `scheme-opposite`. `_pair-banner`, `_pair-slide`, `_pair-video`, `_pair-pro-banner`,
  `_tile-image`, and `_card-custom-overlay` default to `scheme-opposite`. Most other sections
  have no default, so `""` gives `scheme-default`.
- A block scheme applies to its subtree (`vars-<scheme-id>` class). The closest scheme wins.

### Backgrounds

- Section `background`: `canvas` (scheme background), `tint` (`bg-content-mix-5`, a 5% content
  mix), or `custom`. Sections use `background_color` for the custom color.
- Banner-type sections (`section-banner`, `section-pro-banner`, `section-slideshow`,
  `section-video`, `section-before-after`) add `transparent` and default to it. Their background
  shows only when `contain_section` is true. Uncontained, the wrapper drops the background.
- Frames and pair columns have an opt-in color group. `theme-group-frame`, `_tile-frame`,
  `_product-group-frame`, `_callout-group`, `_marquee`, `_card-showcase`, `_pair-custom`,
  `_pair-card-grid`, `_pair-card-slider`, `_pair-card-showcase`, and `_pair-hotspots` apply
  `color_scheme`, `background`, and `background_custom` only when `set_color_scheme` is true.
  `set_color_scheme` defaults to false. With it off, the block inherits the parent scheme and
  has no fill. Blocks use `background_custom` (not `background_color`) for the custom color.
- A frame's padding applies when `set_color_scheme`, `set_border`, or `set_padding` is true.
  Rounding needs a surface (a border, or colors on with a non-transparent background).

### Width and spacing

- Two width controls. `contain_section` + `section_width` (`full`|`page`) sets the section box
  for sections that can bleed. `content_width` sets the inner content width: `full`, `page`, or
  `custom` (`content_width_custom` 25–100 step 5, a percent of global `layout_site_width`;
  `content_width_custom_mobile` 25–100).
- `contain_section: false` makes the section edge to edge (`section-width-bleed`).
- `section-custom` shows `content_width` only when `contain_section` is true.
- Banner-type sections: uncontained means zero section padding. Contained means padding comes
  from `section_padding_top` and `section_padding_bottom`.
- Other sections: `set_rhythm: false` (default) uses the global `section_rhythm_default`
  (default 60). `section_padding_top`/`_bottom` (0–200 step 2) apply only when `set_rhythm`
  is true.
- `set_target_device`/`target_device` work only when global `show_target_device_settings` is
  true.
- Heights use one vocabulary: `content`, `image` (media height), `screen`,
  `screen-five-sixths`, `screen-three-quarters`, `screen-one-half`, `screen-one-third`,
  `screen-one-quarter`, `custom` (`custom_height_type` `percentage`|`px`). Each schema offers
  a subset. Values such as `"350px"` or `"0"` are invalid.

### Type and color tokens

- `type_preset`: `h1`–`h6`, `section`, `p`, `kicker`, `micro`, `btn`, `accordion`, `tab`,
  `custom`. A non-custom preset shows `type_resize` (`xs`–`xl`). `custom` shows `type_font`
  (`heading`|`subheading`|`accent`|`body`), `type_size` (1–15), and `type_uppercase`.
- Text `color` (after `set_color: true`): `content`, `muted`, `primary`, `secondary` (link
  accent), `sale`, `custom`.
- Button `color`: `content`, `primary`, `secondary`, `sale`, `canvas`, `black`, `white`,
  `custom`, `custom_gradient`. `appearance`: `fill`, `stroke`, `soft`.
- Gap and padding steps: `sm`, `md`, `lg`, `custom` (`gap_custom` px). There is no "none". Use
  `custom` with 0.
- `heading_tag` controls appear only when global `show_tag_settings` is true.

### Other traps

- A `_callout-group` placed straight in `section-custom` runs edge to edge on mobile,
  with no side gutter. Put it in a `theme-group-frame` with `set_padding`.
- A section's custom background color is `background_color`. A frame's is
  `background_custom`. Shopify accepts an unknown setting ID without an error and
  ignores it, so a wrong name fails silently. Check the result in a browser.
- For text over a photo in a card grid or slider, use `_tile-image`: it has the
  overlay, placement, and color scheme built in. Use `_card-custom` when the text
  sits below the image in `details`. Leave the tile's `href` empty when it holds a
  button, because a link cannot contain another link.
- A select whose options are digits, such as `columns_sm_grid`, needs a string (`"1"`).
  Shopify refuses the number `1` on upload.

- `section-pair` takes at most 2 blocks. `footer` takes at most 6 columns. `header-menu` and
  `header-toolbar` are limited to 1 each.
- `related` works only on product templates. `list-collections` works only on the
  list-collections template. `footer` and `footer-sub` work only in the footer group.
- Most content sections are disabled in the `header`, `custom.overlays`, and `custom.drawers`
  groups.
- `_card-custom` accepts only its two static children, `overlay` and `details`. Put
  theme blocks inside them, never directly under the card.
- A transparent header needs `header-menu` `transparent: true` and the first template section
  `enable_transparent: true`. Banner-type sections default `enable_transparent` to true but
  hide it when contained.
- `section-spacer` uses a hex `bg_color`, not a scheme.
- The carousel sections' `columns_sm: ""` uses global `slider_columns_mobile` (1–3.6, default
  1.6). `custom` opens `columns_sm_custom`.
- `section-pair` `column_width` values: `first-wide` (label Wide), `even`, `second-wide`
  (label Slim).
- With `enable_ensemble: true` (default), `section-pair` owns `autoplay` and `duration` (1–15 s)
  for both columns.

## 2. Sections

Format: purpose. Choose / avoid. Blocks (static marked `*`). Key settings.

### Promise and hero

**`section-banner` (Banner)** — Promise. One image or video behind placed text and buttons.
- Choose for a hero, a promo band, or a page header with a photo. Avoid when the background
  needs several layers (use `section-pro-banner`) or when media and text sit side by side
  (use `section-pair`).
- Blocks: `@theme`, `@app`, extended set.
- Key settings: `media_type` image|video, `image`/`image_mobile`, `height` (default
  `screen-one-third`), `contain_section` (default false), `vertical_placement`
  full|top|middle|bottom, `horizontal_placement`, `content_padding`, `overlay_opacity` (0–100,
  default 8), `color_scheme` (default `scheme-opposite`).

**`section-pro-banner` (Banner layers)** — Promise. Stacked background layers under one
content block.
- Choose for split images, collages, marquee or pattern-text backgrounds, or countdown promos.
  Avoid for a single photo.
- Blocks: `_section-background` (each holds `_background-image`, `_background-split`,
  `_background-collage-image`, `_background-marquee`, `_background-pattern-text`);
  `content`* (`_section-content`, takes `@theme` + extended). The first layer renders in front.
- Key settings: `height`, `set_height_mobile`/`height_mobile`, `contain_section`,
  `vertical_placement`, `horizontal_placement` (default left), `color_scheme` (default
  `scheme-opposite`).

**`section-slideshow` (Slideshow)** — Promise. Rotating full-bleed slides.
- Choose for several equal campaigns. Avoid for one message (a slideshow hides slides 2+).
- Blocks: `_slide` (media + `@theme` + extended content).
- Key settings: `autoplay` (default true), `duration` (4–15 s, default 8), `height`,
  `contain_section`, `show_controls`, `pagination_style` counter|dots|lines, `color_scheme`
  (default `scheme-opposite`).

**`section-video` (Video)** — Promise or explain with a video band.
- Choose for one uploaded or external video.
- No blocks. Key settings: `video_source` uploaded|external_video, `video`/`video_link`,
  `autoplay`, `loop`, `contain_section`.

**`section-text-spotlight` (Spotlight text)** — Promise or explain. Large statement text that
highlights on scroll, with inline images.
- Choose for a brand statement or a manifesto line. Avoid for body copy.
- Blocks: `_spotlight-text`, `_inline-image`, `_inline-spacer`, `theme-decoration`, `theme-icon`.
- Key settings: `type_preset` (default h1), `height` (content…screen; `enable_sticky` shows
  only with `screen`), `content_width`, `set_background_media`, `enable_scroll_animation`
  (default true), `scroll_animation_mode` both|enter|exit.

### Browse

**`section-card-grid` (Card grid)** — Browse. All cards visible in a grid.
- Choose for a featured collection, collection tiles, editorial tiles, or testimonials. Avoid
  for long lists in limited height (use a carousel).
- Blocks: `header`* (`_section-title`), `_cards-products`, `_cards-collections`,
  `_cards-articles`, `_card-custom`, `_tile-image`, `_tile-frame`. Card order follows block
  order.
- Key settings: `columns_lg`/`columns_md` (2–6), `layout_mobile` slider|grid, `columns_sm_grid`
  1|2, `content_width`, `title_placement`, `set_gap_tab_y`, `color_scheme`, `background`.

**`section-card-slider` (Card carousel)** — Browse. One horizontal carousel.
- Choose for a product strip or an article strip. Avoid when the shopper must compare all items
  at once.
- Blocks: same as Card grid. Columns 2–5.
- Key settings: `columns_lg`, `columns_md`, `columns_sm` ""|custom, `content_width` full|page,
  `slider_control_style` fill|stroke|soft|bare, `progress_bar_visibility`.

**`section-card-slider-tabs` (Tabbed card carousels)** — Browse. Several lists in one slot.
- Choose for "Best sellers / New / Sale". The tab strip hides with one tab.
- Blocks: `header`*, `_cards-tab` (holds the card blocks; `title`).
- Key settings: as Card carousel, plus `set_gap_tab_x`, `enable_typography` for tab labels.

**`collection` (Collection product grid)** — Browse. The main collection template grid.
- No blocks. Key settings: `enable_filters`, `filter_mode` sidebar|drawer, `enable_sorting`,
  `columns_lg` (2–4), `columns_sm` 1|2, `limit` (1–50), `mobile_dense_card_grid`.

**`search` (Search)** — Browse. The search results grid. Same controls as `collection`, plus
`show_suggested_searches`.

**`list-collections` (Collection list)** — Browse all collections. Static `section-title`* and
`collection-card`*. `columns_lg` 2–5.

**`blog` (Blog)** — Browse articles. Static `section-title`*. `columns_lg` 2–4, `limit`,
`show_*` toggles.

**`related` (Related products)** — Browse and cross-sell on the product template.
- Blocks: `header`*, `_related-tab-related-products` (`card_limit`, `fallback_collection`),
  `_related-tab-recent-products` (`threshold` 1–6), `_cards-tab`.

### Explain and prove

**`section-pair` (Pair layout)** — Explain. Two columns that stack on mobile.
- Choose for media beside text, FAQ beside an image, hotspots beside products, a compare slider
  beside copy. Avoid for one column (use `section-custom`).
- Blocks (max 2): `_pair-custom`, `_pair-banner`, `_pair-pro-banner`, `_pair-video`,
  `_pair-slideshow`, `_pair-hotspots`, `_pair-card-grid`, `_pair-card-slider`,
  `_pair-card-showcase`, `_pair-before-after`. Column order follows block order.
- Key settings: `column_width` first-wide|even|second-wide, `height_mode` section|column,
  `height` (section mode; default `screen-one-half`), `align_self` + `enable_sticky` (column
  mode), `gap` (default lg; `custom` 0 for a seamless join), `order_mobile` normal|reversed,
  `contain_section`, `enable_ensemble`.

**`section-custom` (Section layout)** — Explain, prove, or capture email. One vertical stack
of any blocks.
- Choose for FAQ, newsletter, contact form, marquee, callout rows, grids. Avoid rebuilding a
  banner, pair, or card section.
- Blocks: `@theme`, `@app`, `_section-title` (not static here), extended set.
- Key settings: `contain_section` (default true), `content_width` full|page|custom, `gap`
  (default md), `alignment`, `color_scheme`, `background` canvas|tint|custom, `set_rhythm`.
- Presets: Marquee, FAQ: Accordion, FAQ: Tabs, Contact, Newsletter.

**`section-before-after` (Compare images)** — Prove. Draggable before/after slider.
- No blocks. Key settings: `before_image`, `after_image`, `orientation`, `start_position`
  (0–100), `handle_color`, `height`. Inside a pair, use `_pair-before-after` instead.

### Convert

**`product` (Product page)** — Convert. The product template's main section.
- Blocks: `media`* and `details`* only. Put form blocks inside `details`.
- Key settings: `media_col_order` first|second, `media_col_width` slim|even|wide|fill
  (`details_width` 450–1000 with fill), `contain_section`, `enable_breadcrumbs`,
  `enable_transparent`.

**`section-featured-product` (Featured product)** — Convert on any page with its own
`product` picker. Same static `media`*/`details`* structure. It does not update the URL.

**`cart-classic` (Cart)** — Convert. The cart page. Section-local blocks: `message_custom`,
`cart_upsell`, `shipping_estimate`, `customer_notes`, `payment_icons`, `liquid_code`, `@app`.
Key settings: `set_free_shipping_message`, `free_shipping_limit`, `show_checkbox`
(terms; `checkbox_required`), `color_checkout_button`.

**`cart-drawer-classic` (Cart drawer)** — Convert. Lives in the drawers group. Same blocks plus
`cart_review`. `set_free_shipping_message` defaults to true.

**`product-quickview-drawer` (Product quickview)** — One global instance in the overlays group.
Static quickview `media`*/`details`*.

### Header, footer, and global groups

**`header-toolbar` (Toolbar)** — Promise. Announcement bar (header group, limit 1).
- Blocks: `_toolbar-announcement` (`announcement_text`), `_toolbar-countdown`.
- Key settings: `background` (default tint), `sticky_style` always|scroll|never,
  `bottom_border_mode`, `show_language`, `show_country`.

**`header-menu` (Menu)** — Browse. Logo, navigation, and buttons (header group, limit 1).
- Blocks: `_megamenu` (`title` must match a top-level menu link title).
- Key settings: `linklist`, `logo`, `logo_position` left|center, `menu_position`,
  `transparent`, `transparent_white_logo`, `sticky_style`, `target_device_drawer_button`
  mobile|both, `show_search_button`, `show_account_button`, `label_style` text|icon|both.

**`header-drawer` (Menu drawer)** — Browse on mobile (drawers group). Blocks: `_card-slider`.
Key settings: `linklist`, `show_search`, `show_secondary_links`, `show_social_links`,
`show_collection_images`.

**`footer` (Footer)** — Navigate and capture email (footer group, max 6 blocks).
- Blocks: `_footer-column` (`title`, `enable_accordion`, `col_span_lg`/`_md` when the section
  `custom_col_span` is on; holds `_footer-link-list`, `_footer-follow-on-shop`, `@theme`,
  `@app`).
- Key settings: `color_scheme` (default `scheme-opposite`), `background`, `type_preset`
  (column titles; default accordion), `custom_col_span` + `columns_lg`/`columns_md` (1–6).

**`footer-sub` (Subfooter)** — Utility row: copyright, secondary links, locale, payment icons.
Key settings: `footer_secondary_linklist`, `enable_footer_payment`, `enable_footer_social`,
`show_language`, `show_country`, `content_width` full|page.

### Utility and system sections

| Section | Use | Notes |
|---|---|---|
| `page-default` (Page) | Page title and body | `show_title`, `show_content`. Designed pages often disable it. |
| `article` (Article) | Blog post body | `show_*` toggles. |
| `404` | Not-found page | Blocks `@theme`, `_search`. |
| `password` | Password page | `_background` layers + static `content-password`* frame. |
| `gift-card-inner` | Gift card page | Logo and width only |
| `section-spacer` (Spacer) | Fixed vertical gap | `spacer_section_height` 0–500 step 5. Prefer section rhythm |
| `_blocks` (Custom) | Generic `@theme`/`@app` stack | Prefer `section-custom` |
| `apps` | App blocks only |
| `custom-liquid` | Raw Liquid section | `output` raw\|wrapped |
| `page-styleguide` | Design-system check page | Section-local `cards` block. Keep unpublished |
| `predictive-search-results`, `api-*` | Section Rendering API endpoints | Never place in a template |

## 3. Blocks by family

### Text and type

| Block | Purpose | Notable settings |
|---|---|---|
| `theme-text` | One line or heading | `text` inline richtext, `type_preset` (default p), `set_color`/`color`, `limit_width`/`max_width` 100–1100 |
| `theme-richtext` | Paragraphs, lists | `richtext_size` xs–xl, `limit_width`, `set_color` |
| `theme-group-text` (Text group) | Inline run of mixed text, icons, images | Children `_inline-text`, `_inline-image`, `_inline-spacer`, `_inline-group-target`, `theme-icon`, `theme-decoration`; one `type_preset` for all; `set_column_alignment` count 1–4 |
| `_inline-text` | Styled span in a Text group | `enable_typography`, `outline_text`, `highlight_toggle` none\|full\|auto |
| `_section-title` | Section heading | `text`, `type_preset` (default section), `buffer_bottom` 0–200; children `_section-title-row`, `_section-title-inline`, `theme-text`, `theme-richtext`, `theme-spacer`, `theme-decoration` |
| `theme-badge` | Label chip | `appearance` fill\|stroke\|soft\|custom, `color`, `size` |
| `theme-decoration` | Divider or ornament | `decoration_type` shape\|line\|image; `decoration_custom: default` uses the global Decoration settings; `custom` opens local ones |
| `theme-page-content` | Renders a page's content | `page` |
| `_spotlight-text` | Highlight-on-scroll text | Only in `section-text-spotlight` |
| `theme-countdown` | Countdown timer | `schedule` repeat\|once, `repeat_day` 0–6 (0 = Sunday, default 4), `end_time` text "01:00" + `period` am\|pm |

### Media

| Block | Purpose | Notable settings |
|---|---|---|
| `theme-image` | Inline image or logo | `image_size_mode` full\|custom (`image_max_limit` 10–1000, default 120 px), `height` natural\|ratio\|full, `click_action` none\|link\|zoom |
| `theme-video` | Inline video | `video_size_mode`, `set_aspect_ratio` |
| `theme-video-button` | Play button that opens a video popup | `sizing`, `color` |
| `theme-icon` | Icon | `icon_set` core\|art\|image; long `icon_list_art` (commerce, delivery, clothing, food…) |
| `_inline-image` | Image inside a Text group or spotlight | `shape` (none, rounded, keyhole, circle, sunburst, hexagon, octagon, parallelogram, blob-1–4, stamp-sharp, stamp-rounded, ticket), `image_scaling` 50–200 |
| `_tile-image` | Image/video card with overlaid blocks | `aspect_ratio` 0.5–5, `href`, `overlay_opacity`, `vertical_placement`, `color_scheme` (default opposite), `set_parallax` |
| `_background-*` | Layers inside `_background`/`_section-background` | See `section-pro-banner`; `_background-collage-image` `parallax` −100–100 step 2 |

### Layout groups

| Block | Purpose | Notable settings |
|---|---|---|
| `theme-group-frame` (Frame) | Styled box: width, padding, colors, border, link | `set_width` (percent 0–100 or px 100–2000), `full_height` + `justification_column`, `set_color_scheme` (off by default), `set_padding`, `set_link` |
| `theme-group-row` (Row) | Non-wrapping horizontal strip | `full_width`, `placement` start\|center\|end\|spread, `show_arrows`, `set_stack` + `stack_breakpoint_px` (container width) |
| `theme-group-flex` (Flex) | Full flexbox with a mobile/tablet override | `direction`, `wrap`, `gap` (default custom 0), `set_breakpoint` md\|lg; children `_flex-item` (`size` auto\|fit\|fill\|1x\|2x\|3x\|custom) |
| `theme-group-target` | Show children on one device | `target_device` mobile\|desktop\|both (default desktop) |
| `_grid-auto` | Auto or fixed-column grid | `columns` fixed\|auto (`min_col_width` 120–480), `columns_desktop` 1–6 (default 3), `columns_mobile` (default 2); optional `_grid-auto-item` for spans |
| `_grid-editorial` | 12-column placed grid | `row_height` auto\|fixed; children `_grid-editorial-item` (`col_start`/`col_end` 1–12, `row_start`, `row_span`, per-device overrides, parallax −50–50) |
| `_accordion-group` / `_accordion` | FAQ disclosure | Group: `multiple`, `show_number`; item: `title`, `expand` |
| `_tabs` / `_tab` | Tabbed content | `_tab` `title` |
| `_callout-group` | Row/grid of icon or number callouts | `columns_lg` 1–6, `layout` stacked\|between\|below\|inline\|all_inline\|side_left\|side_right, `media_width`; children `_callout-icon`, `_callout-number`, `_callout` |
| `_callout-number` | Stat callout | `number_value` text, `enable_animation`, `show_discount` + `discount_style` |
| `_card-showcase` | One-at-a-time featured card carousel | `card_appearance` normal\|framed (default framed) |
| `theme-spacer` | Fixed gap | `direction` row\|column, 0–200 px |

### Buttons and links

| Block | Purpose | Notable settings |
|---|---|---|
| `theme-button` | Call to action | `text`, `href`, `appearance` fill\|stroke\|soft, `color`, `sizing` xs–xl (default lg), `set_width` |
| `theme-link` | Text link | `appearance` clean\|line\|icon\|both, `color` includes canvas\|black\|white |
| `theme-social-links` | Social icons from global settings | `sizing`, `gap` |
| `theme-liquid-code` | Custom Liquid | `output` raw\|wrapped |

### Cards and card sources

| Block | Purpose | Notable settings |
|---|---|---|
| `_cards-products` | N product cards | `source` product_list\|collection, `card_limit` 1–20 (default 8), `set_aspect_ratio` 0.5–3 |
| `_cards-collections` | One card per collection | `collections`, `set_aspect_ratio` |
| `_cards-articles` | Article cards | `source` blog\|article, `card_limit`, `show_author`/`show_tags`/`show_date`/`show_preview`/`show_link` |
| `_card-custom` | One composed card | `media_type`, `image`, `set_aspect_ratio` 0.5–3, `href`; static `overlay`* (`vertical_placement`, `horizontal_placement`, `color_scheme` default opposite) and `details`* (`content_align`), both take `@theme`/`@app` |
| `_tile-image` | Image tile with overlay blocks | See Media |
| `_tile-frame` | Frame-shaped card (text panel) | Frame settings without width; accepts cards and frames too |
| `_card-product` | One product card (megamenu, showcase, grid items) | `product` |
| `_card-collection` | One collection card | `collection`, `image` |
| `_cards-tab` | One tab of cards | Only in `section-card-slider-tabs` and `related` |
| `_card-slider` | Carousel in the menu drawer | `columns_lg` 1–2.6, `columns_sm` 1–2 |

Global card controls: `card_aspect_ratio` (0.5–2, default 0.9), `enable_quickview`,
`enable_card_quickadd`, `enable_card_variant_swatches`.

### Pair column blocks (only in `section-pair`)

| Block | Notes |
|---|---|
| `_pair-custom` | Content column; `vertical_placement`, `horizontal_placement` (default left); colors off by default (background default tint) |
| `_pair-banner` | Image/video column with overlay content; `color_scheme` default opposite; `height` own setting used in column mode |
| `_pair-pro-banner` | Layered column: `_background` blocks + static `content`* |
| `_pair-slideshow` / `_pair-slide` | Slides; `show_controls` default false |
| `_pair-hotspots` | Image with `_pair-hotspot` (marker), `_pair-hotspots-product`, `_pair-hotspots-tooltip`; `left`/`top` 0–100% |
| `_pair-card-grid` | Cards grid; `columns_lg` 1–4 (default 2) |
| `_pair-card-slider` | Cards carousel; `columns_lg` 1–3.6 step 0.1 (default 1.6) |
| `_pair-card-showcase` | One card at a time; `showcase_width` 30–100 |
| `_pair-before-after` | Compare slider; `height_mobile` default image |
| `_pair-video` | Video column |

### Product form blocks (inside `details`)

| Block | Notes |
|---|---|
| `_product-title` | `type_preset` default h3; `heading_tag` default h1 |
| `_product-price` | `type_preset` default h5; `show_compare_at_price`, `discount_amount_style` percentage\|dollar, `show_sale_label` |
| `_product-option-selectors` | Variant picker; `input_type` auto\|select\|buttons; size-chart popup via `info_popup_page` |
| `_product-option-siblings` | Linked products swatches |
| `_product-subscription` | Selling plans |
| `_product-quantity` | `size` xs–xl |
| `_product-add-buttons` | Add to cart + dynamic checkout; `sizing` default xl, `enable_payment_button` |
| `_product-description` | `enable_truncate` (default true) + `truncate_lines` 1–20 |
| `_product-stock-status` | `stockout_style` low\|always, `stockout_low_threshold` 1–50 |
| `_product-pickup`, `_product-rating`, `_product-sku`, `_product-sharing` | Info blocks |
| `_product-upsell` | `product_list`, `limit` 1–3, `include_metafield_upsells` |
| `_product-complementary` | Shopify complementary product recommendations; `limit` 1–10 |
| `_product-disclosures` | Accordion from the `shopify.disclosure` product metafield |
| `_product-group-row`, `-frame`, `-flex`, `-inline`, `-target`, `-accordion-group`, `-tabs`, `_product-grid-*` | Product-scoped twins of the layout groups. Use them to nest form blocks |

### Cart blocks (section-local, in `cart-classic` and `cart-drawer-classic`)

`message_custom`, `cart_upsell` (`limit`, `include_line_item_upsells`), `shipping_estimate`,
`customer_notes`, `cart_review` (drawer only), `payment_icons`, `liquid_code`.

### Header, toolbar, and footer blocks

| Block | Notes |
|---|---|
| `_megamenu` | `title` matches the parent link; `show_section_links` auto-fills levels 2–3; children `_megamenu-linklist`, `_megamenu-column` |
| `_megamenu-column` | Media column: `_tile-image`, `_card-product`, `_card-collection`, `_card-custom`, `_tile-frame` |
| `_megamenu-linklist` | Extra link list with optional image |
| `_toolbar-announcement` | `announcement_text`; scrolls as a marquee on mobile |
| `_toolbar-countdown` | Same schedule fields as `theme-countdown` |
| `_footer-column` | See `footer` |
| `_footer-link-list` | One menu level; `linklist` |
| `_footer-follow-on-shop` | Shop follow button |
| `theme-form-newsletter` | Email capture; `newsletter_appearance` box\|line |
| `_form-contact` | Contact form; children `_form-input-name`, `_form-input-email`, `_form-input-text`, `_form-select`, `_form-radio-group`, `_form-checkbox`, `_form-group` (row) |
| `_search` | Search box (404, Search) |

### Marquee

| Block | Notes |
|---|---|
| `_marquee` | `speed` −10–10 (negative reverses), `pause_on_hover` interactive\|anywhere\|off; children `theme-group-text`, `_marquee-gallery`, `_marquee-frame` |
| `_marquee-gallery` / `_marquee-gallery-image` | Logo or photo strip; `sizing_mode` height\|width, `height_px` 50–600 |
| `_marquee-frame` | Fixed-width card in the band; `width_px` 80–800 |

## 4. Proven combinations

| Combination | Use |
|---|---|
| `section-card-grid` + `_card-custom` ×3 (static `overlay` with a badge, `details` with text + richtext) | Editorial cards, testimonials |
| `section-card-grid` + `_tile-frame` holding `theme-group-flex` | Text-only value cards |
| `section-card-slider` + `_cards-products` (full width) | Product strip |
| `section-card-slider-tabs` + `_cards-tab` (`_tile-image` + `_cards-products`) | Tabbed merchandising with a lead image |
| `section-pair`: `_pair-custom` (row of text + link) + `_pair-card-grid` (`_cards-products`) | Collection teaser |
| `section-pair`: `_pair-hotspots` + `_pair-card-showcase` (`_cards-products`) | Shop the look |
| `section-pair`: `_pair-hotspots` + `_pair-card-slider` | Shop the look, carousel |
| `section-pair`: `_pair-slideshow` + `_pair-custom` (`_accordion-group`), ensemble on | Linked slides and FAQ |
| `section-pair`: `_pair-custom` (badge, text, `_callout-group` numbers) + `_pair-banner` | Proof stats beside a photo |
| `section-pair`: `_pair-custom` (frame) + `_pair-before-after` | Product proof |
| `section-pair`: `_pair-pro-banner` + `_pair-custom` | Layered media beside copy |
| `section-pair`: two `_pair-custom` (social + newsletter) | Community / signup |
| `section-pair` with hotspot products and tooltips | Feature anatomy |
| `section-banner` + `theme-group-frame` holding `_callout-group` (icons) | Trust band over a photo |
| `section-pro-banner`: `_section-background(_background-split)` + `content` frame | Split-image hero |
| `section-slideshow`: `_slide` holding one `theme-group-frame` | Campaign slides |
| `section-custom` + `_marquee(theme-group-text)`, uncontained, rhythm 0 | Scrolling slogan band |
| `section-custom` + `_marquee(_marquee-frame(theme-group-frame…))` | Scrolling review cards |
| `section-custom` + `_marquee(_marquee-gallery)` in the footer group | Logo or photo band |
| `section-custom` + `_grid-auto` (`_tile-image` + `theme-image` ×5) | Social / photo grid |
| `section-custom` + `_grid-editorial` | Editorial mosaic |
| `section-custom` + `_callout-group` (`_callout-icon` or `_callout-number`) | Benefits or stats row |
| `section-custom` + `_section-title` + `_accordion-group` | FAQ |
| `section-custom` + `theme-text` + `theme-richtext` + `theme-form-newsletter`, custom width | Email capture |
| `product` `details`: title, price, siblings, options, subscription, `_product-group-row(quantity, stock)`, buttons, `_callout-group`, `_product-group-accordion-group` | Full buy box |
| `product` `details` with `_product-group-frame(stock, buttons)` | Boxed purchase area |
| `header-menu` + `_megamenu(_megamenu-column(_card-product ×4))` | Product megamenu |
| `header-drawer` + `_card-slider(_cards-collections)` | Collection promos in the mobile menu |
| `footer`: columns with link list, richtext, newsletter + social | Standard footer |