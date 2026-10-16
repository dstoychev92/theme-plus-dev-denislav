---
name: discover
description: Read everything a Shopify store answers without asking anyone, the themes and the live theme's version, settings, templates, and app blocks, the Admin API's markets, catalog, metafields, menus, and pages, the public site, and the store's Tradecraft data such as its photo library. Writes the facts into the engagement state. Use before any question about the store, when facts are older than 7 days, when the live theme may have changed, or to find photos and content for theme work.
---

# Discover a store

A question about a fact the store can answer wastes the developer's time. This skill reads
those facts first. It changes nothing on the store.

## Run it

```bash
node .agents/skills/discover/scripts/discover.mjs --store <store>.myshopify.com
```

It reads, in order:

1. `shopify theme list`: every theme, the live one, the count against the 20-theme limit, and
   themes connected to a GitHub branch (named `repo/branch`).
2. The live theme's `config/`, `templates/*.json`, `templates/*.liquid`, and `sections/*.json`:
   the theme name and version, every app block and app embed with its enabled state, the
   templates that exist, where each Liquid template's forms post, the homepage's sections, and
   the logo, fonts, and color settings.
3. The Admin API through Shopify CLI: the plan, markets, languages, catalog counts, product
   options, product metafields, metaobjects, menus, pages, and redirect count. Then, on its own,
   the script tags: apps that load through them show no app block in the theme.
4. The public site's homepage: the outside script hosts, which show apps that load without an
   app block, such as a chat script in theme code, and whether a password protects the store.

It writes `facts.json` in `.tradecraft/cache/` and merges the facts into the engagement state.
It prints a summary. Use that summary as the evidence in every question.

## When a read fails

The summary lists each missing part with the reason. Carry on with what it read.

- **Admin API without a sign-in.** Ask the developer once to approve a read-only sign-in,
  and show the command. It opens a browser for them:

  ```bash
  shopify store auth --store <store>.myshopify.com --scopes read_products,read_content,read_online_store_pages,read_online_store_navigation,read_markets,read_locales,read_legal_policies,read_metaobject_definitions,read_themes,read_script_tags
  ```

  The token lasts about a day, and it only reaches what the signed-in staff member can see.
- **A storefront password.** Ask the developer for it once, and pass it in the
  `STOREFRONT_PASSWORD` environment variable to the scripts that read the site. Never put
  it on a command line or in a file.
- **No theme list.** Shopify CLI needs a sign-in. Give the developer
  `shopify theme list --store <store>.myshopify.com` to run.

## Read the facts, do not ask them

After this skill, never ask the developer or the client for:

- the live theme, its version, or other themes on the store
- the markets, currencies, or languages
- the apps in the theme or the scripts on the site
- the catalog size, product options, metafields, or templates in use
- the theme count

Ask instead what the facts cannot say: which apps they still pay for and want, what matters
most to the business, and what the brand should keep. The `tradecraft` skill holds those
questions.

## What the facts do not cover

- Apps with no storefront trace, such as an inventory app, do not show in the theme. The
  Admin API cannot list another app's installation. Ask once, as part of the app question.
- Billing for apps, order history beyond 60 days, payment settings, and other apps' pixels
  need the developer.
- A deeper comparison of the live theme with its release is `tradecraft merge live`, which
  the `splice` skill reads.

## The store's Tradecraft data

With a Tradecraft sign-in, `tradecraft api graphql` reads the store's photo library, lists,
and catalog. [references/tradecraft-data.md](references/tradecraft-data.md) shows the queries.
Use it to choose real photos for pages.
