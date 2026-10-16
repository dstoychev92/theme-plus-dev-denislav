---
name: brand
description: Decide, record, and use a store's brand on top of its theme's settings. Renders the theme's read-only brand page into an editable sandbox, interviews toward the style the merchant wants from sites, type, and styles they admire, finds the store's delight (the small moments only this store makes), exports the result back to Theme Settings, and writes the brand folder that people and agents build from, visual rules and the voice for copywriting included. Use to start or change a store's brand, to steer its look toward a reference, to find or build the delight, to write or check on-brand copy, sections, or pages, or to answer what the brand is.
---

# Brand

A store's brand lives in three layers. Each feeds the next.

1. **The brand page, in the theme.** `templates/page.brand.json` renders `sections/page-brand.liquid`:
   one read-only page that shows what the current Theme Settings produce, in the classes and
   HTML the theme renders, with a settings map that says which setting writes which CSS variable
   and which classes read it. The map's one source is `snippets/brand-settings-map.liquid`. The
   page prints it as JSON in `<script id="brand-settings-map">` for agents and as a hidden table
   for people.
2. **The sandbox, `brand/sandbox/`.** The same page rendered offline from the store's settings, as
   plain HTML with every setting-driven value in `settings.css` as raw CSS variables. This is
   where the brand gets decided: edit it by hand, in Claude Design, or with an agent, until the
   type, color, shape, and concepts are right.
3. **The brand folder, `brand/`.** What the sandbox settled, written down: values exported back to
   Theme Settings, rules with their reasons that name tokens and classes, and the voice. People
   and agents build pages and copy from it.

The brand folder has a fourth part that sits across the three: the **delight**, in
`brand/delight.md`. It records one to three small moments, tied by one idea, that only this store
makes. It is the part most Shopify stores lack, so every build starts from it. See
[references/delight.md](references/delight.md).

`brand/` is the source of the store's brand decisions. The theme's `DESIGN.md` keeps a short
**Store brand** summary that points here, so theme agents find it. `PRODUCT.md` stays about the
product and its users; read it, do not move brand material into it.

## The brand folder

```text
brand/
├── readme.md                 Start here: what the brand is in five lines, and which file to read for what
├── facts.md                  What the store sells, who buys, the evidence on hand, and what it must never claim
├── delight.md                The thread and the delights: small moments only this store makes
├── references/               One file per reference site: its system, and what to borrow (steer writes them)
├── visual/
│   ├── direction.md          The references, the chosen direction, and why (steer writes it)
│   ├── signature.md          The one move that makes a surface this brand's and not a competent default
│   ├── color.md  type.md  layout.md  components.md  motion.md
│   ├── checklist.md          Questions that catch an off-brand page
│   ├── tokens.css            Exported from the sandbox. Every value, once
│   ├── theme-settings.json   Exported: the Theme Setting values, what changed, what no setting controls
│   └── settings-map.json     Exported: the map the values were read with
├── verbal/
│   ├── positioning.md        What the store stands for and who it speaks to
│   ├── voice.md              How it speaks: fixed voice, tone by moment, mechanics
│   └── words.md              Words to use and avoid, names, and approved lines to quote exactly
└── sandbox/
    ├── index.html            The brand page. Edit freely
    ├── settings.css          The values. Edit freely
    ├── directions/           Settings files for directions under comparison (?settings=directions/x.css)
    ├── README.md             How to edit the sandbox, for people and design tools
    ├── fonts.css  scheme-classes.css  settings-map.json  .snapshot/
    └── theme.css  assets/    Copies of the compiled theme, ignored by Git
```

Files that do not exist yet are not failures. Write them when a job below needs them.

`readme.md` opens with the line `<!-- tradecraft:brand-folder 1 -->`. The number is the folder's
layout version. A later version of this skill reads it to know which files to expect.

## See the brand

In a Tradecraft project, `tradecraft brand` serves the whole folder on http://127.0.0.1:4747: the
documents rendered, the delights first, the colors as swatches, and the sandbox with its directions.
It reloads when a file changes. When the project has no `brand/` folder, it asks a few questions
and writes the first files. Without the CLI, `scripts/serve.mjs` serves the sandbox alone.

## What to do

