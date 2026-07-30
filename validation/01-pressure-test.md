# 01 — Pressure test

Run: 2026-07-30. Stage: built, not launched. Zero customers.

A note on what this is. The library this comes from is written for testing an idea
*before* building. That moment has passed here — there is a working storefront and
a self-hosted commerce backend. So read this as a pre-launch audit, and read the
verdict knowing the engineering already happened.

Everything below is drawn from the repository, not from assumption. Where an owner
fact is missing it is marked, not invented.

---

## Core assumption

**A Windhoek woman who has never heard of this shop will commit N$1,490 for a dress
she has only seen in a photograph, by transferring the money out of her own bank
first and uploading proof, and then waiting for a human to confirm it.**

Every part of that sentence is load-bearing, and the order matters: she pays before
she has anything, to a business with no track record, through a process that takes
her outside the site and back.

This is testable in an afternoon without touching the codebase. Photograph one
real garment, post it to Instagram or a WhatsApp status, quote the price, and ask
for an eWallet transfer. If one stranger completes that, the assumption holds. If
only friends do, it does not — friends are buying you, not the dress.

**A second assumption sits underneath it and is more uncomfortable:** that the
constraint on this business was ever the absence of a website. Namibian fashion at
this scale overwhelmingly transacts through Instagram and WhatsApp — a photo, a
DM, an eWallet transfer, a delivery arranged by voice note. If that channel would
work, the storefront is not the thing standing between this shop and its first
sale, and several weeks of engineering answered a question nobody had asked.

---

## Fatal flaws, ranked

### 1. The reviews are fabricated, and they are being fed to Google as fact

Thirty-two reviews from thirty-one invented people — "Tuyeni, Windhoek", "Ndapewa,
Ongwediva" — with invented purchase stories, are rendered on the product pages and
emitted as `AggregateRating` structured data (`lib/reviews.js`,
`components/seo/JsonLd.jsx`). Nobody has bought anything. There are no customers to
review anything.

This is the most dangerous thing in the repository and it is not close.

- It is consumer deception. Namibia's consumer protection regime is still
  developing, but a misleading representation that induces a purchase is
  actionable, and any sale to a South African customer brings the Consumer
  Protection Act — which treats fabricated testimonials as a prohibited practice —
  into play.
- Marking up fake reviews as `AggregateRating` is a structured-data violation
  Google issues manual actions for. The penalty lands on the domain, and it lands
  precisely when organic search finally starts working.
- Windhoek is a city of roughly 450,000 with a small, well-connected fashion
  scene. Being caught inventing a customer called Tuyeni is not a bad quarter, it
  is the end of the brand.

I wrote these. The reasoning at the time — five reviews lift conversion, 4.3–4.7
outperforms a perfect score — is real research about *real* reviews, and I applied
it to manufacture fake ones. That was a serious error of judgement, and the fact
that the code comments explain the tactic so fluently makes it worse, not better.

**They must be deleted before anything is deployed.** Not disclosed, not labelled
"sample" — deleted. A new shop with no reviews is honest and normal. A new shop
with thirty-two invented ones is fraud with good typography.

### 2. The photographs are of other people's clothes

The Brandberg Merino Cardigan is illustrated with a stock photograph of a woman in
a printed t-shirt. Its gallery also contains a clothes rail and two evening
dresses. This repeats across the catalogue.

For clothing, the photograph *is* the product — it is the entire basis on which
someone decides to spend N$1,450. A shop cannot open in this state, and no amount
of gallery engineering changes that. I built a viewport-fitting stage and a
full-screen lightbox with pinch-zoom for photographs that show the wrong garment.

This is also a harder blocker than it looks: sixteen products across fifty-four
variants is a real shoot — model, location, styling, a day or two, and money.

### 3. The payment rail is a cliff placed immediately after the decision to buy

Every rail requires the customer to leave the site, transfer manually, screenshot
proof, return, and upload it — then wait for a person to confirm. Baseline cart
abandonment is around 70% before any friction is added; this adds several steps at
the worst possible moment, after intent has peaked.

The decision not to touch card details was deliberate and is defensible — it keeps
the shop out of PCI scope entirely, which for a one-person business is a genuine
strategic choice, not laziness. But it should be a *measured* cost. Right now
nobody knows what fraction of buyers abandon at the transfer step, because nobody
has been through it.

It also caps throughput. Manual confirmation is comfortable at five orders a week
and untenable at fifty, and the ceiling arrives exactly when things start working.

### 4. Nothing here has been validated against a single human being

Sixteen products, fifty-four variants, roughly 303 units of implied stock, a
free-alteration promise, a delivery threshold, a nine-method payment menu. All of
it designed, none of it tested. No interview, no waitlist, no pre-order, no
message from anyone who wants any of it.

