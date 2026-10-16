# Shopify's GitHub integration

Shopify's GitHub integration connects one theme to one branch. It does two things:

- A push to the branch updates the theme.
- An edit in the Shopify admin, such as a save in the theme editor, becomes a commit
  on the branch. This cannot be turned off.

Many stores use it, because those commits record every change that someone made in
the admin. A Tradecraft project cannot work on that branch. The branch must hold a
built theme at its root, and the project holds source: `theme/src`, the store's
content in `store/`, and the build. Shopify would also commit the admin's edits
into files that the build replaces.

In a Tradecraft project, `tradecraft ci init --integration` sets up that step:
`tradecraft ship` builds the commit and commits the changed files to the output branch.

## Recommend keeping it

Explain both choices, with the cost of each. Recommend choice 2, because the
integration keeps a commit for every change the client makes in the admin, with no
work from anyone. The person decides.

### Choice 1: disconnect the integration

- The person disconnects the theme in the Shopify admin. The theme stays. Only the
  connection goes.
- The project pushes with Shopify CLI by hand. Nothing records what was shipped, so a
  later sync compares with the theme's release, and the project's own work shows up as
  changes.
- A sync, as [sync.md](sync.md) describes, brings the client's changes back.
- Cost: admin edits reach Git only when someone syncs. Sync before every deploy, or
  the deploy replaces the store's newer settings and removes an app's code.

Choose this when nobody depends on the integration's commits.

### Choice 2 (recommended): keep the integration, and make its branch a release branch

The connected branch, such as `main`, stops being where people work. It holds only
the built theme. The project lives on another branch, such as `dev`, which becomes
the repository's default branch.

```text
dev (default)            source, pull requests, splice work
  └─ tradecraft ship  ─►  main (connected to Shopify)   built theme only
                              ▲
                              └── Shopify commits admin edits and app edits here
```

- **Work:** every pull request targets `dev`. Nothing merges into `main` by pull request.
- **Bring changes back:** a sync, as [sync.md](sync.md) describes. Shopify's commits on
  `main` show exactly what changed since the last release.
- **Release:** build from `dev` and replace the contents of `main` with `dist`. The
  steps are below.
- Cost: two branches with different contents. Someone who merges a pull request
  into `main` breaks the theme. Protect `main` so only the release step and Shopify
  can push.

When the old theme's repository already connects to the live theme, its branch
becomes the release branch on launch day.

## Set up choice 2

Each step changes something outside this computer. Ask before each one.

1. Push the project as `dev`. See [repository.md](repository.md).
2. Make `dev` the default branch:
   `gh repo edit <owner>/<repo> --default-branch dev`.
3. Protect the release branch, so pull requests cannot merge into it. Do this in
   the repository settings. Shopify's app still needs to push.
4. Leave the integration connected. Do not reconnect it during the rebuild.

## Before each release

Run the sync first, as [sync.md](sync.md) describes. A release stops while the sync has
open work.

## Release to the connected branch

The person approves each release. The push updates the connected theme. When that
theme is the published theme, the push changes the live store at once.

```bash
# In a Tradecraft project with "delivery": "integration", after the sync is merged
tradecraft ship --dry-run
tradecraft ship
```

`ship` builds the commit and commits the changed files to the output branch, with a
`Tradecraft-Source` line. It stops when Shopify committed edits that the project has not
synced.

Check after the push: the theme in the admin shows the new commit, and the
storefront renders the changed pages.

## What the CLI does not do yet

Record these as gaps. Do not build them during a rebuild:

- A GitHub Action that runs when Shopify commits to the release branch and opens or
  updates one sync pull request into `dev`. The manual sync stays for a catch-up.

In a Tradecraft project with `"delivery": "integration"`, `tradecraft ship` does the
release steps above: it builds the commit, commits the changed files to the release branch as
`Build <source sha>` with a `Tradecraft-Source` line, and stops when Shopify committed
merchant edits that the branch has not synced. `tradecraft sync` reads those Shopify commits
and merges them. `tradecraft ci init --integration` writes a workflow that runs `ship` on each
merge. The release skill covers it.
