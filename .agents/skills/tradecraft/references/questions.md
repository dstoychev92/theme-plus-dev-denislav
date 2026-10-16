# Questions

## Write in ASD-STE100 style

Every question, status message, and report to the developer or the client follows these
rules. Write it, then check each rule before you send it.

- Keep a sentence to 20 words or fewer. Write one instruction or one fact in each sentence.
- Use the active voice and the simple present or past tense.
- Use one word for one thing. Say "live theme" every time, not "published theme" once and
  "production" later.
- Use common words. Do not use idioms, jargon, or internal names: no decision IDs, batch
  names, stage names, or skill names.
- Write numbers, theme names, and theme IDs exactly as the store shows them.

Keep it slim:

- A question has at most 50 words.
- A status message has at most 5 lines: what you did, what you found, and what comes next.
  Do not repeat what the developer already knows. Do not describe work you did not do.
- A report lists results, not steps.

## The shape of one question

1. The decision, as one question that names the exact target.
2. The recommended answer.
3. One fact from the store, the theme, or the site that supports it.
4. What changes with the other answer, only when that is not obvious.

Example:

> How should changes reach the live theme? I recommend that I upload each change you approve,
> after I show you the plan. The live theme, "Dawn", has no GitHub connection. With Shopify's
> GitHub integration instead, I make a branch, and you connect it in Shopify admin.

A system decision, such as how regional variants work, is at most two complete paths. Each
path says what the store gets and what it costs. Never ask for the parts one by one.

When a question names a setting, name its lever: the store's content in `store/`, a theme
preset, or a schema default. They change different stores.

Before you ask, run `state.mjs ask <id> --to developer|client --text "…"`. After the answer,
run `state.mjs decide <id> <value> --by developer|client --evidence "<their words>"`.

## How to ask

- **The developer:** ask in chat, one question per message, in the shape above, and wait for
  the answer. Several numbered questions in one message get one loose reply, such as "yes to
  all three", that fits none of them. `state.mjs ask` refuses a question with internal names or
  more than one question in it (exit code 4): rewrite it and ask again.
- **The client:** only on the review page, made as the next section says. Give the developer
  the link. Read the answers from the page when the session resumes.

## The review page

The review page is the client's one step before the launch. It shows what the agency built,
and it asks the client to choose:

- **Design options:** each hidden alternative section, and each brand direction. Name what
  the client sees, and give the preview link in "More info".
- **Directions:** copy, the purchase path, the homepage order, and other choices with more
  than one good answer. Each option is one direction. The built one is the default.
- **Best guesses:** each decision recorded with `state.mjs guess`, such as who the site is
  for, the path that must work, the apps kept, and the claims. The guess is the default.

Ask at most five things on one page. Put the rest in a second page after the first answers.

The client reads this page as a sample of the agency's work. A decorated page makes the new
website look machine-made. So the page is fixed: plain type, no color, no web fonts.

1. Write `review-page.json` in the project. `scripts/client-page.mjs` shows its shape.
   Each question has:
   - **options:** one to four short answers. Put the recommended answer first, as the
     default. The page adds "Something else" with a text field. An answer that needs
     details, such as a date, belongs in "Something else", not in an option.
   - **detail:** what you found, such as the audience you read from the site, for the
     client to confirm. Leave it out when there is nothing to confirm.
   - **more:** the reason for the question and the evidence, behind "More info".
2. Run the rewrite loop:

   ```bash
   node .agents/skills/tradecraft/scripts/client-page.mjs review-page.json
   ```

   It checks every line against the ASD-STE100 rules and the limits, and refuses to write the
   page while a line fails. Rewrite each flagged line in the JSON and run it again, until it
   writes `review-page.html`. Then read each line once more for the rules no script can
   check: one fact in each sentence, and the words a client uses, not the agency's.
3. Publish `review-page.html` exactly as written, with the `db` capability. Do not
   restyle it, and do not run a design pass on it.
4. The answers are in the page's `answers` collection, one document for each question ID,
   with `answer` and `other` (true when the client typed the answer). Record each with
   `state.mjs decide <id> "<answer>" --by client`, and change the work to match.

When the environment cannot publish a page, give the developer `review-page.html` to
send. The page then offers "Copy answers", and the client sends the text back.

## When to ask

### Up front: the developer

Run `discover` first. It needs no project, and it reads the live theme, its version, and the
other themes. Check which releases of the theme exist before you recommend one: never offer
"the newest release" without its version and whether it is stable.

Then ask one question, unless the opening message settles it: the project kind and the target
together, as in "Do we keep Analog 1.0.0, or move to another theme?". Keeping the live theme
names the target, and `state.mjs` records it.

That is all. Take every other decision from the facts, as a default or a best guess, and
keep working.

### While building: the developer, only when blocked

Ask the developer only when the work cannot continue without an answer, and the facts give
no safe guess. Examples: the store has 20 themes and no preview can be made (R3), or the live
theme is connected to GitHub (R1).

### The plan: a record, not a gate

`PLAN.md` holds the scope, the ranked work, the pages, every default and best guess with its
evidence, and each open choice. Tell the developer it is written, in five lines or fewer, and
keep working. The developer changes it when they want to.

### Review: the client

The review page, as the section above says. It holds the design options, the choices of
direction, and the best guesses, each with a default. E4 decides who sees it.

### Launch: the developer, then the client

Client sign-off on the preview, L1 the theme license, L2 redirects, E5 the date, and the typed
publish.

## Never ask

- A fact `discover` reads: the live theme, its version, markets, apps on the site, the catalog,
  theme count.
- A theme version or a version name.
- A decision already recorded, in this session or an earlier one.
- Several decisions in one question.
