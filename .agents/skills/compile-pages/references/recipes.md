# Storefront recipes for Analog

A recipe is a named pattern for one slot of a page. Each recipe states the shopper job,
the content it needs, the images, a copy pattern, and how to build it in Analog. Pick
recipes from the store's brief and assets (see [SKILL.md](../SKILL.md)). Do not
pick them from what looked good on another store.

How to read a recipe:

- **Job**: the shopper's question that the section answers.
- **Use / Avoid**: the content the store must have, and when to skip the recipe.
- **Images**: role (the roles in `SKILL.md`), shape, and count.
- **Copy**: a pattern, not words. Write copy in the merchant's voice from the merchant's
  facts.
- **Build**: the Analog section and its main blocks and settings.
- **GAP**: Analog cannot build this with standard blocks yet. The line says what is
  missing.

Never invent a review, rating, statistic, award, guarantee, or price to fill a
recipe. If the store lacks the content, choose another recipe or leave the slot out
and report the gap.

## Page arcs

An arc is a complete page order. Choose the arc by what the store should lead with.
Then fill each step with a recipe from the slots below. Seven to eleven sections is
typical.

### A. Product-led: one product line, strong photography

Fits a store with one product family in many colorways or sizes, studio product
photos on one background, and strong lifestyle photography. Proof is awards or press,
not reviews.

1. `toolbar.offer`: the free-shipping threshold.
2. `header.transparent`.
3. `hero.media`: video or photo with the logo or a short line, and one button.
4. `story.intro`: product name and two benefit lines, plus an award badge.
5. `showcase.grid`: the first product line.
6. `story.mood-pair`: a wordless mood break.
7. `proof.press-marquee`.
8. `showcase.grid`: the second product line.
9. `story.mood-banner`.
10. `showcase.grid`: the third line.
11. `capture.footer-column` in the footer.

Give each grid a short title (`showcase.grid` with `_section-title`). Without one, a
new visitor cannot tell the lines apart. If the store has reviews, add
`proof.quote-cards` after the first grid.

### B. Proof-led: one claim, argued

Fits a consumable or technical product where shoppers doubt the category. The store
needs one clear claim and evidence for it: tests, third-party awards, a review count,
or expert quotes.

1. `toolbar.offer`.
2. `header.mega-columns`.
3. `hero.split`: the main offer or bundle beside one image.
4. `showcase.tabs`: best sellers and bundles.
5. `education.ingredient-pair`: the hero ingredient or material.
6. `proof.big-number` followed by `proof.quote-cards`.
7. `story.founder-pair`.
8. `nav.benefit-tiles`.
9. `education.articles`.
10. `objection.pair-accordion`: the quality question, with a chart or detail image.
11. `capture.footer-column` in the footer.

### C. Goal-led: the shopper picks a need

Fits a catalog where each product solves a different problem (sleep, focus, dry skin),
and the shopper does not know the product names. The store needs a benefit for each
product. A quiz app helps but is not required.

1. `toolbar.marquee`: shipping and gift thresholds.
2. `header.mega-columns` with benefit cards.
3. `hero.banner`: proof eyebrow, the shopper's problem as questions, one button to the
   quiz or to the benefit list.
4. `nav.benefit-cards`.
5. `showcase.slider`: best sellers with ratings.
6. `story.provenance`.
7. `proof.quote-cards` with a rating header.
8. `proof.trust-row`.
9. `objection.offer-pair`: subscription or bundle benefits.
10. `objection.guarantee`.
11. `comparison.checklist`.
12. `ugc.video-stories`.

### D. Story-led: brand, place, or event first

Fits a brand whose main offer is an experience, a community, or a place, with commerce
second. It needs strong type, a few strong photos, and real numbers.

1. `toolbar.countdown` when there is a date.
2. `header.mega-columns`.
3. `hero.banner`: headline, key facts (date, place), primary and secondary button.
4. `proof.fact-strip`.
5. `story.statement`.
6. `story.editorial-proof`: a numbers, values, and quote composite.
7. `nav.numbered-tiles`.
8. `proof.stats-band`.
9. `proof.press-quote`.
10. `ugc.bento`: highlights.
11. `capture.closing-cta`.

### E. Collection-led: several lines, lookbook feel

Fits apparel or gear with 3 or more named collections, each with its own lifestyle
photos.

1. `toolbar.offer` or none.
2. `header.image-mega`.
3. `hero.layers` or `hero.slideshow` (one slide for each collection).
4. `nav.collection-tabs`.
5. `education.pair-accordion`: what each line is for.
6. `showcase.look-hotspots`.
7. `nav.collection-cards`.
8. `story.spotlight`.
9. `showcase.collection-rows`: one pair for each line.
10. `ugc.social-grid`.
11. `proof.stats-pair` and `proof.quote-marquee`.
12. `story.values`.
13. `story.word-marquee`.

