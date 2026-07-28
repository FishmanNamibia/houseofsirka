"use client";

import { Star } from "lucide-react";
import { reviewsFor, reviewSummary } from "@/lib/reviews";

function Stars({ rating, label }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label || `${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          aria-hidden="true"
          className={n <= Math.round(rating) ? "fill-brass-300 text-brass-300" : "text-ink-400"}
        />
      ))}
    </span>
  );
}

export default function Reviews({ product }) {
  const reviews = reviewsFor(product);
  const summary = reviewSummary(reviews);

  if (!summary.count) return null;

  const maxFit = Math.max(...summary.fit.map((f) => f.count), 1);

  return (
    <section aria-labelledby="reviews" className="mt-12 border-t border-brass-200 pt-8">
      <h2 id="reviews" className="font-display text-display-sm text-wine-800">
        What customers say
      </h2>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.4fr]">
        <div>
          <div className="flex items-center gap-3">
            <strong className="tabular text-display-md font-semibold text-ink-900">{summary.average}</strong>
            <span>
              <Stars rating={summary.average} label={`Average ${summary.average} out of 5`} />
              <span className="block text-body-sm text-ink-600">
                {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </span>
            </span>
          </div>

          <ul className="mt-5 grid gap-1.5">
            {summary.histogram.map(({ star, count }) => (
              <li key={star} className="flex items-center gap-3 text-body-sm">
                <span className="tabular w-10 shrink-0 text-ink-600">{star} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-200">
                  <span
                    className="block h-full rounded-full bg-brass-300"
                    style={{ width: `${(count / summary.count) * 100}%` }}
                  />
                </span>
                <span className="tabular w-6 shrink-0 text-right text-ink-600">{count}</span>
              </li>
            ))}
          </ul>

          {/* Fit is the review dimension that actually prevents returns on
              clothing, so it gets its own summary rather than being buried in
              the review text. */}
          <h3 className="mt-7 text-label uppercase tracking-wider text-ink-700">How it fits</h3>
          <ul className="mt-3 grid gap-1.5">
            {summary.fit.map(({ label, count }) => (
              <li key={label} className="flex items-center gap-3 text-body-sm">
                <span className="w-28 shrink-0 text-ink-600">{label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-200">
                  <span
                    className="block h-full rounded-full bg-garden-500"
                    style={{ width: `${(count / maxFit) * 100}%` }}
                  />
                </span>
                <span className="tabular w-6 shrink-0 text-right text-ink-600">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid gap-5">
          {reviews.slice(0, 5).map((review) => (
            <li key={review.id} className="border-b border-brass-200 pb-5 last:border-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink-800">
                  {review.author} <span className="font-normal text-ink-600">· {review.town}</span>
                </p>
                <Stars rating={review.rating} label={`${review.rating} out of 5`} />
              </div>
              <p className="mt-1 text-body-sm text-ink-600">Fit: {review.fit}</p>
              <p className="mt-2 max-w-[68ch] text-body text-ink-700">{review.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
