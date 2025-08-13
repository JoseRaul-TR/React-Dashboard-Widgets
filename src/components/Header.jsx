import React, { useState, useEffect } from "react";

export default function Header() {
  // useState to manage the state of the current time and date
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // useEffect to handle side effects, like setting up a timer
  useEffect(() => {
    // Function to update the time and date
    function updateTimeAndDate() {
      const now = new Date();
      // Get the time string (24h)
      const timeString = now.toLocaleTimeString("en-UK", {
        hour: "2-digit",
        minute: "2-digit",
      });
      //Get the date string in English
      const dateString = now.toLocaleDateString("en-UK", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      //Update the state
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    }
    // Call the function once to set the initial values
    updateTimeAndDate();

    // Set up the interval tu update every 1.5s
    const intervalId = setInterval(updateTimeAndDate, 1000);

    //Clean-up function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header id="topBar">
      <p id="timeDate">
        {currentTime} {currentDate}
      </p>
    </header>
  );
}