### Product page arcs

**P1. Lean product page.** Fits apparel, merch, or a catalog of simple products.
`product` (purchase area: title, price, `_product-option-selectors` as buttons, stock
status, add to cart, and accordions for description, care, and shipping), then
`related`.

**P2. Feature-story product page.** Fits a hero product with a mechanism worth
showing. Wordless mood pairs can fill the same slots when the photos carry it.

1. `product` with `_product-upsell`.
2. `education.compare-pair`.
3. `education.hotspots`.
4. `education.spec-tiles`.
5. `proof.stats-pair` (principles or promises).
6. `ugc.tagged-grid`.
7. `related`.

**P3. Long-form proof product page.** Fits a consumable with reviews, a guarantee, and
a contested claim. Keep each proof type once: repeating a quality block, a guarantee,
or a review number reads as filler.

1. `product`: stars, benefit chips, subscription, trust line, accordions.
2. `proof.trust-row`.
3. `education.feature-slider`.
4. `proof.big-number`.
5. `proof.quote-cards`.
6. `education.video-pair`.
7. `comparison.checklist`.
8. `proof.review-widget`.
9. `objection.faq`.
10. `related`.

For the purchase area, use the `pdp.*` recipes at the end of this file.

## Toolbar and announcement

### toolbar.offer: one offer line
- Job: tell the shopper about free shipping, a sale, or a launch before they scroll.
- Use: the store has a real threshold or offer. Avoid: generic slogans.
- Images: none.
- Copy: the offer and its condition in one line, such as "Free shipping over [amount]".
- Build: `header-toolbar` with one `_toolbar-announcement`. Several announcements sit
  in a row on desktop and scroll as a marquee on mobile.

### toolbar.countdown: offer with a deadline
- Job: create urgency for a dated event or sale.
- Use: a real end date. Avoid: an evergreen fake deadline. Use `schedule: repeat`
  only for a real weekly or daily cutoff, such as an order cutoff for same-day
  shipping.
- Images: none.
- Copy: the event name plus the countdown, or the countdown alone.
- Build: `header-toolbar` with `_toolbar-countdown` (`end_date`, `end_time`,
  `end_message`, `hide_on_complete`). Add an `_toolbar-announcement` beside it.

### toolbar.marquee: several messages scrolling
- Job: show 2 to 4 offers or thresholds without a carousel.
- Use: several short, real messages. Avoid: more than 4 messages, or messages that need
  a click.
- Images: none, or small icons through `_inline-image`.
- Copy: short noun phrases separated by a decoration.
- Build: `section-custom` (Marquee preset) placed in the header group above
  `header-menu`. Blocks: `_marquee` > `theme-group-text` > `_inline-text` +
  `theme-decoration`.

### toolbar.none
- Use: no offer, or a header over a full-bleed hero where a bar would cut the image.
  Disable `header-toolbar` instead of writing filler.

## Header

### header.transparent: logo left, menu center, over the hero
- Job: give the hero the full first screen.
- Use: the first section is a full-bleed image or video with a calm top area. Avoid:
  busy hero tops, and pages whose first section is text.
- Images: a white logo (`transparent_white_logo`) for dark heroes.
- Build: `header-menu` with `transparent: true`, `logo_position: left`,
  `menu_position: center`. Set the toolbar transparent too, or disable it.

### header.image-mega: collections as image tiles
- Job: let the shopper choose a collection by its picture.
- Use: 2 to 5 collections, each with its own lifestyle image of one shape. Avoid:
  collections without distinct images.
- Images: `lifestyle` or `product-context`, one shape (4:5 or 1:1), one per collection.
- Copy: collection name; optional "Shop" or "View the lookbook" line.
- Build: `header-menu` > `_megamenu` > `_megamenu-column` > `_tile-image` (or
  `_card-custom` for a card with a caption below).

### header.product-mega: products in the menu
- Job: put best sellers or new products one click away.
- Use: a small catalog with a few hero products. Avoid: large catalogs. The cards go
  stale.
- Images: product cards (`product-white` from product media).
- Build: `_megamenu` > `_megamenu-column` > `_card-product` ×4.

### header.mega-columns: link columns plus one promo
- Job: let the shopper browse by several facets (type, benefit, format) and see one
  offer.
- Use: a catalog with 2 or more ways to browse. Avoid: fewer than about 8 links.
- Images: one promo image, `lifestyle` or `product-context`, 3:2 or 4:5.
- Copy: column titles are the facets ("By benefit", "By format"). The promo has a
  headline and one button.
- Build: `_megamenu` with `_megamenu-linklist` (link columns from the menu), then
  `_megamenu-column` > `_tile-image` (promo) or `_tile-frame` (icon cards).

