import React, { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { monthIndex } from "./monthIndex";

// Memoized timeline item to avoid re-renders when parent scrolls/animates
const TimelineItem = ({ entry, idx, isLeft, prefersReducedMotion, prefetchSrc }) => {
  const monthLabel = entry?.date?.month ?? "";
  const yearLabel = entry?.date?.year ?? "";
  const leftSide = "md:pr-14 md:col-start-1 md:text-right";
  const rightSide = "md:pl-14 md:col-start-2 md:text-left";
  const sideClass = isLeft ? leftSide : rightSide;
  const priority = idx === 0; // only first item gets highest image priority

  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Prefetch next image when this item enters viewport (improves perceived continuity)
  useEffect(() => {
    if (!prefetchSrc) return;
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = prefetchSrc;
          document.head.appendChild(link);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefetchSrc]);

  return (
    <li className="relative grid md:grid-cols-2 md:gap-12 items-center">
      {/* Connector dot */}
      <motion.span
        className="absolute top-8 left-4 md:left-1/2 -translate-x-1/2 inline-flex h-5 w-5 items-center justify-center"
        aria-hidden="true"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm" />
        <motion.span
          className="absolute h-full w-full rounded-full border border-indigo-400/60"
          animate={prefersReducedMotion ? {} : { opacity: [0.45, 0, 0.45], scale: [1, 1.8, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40">
          <span className="block h-2 w-2 rounded-full bg-white" />
        </span>
      </motion.span>

      {/* Content card */}
      <motion.article
        initial={prefersReducedMotion ? false : { y: 40, opacity: 0 }}
        whileInView={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        className={`group/entry ${sideClass}`}
      >
        <motion.div
          whileHover={
            prefersReducedMotion
              ? {}
              : { y: -8, rotate: isLeft ? -0.35 : 0.35, scale: 1.02 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xs ring-1 ring-slate-200/80 shadow-lg shadow-slate-900/5 transition-all duration-300 group-hover/entry:shadow-2xl group-hover/entry:ring-indigo-200 will-change-transform"
        >
          {/* Decorative ambient glows (only visible on hover) */}
          <span className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-300/40 via-indigo-500/20 to-transparent opacity-0 blur-2xl transition-all duration-400 group-hover/entry:opacity-80" aria-hidden="true" />
          <span className="pointer-events-none absolute -left-10 top-6 h-16 w-24 rounded-full bg-gradient-to-r from-fuchsia-400/20 via-transparent to-transparent opacity-0 blur-xl transition-all duration-400 group-hover/entry:opacity-90" aria-hidden="true" />
          <span className="pointer-events-none absolute left-6 top-6 h-8 w-8 rounded-2xl border border-transparent opacity-0 transition duration-300 group-hover/entry:opacity-100 group-hover/entry:border-sky-200/70" aria-hidden="true" />
          <span className="pointer-events-none absolute right-6 top-6 h-8 w-8 rounded-2xl border border-transparent opacity-0 transition duration-300 group-hover/entry:opacity-100 group-hover/entry:border-fuchsia-200/70" aria-hidden="true" />

          {/* Image (optimized with <picture> for AVIF/WebP + fallback) */}
          {/* Aspect ratio container prevents layout shift; placeholder fades out on load */}
          {(() => {
            const rawPath = entry.imagePath || "/images/placeholder.jpg";
            // Derive base without extension for alt formats
            const match = rawPath.match(/^(.*)\.(png|jpg|jpeg)$/i);
            const base = match ? match[1] : null;
            const avif = base ? `${base}.avif` : null;
            const webp = base ? `${base}.webp` : null;
            return (
              <div className="flex items-center justify-center bg-slate-50/90 rounded-t-3xl overflow-hidden aspect-[16/9] relative">
                <picture ref={imgRef}>
                  {/* Order: AVIF -> WebP -> fallback */}
                  {avif && <source srcSet={avif} type="image/avif" />}
                  {webp && <source srcSet={webp} type="image/webp" />}
                  <img
                    src={rawPath}
                    alt={entry.title}
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                    decoding="async"
                    width={1280}
                    height={720}
                    sizes="(min-width: 1024px) 520px, (min-width: 768px) 50vw, 100vw"
                    onLoad={() => setLoaded(true)}
                    className={`h-full w-full object-contain transition-transform duration-400 will-change-transform group-hover/entry:scale-[1.03] ${loaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </picture>
                <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-60'}`} />
              </div>
            );
          })()}

          {/* Text content */}
          <div className="p-6 sm:p-7">
            <div className={`flex ${isLeft ? "justify-end" : ""}`}>
              <time
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-slate-700 shadow-sm backdrop-blur-xs"
                dateTime={`${entry?.date?.year ?? ""}-${monthIndex(entry?.date?.month) || 1}-01`}
                aria-label={`Date: ${monthLabel} ${yearLabel}`}
              >
                <span className="rounded-full bg-slate-100/90 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
                  {monthLabel}
                </span>
                <span className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-3 py-1 text-[0.8rem] font-semibold uppercase tracking-wide text-white shadow-[0_0_12px_rgba(99,102,241,0.32)]">
                  {yearLabel}
                </span>
              </time>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-slate-900">
              {entry.title}
            </h3>
            {entry.subtitle ? (
              <p className="mt-1 text-sm uppercase tracking-wider text-slate-500">
                {entry.subtitle}
              </p>
            ) : null}
            <p className="mt-3 text-slate-700 leading-relaxed text-justify">
              {entry.resume}
            </p>
          </div>

          {/* Glow accent line */}
          <div className="absolute -inset-x-0.5 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 opacity-70" aria-hidden="true" />
        </motion.div>
      </motion.article>
    </li>
  );
};

export default memo(TimelineItem);
