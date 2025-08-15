import React, { useState, useEffect } from "react";
import "./Header.css";

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

  // Split the time string to handle the colon separetely
  const [hours, minutes] = currentTime.split(":");

  return (
    <header id="topBar" className="flex flex-col items-center justify-center p-1 bg-block/50 backdrop-blur-md rounded-x1 shadow-lg transition-all duration-300 ease-in-out">
      <p id="timeDate">
        {hours}
        <span className="blinking-colon">:</span>
        {minutes} {currentDate}
      </p>
    </header>
  );
}