## Hero

### hero.banner: full-bleed photo, text over image
- Job: say what the store is and send the shopper to the main path.
- Use: one wide `action` or `lifestyle` image, 2000 px or wider, with a calm area for
  text. Avoid: product-on-white images, and images with burned-in text.
- Images: 1 image, 16:9 to 3:2. Add a separate portrait `image_mobile` (about 2:3)
  when the subject sits off-center.
- Copy: an optional eyebrow (a real proof point or a kicker), a 2 to 5 word headline,
  an optional line, and 1 primary button plus an optional secondary link.
- Build: `section-banner` (`image`, `height: screen-three-quarters`,
  `vertical_placement`, `horizontal_placement`) with `theme-text` (kicker),
  `theme-text` (heading), `theme-richtext`, and `theme-group-row` > `theme-button` +
  `theme-link`.

### hero.media: video or photo with the logo as the headline
- Job: set the mood and identity. The products follow right after.
- Use: a strong brand mark and a short loop of the product in use. Avoid: an unknown
  brand with no clear product. The shopper needs `story.intro` right after.
- Images: 1 video (16:9) or photo; logo image.
- Copy: no headline, or the logo. One button to the whole catalog.
- Build: `section-pro-banner` > `_section-background` > `_background-image`
  (`media_type: video`), with content blocks for the logo `theme-image` and a link. A
  plain version is `section-banner` with `media_type: video`.

### hero.layers: split or collage background
- Job: show two images or a product cut-out with a lifestyle image in one hero.
- Use: two images that work side by side, or a collage of 2 to 4 cut-outs. Avoid: one
  weak image doubled.
- Images: 2 images of the same height (split), or 2 to 4 collage images plus a base
  image.
- Copy: the same as `hero.banner`.
- Build: `section-pro-banner` > `_section-background` > `_background-split` (or
  `_background-collage-image` plus `_background-image`).

### hero.slideshow: one slide for each collection or campaign
- Job: present 2 or 3 equal lines or campaigns.
- Use: each slide has its own image and destination. Avoid: one message spread over
  slides; most shoppers see only slide one.
- Images: 2 or 3 `lifestyle` images of one shape.
- Copy: a season or line kicker, a headline, a line, and one button on each slide.
- Build: `section-slideshow` > `_slide` with `theme-group-frame` content.

### hero.split: text beside one image
- Job: lead with an offer or argument, not a mood.
- Use: a specific offer (bundle, launch) and one square or portrait image. Avoid: a
  landscape-only image library.
- Images: 1 image, 1:1 to 4:5, `product-context` or `lifestyle`.
- Copy: a promo badge, an imperative headline, one line, one button.
- Build: `section-pair` with `_pair-custom` (`theme-badge`, `theme-text`,
  `theme-richtext`, `theme-button`) and `_pair-banner`. Set `height: screen-three-quarters`
  for a hero.

## Category and collection navigation

### nav.image-tiles: 3 or 4 tiles with text over image
- Job: show the main doors into the store (collections, story, sale).
- Use: one strong image for each door. Avoid: product-on-white images; text over them
  is hard to read.
- Images: 3 or 4 `lifestyle` or `product-context` images, one shape (1:1 to 4:5).
- Copy: a 1 to 3 word title, one line, and a link ("Shop [collection]").
- Build: `section-custom` > `_grid-auto` (`columns_desktop: 3`, `columns_mobile: 1`)
  > `_tile-image` with `theme-text`, `theme-richtext`, `theme-link`.

### nav.collection-cards: image card with title and description below
- Job: explain how the collections differ before the shopper enters.
- Use: 3 collections, each with one sentence about who it is for.
- Images: 3 images of one shape.
- Copy: collection name, one sentence, optional badge ("New").
- Build: `section-card-grid` (`columns_lg: 3`, `layout_mobile: slider`) >
  `_card-custom` with `_card-custom-overlay` (badge) and `_card-custom-details`.

### nav.collection-tabs: tabbed carousels with a lead tile
- Job: let the shopper switch collections and see products at once.
- Use: 2 to 4 collections with 4 or more products each. Avoid: tabs with fewer than 4
  products.
- Images: product cards; one `lifestyle` lead tile for each tab (optional).
- Copy: tab label is the collection name; the lead tile has the name and one line.
- Build: `section-card-slider-tabs` > `_cards-tab` (`title`) > `_tile-image` +
  `_cards-products` (`source: collection`).

### nav.benefit-cards: icon cards by goal
- Job: let the shopper choose by need, not by product name.
- Use: each product or collection maps to one benefit. Avoid: vague benefits that
  apply to every product.
