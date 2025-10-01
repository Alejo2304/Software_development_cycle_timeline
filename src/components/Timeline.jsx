import React, { useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import TimelineItem from "./TimelineItem";
import { monthIndex } from "./monthIndex";

/**
 * Props:
 *   data: Array<{
 *     date: { month: string, year: number },
 *     title: string,
 *     subtitle: string,
 *     resume: string,
 *     imagePath: string
 *   }>
 */
export default function Timeline({ data = [] }) {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll progress for the colored line
  // NOTE: offset tuned so the progress bar feels proportional to visible items
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "end 0.9"],
    // Avoid early layout read before Tailwind classes apply & silence position warning
    layoutEffect: false
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    restDelta: 0.001
  });

  const items = useMemo(() => {
    // Sorting once ensures stable order without re-sorting on every render
    return [...data].sort((a, b) => {
      const ay = a?.date?.year ?? 0;
      const by = b?.date?.year ?? 0;
      const am = monthIndex(a?.date?.month);
      const bm = monthIndex(b?.date?.month);
      return ay === by ? am - bm : ay - by;
    });
  }, [data]);

  return (
    <section
      ref={containerRef}
      className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      style={{ position: 'relative' }}
      aria-label="Engineering timeline"
    >
      {/* Header */}
      <header className="relative mb-16 text-center">
        <div className="relative inline-block">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-600 bg-clip-text text-transparent pb-2">
            Origenes de la ingenieria de Software.
          </h2>
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-indigo-500/20 to-fuchsia-500/20 blur-xl opacity-30 rounded-lg"></div>
        </div>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          ¿Como surge la ingenieria de software? ¿Quien propone el ciclo de desarrollo de software? ¿Como ha cambiado a lo largo de los años?
        </p>
      </header>

    {/* Timeline container with its own positioning context */}
    <div className="relative">
        {/* Vertical axis */}
        <div
          className="pointer-events-none absolute inset-y-0 left-4 md:left-1/2 -translate-x-1/2 w-1.5 md:w-2 rounded-full bg-slate-200/80 shadow-[0_0_20px_rgba(148,163,184,0.25)]"
          aria-hidden="true"
        />
        {/* Animated progress overlay */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-4 md:left-1/2 -translate-x-1/2 w-1.5 md:w-2 origin-top rounded-full bg-gradient-to-b from-sky-400 via-indigo-500 to-fuchsia-500 shadow-[0_0_30px_rgba(99,102,241,0.45)]"
          style={{ scaleY: progress }}
          aria-hidden="true"
        />


        {/* Items */}
        <ol className="space-y-14 sm:space-y-20">
        {items.map((entry, idx) => {
          const next = items[idx + 1];
          return (
            <TimelineItem
              key={`${entry.title}-${idx}`}
              entry={entry}
              idx={idx}
              isLeft={idx % 2 === 0}
              prefersReducedMotion={prefersReducedMotion}
              prefetchSrc={next?.imagePath}
            />
          );
        })}
        </ol>
  </div>
    </section>
  );
}
