# 01 — Pressure test

Run: 2026-07-30. Revised the same day after the owner supplied context that
changed the conclusion.

**What this is.** The prompt library is written for testing an idea before
building. That is not the situation. This is client work: a shop being built for
a buyer who has sold clothing before, with a catalogue that is aspirational —
nothing has been made yet — heading for a demo.

**What changed on revision.** The first pass assessed House of Sirka as if it
were the reader's own startup and concluded the engineering had run ahead of the
business. With client context that verdict was wrong, and the section explaining
why is kept below rather than quietly deleted.

There are two businesses here and they fail differently. Both are assessed.

---

## Core assumption

### For the build (the near risk)

**That the buyer will look at this and recognise their shop in it.**

This is a demo. It gets judged in fifteen minutes on whether it feels like a
real boutique the buyer would be proud to send people to — not on the Medusa
architecture, the WCAG audit, or the token-driven admin theme, none of which the
buyer will see or ask about.

This is testable immediately and cheaply: show it. Everything in this repository
already answers this assumption or does not.

### For the shop (the assumption that decides whether any of it earns out)

**That a Windhoek woman will commit N$1,490 for a dress she has only seen in a
photograph, transferring the money out of her own bank first and uploading proof,
then waiting for a person to confirm it.**

Every clause is load-bearing, and the order matters: she pays before she holds
anything, to a shop with no trading history, through a process that takes her off
the site and back.

The buyer can test this without the website. One real garment, photographed,
posted to whatever audience they already sell to, priced, paid by eWallet. If a
stranger completes that, the assumption holds. If only friends do, it does not —
friends are buying the seller, not the dress.

---

## Fatal flaws, ranked

### 1. Nothing exists to sell

Sixteen products, fifty-four variants, roughly 303 units of implied stock, and
none of it made. The shop cannot open in any state, at any level of code quality,
until garments exist.

This makes everything downstream conditional, and it reorders the work: the
critical path runs through the buyer's workroom, not this repository. It also
means the catalogue is currently a set of guesses about what Windhoek will wear,
made before anyone was asked.

The practical consequence for the demo is worth naming — it is easy to walk a
buyer through a sixteen-product shop and leave them believing they are two weeks
from launch, when they are one production run and one photoshoot away. Being
explicit about that at the demo is the difference between a happy client and an
angry one in a month.

### 2. The photographs are of other people's clothes

The Brandberg Merino Cardigan is illustrated with stock photography of a woman in
a printed t-shirt; its gallery also holds a clothes rail and two evening dresses.
This repeats across the catalogue.

For clothing the photograph *is* the product — it is the whole basis for spending
N$1,450. Sixteen products across fifty-four variants is a real shoot: model,
location, styling, a day or two, and money. It is the largest unbudgeted item in
the project and it belongs to the buyer, not the build.

It also undercuts the demo itself. The gallery I built — viewport-fitted, pinch
zoom, full-screen — is showing the wrong garment, and a buyer who notices will
trust the rest less.

### 3. The payment rail is a cliff placed straight after the decision to buy

Every rail sends the customer out of the site to transfer manually, screenshot
proof, come back, upload it, and wait for a human. Baseline cart abandonment sits
around 70% before any friction is added; this adds several steps at the moment
intent peaks.

Not collecting card details was deliberate and is defensible — it keeps the shop
entirely out of PCI scope, which for a small operator is a real strategic choice.
But it is a cost nobody has measured, because nobody has been through it. And it
caps throughput: manual confirmation is comfortable at five orders a week and
breaks somewhere well before fifty, which arrives precisely when things start
working.

### 4. The shop's identity is placeholder text

`+264 81 000 0000`. `hello@houseofsirka.local`. Instagram, Facebook and TikTok
links pointing at unclaimed handles. On a new shop asking for money up front,
contact details are the trust signal that stands in for a track record, and a
visibly fake phone number is worse than none.

These are quick to fix and they are the buyer's to supply. They should be on the
demo checklist, not discovered after launch.

### 5. One person is the payment gateway, the tailor and the support desk

Manual payment confirmation, a complimentary alteration on every piece, and
WhatsApp support all resolve to the same human. At low volume this is the reason
to buy from a boutique rather than Shein. It is also a hard ceiling, and the
buyer should choose which side of it they are aiming for before anyone scales
anything.

### 6. Fabricated reviews — resolved, worth recording

