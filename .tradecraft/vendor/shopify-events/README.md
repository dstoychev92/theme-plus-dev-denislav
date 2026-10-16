# @shopify/events (vendored)

A local snapshot of Shopify's standard storefront events module, so that TypeScript,
Jest, and Cypress can resolve `@shopify/events` inside this repository.

The browser never loads these files. Each theme maps `@shopify/events` to
`https://cdn.shopify.com/storefront/standard-events.js` in its import map
(`src/snippets/head-scripts.liquid`) and lists the name in `externalPackages` in its
`rollup.config.js`, so the bundles always import the live CDN copy. The CDN copy must
stay the runtime source because Shopify's injected `Shopify.actions` bundle uses the
same module — two copies would break `instanceof` checks across events.

## What is in here

| File | Source |
|---|---|
| `standard-events.js` | Download of https://cdn.shopify.com/storefront/standard-events.js |
| `standard-events.d.ts` | Copy of `assets/standard-events.d.ts` from Shopify's Horizon theme (auto-generated, "Built from storefront-standard-events@e5fd48b") |
| `standard-actions.d.ts` | Copy of `assets/standard-actions.d.ts` from Horizon, importable as `@shopify/events/actions` (types only — the runtime bundle is injected by Shopify through `content_for_header`). The `declare global` block is removed, since each theme declares its own `Window.Shopify`; `declare const actions` gains `export` so the type is importable. |

## How to refresh

Refresh both files together — the types must describe the runtime.

1. `curl -o standard-events.js https://cdn.shopify.com/storefront/standard-events.js`
2. Copy `assets/standard-events.d.ts` from the newest Horizon release
   (https://github.com/Shopify/horizon).
3. Note the new `storefront-standard-events@<hash>` from the `.d.ts` header below.
   The `.js` file's own `// version:` header uses a different hash scheme; refresh
   both files at the same time so they describe the same release.

The `version` in `package.json` stays `0.0.0` — the workspace `*` range needs a plain
semver version, so the snapshot hash cannot live there.

Current snapshot: `storefront-standard-events@e5fd48b`.

Docs: https://shopify.dev/docs/api/storefront-events-and-actions
