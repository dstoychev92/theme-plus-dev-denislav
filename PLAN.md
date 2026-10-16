# Plan: Boom Coffee move to Analog

Test store: theme-plus-dev-denislav.myshopify.com. Client: Boom Coffee.

## The move

- From: the live theme "Analog migration" (#196955635995), Pipeline 9.0.0
- To: Analog 1.1.0-beta.3, the newest release. Analog has no stable release yet. Update to it when it ships
- Base for the comparison: `pipeline-9.0.0-analog-02064390e.zip`, from the developer
- Comparison: `splice/theme-plus-dev-denislav/compare`. 68 files added, 145 modified, 5 removed
- Work list: `splice/theme-plus-dev-denislav/todo.md`

## Custom work to carry over

The splice audit ranks these items. The path that must work comes first.

1. Product page for Brain Coffee (`product.brain-coffee`): benefits, ingredients with study citations, quantity and purchase type
2. Bundle builder (`page.bundle-builder`, `product.bundle-builder`, `_product-bundle-builder`)
3. Upsell and gift sync in the cart (`custom.boom-upsell`, `custom.boom-gift-sync`)
4. Announcement with a free-shipping threshold
5. Homepage: banner, marquees, before/after tabs, card slider tabs, UGC video slider, scroll glass (hidden)
6. Store locations map (`boom-locations-map`, `page.magazinna-mreja`)
7. Romania context templates (`*.context.romania`, `group-header.context.romania`)
8. Content pages: about, story, science, team, FAQ, how to brew, affiliate, lookbook, recipe articles
9. Rotating favicons (`Favicon01`–`07`)

## Best guesses for the client

| Topic | Guess | Evidence |
|---|---|---|
| Who the site is for | Boom Coffee's customers. This store is for tests only | Developer |
| The path that must work | Buying a protein coffee or an adaptogenic Brain Coffee, including the bundle builder | Homepage buttons for each coffee, custom product and bundle templates |
| Apps | Nothing to carry. Custom code does the work of apps. Rebuild each part in Analog | No app blocks, embeds or script tags |
| Brand | Extract the Boom Coffee brand. Do not invent one | Move, not a redesign |
| Copy | Keep the Bulgarian copy. Fix wrong facts only | Default |
| Claims | Keep the health claims only with their study citations. Add no new ones | Product page cites studies, such as Mori et al., 2009 |

## Defaults (the developer can change these)

- The developer commits and pushes. I run only local and read-only commands
- Work on `main`, delivery with `tradecraft ship`
- Previews go to `tradecraft preview`. Never to the live theme
- No URL changes. A removed page gets a redirect

## Risks

- The test store has only a Canada market and English. Boom Coffee sells in Bulgarian, and the theme has Romania context templates. The preview cannot show the Romania context until the store has that market
- The test store has 6 products, 1 collection and 1 page. Many live templates have no content to show here
- The storefront has a password. Checks on the preview need it
