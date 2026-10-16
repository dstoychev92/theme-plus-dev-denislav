---
name: tradecraft
description: Start or continue an agency's work on one Shopify store with Tradecraft. The entry point for a first run and for every return to a project. Reads the engagement state, finds out what the store already answers, asks the developer and the client only what a person must decide, one decision per question, and routes to the job skills (discover, splice, brand, pages, review, release). Use when someone says "start a project for <store>", "set up <store>", "continue", "what's next", or opens a Tradecraft project with no specific task.
---

# Run an engagement

An engagement is one agency's work on one store, from the first conversation to the
retainer. This skill keeps its state, decides what comes next, and asks the questions that
only a person can answer. The job skills do the work.

The state is one file, `.tradecraft/engagement.json` in the project, or
`<handle>.engagement.json` in the working folder before the project exists.
`scripts/state.mjs` reads and writes it. Never keep a decision only in the conversation.

```bash
node .agents/skills/tradecraft/scripts/state.mjs show            # stage, decisions, open questions
node .agents/skills/tradecraft/scripts/state.mjs next            # the decisions due now, and how to settle each
node .agents/skills/tradecraft/scripts/state.mjs decide E1 move --by developer --evidence "…"
```

## Every time this skill starts

1. Run `state.mjs show`. In a project, also run `tradecraft status`.
2. Report the stage and the next action in two lines.
3. Continue from the stage. Never ask a question whose decision is already recorded.

## Stages

| Stage | Work | Owner | Leave when |
|---|---|---|---|
| engage | Run `discover`, then ask the project kind and target as one question, only when the opening message does not say | developer | E1 and E2 recorded |
| setup | `tradecraft login` for a Tradecraft theme, then `tradecraft init`, and `tradecraft merge live` for a move | shared | the project is committed |
| discover | The `discover` skill reads the store, site, and live theme | agent | facts recorded |
| plan | Record a best guess for each decision the client owns, and write `PLAN.md`. Tell the developer, then continue | agent | `PLAN.md` written |
| brand | The `brand` skill: the extracted brand, plus directions as options for the review page | agent | the brand is exported |
| build | `splice` items and `pages`, with best-guess copy | agent | every planned item done or dropped |
| review | The `review` skill: checks, then the review page with options and guesses for the client | shared | the client's choices are in the work |
| launch | The client signs off. Then the `release` skill: sync, stage, publish | shared | **stop** for sign-off and the typed publish |
| care, retain | `release`: sync, hotfix, theme updates | shared | ongoing |

[references/stages.md](references/stages.md) says what "done" means for each stage, so a
fresh session can resume from the files alone.

## Find out first, then ask

[references/decisions.md](references/decisions.md) lists every decision, where its answer
comes from, its default, and the latest stage it can wait to. Before any question:

- **Read what the store answers.** Run the `discover` skill, or at least `shopify theme list`,
  before a question that depends on the store. Never ask for the live theme, the version,
  the markets, the apps on the site, the catalog, or the theme count.
- **Look for an existing project before `tradecraft init`.** A theme named `<repo>/<branch>` is
  connected to a GitHub repository, and the developer may name one. When either exists, ask
  once whether the project uses that repository. Never start a second repository beside it.
- **Check the folder, not the developer.** Whether a command ran, a file exists, or the
  project is set up is a fact in the folder. Read it.
- **Take what the developer already said.** The opening message often answers the project
  kind and the target theme. Record those with `--by developer` and the quote as evidence.
  A theme they name that the live theme already runs is the target, and the project keeps the
  live theme: it is not a move. `state.mjs decide` refuses that move.
- **Default what has a safe default,** record it with `--by default` and the evidence, and
  list the defaults in the plan, where the developer can change them.
- **Guess what the client owns.** Who the site is for, the path that must work, the apps, the
  claims, the copy, and the brand direction are best guesses from the facts. Record each
  with `state.mjs guess <ID> "<value>" --evidence "…"` and keep working. The review page
  shows every guess to the client, beside the work it shaped.
- **Ask the developer only what an agency knows on the first day.** Usually that is the
  project kind and the target theme. [references/questions.md](references/questions.md) has
  the rules.

Never wait for the client before the review page. Never ask the client a question before
there is a preview to show.

## Ask well

