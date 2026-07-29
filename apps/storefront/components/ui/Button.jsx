"use client";

import { classNames } from "@/lib/format";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-none font-semibold transition " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const VARIANTS = {
  primary: "bg-wine-600 text-white hover:bg-wine-700 active:bg-wine-800",
  secondary:
    "border border-brass-600 bg-ink-50 text-garden-700 hover:border-wine-600 hover:text-wine-600",
  ghost: "text-ink-700 hover:bg-wine-50 hover:text-wine-600",
  danger: "bg-clay-700 text-white hover:bg-clay-800",
  link: "text-wine-600 underline underline-offset-4 hover:text-wine-700",
};

const SIZES = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-11 px-4 text-body-sm",
  lg: "h-12 px-6 text-body",
  icon: "h-11 w-11 p-0",
};

/**
 * Single source of truth for button styling. Previously the primary button
 * string was retyped at 15+ call sites and had drifted on height and padding.
 *
 * Renders an <a> when `href` is set, so link-styled actions keep correct
 * semantics rather than being buttons that navigate.
 */
export default function Button({
  as,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const Tag = as || (href ? "a" : "button");
  const isButton = Tag === "button";

  return (
    <Tag
      href={href}
      type={isButton ? props.type || "button" : undefined}
      className={classNames(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