- Images: one icon for each card (no photos).
- Copy: the benefit as the title, one line on how, and a "key ingredient" or
  "best for" line. The last card can be "everything" (a bundle).
- Build: `section-card-slider` > `_tile-frame` (`href` on the frame or a `theme-link`)
  with `theme-icon`, `theme-text`, `theme-richtext`.

### nav.benefit-tiles: photo tiles by goal
- Job: the same as `nav.benefit-cards`, with people photos.
- Use: lifestyle photos of people using the product for each goal.
- Images: 4 square `person` or `lifestyle` images.
- Build: like `nav.image-tiles` with `columns_desktop: 4`, `columns_mobile: 2`.

### nav.numbered-tiles: areas or ranges in order
- Job: show a set of parts (stages, ranges, steps) the shopper can explore.
- Use: 4 to 6 parts with one photo each.
- Images: 3:2 landscape photos, text over image.
- Copy: a number (01–05), a name, and one line.
- Build: `section-card-grid` (`columns_lg: 5`, `layout_mobile: slider`) with
  `_section-title` and `_tile-image` ×N.

### nav.collection-list: plain collection cards
- Job: show every collection on one page.
- Use: a collection list page or a drawer. On a homepage, use it only for a catalog
  with many collections.
- Images: collection images (set in Admin), one shape.
- Build: `section-card-grid` or `section-card-slider` > `_cards-collections`
  (`collections`, `aspect_ratio`). The `list-collections` page uses `_card-collection`.

## Product showcase

### showcase.tabs: best sellers and new arrivals
- Job: show what most people buy.
- Use: a best-seller collection (manual or sorted). Avoid: a "best sellers" tab with
  new or unproven products.
- Images: product cards. All cards must share one image style.
- Copy: tab labels only ("Best sellers", "New").
- Build: `section-card-slider-tabs` > `_cards-tab` > `_cards-products`.

### showcase.slider: one titled product carousel
- Job: show one set of products with a title and a "view all" link.
- Use: 6 to 12 products. Turn on the card star rating only when a review app writes
  the standard rating metafields (theme setting `card_rating_enable`).
- Images: product cards.
- Copy: a 1 to 3 word title and a link to the collection.
- Build: `section-card-slider` with `_section-title` and `_cards-products`.

### showcase.grid: product grid, no slider
- Job: show a whole small line at once.
- Use: 4 or 8 products. Avoid: odd counts that leave a gap in the last row.
- Images: product cards, 4:5 or 1:1, one background.
- Copy: a short title.
- Build: `section-card-grid` (`columns_lg: 4`, `layout_mobile: slider` or `grid` with
  `columns_sm_grid: 2`) > `_cards-products`.

### showcase.collection-rows: banner beside a product grid
- Job: present one collection with its mood image and its products together.
- Use: a lifestyle image for the collection and 4 products. Alternate the image side on
  consecutive rows.
- Images: 1 `lifestyle` image, portrait or square.
- Copy: collection kicker, headline, one button ("View the lookbook").
- Build: `section-pair` with `_pair-banner` (text inside the banner) and
  `_pair-card-grid` > `_cards-products`. A text-only header version uses `_pair-custom`
  with a title and a link.

### showcase.look-hotspots: shop the look
- Job: show products in use and let the shopper buy them from the photo.
- Use: one photo where 3 to 6 products are visible. Avoid: products the photo does not
  show clearly.
- Images: 1 `lifestyle` or `person` image, 4:5 to 1:1.
- Build: `section-pair` with `_pair-hotspots` (`_pair-hotspot` for each product) and
  `_pair-card-showcase` > `_cards-products`.

### showcase.featured-product: buy one product on the homepage
- Job: let the shopper buy the hero product without leaving the page.
- Use: one product that carries the business. Avoid: products with complex options.
- Images: product media.
- Build: `section-featured-product` with `_product-layout-media` and
  `_product-layout-details` (title, price, siblings, selectors, add buttons).

### showcase.single-card: one product beside a banner
- Job: feature one product with a mood image.
- Build: `section-pair` with `_pair-card-showcase` > `_cards-products` (or
  `_card-product`) and `_pair-banner`.

## Proof and social proof

### proof.quote-cards: short review quotes
- Job: show that real customers or experts like the product.
- Use: 3 or 4 real quotes with names, taken from the review app or the merchant.
  Avoid: invented or unattributed quotes.
- Images: none, or stars as an icon.
- Copy: a heading with the real rating and count, then quotes of 1 or 2 sentences, a
  name, and "Verified buyer" only when it is true.
- Build: `section-card-grid` (`columns_lg: 3` or `4`, `layout_mobile: slider`) >
  `_tile-frame` with `theme-icon`, `theme-text`, `theme-decoration`, `theme-text`
  (name). The "Quote card grid" preset is a start.

