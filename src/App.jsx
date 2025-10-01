import React from "react";
import Timeline from "./components/Timeline";
import CaseStudies from "./components/CaseStudies";
import data from "./data/timelineData.json";
import cases from "./data/caseStudies.json";

export default function App() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <Timeline data={data} />
      <CaseStudies cases={cases} />
      <footer className="py-10 text-center text-sm text-slate-500">
        Pruebas de software- Luis Ojeda - Alejandro Ramos.
      </footer>
    </main>
  );
}