import React, { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";

/**
 * HeadingSection component for managing and configuring the main dashboard title.
 *
 * This component handles the display of the main heading (h1), its color, and
 * the title of the document. It also provides a configuration panel to allow
 * users to change these values, which are then saved to localStorage for persistence.
 */

// Use constants for localStorage keys
const H1_TITLE_KEY = "dashboardH1Title";
const H1_COLOR_KEY = "dashboardH1Color";
const DOCUMENT_TITLE_KEY = "dashboardTitle";

export default function HeadingSection() {
  const [h1Title, setH1Title] = useState("My Dashboard");
  const [color, setColor] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  // Load saved data from localStorage on initial render.
  useEffect(() => {
    const savedH1Title = localStorage.getItem(H1_TITLE_KEY);
    const savedH1Color = localStorage.getItem(H1_COLOR_KEY);

    if (savedH1Title) {
      setH1Title(savedH1Title);
      setTempTitle(savedH1Title); // Set tempTitle to the loaded value
    }
    if (savedH1Color) {
      setColor(savedH1Color);
    } else {
      // Set a default color if none is saved
      setColor("#ffffff");
    }
  }, []);

  // useEffect to handle side effects for the title whenever it changes.
  useEffect(() => {
    document.title = h1Title;
    localStorage.setItem(DOCUMENT_TITLE_KEY, h1Title);
  }, [h1Title]);

  // Handler for changes in title
  const handleSaveTitle = () => {
    if (tempTitle.trim() !== "") {
      //Prevents saving an empty title
      setH1Title(tempTitle);
      localStorage.setItem(H1_TITLE_KEY, tempTitle);
    }
    setIsConfigOpen(false);
  };

  // Handler for changes in title color.
  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    localStorage.setItem(H1_COLOR_KEY, newColor);
  };

  return (
    <section className="relative flex items-center justify-center p-4">
      {/* Main heading */}
      <h1
        id="headingTitle"
        className="text-4xl font-bold transition-colors duration-200"
        style={{ color: color }}
      >
        {h1Title}
      </h1>

      {/* Configuration wheel icon */}
      <button
        className="absolute right-4 p-2"
        onClick={() => setIsConfigOpen(!isConfigOpen)}
      >
        <Settings
          size={24}
          className="text-white hover:text-gray-400 hover:cursor-pointer transition-colors duration-200"
        />
      </button>

      {/* Configuration pane */}
      {isConfigOpen && (
        <div className="absolute top-16 right-4 p-4 bg-gray-800/80 backdrop-blur-md rounded-lg z-20 transition-all duration-300 ease-in-out">
          <button
            className="absolute top-2 right-2 p-1"
            onClick={() => setIsConfigOpen(false)}
          >
            <X size={20} className="text-white hover:text-gray-400" />
          </button>
          <div className="flex flex-col space-y-4 mt-2">
            <input
              type="text"
              placeholder="New title ..."
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="px-2 py-2 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveTitle}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
            >
              Change Title
            </button>
            <div className="flex items-center space-x-2">
              <label htmlFor="titleColorPicker" className="text-white">
                Title Color
              </label>
              <input
                id="titleColorPicker"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-10 h-10 border-none rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
