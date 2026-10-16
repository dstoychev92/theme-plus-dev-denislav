---
name: release
description: Move a Tradecraft project's work to the store. Takes the client's Admin edits into Git, uploads a branch to its preview theme, ships to the live theme, launches a new theme with a rollback, and runs hotfixes and theme updates in the retainer. Every command that changes the store prints its plan first. Use for agency work in a Tradecraft project, not internal Theme Store publication.
---

# Work on a branch of a store

Read `tradecraft.json`, the engagement state
(`node .agents/skills/tradecraft/scripts/state.mjs show`), and `tradecraft status` first.
R1 says how the project delivers, R2 the branch model, R3 the preview theme, L1 to L3 the
launch, and K1 the theme updates. Do not ask them again. Git holds
code and content. The store holds the client's latest content. Tradecraft moves changes
between them, and each command that changes the store prints its plan first.

A request to edit does not authorize a ship, a launch, a preview upload, or a push. Follow
the user's authorization, including limits on commits, pull requests, and publication.

## Start with the store's latest content

Run `tradecraft sync` before you change content, and before any upload. It merges the
client's Admin edits into the store's content folder, `store/` (`themes/<theme>/environments/<store>/` in a project from before store/),
and commits them. When it stops with conflicts, resolve the markers with the user, then run
`tradecraft sync --continue`. Never resolve a conflict in the client's content by choosing
your side without asking.

On a compiled theme, sync lists code edits made in the Shopify code editor that it cannot
map to source. Port each one into `src/`, then run `tradecraft sync --accept-code`. Do not
pass `--accept-code` for an edit you did not port or show the user.

## Preview

Run `tradecraft preview --json`. It uploads the working tree as it is, committed or not, to
the branch's own preview theme, `Preview · <branch>`, and returns `previewUrl` and
`editorUrl`. Never ask the developer to commit before a preview. Only `ship` and `launch` need
a commit. Exit code 3 means someone edited the preview in the theme editor: run
`tradecraft sync --theme <id>` to take the edits, or ask before `--force`.

Test the exact preview: `tradecraft check --suite storefront --url <previewUrl>`. Record the
tested URL and time. An old preview or an old report is not evidence for later changes.

Use `tradecraft dev` for live reload on the user's own development theme.

## Ship

`tradecraft ship --dry-run` prints the plan for the live theme. Show it to the user. Run
`tradecraft ship --yes` only when the user approved that plan. Exit code 3 means files are
blocked because someone changed them on the store: run `tradecraft sync`, then plan again.
Never pass `--force` unless the user asks to replace the client's edits by name.

Use `tradecraft ship --only <file>` for a hotfix. Merge the hotfix branch into `main`
afterwards.

## Launch a new theme

A move or a redesign launches on a new theme, so the live theme stays as the rollback.
Before the launch, check:

- The client signed off (L4 in the state) on the commit you launch.
- L1: the theme license is bought on the client's store. Ask the developer when the state
  does not say. Shopify shows a purchase banner on an unlicensed theme.
- L2: every URL the live store had still works. Compare the live store's pages and
  collections with the project's, and add a redirect for each removed one.
- `tradecraft sync` ran today, so the launch carries the client's latest content.

`tradecraft launch` stages the build on `Launch · <branch>`. Check it with the `review`
skill. **Stop** and show the developer the theme and the rollback command. Publish only when
the developer asks in words: `tradecraft launch --publish`. `tradecraft launch --rollback`
publishes the old theme again.

After the publish, run `tradecraft status` to confirm the publish snapshot on
`tradecraft/live`, then set the stage: `state.mjs stage care`. Then use the `feedback` skill, when it is installed.

## Care and retain

- **Client edits:** run `tradecraft sync` at the start of each session.
- **A hotfix:** branch, fix, preview, then `tradecraft ship --only <file> --dry-run`, and
  ship after approval.
- **A theme update (K1):** `tradecraft merge` on a branch. It applies the new release with
  Git conflict markers. Resolve them, preview, and ship after sign-off. Use the `splice`
  skill when the conflicts hide features or the developer wants to review the update.

## Integration delivery

When `tradecraft.json` has `"delivery": "integration"`, ship commits to the output branch and
the Shopify GitHub integration applies it. Shopify's own commits on that branch are Admin
edits, and `sync` takes them like any other. Never force-push the output branch.

## Stops

- Before the first preview upload: one approval covers the project's previews.
- Before each `ship --yes`: the developer approves the printed plan.
- Before `launch --publish`: the developer asks in words.
- Never upload to, publish, or delete the live theme any other way.
