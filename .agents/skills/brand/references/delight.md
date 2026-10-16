# Find the delight

A delight is a small moment that only this store makes. It is subtle, and a shopper who notices it
smiles or feels looked after. It is the part most Shopify stores lack. Their themes are competent
and their brands are on the page, but nothing on the site could only belong to them.

A store usually has one to three delights, and they share one idea, the **thread**. A store that
sells handmade knives might have a thread of "the maker is in the room". That gives a product page
note in the maker's hand, a cart line that names who sharpened the knife, and a care tip that
appears after the add to cart. Three moments, one idea.

"Delight" is the working name. The concept matters more than the word.

## What a delight is not

- A default the theme already does, such as a hover zoom or a fade-in on scroll.
- A popup, a countdown, a discount, or anything that asks the shopper for something.
- Confetti, sound, or motion for its own sake.
- A claim the store cannot back up.
- Something that slows the page, shifts the layout, or hides content until a script runs.

## The tests

Write each test's answer in `brand/delight.md`. A delight that fails one is not ready.

1. **The neighbor test.** Could a store next door, in the same category, use it unchanged? If yes,
   it is not this store's delight yet. Make it more specific.
2. **The loss test.** Would a returning customer notice if it were gone? Ask the merchant.
3. **The truth test.** It uses only what `brand/facts.md` backs up.
4. **The speed test.** No layout shift, no blocking script, no delay to the task. It respects
   reduced motion, and it works or disappears quietly without JavaScript.
5. **The merchant test.** The merchant can turn it off, or change its words, in the theme editor.

## Where it goes

Expression belongs where people browse. Restraint belongs where people do a task.

| Surface | Mode | Delight |
| --- | --- | --- |
| Homepage, collection, product, about, landing pages | Browse | The main home for delights |
| Blog articles and long pages | Read | In the frame (header, end of article), never inside the text |
| Cart, search, account | Task | Only a delight that helps the task, such as a thank-you line in the cart. It never adds a step. |
| Checkout | Shopify's | None. The theme does not render checkout. |

## Find it

Read before asking:

- `brand/facts.md` and `brand/verbal/positioning.md`: what is true and what the store stands for.
- The store's reviews, emails, and social replies, when available: the moments customers mention
  unprompted are the best evidence.
- `brand/visual/signature.md`: the delight often extends the signature from a look into a moment.

Then ask at most three questions, with room for free text:

1. **What do customers mention that has nothing to do with the product?** For example, the
   packaging, a note, how fast someone replied.
2. **What do you do in person that the site does not do?** For example, a market stall, a
   showroom, or a phone call.
3. **What would you hate to lose if the site were rebuilt tomorrow?**

From the answers, propose two or three threads. Each one gets a name, the moments it makes, and
the neighbor test. The merchant picks one thread. Do not combine threads.

## Write it down

`brand/delight.md` holds the thread and each delight:

```markdown
## The thread: <name>

<One sentence: the idea that ties the delights together, and why it is this store's.>

## <Delight name>

- Moment: <where and when a shopper meets it>
- What happens: <what the shopper sees or reads>
- Why it is ours: <the fact or the positioning line it comes from>
- Neighbor test: <why a neighbor could not use it unchanged>
- Built with: <the setting, block, section, or snippet; the theme's own pieces first>
- Limits: <where it never appears, and how often it appears>
- Check: <how to see that it works, on phone and desktop>
- Status: idea | prototype | built | verified
```

## Make it real

1. **Prototype** each delight in the sandbox first: add a block to `brand/sandbox/index.html` in the
   theme's own classes. Show it to the merchant before any theme code.
2. **Build** it the theme's way: a setting on an existing block when one can carry it, a new block
   when not, with its words as a setting the merchant can edit. Follow the theme's `AGENTS.md`.
3. **Verify** it on phone and desktop with the `review` skill, then set the status to `verified`.

Keep `brand/delight.md` current. When a delight is removed, delete its section, and say why in
`brand/visual/direction.md`.
