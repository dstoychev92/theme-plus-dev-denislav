# The splice evidence and its limits

`scripts/audit.mjs` combines three parts. Each one can also be imported on its own.

## triage.mjs: the comparison and the theme files

- **Groups.** `code` is theme code a developer changed or added. `app?:<prefix>` is
  added files that share a name prefix, usually one app. `content` is template JSON,
  section group JSON, `settings_data.json`, and markets. `text` is locales.
  `generated` is blocks from Shopify's AI block generator. `noise` is formatting-only
  changes, JSON that differs only in serialization, and files Shopify drops on upload.
- **Kind.** Each code file gets a first guess of `selling` or `visual` from the words
  in its changed lines. It is a start: a redirect that sends shoppers to their
  region's product is selling even when it reads like markup.
- **Links.** A link is a name that two or more changed files share and the original
  theme never uses: a string literal, a `window.` global, an element ID, a data
  attribute, a class, or a rendered snippet. Names that join the same files form one
  link. Draft features join links through shared files. Layouts and theme-wide
  script and style files are hubs: they carry many features, so they never join two.
  A draft feature can still hold several features. Split it by its links.
- **Bug signs.** Debug output, unfinished-work notes, plain-http scripts, and code
  that force-enables a disabled control.

## storefront.mjs: the live site

Only GET requests to public pages: the sitemap sample, the cart, and any `--pages`. The one exception is
the storefront password form, when `STOREFRONT_PASSWORD` gives the password.

- **Installed apps.** An app's theme app extension serves files from
  `cdn.shopify.com/extensions/...` only while the app is installed and turned on.
  The extension folder name can differ from the app handle, so the script matches
  them by words. Apps from one vendor can share a match.
- **Uninstalled apps.** For a snippet whose app is gone, Shopify writes
  `"snippets/<name>.liquid" was not rendered, the associated app was uninstalled`
  into the page. That is proof.
- **Rendered embeds.** Shopify writes a `BEGIN app block: shopify://apps/<handle>/...`
  comment for each app embed that renders. App blocks inside sections leave no such
  comment, so an app that has only section blocks shows as "not seen" there. Its
  extension files are the better sign, or look for the app's own markup on a page that
  uses it, and add that page with `--pages`.
- **Script tags.** Apps add them through the Admin API, and they can outlive their app.
- **Templates in use.** A page's section IDs end with its template's section keys,
  so the script matches each page to a template. Hidden pages and pages outside the
  sample do not appear.
- **Markets.** The home page's hreflang links list each market and its countries.
  The script loads one product with `?country=<code>` for every country and records
  the variant and currency the server renders. A script can change the variant after
  the page loads, so check a surprising result in a browser. A market whose countries
  get different variants usually means a country list in the theme is out of date.

A storefront with a password redirects every page to `/password`. The script then
reads nothing, unless `STOREFRONT_PASSWORD` gives the password. Shopify also limits
how fast one address reads a store: the script waits and tries again on HTTP 429, at most
30 seconds a wait and 120 seconds in all (`STOREFRONT_WAIT_SECONDS` changes the total). A
page it could not read shows up under "Evidence not gathered". Do not kill the script and run
it again without the site: report the pages it could not read.

## admin.mjs: the Admin API, with --admin

Read-only queries through `shopify store execute`, after a one-time
`shopify store auth` that grants a CLI app `read_products`, `read_content`,
`read_online_store_pages`, and `read_markets`. Use it only with approval.

- **Templates in use.** The `templateSuffix` of every product, collection, page, and
  article. Exact, where the storefront gives a sample. Only those four kinds can be
  called unused: templates such as `index` or `cart` serve fixed pages.
- **Markets.** Each market's countries, from its region conditions.
- **Apps.** `appByHandle` for each handle in the theme JSON: installed, not installed,
  or not a known handle. Shopify CLI has no command that lists a store's apps.

## themejson.mjs: theme JSON

Shopify accepts comments and trailing commas in theme JSON, and Groupthought themes
use trailing commas. The scripts remove both outside strings before they parse. The
same parser is in `packages/tradecraft-cli/src/compare.ts`.

## target.mjs: the target theme

Section, block, and theme setting labels read from the schema text, so it works on
source with build directives and on compiled themes. A shared settings file, such as
a padding group, appears by its file name.

## Keep the evidence honest

- A theme's `theme_version` can be wrong. Many small changes in core files that no
  developer would make usually mean the store started from another release. Group
  them as core drift.
- Keep the raw archives. Never format a source zip in place.
- When formatting failed for a file, compare its raw bytes.
- Equal normalized files can still render differently.
- Check a public page only to answer a question that the files cannot. Do not
  submit forms.