Write every question and reply in ASD-STE100 style, and keep it slim: at most 20 words in a
sentence, 50 words in a question, and 5 lines in a status message.
[references/questions.md](references/questions.md) has the rules and an example. Check each
question and status message with `node .agents/skills/tradecraft/scripts/ste-check.mjs "<text>"`,
rewrite what it flags, and check again until it passes. The client's choices go on the
review page, which runs the same check.

- One decision per question. Put the recommended answer first, with the evidence that leads
  to it and what changes if they choose otherwise.
- A system decision is at most two complete paths, each with its cost to this store. Never
  split it into separate parameters.
- Name the exact target in plain words: the theme by its name, the page, and the lever (store
  content in `store/`, a theme preset, or a schema default). Add a theme's ID only when two
  themes share the name. Never put a CLI command in a question: run it yourself.
- Ask the developer one question per message, and wait for the answer.
- Record every question with `state.mjs ask` before you ask it, and every answer with
  `state.mjs decide`.
- End a turn on the next action, never on "Want me to…?".
- Write for the developer, not for this skill. Never show a decision ID, a batch name, or a
  stage name. Ask about the store in the developer's words: "Where should the move land?",
  not "Who runs Git and the CLI?".
- A "no" from the developer is final. Do not propose the same step again in that session.
- When the developer says they do not understand a question, record nothing. Choose the
  default, say it in one sentence, and move on.

## Defaults that hold unless a person says otherwise

| Topic | Default |
|---|---|
| Who commits and pushes | The developer. Run read-only and local commands only. When the developer must run a command, print it with `state.mjs command "<command>"`, which starts from the project's absolute path |
| Branches | Work in the project on `main`. No worktrees and no stacked pull requests unless the developer asks |
| The live theme | Never upload to it, publish, or delete a theme. Previews go to `tradecraft preview` or a theme the developer names |
| Theme version | The newest release. Never ask for a version name |
| Store names | The CLI names the environment after the store. Never call anything production or staging |
| Existing store | Keep its look, content, and copy. Extract its brand, never invent one |
| Copy | Keep it. Fix wrong facts only |
| Apps | Keep apps that render on the live site. Drop apps with no render evidence. List both in the plan |
| New copy | A best guess in the store's voice. List each new line for the review page |
| The work list | `splice/<store>/todo.md` |

## Route

| When | Use |
|---|---|
| Facts are missing or older than 7 days, or the live theme changed | `discover` |
| The project moves to a new theme, or merges a theme update or another theme's work | `splice` |
| The plan includes the brand | `brand` |
| Pages or templates to compose | `pages` |
| A preview is ready for checks or client review | `review` |
| A ship or launch finished, or the person says you fixed what upset them | `feedback`, when it is installed: it ships only with a Tradecraft sign-in |
| Preview, sync, ship, launch, hotfix | `release` |

Run job skills in this session. When a job skill finishes, come back here, record its
outcome, and move the stage on.

## Sign in before setup

Analog and the other Tradecraft themes, their packages, and the job skills come from the
Tradecraft account, not from npm. When the live theme or the target theme is a Tradecraft
theme, sign in before `tradecraft init`:

```bash
tradecraft login --store <store>.myshopify.com
```

It shows an address and a code and opens the browser. Give the developer the command, wait
until they say they signed in, then run `init`. Never run `npm` or `pnpm` against a
`@groupthought` package, and never ask the developer to fix npm access: the account is the
only source. When `init` fails on a package download, check the sign-in first.

## Set up the project

Run `init` in the folder you work in, and pass each answer as a flag:

```bash
tradecraft init <store>.myshopify.com --theme <live, or the target theme> --directory .
```

Never pass `--yes`. It answers yes to every question the CLI asks, including the ones meant
for the developer. When `init` stops to ask or to explain, such as when a theme has only
pre-releases, show the developer what it said.

## Stops

Stop and wait for a person at these points, and only these:

- **Sign-in:** `tradecraft login` and `shopify store auth` open a browser for the developer.
- **Wrong store:** any read that names another store, such as theme names, the shop name, or
  the domain. Stop, show what you read, and ask the developer to confirm the store. Never
  carry on as if the data were this store's.
- **Client sign-off:** before the launch. It is the only time work waits for the client.
- **Push:** before the first upload to any theme, approve once for previews of this project.
- **Store mutation:** any Admin write.
- **Launch:** publishing a theme, always typed by the developer.
