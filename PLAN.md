# Plan: theme-plus-dev-denislav.myshopify.com

## The project

- Keep the live theme, "denislav-analog" (#186841071899), on Analog.
- Update Analog from 1.1.0-beta.1 to the newest release (1.1.0-beta.3 today), with `tradecraft merge`.
- Keep the store's look, content, and copy. Fix wrong facts only.

## What the store has

- Development store, one market (ca, CAD), one language (en).
- 6 products, 1 collection ("Home page"), 1 page ("contact"), 3 menus, 0 redirects.
- Product options: Color, Size, Packaging, Combined listing option name, Material.
- Homepage: 18 sections, 1 of them hidden (section-pro-banner).
- 5 of 20 themes. None connects to GitHub.
- The storefront has a password.

## Work

1. **Update:** merge Analog 1.1.0-beta.3 onto the live theme's code and settings. Keep every edit the live theme has.
2. **Brand:** extract the existing brand into the brand folder. No new direction.
3. **Pages:** no new pages. The update keeps the current templates.
4. **Review:** check the preview against the live theme, page by page.
5. **Ship:** upload to the live theme with `tradecraft ship`, after your approval.

## Apps

| App | Evidence | Plan |
|---|---|---|
| none | No app blocks, no app embeds, no script tags | nothing to keep or drop |

## Best guesses (the review page shows these)

- **The path that must work:** buy "Combined listing 1": choose Color and Size, add to cart, go to checkout. It has the most stock (176).
- **Who the site is for:** a test store for Analog development, with no real audience.
- **Brand:** extract the existing brand.

## Defaults (change any of them)

- Delivery: `tradecraft ship` to the live theme. The live theme has no GitHub connection.
- Branches: work on `main` in this project.
- Git: I run local commands. You commit and push.
- Previews: `tradecraft preview`. I never upload to the live theme without your approval.
