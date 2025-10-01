import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Props:
 *  cases: Array<{
 *    imagePath: string;
 *    company: string;
 *    subtitle?: string;
 *    description?: string;
 *  }>
 */
export default function CaseStudies({ cases = [] }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Calcula el slide activo en función del centro visible del contenedor
  const updateActiveByScroll = () => {
    const c = containerRef.current;
    if (!c) return;
    const center = c.scrollLeft + c.clientWidth / 2;
    const cards = Array.from(c.querySelectorAll("[data-idx]"));
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((el, i) => {
      const elCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  };

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    updateActiveByScroll();
    const onScroll = () => updateActiveByScroll();
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToIndex = (idx) => {
    const c = containerRef.current;
    if (!c) return;
    const card = c.querySelector(`[data-idx="${idx}"]`);
    if (!card) return;
    const left = card.offsetLeft - (c.clientWidth - card.clientWidth) / 2;
    c.scrollTo({ left, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const prev = () => scrollToIndex(Math.max(0, active - 1));
  const next = () => scrollToIndex(Math.min(cases.length - 1, active + 1));

  return (
    <motion.section
      id="case-studies"
      aria-label="Casos de estudio del ciclo de desarrollo de software"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
  className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <header className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Casos de estudio: Ciclo de desarrollo de software
        </h2>
        <p className="mt-3 text-slate-600">
          Comparativa visual de 4 enfoques organizacionales y de ingeniería.
        </p>
      </header>

      {/* Controles izquierda/derecha */}
  <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 z-40">
        <button
          type="button"
          onClick={prev}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-slate-300 shadow hover:shadow-md hover:ring-slate-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Anterior"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={next}
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 ring-slate-300 shadow hover:shadow-md hover:ring-slate-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Siguiente"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Carrusel: scroll-snap nativo (ligero y fluido) */}
      <div
        ref={containerRef}
        className="scroll-snap relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto pb-2 pt-1
                   flex gap-6 sm:gap-8 snap-x snap-mandatory"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Carrusel de casos"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
      >
        {/* “fade” lateral para sugerir desplazamiento */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-0" />
  <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-0" />

        {cases.map((c, idx) => (
          <motion.article
            key={c.company + idx}
            data-idx={idx}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35 }}
            className={`group relative z-10 snap-center shrink-0
                        min-w-[85%] sm:min-w-[70%] md:min-w-[55%] lg:min-w-[42%] xl:min-w-[38%]
                        rounded-2xl bg-white/70 backdrop-blur-xs ring-1 ring-slate-200 shadow-md
                        hover:shadow-xl transition-transform`}
          >
            {/* Borde superior con el mismo gradiente que la línea de tiempo */}
            <div
              className="absolute -inset-x-0.5 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 opacity-80"
              aria-hidden="true"
            />

            {/* Imagen optimizada con <picture> (AVIF -> WebP -> fallback) */}
            <div className="overflow-hidden rounded-t-2xl bg-slate-50">
              {(() => {
                const raw = c.imagePath || "/images/cases/placeholder.jpg";
                const match = raw.match(/^(.*)\.(png|jpe?g)$/i);
                const base = match ? match[1] : null;
                const avif = base ? base + '.avif' : null;
                const webp = base ? base + '.webp' : null;
                return (
                  <picture>
                    {avif && <source srcSet={avif} type="image/avif" />}
                    {webp && <source srcSet={webp} type="image/webp" />}
                    <img
                      src={raw}
                      alt={c.company}
                      loading="lazy"
                      decoding="async"
                      className="h-64 sm:h-72 md:h-80 lg:h-80 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </picture>
                );
              })()}
            </div>

            {/* Contenido */}
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  {c.company}
                </h3>
                {/*typeof active === "number" && active === idx && (
                  <span className="ml-3 inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                    Activo
                  </span>
                )*/}
              </div>
              {c.subtitle && (
                <p className="mt-1 text-sm uppercase tracking-wider text-slate-500">
                  {c.subtitle}
                </p>
              )}
              {c.description && (
                <p className="mt-3 text-slate-700 leading-relaxed">
                  {c.description}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Indicadores (puntos) */}
      <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
        {cases.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ring-1 ring-slate-300 transition
                        ${i === active ? "bg-indigo-500" : "bg-slate-200 hover:bg-slate-300"}`}
            aria-label={`Ir al caso ${i + 1}`}
          />
        ))}
      </div>
    </motion.section>
  );
}
