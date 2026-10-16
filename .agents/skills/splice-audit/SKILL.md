---
name: splice-audit
description: Audit a splice. Compare a changed Shopify theme with the release it started from, find the features hidden in the changes, and keep a ranked to-do list that is worked through one item at a time until the splice is done. Use to start or continue any splice, such as moving a store's custom code to a new theme or updating a theme to a newer release.
---

# Audit a splice

A splice carries changes from one theme onto another. Every splice has three
inputs, and only the inputs change between kinds of splice:

- A store that moves to a new theme: the store's original release, its live theme,
  and the new theme.
- A theme update: the release the project started from, the project's theme, and
  the newer release.

In a Tradecraft project, `tradecraft splice` writes the comparison to
`splice/<store>/compare`, the changed theme to `splice/<store>/live`, and the base
release to `splice/<store>/original`.

A store can have more than one changed theme, such as an earlier unpublished attempt
at the same migration, or a staging copy someone edited. `tradecraft splice --theme <id>`
splices one of those into `splice/<store>/theme-<id>/`, with the pulled theme in
`theme/`. Each splice folder has a `splice.json` that names the theme and its release.
See "More than one splice" below.

The goal is to find each feature hidden in the changes, understand what it is for,
and hand it to the rebuild so the target theme does it better in its own way. A
feature rarely lives in one file. Most changed lines are merchant content and app
files. Let the script do the mechanical work, then spend your time on judgment.

## 1. Gather the evidence

If `splice/<store>/todo.md` exists, read it first and continue from step 4.

Otherwise run:

```bash
node .agents/skills/splice-audit/scripts/audit.mjs splice/<store> [--site https://<domain>] [--pages /pages/<handle> ...]
```

It takes a few minutes. It reads the live site with GET requests to public pages,
and it waits and tries again when Shopify slows it down. It writes three files beside
the comparison:

- `triage.md`: the evidence. Changed files grouped by origin, links between files,
  apps with proof of whether they are installed, the templates that live pages use,
  a product page in every market, and bug signs.
- `target.md`: what the target theme can do: its sections, blocks, and settings.
- `todo.md`: a first draft of the list. On a rerun it writes `todo.draft.md`
  instead, so merge that into `todo.md` by hand.

When a part of the evidence is missing, the script says so at the top of `todo.md`
and in `triage.md`. Name the missing parts in the list, then carry on with the code
evidence. Do not stop.

**A storefront with a password.** The script cannot read it on its own. Pick one:

- Ask for the storefront password, then run the script with it in
  `STOREFRONT_PASSWORD`. Never put the password on the command line. The script
  submits the password form, as a browser does.
- With approval, sign Shopify CLI in to the store once, then add `--admin`. The Admin
  API gives exact answers: the template each product, collection, page, and article
  uses, each market's countries, and whether each app is installed. It reads only:

  ```bash
  pnpm exec shopify store auth --store <store>.myshopify.com --scopes read_products,read_content,read_online_store_pages,read_markets
  ```

`--admin` also helps on an open storefront, since the storefront sample can miss
pages. The per-country variant check needs rendered pages, so it needs the
storefront.

**A theme update needs less of the site.** When the project's own theme is the
changed theme, such as a store an agency builds before launch, the code evidence
carries the audit. Apps and markets still matter for the rebuild, but a missing
storefront read does not block the list.

[references/evidence.md](references/evidence.md) explains each part of the evidence
and its limits. Read it when a result surprises you.

## 2. Turn the draft into the list

Before you edit it, ask what the merchant said matters. A merchant names the
features that earn money or that customers notice, and the files cannot show that.
A flagged item goes to the top, whatever its size.

Then edit `todo.md`. Do not read the content diffs or the source of an app's own
scripts and styles.

- **Name each feature and say why it exists.** The draft groups files that share new
  names, such as a country list or a global variable. Read those files' changes
  enough to name the feature in merchant terms. Split a draft item that holds two
  features, and merge items that are one.
