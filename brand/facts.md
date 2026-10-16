# Facts

Source: the live theme "Analog migration" (Pipeline 9.0.0) on the test store. The copy is Boom
Coffee's own. Nothing here is invented. Lines marked **Conflict** need the client to confirm.

## What the store sells, and who buys

Boom Coffee (written BOOM! in headlines) sells functional instant coffee: Protein Coffee in five
flavours, and Brain Coffee, an adaptogenic coffee with four mushrooms. It sells to busy, active
adults in Bulgaria, Greece and Romania who want energy without the crash or the jitters.

## Products

- **Boom Protein Coffee**: arabica coffee with whey protein, vitamin D3, magnesium, B-complex,
  calcium and iron. Five flavours (raspberry and hazelnut are named). No added sugar, no
  artificial sweeteners
- **Brain Coffee**: arabica coffee with lion's mane, cordyceps, reishi and chaga, plus ginkgo
  biloba, rosemary, B vitamins and magnesium. No added sugar
- Bundle builder ("Създай своя box"), subscriptions every 2–5 weeks, a free electric frother
  with 2 or more packs, a gift with 3 products

## Evidence on hand

| Evidence | Where |
|---|---|
| EFSA-approved claims: immune function (D3), nervous system (magnesium), energy metabolism (B-complex), muscle mass (protein) | `page.science` FAQ |
| Peer-reviewed studies for the mushrooms, such as Mori et al., 2009 (lion's mane, 16 weeks, adults) | `product.brain-coffee`, "ЗАЩО РАБОТИ" |
| 10 g whey protein per dose | FAQ, product pages |
| About 150 mg caffeine per dose | FAQ, product pages |
| 22 doses per Protein Coffee pack; 16 doses per Brain Coffee pack | FAQ, `product.json` |
| Free shipping over 50 € (Bulgaria), 75 € (Greece), 375 lei (Romania) | Announcement bar |
| 14-day returns for unopened products, info@boom-coffee.com | FAQ |
| Affiliate programme: 15% commission, 10% off for followers | `page.affiliate` |
| Social: Instagram and TikTok @boom.coffee.bulgaria, YouTube @boom.coffee, Facebook | Theme Settings |
| Retail locations map | `page.magazinna-mreja` |

## Conflicts to confirm

- **Conflict:** coffee per dose is 5 g in the FAQ and `product.bundle-builder`, but 4 g in `product.misc`
- **Conflict:** price per dose is €1.02 (`product.bundle-builder`), €1.36 (`product.misc`), and 1.03 (Theme Settings `dose_price_protein`)
- **Conflict:** Protein Coffee has "11 витамина и минерала"; Brain Coffee shows "8 ВИТАМИНА". Confirm both are right per product
- **Conflict:** the homepage says "−15% НА ВСИЧКО" and the bar says "−15% САМО ТАЗИ СЕДМИЦА". Is the offer still on?

## Absences

- No customer reviews or ratings in the theme. Do not quote a review or a star rating
- No press or awards
- No customer count or sales numbers
- No founder story text in the theme (`page.story`, `page.about` and `page.team` hold no copy in their templates)

## Never claim

- That the coffee treats, cures or prevents a disease. "Boom Protein Coffee не е лекарство" stays
- "Напълно безопасно" (completely safe) without a condition. Keep the advice for pregnancy, chronic illness and caffeine sensitivity
- A mushroom benefit without its study, or an EFSA claim the list above does not hold
- A number of customers, a rating, or an award