| Request | Job | Read |
|---|---|---|
| Set up the brand, or "show me the brand" | Run the loop, then write `facts.md` | [The loop](#the-loop) |
| "What makes us special", a signature moment, delight | Find the delight | [references/delight.md](references/delight.md) |
| "Make it feel like this site", "I like this type", change the look | Steer | [references/steer.md](references/steer.md) |
| Write or refresh the visual rules from the sandbox | Document | [references/visual.md](references/visual.md) |
| Write or refresh the voice, or write copy | Voice | [references/voice.md](references/voice.md) |
| Build a page, section, or copy on brand, or check one | Build | [references/build.md](references/build.md) |
| Put the sandbox's values on the store | Export, then apply with consent | [The loop](#the-loop) |

A request that names no job: read `brand/readme.md`, say what exists and what is missing, and
offer the next job. A store with no `brand/` folder starts with the loop, then steer, then the
delight.

Read the engagement state first: `node .agents/skills/tradecraft/scripts/state.mjs show`.

- **B1, the stance.** An existing store's brand is extracted, not invented: record what the
  store already is, from the sources B2 names, and steer only where the developer asks. Define
  a new brand only when B1 says so, as in a redesign.
- **B2, where the brand lives.** Read those sources first, such as a video channel or the
  product's own graphics, before the website. Never ask again what the state records.
- **B3, the direction.** Export the extracted brand, and keep working. Make two or three
  directions as options, and record the one you built with `state.mjs guess B3 "…" --evidence
  "…"`. The client chooses on the review page. Never wait for the client before the export.

Read before you ask. The scan of the store, its copy, and its settings is a hypothesis for the
merchant to confirm, not a decision. Ask at most three questions in a round, and only about gaps.

## facts.md

`brand/facts.md` keeps the store's truth apart from its look, so a new direction never erases it:

- what the store sells and who buys it, in two sentences;
- **evidence on hand**: reviews, press, awards, guarantees, numbers, and certifications, each with
  where it lives;
- **absences**: what the store does not have yet, such as "no reviews yet" or "no press". Agents
  read this list so they never invent a review, a number, or a customer.

`PRODUCT.md`, when the theme has one, is about the product and its users. Read it. Do not move
brand material into it.

## The loop

Run from the project root. The scripts find the theme from `tradecraft.json` and the store's
settings in `store/config/settings_data.json` (in a project from before `store/`, the theme's
only environment). The export writes there, never into the theme's own preset. `--theme`, `--env`,
`--settings`, `--store`, `--shop-name`, and `--root` override them.

```bash
pnpm build
node .agents/skills/brand/scripts/snapshot.mjs
node .agents/skills/brand/scripts/serve.mjs
node .agents/skills/brand/scripts/export.mjs
```

1. **Build.** The snapshot renders the built theme in the theme's `dist` folder, so build after any
   theme change.
2. **Snapshot** writes the sandbox from the theme and the store's settings. It refuses to replace
   a sandbox that already has a page: it may hold decisions not exported yet. Export first, or pass
   `--force` when the user agrees to start over. After a fresh clone or a theme build, pass
   `--assets-only` to restore `theme.css` and the scripts without touching the edits.
3. **Serve** on http://localhost:4747 and open it. The theme's scripts are ES modules and do not
   run from `file://`.
4. **Edit**: steer, or the user's own edits.
5. **Export** reads `settings.css` back into Theme Settings and writes `brand/visual/tokens.css`,
   `theme-settings.json`, and `settings-map.json`. It prints three lists. Report all three:
   - **settings changed**: the values that will go to the store;
   - **variables no setting controls**: edits to fixed theme values, such as the spacing scale.
     The theme cannot take them from settings. Each needs a theme change or gets dropped. Ask;
   - **warnings**: colors outside sRGB, a type scale the theme does not offer, a spacing value
     that is none of the three sizes.
6. **Apply** only after the user says yes: `export.mjs --apply` writes the changes into the
   store's `settings_data.json`. Show the diff. Deploying is a separate step the user runs.
7. **Snapshot again** after applying, so the sandbox and the store agree.

### A store that has no brand page yet

- The theme needs `sections/page-brand.liquid` and the `brand-*` snippets. Analog has them. A theme
  without them, such as Horizon, has no sandbox. The rest of the folder still works: facts, the
  delight, the verbal files, and visual rules that name the theme's own settings. Steer with the
  live store or a preview theme instead of the sandbox. Do not write a brand page for another
  theme here.
- `templates/page.brand.json` belongs with the store's templates (`store/templates/` in a
  Tradecraft project, or `environments/<env>/templates/` in this monorepo). Write it when missing:
  `{"sections": {"main": {"type": "page-brand"}}, "order": ["main"]}`.
- On the store, a page with the handle `brand` using the `page.brand` template shows it at
  `/pages/brand`. Creating the page changes the store, so ask first. Keep it unpublished from
  navigation: it is a tool, not content.

## Rules

- **One value lives in one place.** While the brand is being decided, the place is
  `brand/sandbox/settings.css`. Once applied, it is Theme Settings. Markdown in `brand/` names
  tokens, settings, and classes. It never repeats a hex, a pixel size, or a font weight.
- **Settings first.** A look the settings can make is made with settings. Edit `settings.css`
  values, not `theme.css`, which is compiled. HTML in the sandbox uses classes `theme.css` already
  has; a class it lacks does nothing on the store either.
- **Know the theme's limits** before promising a look: four font roles from Shopify's font
  library, color schemes rather than shade ramps, three radii with role picks, three type scales,
  and three spacing sizes. The settings map lists every lever. A reference that needs more than
  the levers allow becomes a theme change the user decides on, never a silent hack.
- **The page renders what Shopify renders.** The sandbox comes from the theme's own Liquid. Do not
  hand-write imitations of `core-button` and the other snippets; copy their markup from the page.
- **Facts stay true.** Copy and voice examples use only what the store can back up. `brand/facts.md`
  lists the evidence on hand and the absences. Never invent reviews, numbers, customers, or
  awards.
- **Borrow systems, not identities.** A reference site lends qualities: a type pairing, a density,
  a way of using color. Never its logo, name, wordmark, photography, or copy.
- **Consent for the store.** Applying settings, creating the brand page, and deploying change the
  live store or its theme. Each needs the user's yes.
- When `brand/` and the theme disagree, the theme's current settings are what the store shows.
  Say which side is stale and offer the fix; do not quietly rewrite either.
