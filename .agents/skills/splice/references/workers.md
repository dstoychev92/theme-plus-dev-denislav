# Phase 3: workers

A worker builds one feature layer from the plan, on its own branch in its own
worktree. Every worker starts from the pushed foundation, so the workers build at the
same time. This session stacks their branches afterward, in phase 4.

Use workers only when the person chose them in phase 1. Otherwise build the layers in
this session, as in [build.md](build.md).

## Before the first worker

The foundation is pushed and its commit is in `plan.md`, as [build.md](build.md)
describes. Do not start a worker before that.

## Start each worker

Use the first of these that this session has:

1. **Claude Code desktop app: a side session.** `start_session` starts a new session
   that shows in the sidebar under this one. The person can open it, watch it in split
   view, and talk to it while it works. This session hears when each of its turns
   ends. Open the custom-design workers in split view, so the person sees them build.
   A forked session can lack `start_session`. When the person wants side sessions,
   tell them to run the rebuild from a session that is not a fork.
2. **Claude Code: a sub-agent.** Use the Agent tool with `isolation: "worktree"`. The
   person sees only the report.
3. **Codex: a sub-agent.** When the Codex session can start sub-agents, make each
   worker's worktree first, from the project root, and give the sub-agent that folder:

   ```bash
   git worktree add ../<store>-<n>-<feature> -b splice/<store>/<n>-<feature> origin/splice/<store>/1-foundation
   ```

   Run the worktree setup that the project's `AGENTS.md` names, or `pnpm install`,
   in each folder. Tell the sub-agent to work only in its folder.
4. **None.** Tell the person, and build the layers in this session.

When the person runs Git themselves, a worker cannot wait for them to type each
command. Tell the person before they choose workers: workers commit and push their own
branches, and the person still merges.

Start every worker in one turn, so they run at the same time.

## The brief

A worker starts with no memory of this conversation. Its brief holds everything it
needs. Build each brief from `plan.md`:

```markdown
You build layer <n>, "<feature>", of a splice for <store>, from <old theme> to <target theme>.
Other workers build other layers at the same time. Change only the files listed
under "Files you may change".

## Setup
1. Start from the pushed foundation:
   `git switch -c splice/<store>/<n>-<feature> origin/splice/<store>/1-foundation`,
   unless this worktree is already on that branch.
2. Run `git log --oneline -3` and confirm that commit <foundation sha> is in it. If it
   is not, stop and report `blocked`.
3. Run `pnpm install` at the project root.
4. Read the theme's `src/AGENTS.md` and `DESIGN.md` (`theme/src/` in a Tradecraft project). Read
   `.agents/skills/splice/references/build.md`. They bind this work.

## Evidence (read-only)
<absolute path to splice/<store>/>: pages/, changes/, triage.md. The items' rows on the list: <link, or todo.md>.

## The items
<goal, what a shopper sees today, the decisions, the facts: URLs, field names, handles>

## Files you may change
<paths>

## Rules
- Do not change template JSON, section group JSON, or `settings_data.json`. The lead
  session places the feature on its pages. Say in your report where it goes.
- Do not ask the person a question unless you are a side session and the answer
  changes the work. Otherwise take the smaller choice that is easy to undo, and list
  the question in your report.
- Do not push a theme. Do not submit a form. Do not merge. Do not open a pull request:
  the lead session opens it after it stacks the layers.
- Build and run Theme Check with `tradecraft check --suite theme-check`. Fix every
  error in your files.
- Commit, and push your branch.

## Report
First line, one word: `ready`, `partial`, or `blocked`.
Then: branch, files changed, what you built, the check you ran, what you could not
check, where the feature goes on which pages, and questions for the person. Write it
so it can be the pull request body.
```

Add item-specific facts to the brief. Do not add rules that conflict with `build.md`.
A side session may ask the person questions in its own chat. Tell it to ask only when
the answer changes the work.

## Hear back

- A side session ends a turn when it finishes or asks something. Read its last
  message. When it asked a question that the plan answers, answer in its session.
  When the plan does not answer it, the person answers.
- A sub-agent returns its report. Read the first word.
- Report each `partial` or `blocked` result to the person. Do not rebuild a worker's
  layer in this session without telling the person.

Keep the workers' sessions until the stack is reviewed. The person may want to
continue one, such as a design page.