### proof.quote-marquee: scrolling review cards
- Job: show many short reviews in little height.
- Use: 6 or more short real quotes.
- Build: `section-custom` > `_marquee` > `_marquee-frame` > `theme-group-frame`
  (icon, quote, name).

### proof.big-number: one large figure
- Job: make one strong number the headline (reviews, customers, awards, years).
- Use: a verified number with a source. Add a footnote when the number combines
  channels.
- Copy: the number and what it counts. Nothing else.
- Build: `section-text-spotlight` with one `_spotlight-text`.

### proof.stats-pair: animated numbers beside an image or story
- Job: prove scale or history with 3 or 4 numbers.
- Use: real figures (years, customers, countries). Avoid: vanity numbers with no unit.
- Images: 1 `lifestyle` or `person` image, or a collage.
- Copy: kicker, headline, short paragraph, then number plus a 1 to 3 word label.
- Build: `section-pair` with `_pair-custom` > `_callout-group` > `_callout-number`
  and `_pair-banner` or `_pair-pro-banner`.

### proof.stats-band: numbers on a color band
- Job: the same as `proof.stats-pair`, without an image.
- Build: `section-custom` with a color scheme and `_callout-group` > `_callout-number`
  ×3 or ×4.

### proof.fact-strip: key facts in one line
- Job: answer "what do I get" in four short facts.
- Use: 3 or 4 facts the shopper cares about (place, size, distance, payment plan).
- Build: `section-custom` > `_grid-auto` (`columns_desktop: 4`) > `theme-text`, or a
  `_callout-group` > `_callout-icon`.

### proof.trust-row: service or certification icons
- Job: remove small doubts (returns, shipping, support, testing, certifications).
- Use: real policies or certifications only.
- Images: 3 to 6 icons.
- Copy: a 2 to 3 word title and one line for each.
- Build: `section-card-grid` (`columns_lg: 3`) > `_tile-frame` > `theme-icon`,
  `theme-text`, `theme-richtext`. In the purchase area use `_callout-group` >
  `_callout-icon`.

### proof.press-marquee: award and press names
- Job: borrow trust from known names.
- Use: real press, awards, or stockists. Logos need permission and one style.
- Images: none (names as text), or logo images through `_inline-image`.
- Build: `section-custom` (Marquee preset) > `_marquee` > `theme-group-text` >
  `_inline-text` or `_inline-image`.

### proof.press-quote: one pull quote
- Job: let a credible outside voice describe the brand.
- Copy: the quote (one or two sentences) and the source.
- Build: `section-custom` with `theme-text` (quote) and `theme-text` (source), or
  `section-text-spotlight`.

### proof.review-widget: the review app
- Job: show all reviews with filters.
- Use: an installed review app with reviews. Avoid: an empty widget.
- Build: the app's block in an `apps` section, or in `section-custom` (`@app`).
  Analog has no review block of its own. Stars in the purchase area use
  `_product-rating`; stars on cards use the theme setting `card_rating_enable`. Both
  read the standard rating metafields that the app writes.
- GAP: no themed review display. A store without an app cannot show reviews except as
  hand-entered quotes (`proof.quote-cards`).

## Brand story

### story.intro: product introduction under the hero
- Job: name the product and say what it does when the hero has no words.
- Copy: an eyebrow ("Introducing"), the product name, two benefit lines, an optional
  award badge.
- Build: `section-custom` with `theme-text` ×2, `theme-richtext`, `theme-image`.

### story.spotlight: statement with inline images
- Job: state the brand promise in one large sentence.
- Use: a promise that reads well at display size, plus 2 to 6 small images.
- Images: small `detail` or `product-context` images, square, inline.
- Copy: one sentence split into 3 to 6 phrases.
- Build: `section-text-spotlight` > `_spotlight-text` and `_inline-image` in turn.

### story.statement: plain large paragraph
- Job: make one serious statement (values, acknowledgement, mission).
- Build: `section-text-spotlight` with one `_spotlight-text`, or `section-custom` with
  a large `theme-text`.

### story.founder-pair: image beside the story
- Job: show the people or place behind the brand.
- Use: a real photo of the founders, workshop, or place. Avoid: stock photos.
- Images: 1 `person` or `lifestyle` image, portrait (about 3:4).
- Copy: a kicker, a headline, 2 to 4 sentences, and one link ("Our story").
- Build: `section-pair` with `_pair-banner` and `_pair-custom` (`theme-text`,
  `theme-richtext`, `theme-button` or `theme-link`).

### story.provenance: where and how it is made
- Job: answer "where does this come from" as a selling point.
- Use: a verifiable origin or process claim and a photo of it.
- Images: 1 wide `lifestyle` photo of the place (about 16:9) or a portrait of the
  maker.
