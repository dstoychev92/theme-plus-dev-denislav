# Phases 4 and 5: stack, verify, and the review guide

## Stack the layers

Layers built in this session are already stacked. For each worker's branch, in the
plan's order:

1. Read the report's first word. Stack only `ready`. Ask about `partial`.
2. Check that the branch changes only the files the plan gave it:
   `git diff --name-only origin/splice/<store>/1-foundation origin/splice/<store>/<n>-<feature>`.
3. Move it onto the layer below it, push it, and open its pull request with that layer
   as its base and the worker's report as its body:

   ```bash
   git rebase --onto splice/<store>/<n-1>-<name> origin/splice/<store>/1-foundation splice/<store>/<n>-<feature>
   git push --force-with-lease origin splice/<store>/<n>-<feature>
   gh pr create --base splice/<store>/<n-1>-<name> --head splice/<store>/<n>-<feature>
   ```

Two layers that change different files rebase with no conflict. A conflict means the
plan gave one file to two layers. Resolve it in this session, and fix the plan.

Then build the templates and JSON layer on top, as [build.md](build.md) describes, and
open its pull request. Build the top of the stack and run Theme Check once more,
because a layer can break what each branch passed alone.

## Push one preview theme

Push only with the approval from the plan. Check first that no watcher serves the
same theme and store. The preview shows the top of the stack, so it shows every layer.

**In a Tradecraft project,** run from the project root, on the top layer's branch:

```bash
tradecraft preview --json
```

It builds the commit and uploads it to the branch's own unpublished theme,
`Preview · <branch>`, and returns `previewUrl` and `editorUrl`. The first run creates the
theme. Each later run uploads only the files that changed. Exit code 3 means someone edited
the preview in the theme editor; take the edits with `tradecraft sync --theme <id>` before
you upload again. The release skill has the rules.

**In this monorepo,** build the theme, then push from the repository root with the
theme's `dist` path. Name the theme the same way:

```bash
pnpm <theme> build -s=<env>
shopify theme list --store <store> --json
shopify theme push --path themes/<theme>/dist --store <store> --unpublished --theme "[<Theme>] <summary> (#<pr>)" --json
```

Count the themes in the list without the `development` ones. When the store has 5 or
fewer free slots, push a development theme for the pull request instead:
`--development --development-context pr-<pr>`.

If Shopify CLI asks for a sign-in, give the person the link and the code it prints,
because a command run without a terminal cannot open a browser.

## Verify

Run one pass. Fix what it finds in one batch. Run one more pass over the fixes. Then
stop and report what is still open.

- Load pages through the store's preview link,
  `https://<store>.myshopify.com/<path>?preview_theme_id=<id>`, with a fresh cookie
  file for each request. Confirm that each page reports the development theme's ID
  in `Shopify.theme`, because a preview request can fall back to the live theme.
- To check what a shopper in another country sees, add `&country=<code>`. The local
  preview at `127.0.0.1` shares one storefront session across requests, so a country
  sticks from one request to the next there.
- Read what the server rendered: the variant in the `name="id"` field, the price,
  the currency, and for forms the action, method, encoding, and every field name.
  Search the whole page for `Liquid error`, including the head.
- Look in a browser on desktop and mobile when the result depends on a script or a
  layout. Check that the page does not scroll sideways at 375 pixels, and read the
  console.
- Check every product or page the item applies to, not one sample. Store data varies
  in ways one page hides: two of eight products named the same option without its
  colon, and only checking all eight found it.
- Check the places that share the code, such as cards and quick view when the
  product form changed.
- Do not submit a form, such as adding to a cart or sending a message. Leave that
  check to the person and say what to do. Some results show only on the published
  theme, such as robots.txt. Say when they can be checked.

A fix found here goes on the layer that holds the item, as its own commit, with a
message that names the item. Then rebase the layers above it. A bug in the target theme itself also goes in "Bugs to check",
so the theme's maintainers hear about it.

## The review guide

Write the guide into the top pull request's body, and link it from the bottom one, so
the reviewer starts there. It holds:

- the preview link and the editor link
- the stack in order: each layer's pull request, what it holds, and why, in two or
  three lines
- the split pull requests, each with why it will probably close
- what you checked, and what passed
- what only the person can check, such as a real form submission
- the questions the workers listed
- the decisions the person must make, linked to the list, and the actions outside the
  theme, such as a page body to clear or a redirect to add

## Mark the items

On the list, mark each stacked item `rebuilt`, with its layer, its pull request, the
preview theme, and what is still unverified. Mark an item `verified` only after its own
check passed and the person confirmed the checks that only they can run. Put the open
checks and questions on the list too. When the list is `todo.md`, commit it on the
foundation layer.

## Merge

The person merges the stack from the bottom, one pull request at a time. After each
merge, GitHub moves the next pull request's base to the base branch. When the merge
squashed the layer, its commits show again in the next pull request: rebase the rest
of the stack onto the base branch and push, when the person asks. The person merges or
closes each split pull request on its own. The release follows the store's release
path in `plan.md`.
