import React from "react";
import HeadingSection from "./HeadingSection";
import LinksWidget from "./LinksWidget";
import WeatherWidget from "./WeatherWidget";
import PoliceEventWidget from "./PoliceEventWidget";
import NotesWidget from "./NotesWidget";

export default function Widgets() {
  return (
  <main id="dashboard" className="w-full flex flex-col items-center">
    <HeadingSection />
    <section id="widgets" className="flex flex-wrap justify-center gap-4 w-full p-4">
        <LinksWidget />
        <WeatherWidget />
        <PoliceEventWidget />
        <NotesWidget />
    </section>
  </main>)
  ;
}
