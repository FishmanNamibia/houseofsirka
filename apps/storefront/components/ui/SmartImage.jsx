"use client";

import Image from "next/image";

/**
 * Wraps next/image and routes around its two failure modes here:
 * admin uploads are base64 data URLs the optimizer cannot process, and any
 * host not listed in next.config.js remotePatterns throws.
 */
export default function SmartImage({ src, alt = "", className, fill = true, width, height, sizes, priority }) {
  const value = String(src || "");
  const isData = value.startsWith("data:");
  const isRemote = value.startsWith("http");
  const optimizable = isRemote || value.startsWith("/");

  if (!value) return <div className={className} aria-hidden="true" />;

  if (!optimizable || isData) {
    // eslint-disable-next-line @next/next/no-img-element -- data URLs bypass the optimizer
    return <img src={value} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />;
  }

  if (fill) {
    return (
      <Image
        src={value}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={value}
      alt={alt}
      width={width || 800}
      height={height || 1000}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