Thirty-two invented reviews from thirty-one named Namibians were rendering on
product pages and being emitted to Google as `AggregateRating` structured data,
for products nobody has bought. As demo material that is reasonable; live it
would have been consumer deception and a structured-data violation Google issues
manual actions for, and in a fashion scene the size of Windhoek's, brand-ending
if noticed.

Now gated behind `NEXT_PUBLIC_DEMO_DATA`, which shows the reviews **and**
simultaneously forces the site to noindex and strips the rating markup. Fake
reviews and search visibility can no longer both be switched on — not by
policy, by construction. Verified in both builds.

I wrote those reviews, applying real research about real reviews to manufacture
fake ones, and left no guard on them. The guard exists now because it should
never have depended on someone remembering.

---

## Problem validation

**For the customer, plausibly a painkiller.** Buying well-fitting occasion and
work clothing in Windhoek is genuinely constrained — limited local range, imported
stock cut for other bodies, and the alternative being a trip to Cape Town or an
online order that takes weeks and cannot practically be returned. The published
per-size garment measurements and the free alteration attack exactly that, and
they are the most credible things on the site. That 83–87% of apparel sites fail
at sizing information is the strongest reason to think there is an opening.

**For the buyer, currently closer to a vitamin.** They have sold clothing before,
which means a channel already works for them — almost certainly Instagram or
WhatsApp. A website becomes a painkiller when that channel breaks down: orders
lost in a message backlog, no idea what stock remains, no record of who paid. That
threshold is real and common. Whether this buyer has hit it is the single most
useful thing to establish, and it is a question, not an assumption.

**The tell to check at the demo:** ask how they currently track who has paid. If
the answer is a spreadsheet of eWallet references reconciled against DMs, they are
in pain and this shop is a painkiller. If the answer is "I just remember", it is a
vitamin and the sale is aspirational rather than urgent — which is fine, but it
changes what to emphasise.

---

## Founder-market fit

Two answers, because there are two ventures.

**The buyer: reasonable.** They have sold clothing before. That is the part of
this business the codebase cannot help with — knowing what Windhoek women will
wear, sourcing it, and being trusted with money up front — and they have done some
of it. It is the strongest single fact available. What remains unknown is the size
and warmth of their existing audience, which decides whether launch means ten
orders or zero.

**The builder: strong for the build, and that is the correct scope.** A
well-architected Medusa backend, an accessible storefront and a branded admin are
exactly what a client should get. The risk in agency work is not technical, it is
that the client cannot launch what they commissioned and the build takes the
blame. Guarding against that means being direct at the demo about what is missing
and who owns it.

---

## Brutal verdict

**Strong build. Unproven shop. The gap between those two is the risk, and it is
managed by saying so out loud, not by writing more code.**

The demo will land — it is a genuinely good storefront, and it should be shown.
But the buyer is not two weeks from launch, and if they leave the demo believing
they are, the disappointment attaches to the build.

**What I got wrong on the first pass, kept on purpose:** I judged the ordering
"inverted" — polish before demand. For a founder's own venture that criticism
holds. For client work it does not: a demo *is* the validation step, and it has to
look real to work. Building the polished thing first was the right call, and I
reversed the conclusion once the context arrived rather than defending it.

**What still stands from the first pass**, and it is the part I would keep:
across this project I was asked for features and built them without once asking
who this was for. That question would have taken one sentence and would have
changed the reviews decision, the photography advice, and this document. I should
have asked in week one.

### Three things before the demo

1. **Confirm the demo runs with `NEXT_PUBLIC_DEMO_DATA=true`** so the reviews
   show. It is in `.env.local` already. If it is ever deployed anywhere public,
   that same flag keeps it out of Google.
2. **Get the buyer's real phone, email and social handles in** — fifteen minutes,
   and placeholder contact details are the fastest way to make a polished demo
   feel unfinished.
3. **Take a written list to the demo of what only they can supply**: real
   garments, real photography, real contact details, a review policy, and a
   decision on whether manual payment confirmation is acceptable at their expected
   volume. Their answers are the input to `/validate-problem`, and the honest
   framing is that the build is ready and the shop is not yet.

### Open questions for the buyer

These block prompts 02 through 05, and guessing them produces confident nonsense:

- Where do they sell today, and to how many people?
- How do they currently track who has paid?
- How many pieces can they actually produce, and by when?
- Who takes the photographs, and has that been budgeted?
- What is a good first month — ten orders, or fifty?
