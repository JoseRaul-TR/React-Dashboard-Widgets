import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import BackgroundImage from "./components/BackgroundImage";
import { RefreshCw, Search } from "lucide-react";
import "./App.css";

/**
 * App.jsx - The main application component.
 *
 * This component handles the overall layout and state management for the background image.
 * It uses localStorage to persist the user's last chosen background image.
 */
function App() {
  const [backgroundImage, setBackgroundImage] = useState("");

  // This useEffect hook runs once when the component mounts.
  // It checks for a previously saved background image in the browser's localStorage
  // and sets it as the current background if it exists.
  useEffect(() => {
    // Load background from local storage on initial load
    const lastImageUrl = localStorage.getItem("lastBackgroundImage");
    if (lastImageUrl) {
      setBackgroundImage(lastImageUrl);
    }
  }, []);

  return (
    // The main container div uses a custom CSS class to handle the background image.
    <div
      className="flex flex-col min-h-screen min-w-screen text-white p-4"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* The Header, Main, and Footer components are wrapped inside this
          main container to ensure they inherit the background. */}
      <Header />
      <Main />
      <Footer />
      {/* The BackgroundImage component is responsible for changing the background
          and is placed last to overlay the rest of the content. */}
      <BackgroundImage onBackgroundChange={setBackgroundImage} />
    </div>
  );
}

export default App;
