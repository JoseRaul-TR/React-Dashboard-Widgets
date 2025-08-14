import React from "react";
import HeadingSection from "./HeadingSection";

export default function Main() {
  return (
  <main id="dashboard">
    <HeadingSection />
    <section id="widgets">
        {/* <LinksWidget />
        <WeatherWidget />
        <PoliceEventWidget />
        <NotesWidget />  */}
    </section>
  </main>)
  ;
}
