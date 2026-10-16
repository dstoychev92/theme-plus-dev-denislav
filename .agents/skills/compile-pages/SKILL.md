---
name: compile-pages
description: Compile a store's homepage or product page from the theme's own sections, filled with the store's real products, images, and copy. Builds a faithful version of the live page and an alternate that tells the store's story better, with hidden options to compare. Use for a new store, a migration, or a redesign of a key page.
---

# Compile pages from the store's story

A page sells when each section answers the next question a shopper has. Before you
choose sections, find what this store sells, to whom, and why someone buys it. Then
build two versions of the page:

- **Faithful** (`templates/index.json`): the merchant's current page, section by
  section, in the target theme's own sections. It keeps their order, copy, images,
  and links. The merchant must recognize it.
- **Alternate** (`templates/index.alt.json`): the same store's best page by the
  practices below. It may reorder, merge, add, or drop sections, and it uses the
  strongest images. The merchant previews it at `?view=alt` and copies sections they
  like into the faithful page in the theme editor.

The same pair works for a product page (`product.json` and `product.alt.json`). A new
store with no live page gets the alternate only. The alternate template must only use
the store's real content: never invent a review, claim, guarantee, price, or
statistic. When the best page needs content the store does not have, leave the
section out and list the gap.

Read [catalog-analog.md](references/catalog-analog.md) for what each Analog section
and block does, and [recipes.md](references/recipes.md) for page patterns.

## 1. Write the brief

Read the live homepage, the main navigation, the top collections, three or four
best-selling products (title, description, price range, options, reviews), the
about page, and the shipping and returns pages. Write `brief.md` beside the store's
other records, at most one page:

| Line | Question it answers |
|---|---|
| Offer | What do they sell? Products, programs, subscriptions, services |
| Hero products | Which 1-4 products carry the business? Use bestseller collections, navigation order, and homepage placement as evidence |
| Shopper | Who buys, and what do they want to become or fix? |
| Promise | The one result the store promises, in the merchant's words when they have them |
| Proof | What makes the promise believable: reviews and ratings, named experts or pros, press, numbers, guarantees, years in business |
| Objections | What stops a purchase: price, fit, skill level, shipping, returns, "is this for me" |
| Mechanism | Why it works: the method, material, or design behind the product |
| Voice | Three or four words, with a sample line from the site |
| Assets | Logo, photo style, video, UGC, app or course screenshots, icons |

Each line cites where it came from: a URL, a product handle, or a review count.
Mark a judgment as a judgment.

## 2. Inventory the images

Run `node scripts/image-inventory.mjs` (run it with `--help` for the flags). It
merges the store's product media and Files from the Admin API with the images the
live site shows, then ranks them: images the merchant chose for the homepage first,
then images used across many pages, then large images, then catalog media. It writes
numbered contact sheets when ImageMagick is installed.

Look at every contact sheet and fill `roles.json` for the images you might use:

| Role | Use it for | Avoid |
|---|---|---|
| `action` | Hero, story, section backgrounds: the product in use | Small crops where the subject gets lost |
| `lifestyle` | Brand story, collection tiles, pairs | Product detail |
| `person` | Testimonials, experts, founder story | Hero behind text when the face is the subject |
| `product-white` | Product cards, comparison, bundles | Full-width hero |
| `product-context` | Collection tiles, feature pairs | |
| `detail` | Mechanism, materials, feature lists | Hero |
| `screen` | App, course, or software sections | Behind text |
| `graphic` | Only where its built-in text is the point | Any slot that adds its own text |
| `icon` / `logo` | Service rows, press rows, footer | Large slots |

Record the subject, where text can sit (`left`, `right`, `top`, `bottom`, `none`),
and any text burned into the image. Treat a burned-in text image as unusable behind
the theme's own heading.

Choose images for slots by role and shape. Do not use one image twice on a page. A
hero needs a wide or landscape `action` or `lifestyle` image at 2000 px or more, with
a calm area where the heading sits. A card row needs images of one shape and one
style. Mixing white-background products with photos in one row looks unplanned.

Only an image in the store's Files has a `shopify://shop_images/<file>` reference.
Product media usually is in Files. Blog article images usually are not. Shopify
accepts a reference to a missing file and renders nothing, so after an upload count
the images in each section on the page. The Admin API's `files` query settles it
before the upload.

The founder and team photos are often only on the about page, which the homepage
links from the footer. The inventory reads story pages first. Look at them before
you settle for a product shot in a story section.

## 3. Choose the arc

A homepage answers these questions, in roughly this order. Use the store's brief to
decide which ones get a section and how big it is:

