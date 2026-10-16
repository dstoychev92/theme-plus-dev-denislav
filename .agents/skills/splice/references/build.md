# Build a rebuild

These rules apply to every rebuild: the foundation, each worker, and a single item
built in the lead session.

## Find the target's own way

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
  prices by country, say so in the item. That is the merchant's decision, so ask in
  the plan before you build around it.

## Keep the theme general

The target theme's source in a project also serves other stores and later updates.

- Put store-specific values in theme settings, off by default, not in code. A new
  setting that is empty must leave the theme exactly as it was.
- Prefer the store's own data to a copied list. Map to the store's markets, tags, or
  metafields rather than writing country or product lists into the theme. A copied
  list goes out of date: the store this rule came from sent 14 countries to the wrong
  warehouse because its theme kept its own country list.
- Keep source changes in the theme's `src`. Never write to `dist`.
- Put this store's values in its content folder: `store/` in a Tradecraft project, or
  `themes/<theme>/environments/<env>/` in this monorepo and in a project from before
  `store/`. Every JSON file there replaces the theme's file at the same path when the build
  runs: `config/settings_data.json`, `templates/*.json`, and `sections/*.json` groups. Start
  from a copy of the theme's file.
- A page template for one store goes in the store's content folder. Name it after the template
  suffix that the store's pages already use, such as `page.form-front.json`. The
  pages then use it on publish with no change in the admin.
- The content folder carries JSON files only. A store-only Liquid file, such as
  `templates/robots.txt.liquid` or a custom section, goes in the project's theme source.
- Copy the store's app embeds early: the enabled `shopify://apps/...` blocks in the
  live `settings_data.json`, for apps that are still installed. Without them the
  development theme lacks the apps that some features depend on, such as a country
  selector or a bundle builder. App blocks inside templates move with their template.
- Replace or hide the target theme's demo content that the store would show, such as
  a sample discount message, a sale countdown, or an "About your store" placeholder.
- Do not copy the old theme's settings or templates. Their IDs belong to the old theme.
- When the old code is a frozen copy of something the platform keeps current, such as
  Shopify's default robots.txt rules, keep the store's exact behavior unless you can
  tell its own additions apart. Record the switch to the platform's version as a
  suggestion.
- Follow the target theme's conventions and its `AGENTS.md`. Match the surrounding
  code: the same Liquid style, a `{% doc %}` block on a new snippet, comments only
  for what the code cannot say.

## The foundation

This session builds the plan's shared files first, on `splice/<store>/1-foundation`,
made from the base branch. Keep it small: the shared files and nothing else.

Before any layer starts, the foundation must be on GitHub:

1. Build and check it, as below.
2. Commit it, push the branch, and open its pull request into the base branch.
3. Run `git log --oneline -1 origin/splice/<store>/1-foundation` and record that
   commit in `plan.md`. Each layer, and each worker, starts from it.

A worker that starts before the push builds on the base branch without the shared
files, and its layer fails to build or repeats them.

## Feature layers in this session

This is the default. For each feature layer, in the plan's order:

1. Make the layer's branch from the layer below it:
   `git switch -c splice/<store>/<n>-<feature> splice/<store>/<n-1>-<name>`.
2. Build it, then build and check as below.
3. Commit, push, and open a pull request whose base is the layer below it. Its body
   names the items, what changed, the check that ran, and what is still unchecked.

Change only the files the plan gave the layer, as a worker would.

## Split pull requests

Build each split item on `splice/<store>/split-<item-id>`, from the base branch, or
from the foundation when it needs the foundation. Its pull request says in its first
line why the reviewer will probably close it, such as "The old theme's second cart
drawer. The new theme's drawer already does this." It changes no file that the stack
changes.

## The templates and JSON layer

This session builds it last, in phase 4, after the feature layers are stacked. It
places every feature on its pages: template JSON, section group JSON, and the rest
of the content folder's `settings_data.json`. Workers never change these files.

## Pages and forms

A theme export does not hold page content. When an item depends on pages, list the
actual page handles and their template suffixes. With approval, the Admin API gives
them exactly; `splice` explains how.

For each form, record its action, method, encoding, field names, attachments,
conditional fields, and success page. Compare these separately from how it looks. Do
not replace an external form with Shopify's contact form because both send
messages. Do not send a test submission unless someone authorizes it. Report what
was not exercised, such as delivery, attachments, and captcha.

## A content page

A content item, such as the homepage or a product page, becomes the target theme's
own sections and blocks, filled with the store's content. Do not port the old
sections. Follow the `pages` skill: it writes the store brief, ranks the
store's images, and builds a faithful version of the live page and an improved
alternate.

When the person asks for a custom design in code instead, build it as sections in
the theme source with settings for the copy, and record that choice in the plan.

Record what the target could not express yet, such as a background video that the
theme takes only as a file from the store's Files, so it can be finished by hand.

## Build and check

Build with the store's content, then run Theme Check on the output:

```bash
tradecraft check --suite theme-check    # in a Tradecraft project: builds with store/ and checks
```

In this monorepo, build with the environment: `pnpm <theme> build -s=<env>`, then
`npx shopify theme check --path themes/<theme>/dist`.

Fix every error. A warning in a file you did not touch was there before; leave it.
Theme Check reports app blocks in template JSON as `JSONMissingBlock`, because it
cannot see apps. Shopify accepts them, so check that the page renders the app
instead. Confirm each new template is in `dist/templates/`.
