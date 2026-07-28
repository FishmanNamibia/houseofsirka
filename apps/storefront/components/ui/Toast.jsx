"use client";

/**
 * Status announcements.
 *
 * The live region is always mounted, even when empty — screen readers only
 * announce changes to a region that already existed, so mounting it alongside
 * the message would swallow the first announcement.
 */
export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-[60]"
    >
      {message ? (
        <div className="rounded-md bg-ink-900 px-4 py-3 text-body-sm font-semibold text-white shadow-soft">
          {message}
        </div>
      ) : null}
    </div>
  );
}
