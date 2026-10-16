# Delight

Draft: these are best guesses from the live theme. The client has not answered the delight
questions yet. They go on the review page.

## The thread: the first cup

Everything moves toward the moment you stir a dose and drink it: "ПЪРВАТА ЧАША ВЕЧЕ Е НАВИК".
It is Boom's because the product is a powder you stir in 30 seconds, not a bag of beans.

## The glass fills as you scroll

- Moment: homepage, between the product sections
- What happens: a glass fills with coffee as the shopper scrolls down
- Why it is ours: "Разбъркай. Отпий." and the "Готово за 30 секунди" claim
- Neighbor test: a bean roaster cannot use it. It shows a stirred drink, not a brew
- Built with: live `boom-scroll-glass` section and `_glass-cup` block. Hidden on the live homepage today
- Limits: once per site, homepage only. Static full glass under reduced motion or without JavaScript
- Check: phone and desktop scroll, no layout shift
- Status: idea (built on Pipeline, hidden; needs the client's yes)

## A new favicon each visit

- Moment: the browser tab
- What happens: the tab icon changes between seven Boom icons
- Why it is ours: live theme ships `Favicon01`–`Favicon07`
- Neighbor test: the icons are Boom's own art
- Built with: a small snippet that picks a favicon. Fallback is the `favicon` setting
- Limits: the tab only
- Check: reload a few times; the icon changes, nothing else moves
- Status: idea (confirm that the live site rotates them)

## The cost of a dose

- Moment: product page, near the price
- What happens: the price per dose, with the qualifier, such as "с 3 пакета + абонамент"
- Why it is ours: the store sells by the dose and compares it with a café coffee and a shake
- Neighbor test: it uses Boom's own dose counts and prices per market
- Built with: live settings `dose_price_*` and `dose_qualifier_*`
- Limits: product and bundle pages
- Check: each market shows its own price
- Status: idea (the price per dose conflicts across pages; see `facts.md`)
