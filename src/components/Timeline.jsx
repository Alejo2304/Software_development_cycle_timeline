import React, { useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.1"]
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    restDelta: 0.001
  });

  // Normalize & sort by year/month ascending
  const monthIndex = (m) => {
    if (!m) return 0;
    const s = String(m).toLowerCase().trim();
    const map = {
      jan: 1, january: 1,
      feb: 2, february: 2,
      mar: 3, march: 3,
      apr: 4, april: 4,
      may: 5,
      jun: 6, june: 6,
      jul: 7, july: 7,
      aug: 8, august: 8,
      sep: 9, sept: 9, september: 9,
      oct: 10, october: 10,
      nov: 11, november: 11,
      dec: 12, december: 12,
    };
    return map[s] || 0;
  };

  const items = useMemo(() => {
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
      aria-label="Engineering timeline"
    >
      {/* Vertical axis */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-px bg-slate-200"
        aria-hidden="true"
      />
      {/* Animated progress overlay */}
      <motion.div
        className="pointer-events-none absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-px origin-top bg-gradient-to-b from-sky-400 via-indigo-500 to-fuchsia-500 shadow-glow"
        style={{ scaleY: progress }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="mb-14 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          Milestones in Engineering
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600">
          A curated, animated timeline for classroom exhibitions. Powered by JSON data.
        </p>
      </header>

      {/* Items */}
      <ol className="space-y-14 sm:space-y-20">
        {items.map((entry, idx) => {
          const isLeft = idx % 2 === 0; // alternate sides on md+
          const sideBase =
            "relative grid md:grid-cols-2 md:gap-12 items-center";
          const leftSide = "md:pr-14 md:col-start-1 md:text-right";
          const rightSide = "md:pl-14 md:col-start-2 md:text-left";

          return (
            <li key={`${entry.title}-${idx}`} className={sideBase}>
              {/* Connector dot */}
              <span
                className="absolute top-8 left-4 md:left-1/2 -translate-x-1/2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-white"
                aria-hidden="true"
              >
                <span className="block h-2 w-2 rounded-full bg-white/90" />
              </span>

              {/* Content card */}
              <motion.article
                initial={prefersReducedMotion ? false : { y: 40, opacity: 0 }}
                whileInView={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: "spring", stiffness: 80, damping: 16 }}
                className={`group ${isLeft ? leftSide : rightSide}`}
              >
                {/* Card wrapper */}
                <motion.div
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : { y: -4, rotate: isLeft ? -0.25 : 0.25 }
                  }
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="relative rounded-2xl bg-white/70 backdrop-blur-xs ring-1 ring-slate-200 shadow-md hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="overflow-hidden rounded-t-2xl">
                    <img
                      src={entry.imagePath || "/images/placeholder.jpg"}
                      alt={entry.title}
                      loading="lazy"
                      className="h-56 w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Text content */}
                  <div className="p-6 sm:p-7">
                    <div className={`flex ${isLeft ? "justify-end" : ""}`}>
                      <time
                        className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium tracking-wide text-slate-700 shadow-sm"
                        dateTime={`${entry?.date?.year ?? ""}-${monthIndex(entry?.date?.month) || 1}-01`}
                        aria-label={`Date: ${entry?.date?.month} ${entry?.date?.year}`}
                      >
                        {entry?.date?.month} {entry?.date?.year}
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
                    <p className="mt-3 text-slate-700 leading-relaxed">
                      {entry.resume}
                    </p>
                  </div>

                  {/* Glow accent line */}
                  <div
                    className={`absolute -inset-x-0.5 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 opacity-70`}
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
