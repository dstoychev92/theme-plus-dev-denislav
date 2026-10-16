# Splice to-do: Boom Coffee (test store theme-plus-dev-denislav)

Move: Pipeline 9.0.0 (live, "Analog migration") → Analog 1.1.0-beta.3.
Base: `base/pipeline-9.0.0-analog-02064390e.zip`. Changes: `changes/`. Comparison: `compare/changes/`.
Target: `theme/dist`. What it can do: `target.md`. Evidence: `triage.md`.

Key: S selling · V visual · C content · T text. Status: found → understood → rebuilt → verified, or dropped (only after someone confirms).
Suggestion: **rebuild** (Analog has a native way), **port** (bring the code over, made general), **drop**.

Not gathered: the storefront has a password, so the audit did not read the live site. No app is installed in the theme (P3); the `boom-*` and `schema-*` files are the store's own code, not apps.

## Must

The path that must work (P1): buying Protein Coffee or Brain Coffee, alone, in a box, or on subscription.

- [ ] S1 selling: **BOOM! BOX bundle builder.** WHY: the shopper fills a box with flavours, sees the volume discount grow, and gets a gift at set sizes. The box product is only a shell and is blocked from being ordered alone. Suggest: port as an Analog product block. Files: blocks/_product-bundle-builder.liquid, assets/custom.boom-bundle-builder.css, snippets/boom-gift-icon.liquid. Templates: product.bundle-builder(.context.romania), page.bundle-builder. Status: understood
  - Shopper sees: a flavour grid from the block's collection, a bag counter with 1–4+ tiers, % off per tier, gift icons at tiers 2–4, a "best deal" badge, price per dose
  - Runs on: the BOOM! BOX shell product page. Reads the collection's products, metafields `custom.card_bg_color`, `custom.card_badge`, `custom.doses_per_bag`
  - How it adds: no button of its own. It patches `window.fetch` and rewrites the next `/cart/add` body into one line per flavour, with the subscription plan from S3 (`window.__boomSubPlan`). It also blocks the shell product from being added alone
  - Discounts: the theme only shows the %. The real discount must be a Shopify automatic discount on Boom's store. Gifts (`gift_product_2..4`) are added in the cart by S4
  - Analog has: no bundle builder. It has its own add-to-cart in `theme.main.js` and a product form
  - Suggest: port as an Analog product block, but replace the fetch patch with an explicit hook on Analog's product form submit (the patch breaks any other script that adds to cart). Keep the settings and labels as block settings
  - Check: on the preview, add 3 flavours, one-time and subscription; the cart has 3 lines with the plan; the shell product never enters the cart; the tier and the gift match