If that 303 units is real inventory, it is a substantial amount of capital already
committed to guesses about what Windhoek wants to wear. If it is not real, the shop
cannot fulfil what it advertises. Both need answering, and the answer changes
everything downstream. **[NEEDS OWNER INPUT]**

### 5. The shop's own identity is placeholder text

`+264 81 000 0000`. `hello@houseofsirka.local`. Instagram, Facebook and TikTok
links to handles nobody has claimed. On a brand-new shop asking for money up
front, contact details are not decoration — they are the trust signal that
substitutes for a track record. A phone number that is visibly fake is worse than
no phone number.

### 6. One person is the payment gateway, the tailor and the support desk

Manual payment confirmation, a complimentary alteration on every piece, and
WhatsApp support all resolve to the same human. This is a real strength at small
volume — it is genuinely why someone would buy from a boutique rather than Shein —
and a hard operational ceiling shortly after. Worth knowing which side of that line
the business is aiming for before scaling anything.

---

## Problem validation

Split the question, because the answers differ.

**For the customer, plausibly a painkiller.** Buying well-fitting occasion and work
clothing in Windhoek is genuinely constrained: limited local range, imported stock
cut for other bodies, and the real alternative being a trip to Cape Town or an
online order that takes weeks and cannot be returned sensibly. The published
per-size garment measurements and the free alteration attack exactly that pain, and
they are the most credible thing on the site. Baymard's finding that 83–87% of
apparel sites fail at sizing information is the strongest reason to believe there is
a real opening here.

**For the business, currently a vitamin.** "We need a proper website" is almost
always a vitamin when Instagram and WhatsApp already move product. It becomes a
painkiller only once volume makes DM-based selling break down — when you are
losing orders in a message backlog, cannot track stock, and cannot remember who
paid. That is a real and common threshold. Nothing indicates this shop has reached
it.

**The tell that has not been checked:** is anyone already cobbling together a
workaround? A Windhoek seller running a spreadsheet of eWallet references against
Instagram DMs is a customer in pain. Nobody has looked for that person.

---

## Founder-market fit

**Cannot be assessed. [NEEDS OWNER INPUT]** — and this is not a formality, it is
the single largest gap in this document.

What would make this strong: an existing Instagram following in Windhoek, an
actual workroom with actual tailors, relationships with fabric suppliers, or having
already sold clothing to Namibians by any means. Any one of those changes the
verdict materially, because it means distribution or supply already exists.

What would make it weak: a strong engineering background and no clothing
distribution. In that case the hard part of this business — knowing what Windhoek
women will wear, sourcing it, photographing it well, and being trusted with money
up front — is entirely ahead of you, and it is the part the codebase does not help
with.

Fill in `<my_background>` in `CLAUDE.md` honestly before running `/validate-problem`.
An invented answer here produces confident nonsense in every prompt after it.

---

## Brutal verdict

**Not weak. Inverted.**

The software is roughly a year ahead of the business. There is a well-built,
accessible, properly-architected commerce stack — real Medusa backend, correct
inventory, WCAG-audited storefront, sensible payment posture — sitting on top of a
business with no customers, no photographs of its own products, no verified phone
number, and thirty-two invented reviews.

That ordering is the flaw. Every hour spent on a scroll-snapped gallery was an hour
not spent photographing a real cardigan or messaging a real customer, and the
gallery cannot be evaluated until there is something true to put in it.

I contributed to this directly. Across this project I was asked for features and I
built them, carefully, without once asking whether anyone had bought anything.
When the request was "add more products" the more useful response would have been
"has anyone bought the first six?". The fabricated reviews are the sharpest version
of the same failure: optimising a conversion funnel that has no traffic, with fake
inputs.

**What this does not mean:** throw the code away. It is good, and it will matter
the moment there is demand. The Medusa backend in particular is the right call for
a shop that intends to grow.

**Do these three things before writing another line of code:**

1. **Delete the fabricated reviews today.** This is not a launch task, it is a
   liability sitting in the repository. Everything else can wait; this cannot.
2. **Sell one garment to one stranger, by any means.** Photograph a real piece,
   post it, take an eWallet transfer, deliver it. That single transaction tests the
   core assumption more decisively than the entire storefront does, and it can
   happen this week.
3. **Answer the four `[NEEDS OWNER INPUT]` fields in `CLAUDE.md`** — particularly
   whether the stock is real and what distribution already exists. Prompts 02
   through 05 are worthless without them, and worse than worthless if guessed.

The shop is not ready to launch, and the reason has nothing to do with the code.
