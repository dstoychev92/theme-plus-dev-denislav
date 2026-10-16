# Sync: bring the client's live changes into the project

After a release, the client keeps changing the live store. A save in the theme editor
changes settings JSON. An app install, or an edit in the admin's code editor, changes
theme code. A sync brings both into the project before the next release, because the
release replaces every file on the store's theme.

A sync is usually one pull request into the base branch. Its main work is resolving
JSON conflicts well, and showing the reviewer what the client changed since the last
release.

In a Tradecraft project, `tradecraft sync` does steps 1 to 3 in one run, on the current
branch. It reads the live theme, finds each file that changed since the branch last synced,
merges content setting by setting into `store/`, merges code
into `src/` for a theme copied unchanged, and commits with a `Tradecraft-Live` trailer. It
stops with Git conflict markers where you and the client changed the same setting; resolve
them by the rules in step 3, then run `tradecraft sync --continue`. On a compiled theme it
lists the code edits it cannot map to source: handle them as step 4 describes, then run
`tradecraft sync --accept-code`. Make the sync branch first (step 2), then run it there.
Use the manual steps below outside a Tradecraft project.

## 1. Find what changed since the last release

The base is the last release. The changes are the store's theme now. The target is
the project's theme. Find the base and the changes from the store's release path in `plan.md`:

- **Release branch** (Shopify's GitHub integration, choice 2 in
  [github-integration.md](github-integration.md)):
  1. `git fetch origin`.
  2. The base is the last delivery on the release branch. In a Tradecraft project it is
     the newest commit with a `Tradecraft-Source:` line, which `tradecraft ship` writes. In a manual setup it is the last commit whose message starts with
     `Release dev`.
  3. The changes are `origin/<release branch>`.
  4. List what changed: `git log --oneline <release commit>..origin/<release branch>`
     and `git diff --name-only <release commit> origin/<release branch>`.
- **No connected branch** (choice 1): nothing records what was shipped.
  1. The base is the theme's release, so the project's own customizations show up as
     changes too. Name them in the pull request.
  2. The changes are the store's live theme.

Before the first release there is nothing to sync. The store's code belongs to the
move's own splice.

No change means no sync. Otherwise sort the files: `.json` files under `config/`,
`templates/`, and `sections/` are settings. Every other file is code. A JSON file that
is new, not changed, can be an app's template. Check it with the code too.

## 2. Make the branch

Make `splice/<store>/sync-<date>` from the base branch. The settings and the code go
on it, as one pull request named "Sync <store>, <date>".

## 3. Bring in the settings

In a Tradecraft project, `tradecraft sync` merges the store's JSON into
`store/`, formatted the way the project formats it. Outside a
project, pull the JSON with `shopify theme pull --only` into a scratch folder and strip
Shopify's banner comment before you merge it. Do not copy the files from the release branch
by hand: they carry the banner comment and every unchanged section.

Resolve each conflict between the store's JSON and the project's own changes since the
release:

- **The client's content wins:** setting values, text, images, block choices, block
  order, and sections the client added or removed.
- **The project's structure wins:** a setting ID that the project renamed, a value
  that a migration changed, a new required setting, and a setting that the project
  removed. Move the client's value onto the project's new ID or format. Never put an
  old ID back.
- **Both changed the same value:** keep the client's value, and list it in the pull
  request as a question, with both values.

Build with the store's environment and run Theme Check, as [build.md](build.md)
describes. A pulled template that names a block or section the project removed fails
the push. Fix it in the template, and list it.

## 4. Bring in the code

When the sort found code changes, they are a drift splice. The base is the build the
project last released, the changes are the store's theme now, and the target is the
project's build, which `tradecraft merge` uses by default. Base and target are the same
theme, so the comparison lists the files that both the client and the project changed.

- **Release branch:** the branch holds the client's edits.

  ```bash
  tradecraft merge git:origin/<release branch> --base git:<release commit> --out splice/<store>/drift-<date>
  ```

- **No connected branch:** splice the live theme onto the project, with the release as
  the base.

  ```bash
  tradecraft merge live --out splice/<store>/drift-<date>
  ```

When the comparison shows no change outside the settings files, the sync holds only
settings. Say so in the pull request.

Otherwise run `splice` on `splice/<store>/drift-<date>` with `--no-site`, because
the store's site evidence is already in the move's splice. Add its items to the
store's list with the source "drift <date>". Then rebuild each one the target's own
way, as [build.md](build.md) describes:

- Code the store needs, such as an app's snippet and the `{% render %}` that calls it,
  goes in the sync pull request.
- Code the reviewer will probably remove, such as the leftovers of an app the store
  uninstalled, goes in a split pull request, as SKILL.md describes.
- A drift large enough to hide what each part is gets a stack, as for a move.

## 5. Preview and describe

Push the preview, as [verify.md](verify.md) describes. Verify the pages that the client
changed.

The pull request body holds:

- the preview link and the editor link
- what the client changed since the last release, by page, in merchant terms, such
  as "Homepage: new hero image and a second slideshow slide"
- the commits or the date range it covers
- each conflict and how it was resolved, and the questions where both sides changed
  the same value
- the code changes and their items, and the split pull requests

## Before each release

A release stops while a sync has open work:

- the sync pull request has not merged, or
- a code change from the drift has no item on the list, or its item is not rebuilt or
  dropped.

A release then would delete the client's newest settings, or remove an app's code from
the theme.
