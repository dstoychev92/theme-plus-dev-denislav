---
name: review
description: Check a Tradecraft project's preview before the client sees it and collect the client's sign-off. Runs the storefront suite on the preview, compares each page the store uses with the live store in every market, checks the client's priority feature first, and turns the client's notes into work items. Use when a preview is ready, when the client sends review notes, or before a launch.
---

# Review a preview

A review answers one question: can this preview replace the live store? Check it before the
client sees it, so the client reviews the design and not the defects.

## Before you start

Read the engagement state: `node .agents/skills/tradecraft/scripts/state.mjs show`.

- **P1** is the feature that must work. Check it first.
- **Q1** says which tests may run and what they may touch. Without Q1, run the storefront
  suite on the preview only, and never add to a cart on the live store.
- **R3** says which theme is the preview.
- **E4** says who sees the review page. It is not asked before now. When it is missing, ask
  the developer once, as the preview is ready: "Do you send the review page to the client?"
- **The facts** list the markets, languages, and templates in use. Check each one.

Find the preview link with `tradecraft status`, or make one with `tradecraft preview` after
the developer's one approval for previews. Record the commit you test. A report for another
commit is not evidence for this one.

## 1. Run the checks

```bash
tradecraft check --suite theme-check
tradecraft check --suite storefront --url "<preview link>"
```

A storefront password goes in `TRADECRAFT_STOREFRONT_PASSWORD`. Fix each failure before the
client review, or list it in the report as open.

## 2. Compare with the live store

Open the live store and the preview side by side, at desktop and phone widths. Check:

1. **P1** from start to end, as a shopper does it.
2. Each template in use: one product per product template, each collection template, the
   cart, search, and each page template.
3. Each market and language in the facts: a product page and the cart, with the price,
   currency, and availability the live store shows.
4. Each app the plan keeps: it shows and works. Each app the plan drops: no trace remains.
5. Forms: newsletter, contact, and any custom form the facts list.

Record each difference with the page, the market, and the width. A difference the plan
chose is not a defect. Name it in the report so the client knows it is on purpose.

## 3. Report to the developer

One table, defects first:

| Page | Market | Width | Live | Preview | Kind |
|---|---|---|---|---|---|

Kind is `defect`, `planned change`, or `question`. A `question` is a store policy only the
client can set (P4). Keep the live behavior as the guess. It goes on the review page with
the live behavior shown, never as a chat question.

## 4. The review page

This is the client's first step in the project. Nothing before it waited for the client.
Build the page from what the work already holds:

- `node .agents/skills/tradecraft/scripts/state.mjs review` lists the best guesses. Each is a
  question, with the guess as the default.
- Each hidden alternative section and each brand direction is a design option. Give the
  preview link in "More info".
- Each choice with more than one good direction, such as copy, the purchase path, or the
  homepage order, is a question. The built direction is the default.

The `tradecraft` skill's [questions reference](../tradecraft/references/questions.md) says
how to write the page and run its rewrite loop. Send it when the developer asks.

Read the answers from the page. Record each with `state.mjs decide <ID> "<answer>" --by
client`, and change the work to match: show a hidden section, take a direction, or rewrite a
line. Then make a short second page for anything left. When the client edits the preview in
the theme editor, take the edits with `tradecraft sync --theme <id>`.

Sign-off comes last, before the launch. It is the only time work waits for the client.
Record it when the developer passes it on:

```bash
node .agents/skills/tradecraft/scripts/state.mjs decide L4 "<commit>" --by client --evidence "<their words>"
```

Then stop. The launch belongs to the `release` skill.

## Rules

- Never add to a cart, submit a form, or sign in on the live store unless Q1 allows it.
- Never upload to the live theme to test.
- Report what you checked and what you did not. Do not call a page fine when you did not open it.
