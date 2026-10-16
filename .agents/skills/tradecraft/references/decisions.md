# Decisions

Each decision has an ID. `state.mjs` uses the same IDs, so the list here and the state file
agree.

**How** says how to settle it:

- **find:** read it from the store, the theme, or the site. Never ask.
- **agency:** ask the developer. Ask only what an agency knows on the first day.
- **guess:** take the best guess from the facts, record it with `state.mjs guess`, and keep
  working. The client confirms or changes it on the review page. Never wait for it.
- **default:** take the default and state it in the plan.

**By** is the stage that needs the decision. Settle it then, not earlier.

Work never waits for the client. The client sees the work on the review page, with the
guesses and the options, and signs off only before the launch.

## Engagement

| ID | Decision | How | Ask | Default | By |
|---|---|---|---|---|---|
| E1 | Project kind: keep the live theme, move to a new theme, redesign, or sync only | find + agency | developer | The target the developer named; else keep the live theme. Show the live theme's name and version | engage |
| E2 | Target theme | agency, unless the opening message names it | developer | The live theme. The version is always the newest release, never asked | engage |
| E3 | Who runs Git and the CLI, and who commits | default | none | The agent runs local commands and asks before anything leaves the computer; the developer commits and pushes | engage |
| E4 | Who sees the review page | agency | developer | The developer sends it to the client. Ask when the first preview is ready, never before | review |
| E5 | Launch date and dates with no changes | agency | developer | None. Ask when the client signs off | launch |

## Store facts (never ask)

| ID | Fact | Where |
|---|---|---|
| F1 | Live theme, other recently edited themes, theme count, GitHub-connected themes (names like `repo/branch`) | `shopify theme list`; re-read before any comparison or upload |
| F2 | The live theme's base release | `discover` records it. To read theme JSON yourself, run `node .agents/skills/splice/scripts/themejson.mjs <file> [key.path]`: Shopify's JSON has comments and trailing commas, so `JSON.parse`, `require()`, and `json.loads` fail on it |
| F3 | Markets, currencies, languages | Admin `markets`, `shopLocales` |
| F4 | Catalog size and shape, metafields and metaobjects in use | Admin counts and definitions |
| F5 | Templates in use | `templateSuffix` on products, collections, and pages |
| F6 | What the site is and sells | Crawl, catalog, pages |

## Priorities and store behavior

| ID | Decision | How | Ask | Default | By |
|---|---|---|---|---|---|
| P1 | The one path that must work | guess | none | The main way the store makes money: buying its best-selling product, or booking or contacting for a service. Test it first | plan |
| P2 | Who the site is for | guess | none | Read from the catalog, the pages, and the copy | plan |
| P3 | Apps: keep, replace, or drop each | guess | none | Keep apps that render; drop apps with no render evidence. Count the app blocks, the homepage scripts, and the script tags `discover` lists. List each with its evidence in the plan, where the developer can change it | plan |
| P4 | Store policies the theme expresses, such as sold-out handling per region | guess | none | Keep the live behavior | build |
| P5 | Replace an app with a feature the theme has | guess | none | Prefer the theme's own feature | build |
| P6 | Forms and outside services | guess | none | Keep where they post, as `discover` lists them, file uploads included; move the form into code | build |

## Repository and delivery

| ID | Decision | How | Ask | Default | By |
|---|---|---|---|---|---|
| R1 | Delivery: `tradecraft ship` or the Shopify GitHub integration | find + agency | developer | Ship. Ask only when the live theme is connected or the folder has a remote | setup |
| R2 | Branch and review model | default | none | `main` in the project | setup |
| R3 | Preview theme | find + agency | developer | `tradecraft preview`. At 18 or more themes, ask which theme to free, or use a development theme | build |
| R4 | Where the work list lives | default | none | `splice/<store>/todo.md` | build |

## Brand and content

| ID | Decision | How | Ask | Default | By |
|---|---|---|---|---|---|
| B1 | Brand stance: extract the existing brand, or define a new one | guess | none | Extract, unless E1 is a redesign | plan |
| B2 | Where the brand lives best: the site, video, packaging, social | guess | none | What the crawl found | brand |
| B3 | Brand direction | guess | none | The extracted brand. Make two or three directions as options for the review page | brand |
| B4 | Facts, spelling, and claims never to make | guess | none | The site's own claims, with wrong facts fixed | build |
| B5 | Homepage approach | guess | none | Move: keep the content, use the best sections of the target theme, alternatives as hidden sections. Redesign: from scratch | build |
| B6 | Copy and images | guess | none | The live copy, facts fixed; the images the live site uses most. New copy is a best guess: list each line for review | build |
| B7 | Header, footer, and demo content | find | none | Faithful to live; a theme's demo text never ships | build |

## Launch and after

| ID | Decision | How | Ask | Default | By |
|---|---|---|---|---|---|
| L1 | Theme license | agency | developer | Bought on the client's store before publish | launch |
| L2 | URL changes and redirects | find | none | No URL changes; any removed page gets a redirect | launch |
| L4 | Client sign-off on the preview | agency | developer | The developer passes on the client's sign-off and the commit it covers | launch |
| L3 | Launch method and rollback | find + agency | developer | `tradecraft launch` for a move or redesign; `ship` for the same theme | launch |
| Q1 | Tests, and what they may touch | default | none | Storefront suite on the preview; no cart test on the live store | review |
| K1 | Theme updates in the retainer | agency | developer | Merge each full release on a branch, preview, ship after sign-off | retain |
