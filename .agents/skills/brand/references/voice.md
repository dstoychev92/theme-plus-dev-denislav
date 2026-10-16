# Write the voice

The voice is how the store speaks, written so a person or an agent can write new copy that sounds
like the store and says only what is true. Draft it from evidence, then confirm it with the
merchant. A draft the merchant has not confirmed says so at the top.

## 1. Gather evidence

Read before asking anything:

- `brand/facts.md`: the evidence on hand and the absences. `PRODUCT.md` too, when the theme has one.
- The store's own copy: the homepage, about page, product descriptions, collection intros, FAQ,
  policies, and emails when available. In a Tradecraft project, the templates' JSON under
  `store/templates/` and `store/sections/` holds most of it.
- Anything the merchant has written about themselves: a founder note, social bios, press.

Note what the copy already does well and what it does unevenly. Real lines that work become
approved lines. A voice written from scratch, ignoring how the store already talks, will not stick.

## 2. Draft

Write three files in `brand/verbal/`.

### positioning.md

- What the store sells and to whom, in two sentences.
- What it stands for: the one or two things it can say that a neighbor could not truthfully copy,
  with the evidence for each.
- Who it speaks to, in the situation they are in when they read.
- What it never claims.

### voice.md

- **Voice**, which does not change: three or four traits, each with what it means here, what it
  does not mean, and one short example line from the store's own copy.
- **Tone**, which follows the moment: a short table of moments (selling, helping, an error or
  delay, a policy or legal answer, a thank you) with how the voice shifts in each.
- **Mechanics**: case for headlines and for body, punctuation habits, numbers, dates, currency, how
  to write the store's and products' names, contractions, emoji, and how long a sentence runs.
- **Before and after**: three pairs that rewrite a generic line into the voice.

### words.md

- **Names**: the store, products, and features, spelled and capitalized exactly.
- **Words to use** and **words to avoid**, each with the reason and the better word.
- **Approved lines**: headlines and phrases already set, to quote exactly. A line here may use a
  word the avoid list rules out; it is approved as a whole and is not edited to pass the list.
- **Claims**: what may be said and the evidence behind it, and what must not be said.

## 3. Confirm

Use the structured question tool. Ask at most three questions per round, about what the evidence
cannot settle, and show the drafted answer as the first option so the merchant can approve it in
one click:

1. "Does this sound like you?", with the traits and one example each.
2. Which of the uneven habits to keep, such as formal or casual, or "we" or the store's name.
3. Words, claims, or topics that are off limits.

Record their answers. Mark anything still unconfirmed with `Draft:` at the start of the line, and
leave the note at the top of the file until every draft line is confirmed or removed.

## Writing copy with the voice

When asked to write or check copy:

- Read `voice.md` and `words.md` first. Reach for an approved line before writing a new one.
- Match the moment's tone, and the type preset the copy will sit in: a `type-kicker` line is a few
  words; a `type-h1` is one idea.
- Use only facts the store can back up. Leave a gap marked `[needs: …]` rather than inventing a
  number, a review, or a promise.
- When checking copy, quote each line that misses and name the rule it breaks.