- Copy: a contrast headline (own process versus the usual way, without naming a
  competitor), 3 proof bullets, and a location tag.
- Build: `section-custom` > `_grid-editorial` > `_grid-editorial-item` (text) +
  `_tile-image` with a `theme-badge` for the location. A simpler version is
  `story.founder-pair`.

### story.editorial-proof: numbers, values, and quote in one composition
- Job: tell the story and prove it in one section.
- Build: `section-custom` > `_grid-editorial` with items for a `_callout-number`, a
  values heading (`theme-group-text`), a paragraph, and a quote frame
  (`theme-group-frame`).

### story.values: three values with icons
- Job: name what the brand stands for.
- Use: values the store acts on, each with one supporting line.
- Build: `section-custom` > `_callout-group` > `_callout-icon` ×3, or
  `theme-group-row` > `theme-group-frame` (icon, title, text) ×3.

### story.word-marquee: brand words scrolling
- Job: a rhythm break that repeats the brand's three or four words.
- Copy: 3 to 5 single words.
- Build: `section-custom` > `_marquee` > `theme-group-text` > `_inline-text` +
  `theme-decoration`.

### story.mood-banner and story.mood-pair: wordless image breaks
- Job: show the product in life between product rows.
- Use: strong photography only. Do not stack two of these in a row (see
  `SKILL.md`).
- Images: 1 full-bleed `lifestyle` or `person` image (about 16:9), or 2 portraits
  (about 4:5) side by side.
- Build: `section-banner` with no text blocks; `section-pair` with two `_pair-banner`
  blocks; or `section-video` for a loop.

### story.video: brand or factory video
- Job: show the process or the product in motion.
- Images: a 16:9 video, or a poster plus a play button.
- Build: `section-banner` with `media_type: video` and `theme-video-button`; or
  `section-video`; or `section-pair` with `_pair-video`.

## Product education

### education.ingredient-pair: one material or ingredient explained
- Job: teach what the key ingredient or material does.
- Use: one ingredient that drives the product. Mark claims that need a disclaimer.
- Images: 1 `detail` or `person` image (hands holding the material), portrait.
- Copy: a headline that names the result, 3 to 5 benefit bullets, and "Shop
  [ingredient]".
- Build: `section-pair` with `_pair-banner` and `_pair-custom` (`theme-text`,
  `theme-richtext` list, `theme-button`).

### education.routine: slideshow plus numbered steps
- Job: show how to use the product, step by step.
- Use: a real routine or process with 3 to 4 steps and a photo for each step.
- Images: 3 slides, same shape.
- Copy: the steps as numbered accordion titles; 1 or 2 sentences each.
- Build: `section-pair` with `_pair-slideshow` > `_pair-slide` ×3 and `_pair-custom`
  > `_accordion-group` (`show_number`, `enable_timer_indicator`) > `_accordion`. Turn on
  `enable_ensemble` so the open step drives the slide.

### education.hotspots: features on the product photo
- Job: point to the parts that make the product better.
- Use: a clear product photo where 3 or 4 features are visible.
- Images: 1 `detail` or `product-context` image, 1:1 to 4:5.
- Copy: numbered feature names in tooltips, matching numbered callouts beside them.
- Build: `section-pair` with `_pair-hotspots` > `_pair-hotspots-tooltip` (or
  `_pair-hotspots-product`) and `_pair-custom` > `_callout-group` > `_callout-number`.

### education.compare-pair: before and after, or outside and inside
- Job: show a difference the shopper cannot see from a product photo.
- Use: two aligned images of the same framing (cutaway, wear test, result).
- Images: 2 images, same size and framing.
- Build: `section-pair` with `_pair-custom` and `_pair-before-after`. Full width:
  `section-before-after`.

### education.feature-slider: feature tiles
- Job: list 3 to 6 features with one image each.
- Images: tiles of one shape (1:1 or 4:5), `detail`.
- Copy: a 2 to 3 word feature name and one line.
- Build: `section-card-slider` > `_tile-image` with `theme-text`, `theme-decoration`,
  `theme-text`.

### education.spec-tiles: specifications
- Job: give technical buyers the numbers.
- Copy: label and value pairs; product metafields where possible.
- Build: `section-card-slider` or `section-card-grid` > `_tile-frame` >
  `theme-richtext`. Use `{{ closest.product.metafields... }}` text for per-product
  values.

### education.pair-accordion: image beside an accordion of lines or benefits
- Job: explain 3 to 4 lines or benefits in little height.
- Build: `section-pair` with `_pair-slideshow` or `_pair-hotspots` and
  `_pair-custom` > `_accordion-group` > `_accordion` (each may hold `_callout-group`
  and buttons).

