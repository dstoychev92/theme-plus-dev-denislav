---
name: splice-rebuild
description: Rebuild one splice to-do item in the target theme, the way that theme would build it, then verify it on a development theme. Use after splice-audit marks an item understood, in a Tradecraft project or this monorepo.
---

# Rebuild a splice item

This is the implementation stage of a splice. `splice-audit` keeps the list in
`splice/<store>/todo.md` and describes the kinds of splice.

Take the top item marked `understood`. Rebuild it for its goal, mark it `rebuilt`,
verify it, and mark it `verified`. Add anything new you find to the list instead of
widening the item. Then return to the list. Do not publish a theme, and do not run
Git operations unless asked.

## 1. Find the target's own way

Before you write code, find where the target theme already decides the thing the
item changes. Search its source for every place, not the first one: in Analog, 19
blocks and snippets each choose the current variant. A rebuild that changes one of
them leaves the others disagreeing, such as a price for one variant and an add
button for another.

- If the target has one place for it, change or extend that place.
- If it has many, add one snippet that answers the question, and call it from each
  place. Keep each call the same few lines.
- If the target can reach the goal through settings or its own sections and blocks,
  use those and write no code.
- If the platform can reach the goal without theme code, such as Shopify Markets for
  prices by country, say so in the item. That is the merchant's decision, so ask
  before you build around it.

When two ways are reasonable, ask which one with the cost of each, then build it.

## 2. Build it so the theme stays general

The target theme's source in a project also serves other stores and later updates.

- Put store-specific values in theme settings, off by default, not in code. A new
  setting that is empty must leave the theme exactly as it was.
- Prefer the store's own data to a copied list. Map to the store's markets, tags, or
  metafields rather than writing country or product lists into the theme. A copied
  list goes out of date: the store this rule came from sent 14 countries to the wrong
  warehouse because its theme kept its own country list.
- Keep source changes in the theme's `src`. Never write to `dist`.
- Put this store's values in its environment:
  `themes/<theme>/environments/<env>/config/settings_data.json`. That file replaces
  the theme's own `settings_data.json`, so start from a copy of the theme's file and
  add the store's values to its current preset. The same goes for a template or a
  section group that only this store needs, such as `templates/product.json`.
- An environment carries JSON files only. A store-only Liquid file, such as
  `templates/robots.txt.liquid`, goes in the project's theme source.
- Copy the store's app embeds early: the enabled `shopify://apps/...` blocks in the
  live `settings_data.json`, for apps that are still installed. Without them the
  development theme lacks the apps that some features depend on, such as a country
  selector or a bundle builder. App blocks inside templates move with their template.
- Replace the target theme's demo content that the store would show, such as a
  sample discount message in the cart.
- Do not copy the old theme's settings or templates. Their IDs belong to the old theme.
- When the old code is a frozen copy of something the platform keeps current, such as
  Shopify's default robots.txt rules, keep the store's exact behavior unless you can
  tell its own additions apart. Record the switch to the platform's version as a
  suggestion.
- Follow the target theme's conventions and any skills the project has for it. Match
  the surrounding code: the same Liquid style, a `{% doc %}` block on a new snippet,
  comments only for what the code cannot say.

Build, then run Theme Check on the output. Fix every error. A warning in a file you
did not touch was there before; leave it. Theme Check reports app blocks in template
JSON as `JSONMissingBlock`, because it cannot see apps. Shopify accepts them, so
check that the page renders the app instead.

## 3. Verify on a development theme

Ask before the first upload: `pnpm dev:<env>` uploads the build to a hidden
development theme on the store and keeps it in sync. It does not touch the live
theme. Check first that no other watcher serves the same theme and store. If Shopify
CLI asks for a sign-in, give the person the link and the code it prints, because a
command run without a terminal cannot open a browser.

Check the item's own acceptance check, with evidence:

- Load pages through the store's preview link,
  `https://<store>.myshopify.com/<path>?preview_theme_id=<id>`, with a fresh cookie
  file for each request. Confirm that each page reports the development theme's ID
  in `Shopify.theme`, because a preview request can fall back to the live theme.
- To check what a shopper in another country sees, add `&country=<code>`. The local
  preview at `127.0.0.1` shares one storefront session across requests, so a country
  sticks from one request to the next there.
- Read what the server rendered, such as the variant in the `name="id"` field, the
  price, and the currency. A script can change the page after it loads, so look in a
  browser when the result depends on one.
- Check every product or page the item applies to, not one sample. Store data varies
  in ways one page hides: two of eight products named the same option without its
  colon, and only checking all eight found it.
- Check the pages the item named, on desktop and mobile, and the places that share
  the code, such as cards and quick view when the product form changed.
- Do not submit a form to check a result, such as adding to a cart. Leave that check
  to the person and say what to do. Some results show only on the published theme,
  such as robots.txt. Say when they can be checked.

Record the result in the item: what you checked, on which development theme, and
what is still unverified. Mark it `verified` only when the checks pass.

## Rebuild a content page

A content item, such as the homepage or a product page, becomes the target theme's
own sections and blocks, filled with the store's content. Do not port the old
sections, and do not reach for a custom Liquid section. Follow the `compile-pages`
skill: it writes the store brief, ranks the store's images, and builds a faithful
version of the live page and an improved alternate.

Record what the target could not express yet, such as a background video that the
theme takes only as a file from the store's Files, so it can be finished by hand.

## Pages and forms

A theme export does not hold page content. When an item depends on pages, list the
actual page handles and their template suffixes. With approval, the Admin API gives
them exactly; `splice-audit` explains how.

For each form, record its action, method, encoding, field names, attachments,
conditional fields, and success page. Compare these separately from how it looks. Do
not replace an external form with Shopify's contact form because both send
messages. Do not send a test submission unless someone authorizes it. Report what
was not exercised, such as delivery, attachments, and captcha.
