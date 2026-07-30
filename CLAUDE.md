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
[NEEDS OWNER INPUT] The code implies a Windhoek professional woman buying
occasion and workwear at N$600–N$2,700, comfortable transferring by eWallet or
EFT. That is an inference from pricing, copy and payment rails, not a customer
anyone has spoken to. Replace it with a specific person — "Windhoek office
manager, 30s, buys two or three occasion pieces a year, currently shops Instagram
sellers and trips to Cape Town" — not a demographic.
</target_customer>

<problem>
[NEEDS OWNER INPUT] Not yet stated in the customer's own words. The site's copy
asserts the pain — limited local range, sizing that does not fit, buying blind —
but no interview or message from a real buyer has been recorded. Until one is,
this is the founder's hypothesis, not the customer's complaint.
</problem>

<stage>
Built, not launched. Next.js storefront and self-hosted Medusa v2 backend, both
running locally only. Zero paying customers, zero real orders, no deployment, no
domain. Product photography is Unsplash stock and does not depict the actual
garments. Contact details are placeholders (+264 81 000 0000,
@houseofsirka.local) and the social handles are unclaimed. Customer accounts with
passwords are not built yet.
</stage>

<my_background>
[NEEDS OWNER INPUT] Why you specifically. Relevant experience, an unfair
advantage, and any distribution that already exists — an Instagram following, a
customer list, a physical workroom, relationships with tailors or fabric
suppliers. Distribution you already have is the single highest-value entry here.
</my_background>

<constraints>
[NEEDS OWNER INPUT] Hours per week, budget, hard deadlines, and — most important
for a stock-holding business — whether the sixteen products are physically in a
workroom or aspirational. The seed implies roughly 303 units across 54 variants;
if that stock is real it represents significant capital already committed, which
changes every recommendation.
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
