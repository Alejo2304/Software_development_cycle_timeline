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
    offset: ["start 0.5", "end 0.9"]
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
      jan: 1, january: 1, enero: 1,
      feb: 2, february: 2, febrero: 2,
      mar: 3, march: 3, marzo: 3,
      apr: 4, april: 4, abril: 4,
      may: 5, mayo: 5,
      jun: 6, june: 6, junio: 6,
      jul: 7, july: 7, julio: 7,
      aug: 8, august: 8, agosto: 8,
      sep: 9, sept: 9, september: 9, septiembre: 9,
      oct: 10, october: 10, octubre: 10,
      nov: 11, november: 11, noviembre: 11, 
      dec: 12, december: 12, diciembre: 12,
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
          const isLeft = idx % 2 === 0; // alternate sides on md+
          const sideBase =
            "relative grid md:grid-cols-2 md:gap-12 items-center";
          const leftSide = "md:pr-14 md:col-start-1 md:text-right";
          const rightSide = "md:pl-14 md:col-start-2 md:text-left";
          const monthLabel = entry?.date?.month ?? "";
          const yearLabel = entry?.date?.year ?? "";

          return (
            <li key={`${entry.title}-${idx}`} className={sideBase}>
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
                className={`group/entry ${isLeft ? leftSide : rightSide}`}
              >
                {/* Card wrapper */}
                <motion.div
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: -8,
                          rotate: isLeft ? -0.35 : 0.35,
                          scale: 1.02
                        }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xs ring-1 ring-slate-200/80 shadow-lg shadow-slate-900/5 transition-all duration-300 group-hover/entry:shadow-2xl group-hover/entry:ring-indigo-200"
                >
                  <span
                    className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-300/40 via-indigo-500/20 to-transparent opacity-0 blur-2xl transition-all duration-400 group-hover/entry:opacity-80"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute -left-10 top-6 h-16 w-24 rounded-full bg-gradient-to-r from-fuchsia-400/20 via-transparent to-transparent opacity-0 blur-xl transition-all duration-400 group-hover/entry:opacity-90"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute left-6 top-6 h-8 w-8 rounded-2xl border border-transparent opacity-0 transition duration-300 group-hover/entry:opacity-100 group-hover/entry:border-sky-200/70"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute right-6 top-6 h-8 w-8 rounded-2xl border border-transparent opacity-0 transition duration-300 group-hover/entry:opacity-100 group-hover/entry:border-fuchsia-200/70"
                    aria-hidden="true"
                  />

                  {/* Image */}
                  <div className="flex items-center justify-center bg-slate-50/90 rounded-t-3xl min-h-72 overflow-hidden">
                    <img
                      src={entry.imagePath || "/images/placeholder.jpg"}
                      alt={entry.title}
                      loading="lazy"
                      className="h-full w-full max-h-72 object-contain transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
                    />
                  </div>

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
      </div>
    </section>
  );
}
