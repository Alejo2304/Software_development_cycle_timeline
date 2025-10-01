<div align="center">
  <h1>🧭 Orígenes de la Ingeniería de Software – Timeline Interactiva</h1>
  <p>Proyecto educativo que visualiza hitos históricos y modelos organizacionales usando React + Vite + Tailwind + Framer Motion.</p>
  <img src="public/vite.svg" height="60" alt="Vite" />
</div>

## ✨ Características Principales

- Línea de tiempo animada con progreso de scroll (Framer Motion).
- Carga de imágenes optimizada con `<picture>` (AVIF → WebP → PNG/JPG) y prefetch de la siguiente.
- Placeholder blur progresivo (sin parpadeo) + lightbox accesible.
- Carrusel de casos (Microsoft, Spotify, Google, Netflix, Amazon) con scroll-snap nativo.
- Script automático de conversión de imágenes (Sharp) para `public/images/timeline` y `public/images/cases`.
- Respeta `prefers-reduced-motion`.

## 🗂 Estructura
```
public/
  images/
    timeline/
    cases/
src/
  components/
  data/
scripts/
```

## 🚀 Uso Rápido
```bash
npm install
npm run dev
```
Abrir: http://localhost:5173

## 🖼 Conversión de Imágenes
```bash
npm run images:convert
node scripts/convert-images.mjs --quality=82 --avifQuality=55 --force
```
Omite archivos ya convertidos (`↷ Skip`).

## ♿ Accesibilidad
- Lightbox: Escape para cerrar, foco navegable.
- Botones carrusel con `aria-label`.
- Motion reducido si el usuario lo prefiere.

## 🔧 Tecnologías
React, Vite, Tailwind CSS, Framer Motion, Sharp, ESLint.

## 🛠 Mejores Prácticas Aplicadas
- Memoización de items.
- Prefetch progresivo de imágenes.
- Blur + saturación gradual para evitar flash.
- Separación clara de datos (`/data`).

## 📦 Build Producción
```bash
npm run build
npm run preview
```

## 📌 Próximas Mejores (Ideas)
- Blur hash / LQIP automático.
- Zoom/pan dentro del lightbox.
- Virtualización para cientos de eventos.
- Modo oscuro.

---
¡Disfruta explorando la evolución de la ingeniería de software! 🚀