- **Fill in each app.** Write what it does and why the store has it: Selecty lets
  shoppers choose their country, which picks the regional variant. Find the app in
  the Shopify App Store by name, since its handle does not always match the App
  Store address. Attach a file group whose prefix belongs to the app, as BSS files
  belong to `ta-labels-badges`. The draft's "installed" comes from evidence on the
  site. Check it when two apps share a vendor, such as Klaviyo's email and reviews
  apps.
- **Check each kind.** `selling` covers what a shopper can buy, for how much, and
  whether they find the store: variants, prices, stock, cart, checkout, shipping,
  customer pricing, robots.txt, and search metadata. `visual` covers layout, styles,
  and media, which the target theme can usually do with its own settings. Judge the
  kind by what the feature does, not by its file.
- **Rank.** Flagged items first. Then selling items and the apps they need, with the
  ones that break quietly first, such as region, market, or pricing logic. Then
  other installed apps, then visual, content, and text items.
- **Word every open question** so that whoever reads it knows what is asked and why,
  without this skill. Keep at most five.

Show the list and the open questions. Then stop, so the list can be reordered,
merged, split, or trimmed.

## 3. Report the bugs

Keep the "Bugs to check" section current. The script seeds it with debug code,
scripts that undo stock rules, and markets whose countries get different variants.
Add what you find while reading, such as two apps that do the same job. Merchants
value this list, and it is not the same as the to-do items.

## 4. Understand one item at a time

Take the top open item. Read only its files and hunks, and record in the item:

- What a shopper sees, and the files and hunks that make it.
- What it is for: the merchant's goal. Old code often works around a limit that the
  target theme no longer has.
- Where it runs: a template from "Templates in use" in `triage.md`, a setting that
  turns it on, or unknown. A file that exists is not proof that a page uses it.
- The store data it reads, across every product or page it touches, such as each
  product's option names. Data varies more than one sample shows.
- External services, scripts, and form actions it depends on.
- What the target theme already has for the same goal, from `target.md`, with the
  file and setting.
- A suggestion of `port`, `rebuild`, or `drop`, and the reason. Prefer `rebuild`
  when the target theme has a native way, and describe the goal well enough that the
  rebuild can do better than the original.
- How to check the result after the rebuild, such as the market check in
  `triage.md` for regional features.

Reading an item often finds new ones. Add them to the list instead of widening the
current item. Mark the item `understood`, then use `splice-rebuild` for it, or take
the next item when the whole picture is wanted first.

## 5. Loop until the list is empty

Each session reads `todo.md`, reports the open items in order, and continues with
the top one. The splice is done when every item is verified or dropped. Drop an
item only after someone confirms the store does not need it.

Do not copy the changed theme's `settings_data.json` or templates into the target:
their setting and block IDs belong to the old theme. The content item covers them
through settings translation. A theme export is not a store backup. Page bodies,
menus, files, redirects, and app settings live in the store, so name the missing
evidence instead of guessing.

## More than one splice

The live splice's `todo.md` is the one list for the store. A second splice adds
evidence to it; it does not start a second list.

1. Run `scripts/audit.mjs splice/<store>/theme-<id>`. Use `--no-site` when the live
   splice already gathered the site evidence, since the storefront shows the live
   theme, not this one. The draft goes in that folder's `todo.md`.
2. Match each draft item to a live-list item by what it does, not by file name. The
   same feature often has different files: a Liquid snippet in one theme and a
   script in another.
3. For each match, compare the two versions and the rebuild if one exists. Look for
   what the second version does better or in more detail: an edge case it handles,
   a setting or content it configured, a platform feature it used instead of code,
   wording or layout the merchant chose. Write each finding into the live item as a
   line that names the source theme, and change the item's status if the finding
   reopens it.
4. Add an item to the live list for anything new. Mark the source theme.
5. Treat the second theme as evidence of intent. It may copy the same bugs, and it may
   reflect someone's decisions about what the store needs. Who made it and when
   changes how much weight it gets, so ask if it is unclear.
6. Delete the second folder's draft `todo.md` when every item is mapped, so only one
   list stays live. Keep its `triage.md` and comparison as evidence.

