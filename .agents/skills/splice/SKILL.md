---
name: splice
description: Carry custom work from one Shopify theme onto another and rebuild it the target theme's way. Covers a store's move to a new theme, a theme update, a sync of code edits the client made on the live theme, another theme on the store such as an earlier attempt, and another vendor's theme. Runs tradecraft merge, audits the comparison into a ranked work list led by the client's priority, and rebuilds each item as local changes, one pull request, or a stack. Use after the tradecraft skill's plan names a move or update, or when someone asks to compare, audit, port, or carry over theme work.
---

# Splice

A splice carries edits from one theme onto another. It has three inputs:

- **base:** the theme everyone started from.
- **changes:** the base plus someone's edits. The splice carries these forward.
- **target:** the theme where the edits land.

| Kind | base | changes | target |
|---|---|---|---|
| move | the release the store's theme started from | the store's live theme | the project's theme |
| sync | the build the project last released | the store's theme now | the project's theme |
| update | the release the project is on | the project's theme | the newer release |
| another theme on the store | its release | that theme, such as an earlier attempt at the move | the project's theme |
| another vendor's theme | its release | the store's theme | any theme |

`tradecraft merge` with no argument applies a theme update by itself, with Git conflict
markers. Use this skill for an update only when the person wants to review it, or when the
conflicts hide features. `tradecraft sync` merges the client's content edits; this skill
handles the code edits a compiled theme cannot take back. See
[references/sync.md](references/sync.md).

## Before you start

Read the engagement state: `node .agents/skills/tradecraft/scripts/state.mjs show`. It holds:

- **P1** the client's priority feature. It goes first on the list, whatever its size.
- **P3** the app decisions. Do not ask about an app again.
- **E3, R1, R2** who runs Git, the delivery, and the branch model. Follow them.
- **The facts** from `discover`: markets, apps in the theme, templates in use.

When P1 is missing, record a best guess from the facts with `state.mjs guess P1`, such as the
store's best-selling product's purchase path, and rank with it. The client confirms it on
the review page.

## 1. Compare

```bash
tradecraft merge live                      # a move: the live theme onto the project's theme
tradecraft merge <theme id>                # another theme on the store
tradecraft merge ./theme.zip --base ./base.zip
```

Re-read the live theme first with `shopify theme list`. When it is not the theme the facts
name, stop and tell the developer: someone published another theme.

`merge` writes `splice/<store>/` and exits with code 3 when the comparison is ready. Without
`--base`, it finds the release the theme reports. When no repository has it, it makes a
`base/` folder: ask where the theme came from, put the zip there, and run the same command.
When `merge` warns that the base may be a different build, stop before the audit: a wrong base
turns every file into a false item. Ask the developer where the store got the theme, put that
release's zip in `base/`, and run `merge` again.

## 2. Audit

```bash
node .agents/skills/splice/scripts/audit.mjs splice/<store> [--site https://<domain>] [--admin]
```

It writes `triage.md` (changed files by origin, apps with evidence, templates in use, a
product page per market, bug signs), `target.md` (what the target theme can do), and a first
`todo.md`. `--admin` uses the read-only sign-in that `discover` set up. A storefront password
goes in `STOREFRONT_PASSWORD`. [references/evidence.md](references/evidence.md) explains each
part.

Then turn the draft into the work list:

- **Name each feature and say why it exists**, in merchant terms. Split an item that holds
  two features, and merge items that are one.
- **Apps:** apply the P3 decisions. Never list an app the developer already dropped.
- **Kind:** `selling` covers what a shopper can buy, for how much, and whether they find the
  store, including robots.txt and search metadata. `visual` covers layout and media.
- **Rank:** P1 first, then selling items that break quietly, such as region, market, or price
  logic, then the apps they need, then visual and content.
- **Open questions:** at most five, each a store policy only a person can set, such as sold-out
  handling per region. Show the live behavior in each. Keep the live behavior as the guess, record it with `state.mjs guess P4`, and keep working.
  The client confirms each on the review page.

The list lives where R4 says: the shared page, or `splice/<store>/todo.md`.
[references/list.md](references/list.md) explains the rows. Report the bugs you find in the
list's "Bugs to check" section, apart from the work items.

Show the ranked list to the developer in five lines or fewer, and continue with the top item.

## 3. Understand one item at a time

Take the top open item. Read only its files and hunks, and record: what a shopper sees, what
it is for, where it runs, the store data it reads across every product it touches, outside
services, what the target theme already has, a suggestion of `port`, `rebuild`, or `drop`
with the reason, and how to check it. Prefer `rebuild` when the target theme has a native
way. Mark it `understood`.

## 4. Rebuild

[references/build.md](references/build.md) holds the rules for every rebuild: find the target
theme's own way, keep the theme general, put store values in `store/`, and run the build and
Theme Check. Never copy the old theme's `settings_data.json` or templates: their setting and
block IDs belong to the old theme.

Choose the shape from the plan and R2:

| Shape | When |
|---|---|
| Local changes | The developer commits themselves (E3), or a few items. Leave the changes for review |
| One pull request | A sync, or a small move or update |
| A stack of pull requests | A large move, when a team reviews one feature at a time |

[references/plan.md](references/plan.md), [references/repository.md](references/repository.md),
[references/verify.md](references/verify.md), and [references/workers.md](references/workers.md)
cover the stack: the plan, the repository, the preview, and parallel workers.
[references/github-integration.md](references/github-integration.md) applies when R1 is the
GitHub integration.

## 5. Loop

Each session reads the list and the state, reports the open items in order, and continues
with the top one. The splice is done when every item is verified or dropped. Drop an item only
after someone confirms the store does not need it.

## More than one changed theme

The live splice's list is the one list for the store. For another theme on the store, run
`tradecraft merge <theme id>` and `audit.mjs splice/<store>/theme-<id> --no-site`, then match
each of its items to a live item by what it does. Record what the second version does better
in the live item, with its source. Who made the second theme and when changes its weight: ask
when the state does not say.

## Rules

- Ask before anything that leaves this computer: a push, a pull request, a theme upload, a
  repository, or a Shopify change. One approval from the developer can cover a listed set.
- Never publish, delete, or upload to the live theme. Never merge into the base branch.
- Fix only what an item needs. Record other problems as bugs.
- Verify in at most two passes, and report what is still open.
