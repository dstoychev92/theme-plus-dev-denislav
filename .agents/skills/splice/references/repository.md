# Phase 0: the repository

A rebuild is a stack of pull requests. It needs a Git repository on GitHub, a base
branch that pull requests go into, and a release path that does not overwrite the
store's own edits. Settle these first. A rebuild that starts without them ends with work
that nobody can review.

## 1. Read the state

Run these read-only checks from the project root:

```bash
git status --short --branch
git remote -v
git branch -a
gh repo view --json nameWithOwner,defaultBranchRef,visibility 2>/dev/null
```

When `origin` exists, also check whether its history is this project's history:

```bash
git fetch origin
git merge-base HEAD origin/<default branch> || echo "no shared history"
```

The engagement state already holds most answers: E3 (who runs Git and commits), E4 (who
approves), R1 (delivery and any GitHub-connected theme), and R2 (branch and review model).
Read them with `node .agents/skills/tradecraft/scripts/state.mjs show`. Ask only the ones
still missing, one decision per question, as the `tradecraft` skill's question rules say.
`discover` already lists any theme connected to GitHub: its name has the form `repo/branch`.

## Git preference

Follow E3 in every phase:

- **The person runs Git:** show each command in its own code block, say what it
  does, and wait until they say it ran. Do not run a command that changes a branch,
  a commit, or a remote. Read-only commands, such as `git status` and `git log`,
  stay yours.
- **I run Git:** run the commands. Ask before each push, each pull request, and each
  change to the repository's settings, unless the plan's approved list covers it.

The commands in these references are the same in both cases. Only who types them
changes.

## 2. Match the case

### No repository

Recommend a private GitHub repository for the project. Explain the reason in one
sentence: the pull requests are how the person reviews each item, and how the next
person finds out why a change exists.

With approval, create it and push:

```bash
gh repo create <owner>/<store> --private --source . --push
```

The `main` branch then holds the clean release from `tradecraft init` and the
splice list or its link. Go to section 3.

### The repository is this project

`origin` shares history with `HEAD`. Use the default branch as the base. Go to
section 3.

### The repository holds the old theme

`origin` exists, but `git merge-base` finds no shared history. The repository
holds the theme the store runs today, often with its history of store edits.
Offer two choices, with the cost of each:

- **The same repository, a new branch for the project (recommended when the
  repository connects to the store through Shopify's GitHub integration).** Push the
  project as a branch with its own history, such as `dev`:

  ```bash
  git push origin HEAD:refs/heads/dev
  ```

  The old branches stay untouched. At launch, the branch that the old theme used
  becomes the release branch, and the store keeps its connection. Read
  [github-integration.md](github-integration.md).
- **A new repository for the project (when no integration is connected).** The old
  repository stays as it is, as the record of the old theme. Its history is splice
  evidence: the commits show who changed what and when.

Never force-push over the old theme's branch. Never delete it.

### Shopify's GitHub integration is connected

Read [github-integration.md](github-integration.md) before section 3. The
integration commits every edit made in the Shopify admin to its branch. That
branch must hold a built theme, so the project cannot work on it.

## 3. Set up the pull request flow

- **Base branch:** the branch that holds the project source. It is `main`, or `dev`
  when the release branch is connected to Shopify. Make it the repository's default
  branch, with approval, so pull requests target it.
- **The stack:** one branch for each layer, each made from the layer below it:

  ```text
  <base> ← splice/<store>/1-foundation ← splice/<store>/2-<feature> ← … ← splice/<store>/<n>-templates
  ```

  Each layer's pull request targets the layer below it, so it shows only its own
  change. The bottom pull request targets the base branch. Number the layers so the
  order shows in the branch list.
- **Split pull requests:** `splice/<store>/split-<item-id>`, from the base branch,
  each targeting the base branch. Make one from the foundation instead only when it
  needs the foundation, and say so in its body.
- **One pull request:** a sync, or a small move or update, uses one branch, such as
  `splice/<store>/sync-<date>`, and one pull request into the base branch.
- **Plain Git and `gh`:** the stack needs no other tool. When a lower layer changes,
  rebase each layer above it onto the new tip, in order, and push with
  `--force-with-lease`. Use a stack tool only when the repository already uses one.
- **Evidence:** the project `.gitignore` keeps `splice/<store>/*` out of Git, except
  `todo.md`, which holds the list or its link. Workers in other worktrees need the
  evidence. Before phase 3, either copy the folder into each worktree, or give workers
  its absolute path as read-only evidence. Do not commit `base/`, `changes/`, or
  `compare/`: they hold the store's theme files.
- **Store settings file:** `shopify.theme.toml` is ignored. A worker
  that only builds does not need it. This session pushes the preview theme from its
  own checkout.

Record the result at the top of `splice/<store>/plan.md`: the mode, the repository,
the base branch, the release path, who runs Git, and who merges.