### education.articles: blog cards
- Job: answer research questions and build authority.
- Use: 3 or more useful articles. Avoid: an empty or outdated blog.
- Images: 16:9 article images.
- Build: `section-card-slider` (Article card carousel preset) > `_cards-articles`.

### education.video-pair: video demonstration
- Job: show a test or demonstration.
- Build: `section-pair` with `_pair-custom` and `_pair-video` (or `_pair-banner` with
  `theme-video-button`).

## Objection handling and FAQ

### objection.faq: accordion of questions
- Job: answer the questions that stop a purchase.
- Use: real questions from support or reviews (shipping, returns, sizing, safety,
  "is this for me").
- Copy: the question as the shopper asks it; a direct answer first.
- Build: `section-custom` (FAQ: Accordion preset) with `_section-title` and
  `_accordion-group` > `_accordion` > `theme-richtext`. For grouped questions use the
  FAQ: Tabs preset (`_tabs` > `_tab`).

### objection.pair-accordion: image beside promises
- Job: handle one objection (quality, fit, durability) with evidence and a picture.
- Images: 1 `detail` image or a chart (a chart is a `graphic`; keep the text in it
  readable).
- Build: `section-pair` with `_pair-custom` > `_accordion-group` and `_pair-banner`
  or `_pair-hotspots`.

### objection.guarantee: risk reversal
- Job: remove the risk of trying.
- Use: a real written guarantee or return policy, with its length.
- Copy: the period and the promise ("[N]-day money-back guarantee"), one line of terms,
  and a link to the policy.
- Build: `section-custom` with `theme-icon` or `theme-badge`, `theme-text`,
  `theme-richtext`, `theme-link`. In the purchase area, add a one-line `theme-text` or
  `_callout-icon`.

### objection.offer-pair: why subscribe or bundle
- Job: explain the subscription or bundle offer.
- Use: a real subscription (selling plans) or bundle discount.
- Images: 1 `product-context` image or an offer graphic.
- Copy: the saving as the headline, then a 4 to 5 item checklist.
- Build: `section-pair` with `_pair-custom` (`theme-text`, `theme-richtext` checklist,
  `theme-button`) and `_pair-banner`.

### objection.size-guide
- Job: answer "will it fit".
- Build: a `page.size-guide` template linked from the purchase area, or a
  `_product-group-accordion` with the size table as `theme-richtext`. Per-product
  values can come from metafields.
- GAP: no size-guide drawer or modal opened from the purchase area. It needs a custom
  drawer section and a link block.

## Comparison

### comparison.checklist: us against the usual alternative
- Job: show why this product beats the common alternative.
- Use: 4 to 7 true, checkable differences. Do not name a competitor unless the merchant
  supplies a sourced comparison.
- Images: optional packshot (`product-white`) beside it.
- Copy: two column titles ("[Brand]", "Most brands"), then one line per row with a
  check or cross icon.
- Build: `section-card-grid` (`columns_lg: 2`) with `_section-title` and two
  `_tile-frame` columns, each a stack of `theme-group-flex` (`theme-icon` +
  `theme-text`) rows.
- GAP: no table block. The two-column build does not align rows across columns when a
  line wraps. A true table needs `theme-liquid-code`, which merchants cannot edit
  safely.

### comparison.lines: compare your own lines or models
- Job: help the shopper choose between the store's own collections or models.
- Copy: one card per line with "best for", key specs, and a link.
- Build: `section-card-grid` > `_card-custom` (image, `_card-custom-details` with
  title, text, link), or `_tile-frame` with spec rows.

### comparison.before-after: visual comparison
- Job: show the result or the difference in one image.
- Build: `section-before-after`, or `education.compare-pair`.

## UGC and community

### ugc.social-grid: follow tile plus photos
- Job: show the community and send people to the social account.
- Use: 5 or more customer or brand social photos with permission.
- Images: 5 square images plus one tile with the handle.
- Copy: "Follow along" type title, the handle, social links.
- Build: `section-custom` > `_grid-auto` > `_tile-image` (handle, `theme-social-links`)
  + `theme-image` ×5.
- GAP: no live Instagram feed; it needs an app block.

### ugc.tagged-grid: customers wearing or using it
- Job: show real people using the product, with handle and place.
- Images: 4 to 8 `person` photos, mixed shapes allowed in an auto grid.
- Copy: a handle badge and a short place or quote on each tile.
- Build: `section-custom` with a heading and `_grid-auto` > `_tile-image`
  (`theme-badge`, `theme-group-text`).

### ugc.video-stories: customer video testimonials
- Job: let customers tell their result in their own words.
- Use: real customer videos with permission.
- Images: 3 portrait posters (4:5).
- Copy: one sentence per story and a "Shop" link to the product they used.
- Build: `section-card-grid` (`columns_lg: 3`) with `_section-title` and `_tile-image`
  > `theme-text`, `theme-video-button`, `theme-link`.

