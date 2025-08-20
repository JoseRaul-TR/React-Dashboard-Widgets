import React from "react";
import HeadingSection from "./HeadingSection";
import LinksWidget from "./LinksWidget";
import WeatherWidget from "./WeatherWidget";
import NotesWidget from "./NotesWidget";
import CalculatorWidget from "./CalculatorWidget";

export default function Widgets() {
  return (
  <main id="dashboard" className="w-full flex flex-col items-center">
    <HeadingSection />
    <section id="widgets" className="flex flex-wrap justify-center gap-4 w-full p-4">
        <LinksWidget />
        <WeatherWidget />
        <NotesWidget />
        <CalculatorWidget />
    </section>
  </main>)
  ;
}