1. **What is this, and is it for me?** Hero: promise as the heading, the shopper's
   result as the image, one primary button to the hero products or best sellers.
2. **What can I buy?** Best sellers or the main collections, early, before long
   storytelling. Three or four cards across on desktop reads as a curated set.
3. **Why should I believe it?** Proof close to the products: ratings, reviews,
   experts, press, numbers.
4. **How does it work?** The mechanism or method, with detail images or a short
   video.
5. **What else do I get?** Programs, bundles, the app, the community.
6. **What if it is wrong for me?** Shipping, returns, guarantee, support, sizing.
7. **Stay in touch.** Email signup with a reason to join.

Practices that apply to most stores:

- One primary action per section. The hero's button goes where most buyers go next.
- Lead with the shopper's result. Put features and specifications lower.
- Show prices and ratings on product cards when the store has reviews.
- Put the strongest proof within one scroll of the first product row.
- Answer shipping and returns on the homepage when the store sells across borders or
  has a free-shipping threshold. The announcement bar is the cheapest place.
- Keep a consistent rhythm: alternate dense and open sections, and do not stack two
  full-bleed image sections without a text or product section between them.
- Mobile first: check that each hero heading stays readable over its image at
  375 px, and that rows of cards become sliders, not long stacks.
- Fewer, stronger sections beat many weak ones. Seven to ten sections is typical.

`recipes.md` has the section patterns and complete arcs. `catalog-analog.md` says
which Analog section does each job.

## 4. Fit the brand, not an example

Models copy what they see. A recipe is a job and a structure, never a design to
reproduce, and the store's own brief decides how it looks and sounds.

- Before you build, write two or three one-line directions for the page from the
  brief, such as "proof first, dark and technical" or "story first, bright and
  warm". Pick one and say why in the report.
- Let the brief set the treatment. The voice decides type scale, casing, and copy
  length. The photo style decides crops, overlays, and how much text sits on images.
  The kind of proof decides which proof recipe to use.
- Do not use one recipe twice on a page, and do not keep a theme preset's demo copy,
  colors, or images.
- Write copy from the merchant's facts and voice. Never borrow lines, names, or
  layouts from another brand, and never name another store or client in a page, a
  record, or a report.

## 5. Build both templates

Build both templates with `scripts/schema_kit.mjs` from the target theme's own
sections and presets, so every setting is valid. Write a small Node generator script
(`.mjs`) per page so a rerun reproduces the result after feedback. The module's header
has an example. Its calls are `new Presets(root)`,
`presets.section(type, { index, having })`, `presets.block(type)`,
`setChildren(parent, [[child, staticId], ...])`, `blank`, `example`, and `page`.

- **Faithful**: one target section for each live section, in the live order, with
  the live copy, images, and links. Match the live design choices that the target
  can express: column count, image shape, dark or light, overlay text. Record each
  difference you could not match.
- **Alternate**: follow the arc. Reuse the merchant's copy where it states the
  promise or the proof well. Write new copy only for headings and buttons, in the
  merchant's voice, and keep it short. List each new line in the report so the
  merchant can change it.

When a page part has more than one good recipe, put the runner-up in the
alternate template as a hidden section (`"disabled": true`) right after the chosen
one, keyed `<slot>_option_<name>`. The merchant sees it in the editor and can switch
it on. Hidden sections do not render, so check them in a temporary template with
`disabled` removed, such as `index.options.json`, previewed with `?view=options`.
Delete that template before you push to a merchant's theme.

When the merchant or a teammate edits a draft theme in the editor, pull that theme
into a separate reference folder (with approval), compare it with the generated
files, and carry the edits into the generator scripts. Never pull over the project's
own files. A pull holds saved changes only.

Before upload, check every line of new copy against the brief. A plausible line
such as "save on the set" is a claim; keep it only when a source in the brief says it.
Numbers you compute, such as an average rating from the product cards, need the
source and date in the report, because they go stale.

Keep the store's images as `shopify://shop_images/...` and its links as
`shopify://...`. They work in any theme on the same store. Shopify reports one refused
setting at a time on upload, so fix each and upload again. Popups and entrance
animations can hide content in a screenshot, so also read each section's height and
text from the page.

Then upload to a development theme (with approval), check both in a browser at
desktop and mobile widths, and report what the alternate template does differently
and why, one line per section.

## 6. Report

End with a table the merchant can act on:

| Alternate section | Job | Why it differs from the live page | Copy to keep? |
|---|---|---|---|

Add the gaps: content the best page needed but the store does not have, such as
review counts, a guarantee, or lifestyle photos for a product.