- [ ] S2 selling: **Quantity cards with volume discounts and gifts.** WHY: 1–4 packs as cards with % off per tier (`discount_pct_2..4`), a "best deal" badge, price per dose, and a free gift above a threshold. Orange accent for Protein, blue for Brain. Suggest: port as a product block beside Analog's quantity block. Files: blocks/_product-quantity-alt.liquid, snippets/product-form-price.liquid. Status: found
- [ ] S3 selling: **Subscription cards.** WHY: one-time vs subscription as two cards, frequency grid, perks (10% off, free shipping, cancel any time). Suggest: rebuild on Analog's own subscription block, restyled; port only the card layout. Files: blocks/_product-subscription-alt.liquid, snippets/product-form-price-subscription.liquid. Status: found
- [ ] S4 selling: **Cart tier bar and automatic free gift.** WHY: in the cart, a progress bar for BOOM! BOX tiers adds or removes the free gift line through the Cart API as the count changes. Suggest: port into Analog's cart drawer and cart page. Remove the debug switch. Files: snippets/cart-boom-tier-bar.liquid, assets/custom.boom-gift-sync.js, assets/custom.boom-gift-sync.css, snippets/cart-line-item-product.liquid, sections/cart-drawer.liquid, sections/cart.liquid. Status: found
- [ ] S5 selling: **Price per dose, per market.** WHY: shows "from €x per dose" on cards and products, and replaces `[[doza_protein]]` / `[[doza_brain]]` in descriptions and SEO text. Values from Theme Settings with per-market overrides (`dose_price_*_markets`), then product metafields. Suggest: port the snippets and settings. Prices conflict across pages (see `brand/facts.md`). Files: snippets/dose-price.liquid, snippets/replace-dose-placeholders.liquid, snippets/card-product-lg-price.liquid, blocks/_product-description.liquid, snippets/head.liquid, snippets/head-social-meta.liquid, config/settings_schema.json. Status: found
- [ ] S6 selling: **Free-shipping threshold per market.** WHY: 50 € (BG), 75 € (GR), 375 lei (RO) in the announcement bar and the cart message. Suggest: rebuild with Analog's "Market free shipping limit" metafield setting and its cart free-shipping message. Files: blocks/_announcement-shipping-threshold.liquid, snippets/free-shipping-threshold.liquid, snippets/cart-shipping-message.liquid, snippets/cart-upsell-block.liquid. Status: found
- [ ] T1 text: **Bulgarian, Greek and Romanian theme strings.** WHY: the store sells in Bulgarian; Analog ships no `bg`, `el` or `ro` locale, so buttons and cart text would show in English. Suggest: port the live locales mapped to Analog's keys, plus the `boom.*` strings. Files: locales/bg.json, locales/el.json, locales/ro.json, locales/en.default.json. Status: found
- [ ] S7 selling: **Switch to subscription in the cart.** WHY: each cart line with selling plans offers a toggle to the best-discount plan, with a % badge. Suggest: port into Analog's cart line item. Files: snippets/cart-line-item-subscription-toggle.liquid, snippets/cart-line-item.liquid. Status: found
- [ ] S8 selling: **Company invoice in the cart.** WHY: a checkbox reveals company name and ЕИК fields that go to cart attributes, required for Bulgarian business invoices. Suggest: port into Analog's cart. Files: snippets/cart-company-invoice.liquid, sections/cart-drawer.liquid, sections/cart.liquid. Status: found
- [ ] S9 selling: **Structured data for search.** WHY: richer product schema, FAQ, breadcrumb, collection and recipe JSON-LD. Suggest: port, after checking what Analog already prints. Files: snippets/schema-*.liquid, layout/theme.liquid, sections/product.liquid, sections/section-accordion.liquid, sections/article*.liquid. Status: found
- [ ] S10 selling: **robots.txt.** WHY: blocks duplicate query URLs (`?variant=`, `?q=`) and allows AI search crawlers. Suggest: port as is. Files: templates/robots.txt.liquid. Status: found

## Should

- [ ] V1 visual: **Custom brand fonts.** WHY: Heading Now, Jost and EB Garamond italic from the store's Files override the font settings; without them the site falls back to Figtree. Suggest: port as a font override that Analog's head type snippet reads; files must exist on Boom's store. Files: snippets/head-type.liquid, assets/theme.css. Status: found
- [ ] S11 selling: **Sticky add-to-cart bar.** WHY: on the product page, a bar appears once the form scrolls away and scrolls back to the quantity cards. Suggest: port as a product section setting. Files: snippets/product-sticky-add-to-cart.liquid, sections/product.liquid, sections/section-featured-product.liquid. Status: found
- [ ] S12 selling: **Nutrition and ingredients tables.** WHY: product accordion tables from JSON metafields `custom.hranitelni_stoinosti` and `custom.systavki`. Suggest: port as a snippet for a Liquid block. Files: snippets/boom-nutrition-table.liquid. Status: found
- [ ] S13 selling: **Post-add upsell popup (Brain Coffee −20%).** WHY: after a Protein Coffee add, a popup with a countdown offers Brain Coffee. Off on live (`boom_upsell_enabled` false). Suggest: port only if the client wants it back; see q1. Files: assets/custom.boom-upsell.js, assets/custom.boom-upsell.css, snippets/boom-upsell-popup.liquid, snippets/head-scripts.liquid. Status: found
- [ ] S14 selling: **Header phone button.** WHY: a call link in the header. Suggest: rebuild with Analog's header link or icon block. Files: snippets/header-phone-button.liquid, sections/header-menu.liquid, snippets/core-icon.liquid. Status: found
- [ ] S15 selling: **Small edits to prices, cards, forms and groups.** WHY: unknown yet; may be core drift. Suggest: read each, drop drift. Files: snippets/card-price.liquid, snippets/card-product.liquid, blocks/_product-price.liquid, blocks/_form-group.liquid, blocks/theme-form-newsletter.liquid, blocks/_toolbar-announcement.liquid, blocks/_product-group-row.liquid, blocks/_section-title-row.liquid, blocks/theme-group-row.liquid, blocks/_product-group-flex.liquid, blocks/theme-group-flex.liquid. Status: found
- [ ] V2 visual: **Store locations map.** WHY: a map of retail partners from `location` metaobjects, plus a partner form. Suggest: port as a section. Files: sections/boom-locations-map.liquid, assets/custom.locations-map.js. Template: page.magazinna-mreja. Status: found
- [ ] V3 visual: **UGC video testimonial slider.** WHY: customer videos on the homepage. Suggest: port, or rebuild with Analog's card carousel and video if it covers the look. Files: sections/section-ugc-video-slider.liquid, blocks/_ugc-video-testimonial.liquid, snippets/ugc-silhouette.liquid, assets/custom.ugc-slider.*. Status: found
- [ ] V4 visual: **Recipe article template.** WHY: recipes with ingredients, steps, video and the product used, from article metafields. Suggest: port as a section. Files: sections/article-recipe.liquid. Status: found
- [ ] V5 visual: **"How it works over time" timeline.** WHY: steps on a rail that fills on scroll (affiliate page, product). Suggest: port as a section. Files: sections/section-timeline.liquid, blocks/_timeline-step.liquid, blocks/theme-group-frame.liquid. Status: found

