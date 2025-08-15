import React from "react";
import HeadingSection from "./HeadingSection";
import LinksWidget from "./LinksWidget";

export default function Main() {
  return (
  <main id="dashboard">
    <HeadingSection />
    <section id="widgets" className="w-full max-w-4xl p-4">
        <LinksWidget />
        {/* <WeatherWidget />
        <PoliceEventWidget />
        <NotesWidget />  */}
    </section>
  </main>)
  ;
}
