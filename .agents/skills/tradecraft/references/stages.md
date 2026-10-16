# Stages and resume points

A fresh session finds its place from files, never from memory. `state.mjs show` prints the
stage and the open decisions. Check the stage's "done" condition before doing its work again.

| Stage | Done when | Resume action |
|---|---|---|
| engage | E1 and E2 are recorded | Ask the missing ones |
| setup | The Tradecraft sign-in works for a Tradecraft theme (`tradecraft status` shows the account), `tradecraft.json` exists, and the first commit has a `Tradecraft-Live` trailer (or `tradecraft status` shows a record of the live theme) | Run the missing CLI step, or give the developer the command for anything that leaves the computer |
| discover | `facts.readAt` is set, and `facts.liveTheme.id` matches today's live theme | Run `discover` again when the live theme changed or the facts are older than 7 days |
| plan | Every decision with "By" at plan or earlier is recorded, as an answer, a default, or a guess, and `PLAN.md` exists | Record the missing guesses, then write `PLAN.md` |
| brand | `brand/readme.md` records the exported brand and its directions, or the plan leaves the brand out | The `brand` skill resumes from its readme |
| build | Every item on the work list is done or dropped | Continue with the first open item |
| review | The review page's answers are recorded, and the work matches them | Read the page's `answers` collection; apply each choice; make a second page for what is left |
| launch | Client sign-off is recorded, and `tradecraft status` shows the publish on `tradecraft/live` | Ask for sign-off, then `release` |
| care, retain | Dates in the state file | `release` |

## The state file

`.tradecraft/engagement.json` is tracked in Git. Each decision is one key, so two branches
that record different decisions merge cleanly. Raw reads go in `.tradecraft/cache/`, which
Git ignores. Item progress lives on the work list, not here. A decision with `"by": "guess"` is shown to
the client on the review page. The client's answer replaces it with `"by": "client"`.

```json
{
  "schemaVersion": 1,
  "store": "acme.myshopify.com",
  "stage": "build",
  "reviewPage": null,
  "decisions": {
    "E1": {"value": "move", "by": "developer", "at": "2026-10-02T01:00:00Z", "evidence": "\"we're moving them onto Analog\""},
    "P1": {"value": "Buying a board", "by": "guess", "at": "…", "evidence": "Top seller in the last 60 days"}
  },
  "questions": {
    "q1": {"decision": "E2", "to": "developer", "text": "…", "askedAt": "…", "answeredAt": null}
  },
  "facts": {"readAt": "…", "liveTheme": {"id": 1, "name": "…", "version": "…", "connected": false}},
  "plan": {"file": "PLAN.md"},
  "history": [{"at": "…", "event": "stage build"}]
}
```
