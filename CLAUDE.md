# House of Sirka

## Project context

This block is read automatically at the start of every session, so the validation
prompts in `validation/` run without re-explaining the business. Keep it current —
a stale context block produces confident analysis of a company that no longer
exists.

Fields marked **[NEEDS OWNER INPUT]** cannot be derived from the code. They are
left blank on purpose rather than guessed: an invented founder story or an assumed
constraint would quietly corrupt every prompt downstream of it.

```
<project_context>
<idea>
An online boutique for Windhoek, Namibia, selling dresses, tailoring and intimate
collections in Namibian dollars. Sixteen pieces from N$590 to N$2,680, held in
depth across sizes, with real garment measurements published per size and one
complimentary alteration on anything bought. Orders are paid through Namibian bank
rails — EFT, FNB eWallet, PayPulse/BlueVoucher, EasyWallet, Nedbank Send Money,
Pay2Cell, or cash on delivery — each confirmed by hand against a proof-of-payment
upload. No card details are collected anywhere, deliberately. Free delivery in
Windhoek over N$1,500.
</idea>

<target_customer>
Two layers, because this is client work.

The client: a Namibian seller who has sold clothing before — so a channel already
works for them — commissioning an online shop for the House of Sirka label.

The shopper: [NEEDS BUYER INPUT] The code implies a Windhoek professional woman
buying occasion and workwear at N$600–N$2,700, comfortable transferring by eWallet
or EFT. That is inferred from pricing, copy and payment rails, not from anyone who
has been spoken to. Replace with a specific person once the buyer describes who
actually buys from them today.
</target_customer>

<problem>
[NEEDS BUYER INPUT] Not yet in the customer's own words. The site asserts the pain
— limited local range, sizing that does not fit, buying blind — but no buyer or
shopper interview has been recorded.

The question that settles it, to ask at the demo: how do they currently track who
has paid? A spreadsheet of eWallet references reconciled against Instagram DMs
means the shop is a painkiller. "I just remember" means it is a vitamin.
</problem>

<stage>
Client build, heading for a buyer demo. Next.js storefront and self-hosted Medusa
v2 backend, running locally, not deployed. No domain, no real orders.

Blocking launch, all of it the buyer's to supply: nothing has been made yet — the
sixteen products and ~303 units of stock are aspirational — product photography is
Unsplash stock showing the wrong garments, contact details are placeholders
(+264 81 000 0000, @houseofsirka.local), and the social handles are unclaimed.
Customer accounts with passwords are not built.

Demo data (the invented reviews) is gated behind NEXT_PUBLIC_DEMO_DATA, which
forces noindex and strips aggregateRating while it is on. See apps/storefront/lib/demo.js.
</stage>

<my_background>
Building this shop for a client rather than running it. The client has sold
clothing before, which is the hardest part of the business and the part the code
cannot supply.

[NEEDS OWNER INPUT] Still worth recording: the size and warmth of the buyer's
existing audience, since that decides whether launch means ten orders or zero.
</my_background>

<constraints>
[NEEDS OWNER INPUT] Hours per week, budget, and the demo date.

Known: stock is aspirational, so the critical path to launch runs through the
buyer's production and photography, not through this repository. Photography in
particular is the largest unbudgeted item — sixteen products across fifty-four
variants is a real shoot.
</constraints>
</project_context>
```

## Validation prompts

Five sequential prompts live in `.claude/commands/`. Run them in order — outputs
chain, the core assumption from `/pressure-test` feeds `/mvp`, the early adopter
profile from `/validate-problem` feeds `/map-competition` and `/first-ten`.

| Command | What it does |
|---|---|
| `/pressure-test` | Finds the fatal flaws before more is built |
| `/validate-problem` | Tests whether the pain is real and paid for |
| `/map-competition` | Maps what customers do today instead |
| `/first-ten` | A manual plan to the first ten customers |
| `/mvp` | The smallest thing that tests the core assumption |

Outputs are saved to `validation/`, numbered. Keep them: in three months the
reasoning is still there and can be diffed against what actually happened.

**A caveat on sequence.** This library is written for validating an idea *before*
building. This shop is already built, so the prompts read as a pre-launch audit
rather than a pre-build one. That is still worth doing — the findings in
`validation/01-pressure-test.md` are things that would stop a launch — but note
that `/mvp` in particular is partly retrospective here, and its honest use is to
identify what should be *removed* before launch, not what to add.

## Repository

Turborepo monorepo. `apps/storefront` (Next.js 16, JavaScript), `apps/backend`
(Medusa v2.18.0, TypeScript), `packages/shared`. See `docs/adr/` for the backend
and monorepo decisions, and `apps/backend/AGENTS.md` for backend conventions.