## Later

- [ ] V6 visual: **Scroll-filling glass (delight).** WHY: a glass fills with coffee as you scroll. Hidden on the live homepage. Suggest: port; see `brand/delight.md`. Files: sections/boom-scroll-glass.liquid, blocks/_glass-cup.liquid, snippets/glass-cup.liquid, blocks/_flex-item.liquid, blocks/_pair-custom.liquid, sections/section-custom.liquid, sections/section-pair.liquid. Status: found
- [ ] V7 visual: **Filled active tabs.** WHY: the active tab takes the section colour. Suggest: rebuild with Analog's tab settings, port if missing. Files: sections/section-tabs.liquid, sections/section-card-slider-tabs.liquid. Status: found
- [ ] V8 visual: **Announcement bar with marquee.** WHY: rotating offers per market. Suggest: rebuild with Analog's toolbar announcement. Files: sections/section-announcement-bar.liquid. Status: found
- [ ] V9 visual: **Card showcase custom background.** Suggest: rebuild with settings. Files: blocks/_card-showcase.liquid, blocks/_pair-card-showcase.liquid. Status: found
- [ ] V10 visual: **Rotating favicons.** WHY: seven Boom favicons. Suggest: confirm it rotates on live, then port a small snippet. Files: assets/Favicon01–07.jpg, layout/theme.liquid. Status: found
- [ ] V11 visual: **Style and script edits.** Suggest: read for features hidden in theme.css and theme.main.js, drop the rest. Files: assets/theme.css, assets/theme.main.js, assets/custom.css. Status: found
- [ ] V12 visual: **Small edits, which may be core drift.** See the V18 list in `triage.md`. Status: found
- [ ] C1 content: **Templates and settings.** 38 files; the `pages` skill rebuilds them in Analog's sections. The test store uses only 3 (product, collection, contact). Status: found

## Open questions

The live behavior is the guess. The client confirms each on the review page.

- [ ] q1: The upsell popup is off on live. Guess: leave it off and do not port it now. Blocks S13.
- [ ] q2: The test store has only the Canada market. Guess: add Bulgaria, Greece and Romania markets on the test store before checks, so per-market prices, thresholds and the Romania templates can be seen. Blocks S5, S6, T1.
- [ ] q3: Four facts disagree (dose size, price per dose, vitamin counts, the −15% offer). Guess: keep the live values until the client corrects them. See `brand/facts.md`.

## Dropped (suggested, confirm before removing)

## Done

## Bugs to check

- assets/custom.boom-gift-sync.js: a debug mode left in (`?boom_debug=1`). Remove it in S4
- snippets/predictive-search-flyout.liquid: `console.log('focusing')` left in
- templates/product.misc.json: "Use this text to share information about your brand." is theme demo text on a live template
