/**
 * Demo mode.
 *
 * The seeded reviews in lib/reviews.js are sales material: they let the shop be
 * shown to the buyer as it would look with a year of trading behind it, which a
 * bare product page cannot do. They are also thirty-two invented people who have
 * never bought anything.
 *
 * That is fine in a demo and indefensible in a live shop, so the two states are
 * made mutually exclusive here rather than left to whoever does the deploy
 * remembering. Turning demo data ON simultaneously turns OFF everything that
 * would let a machine or a stranger treat it as fact:
 *
 *   - `aggregateRating` is dropped from the product structured data, so no
 *     invented score is ever submitted to Google. Marking up reviews that do not
 *     exist is a structured-data violation Google issues manual actions for, and
 *     the penalty lands on the domain.
 *   - every page is served `noindex, nofollow`, so the demo cannot be crawled,
 *     ranked, or found by a customer who was never meant to see it.
 *
 * The safe state is the default. Demo mode has to be asked for explicitly, and
 * asking for it costs you indexing — which is exactly the trade a demo should
 * make and a live shop never would. There is no configuration in which fake
 * reviews and search visibility coexist.
 *
 * To go live: remove NEXT_PUBLIC_DEMO_DATA from the environment. The seeded
 * reviews disappear, the rating markup returns the moment real reviews exist,
 * and the site becomes indexable.
 */
export const DEMO_DATA = process.env.NEXT_PUBLIC_DEMO_DATA === "true";

/** Live shops index; demos must not. */
export const INDEXABLE = !DEMO_DATA;
