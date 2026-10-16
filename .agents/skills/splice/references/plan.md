# Phase 1: the plan

The plan lets this session and any worker build without asking. It names the mode,
every item, the layer each item goes in, the files each layer may change, and the
answer to every question.

## 1. Name the mode

- **move:** the project has never released to this store, and the list compares the
  store's old theme with the project's theme.
- **update:** the list compares the release the project started from with a newer
  release, after `tradecraft merge` or an update in the monorepo.
- **sync:** the project released to this store before, and the store changed since.
  Read [sync.md](sync.md) instead of the rest of this file.

## 2. Pick the items

Take each item on the list marked `understood`. An item is ready when:

- its goal is clear,
- its decisions are made, or can be asked now,
- it has a check to run after the rebuild.

Leave an item out when it needs evidence nobody has, such as page bodies or app
settings. Say what is missing.

## 3. Cut the layers

Cut by feature, so each layer answers "what is this":

1. **Foundation:** the files that two or more layers share. This session builds it
   first.
2. **One layer for each feature group,** such as "size chart" or "mega menu", in the
   order a reviewer should read them. Group items that must agree, such as two
   custom-designed pages that must look the same. Group by who must agree, not by
   size.
3. **Templates and JSON, last:** the template JSON, the section group JSON, and the
   environment's `settings_data.json` for every feature. This session builds it after
   every feature layer exists.

Then mark each item that the reviewer will probably close as a **split** pull request,
as SKILL.md describes. A split item never goes in the stack.

A move with two or three items, or a small update, can be one pull request. Say so in
the plan.

## 4. Assign files

List the files each layer creates or changes. Two layers never change the same file,
so the stack rebases without conflicts. When two layers need the same file, it goes in
the foundation or in the templates and JSON layer. Feature layers then only read it.

Files that the foundation usually holds:

- a snippet or block that two features use, such as a form field
- `locales/en.default.json`
- `layout/theme.liquid`
- the store's app embeds in the environment's `settings_data.json`
- the target theme's demo content that the store would show, such as a sample
  announcement or a placeholder footer column

Files that the templates and JSON layer holds:

- `templates/*.json` and `sections/*.json` in the environment
- the rest of the environment's `config/settings_data.json`

## 5. Ask one round

Gather every open question from the ready items. Ask them in rounds of at most three,
most important first. Include:

- each choice between two reasonable ways, with the cost of each
- design direction for custom work: a brief, a reference, or "build a first version"
- one session or workers, offered as SKILL.md describes. Leave it out for one pull
  request.
- approval for the actions in this run, as one list: the branches, the pull requests,
  the preview theme push, and who merges. When the person runs Git, the list holds
  only the actions that are not Git, such as the push.

## 6. Write the plan

Write `splice/<store>/plan.md`:

```markdown
# Rebuild plan: <store>

Mode: <move | update>. Repository: <owner/repo>. Base: <branch>.
Release: <manual push | connected release branch, see github-integration.md>. Merges: <person>.
Git: <the person runs it | this session runs it>. Build: <one session | workers>.
Approved actions: <list>.

## Stack
### 1. Foundation
- <file>: <why it is shared>

### 2. <feature>: <item ids>
- Goal: <one sentence per item>
- Files it may change: <paths>
- Answers: <the decisions for these items>
- Check after the rebuild: <the item's acceptance check>

### <n>. Templates and JSON
- <file>: <the features it places>

## Split pull requests
- <item id>: <why the reviewer will probably close it>

## Left out
- <item>: <what is missing>
```

The plan is the workers' source of truth. Change the plan, not a worker's brief, when
an answer changes.