### ugc.image-marquee: scrolling photo strip
- Job: a light rhythm break with many photos.
- Build: `section-custom` > `_marquee` > `theme-group-text` > `_inline-image`, or
  `_marquee` > `_marquee-gallery` > `_marquee-gallery-image`.

### ugc.bento: highlights grid
- Job: show the range of the experience or catalog in one composition.
- Images: 1 large tile (video or photo) and 4 smaller landscape tiles.
- Build: `section-custom` > `_grid-editorial` > `_grid-editorial-item` > `_tile-image`
  (`href` to a gallery or collection).

## Email capture

### capture.perks-pair: reasons to join, then the form
- Job: get the email with a clear reason.
- Use: a real benefit (first-order discount, early access, member drops).
- Copy: a kicker with the program name, the benefit as the headline, 2 to 3 perks, and
  the form.
- Build: `section-pair` with two `_pair-custom` blocks; the second holds
  `theme-form-newsletter`.

### capture.strip: centered heading and form
- Job: a short signup band before the footer.
- Build: `section-custom` (Newsletter preset) with `theme-text`, `theme-richtext`,
  `theme-form-newsletter`.

### capture.footer-column: form in the footer
- Job: offer signup on every page.
- Copy: a one-line hook with the benefit.
- Build: `footer` > `_footer-column` with `theme-text` + `theme-form-newsletter` +
  `theme-social-links`, or a `section-custom` footer (see `footer.custom`).

### capture.closing-cta: final call to action
- Job: close the page with the main action.
- Copy: an eyebrow, a two-line headline, one button.
- Build: `section-custom` or `section-banner` with `theme-text` ×2 and `theme-button`.

### capture.popup
- GAP: Analog has no email popup or flyout section. Recommend the merchant's email app.

## Footer

### footer.columns: newsletter, about, and links
- Job: give navigation, signup, and contact on every page.
- Build: `footer` > `_footer-column` ×3 or ×4 (`_footer-link-list`, `theme-richtext`,
  `theme-form-newsletter`, `theme-social-links`); `footer-sub` for legal links,
  payment icons (`enable_footer_payment`), and localization.

### footer.collection-columns: one column per collection
- Job: list each collection's links in its own column.
- Use: 3 or more collections with their own menus.
- Build: `footer` with a newsletter column and one `_footer-column` with a
  `_footer-link-list` per collection.

### footer.custom: composed footer
- Job: a footer with a large wordmark, badges, app links, or a disclaimer.
- Use: content that `_footer-column` cannot hold: app store badges, trust seals,
  regulatory text, or a large logo band.
- Build: `section-custom` in the footer group > `_grid-auto` > `_grid-auto-item` with
  `theme-image`, `theme-text`, `theme-link`, `theme-form-newsletter`,
  `theme-social-links`. Keep `footer-sub` after it.

### footer.gallery-band: image marquee above the footer
- Build: `section-custom` > `_marquee` > `_marquee-gallery` in the footer group, before
  `footer`.

### footer.minimal: subfooter only
- Use: a small store or a landing-page store.
- Build: `footer-sub` alone.

## Product page purchase area

The product template's `main` holds `_product-layout-media` and
`_product-layout-details`. These recipes choose the blocks inside the details column.

### pdp.lean
- Blocks: `_product-title`, `_product-price`, `_product-option-selectors`
  (`input_type: buttons`), `_product-stock-status`, `_product-quantity`,
  `_product-add-buttons`, `_product-description`.

### pdp.accordion
- Adds `_product-group-accordion-group` > `_product-group-accordion` (description,
  care, shipping and returns) below the buy buttons, and `_product-upsell`.

### pdp.proof
- Adds `_product-rating` above the title (needs a review app), a benefit kicker or
  chips (`theme-badge`, `_product-group-inline`), a `_callout-group` > `_callout-icon`
  trust row, and a one-line guarantee or shipping `theme-text`.

### pdp.offer
- Subscription: `_product-subscription` reads the product's selling plans. A
  subscription app may supply its own block instead.
- Linked colorways: `_product-option-siblings`.
- Add-ons: `_product-upsell`; `_product-complementary` (Search & Discovery
  recommendations).
- GAP: no quantity-tier bundle picker (1, 2, or 4 units at a per-unit price). It needs
  an app.

## Gaps summary

| Need | Status |
|---|---|
| Review widget and summary | App block only |
| Comparison table with aligned rows | `theme-liquid-code` only |
| Email popup | App only |
| Size guide drawer | Custom code |
| Quantity-tier bundle picker | App only |
| Product quiz | App only |
| Live social feed | App only |
| Lineup or directory with modals | Custom code |
