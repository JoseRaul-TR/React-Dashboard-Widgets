import { RefreshCw, Search } from "lucide-react";
import React, { useState, useEffect } from "react";

const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

function BackgroundImage({ onBackgroundChange }) {
  // State to hold the user's search query for the image.
  const [searchInput, setSearchInput] = useState("");
  // State to manage the loading status of the API call.
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error messages from the API.
  const [error, setError] = useState(null);

  /**
   * Fetches an image from the Unsplash API based on the provided query
   * and updates the application's background.
   * @param {string} query - The search term for the image.
   */
  const fetchAndSetBackgroundImage = async (query = "") => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      // Ensure the API key is provided before making the request.
      if (!UNSPLASH_API_KEY) {
        throw new Error("Unsplash API key is not configured.");
      }
      let url = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_API_KEY}`;
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const data = await response.json();

      if (data?.urls?.regular) {
        const newImageUrl = data.urls.regular;
        onBackgroundChange(newImageUrl); // Pass URL to the parent App component
        localStorage.setItem("lastBackgroundImage", newImageUrl); // Save for presistence
      } else {
        setError("No image found. Please try a different search.");
      }
    } catch (error) {
      setError(`Failed to fetch image: ${error.message}. Please try again.`);
      console.error("Error fetching image from Unslpash API:", error);
    } finally {
      setIsLoading(false); // ENd loading, wheter succesful or not
    }
  };

  // Handler for "Random background" button click.
  const handleRandomBackground = () => {
    fetchAndSetBackgroundImage();
  };

  // HAndler for the "Search" button click.
  const handleSearchBackground = () => {
    fetchAndSetBackgroundImage(searchInput);
  };

  return (
    <section
      id="backgroundImage"
      className="fixed bottom-4 right-4 z-10 p-4 bg-block/50 backdrop-blur-md rounded-x1 shadow-lg transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center">
        <button
          onClick={handleRandomBackground}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          <RefreshCw size={16} />
          <span>Random background</span>
        </button>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <input
            type="text"
            placeholder="Search image..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
            className="w-full md:w-auto px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border-2 border-transparent focus:border-slate-400 focus:outline-none transition-colors duration-200"
          />
          <button
            onClick={handleSearchBackground}
            disabled={isLoading || searchInput.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>
      {isLoading && (
        <p className="text-center mt-2 text-sm text-sky-200">
          Loading background image ...
        </p>
      )}
      {error && (
        <p className="text-center mt-2 text-sm text-red-400">{error}</p>
      )}
    </section>
  );
}


export default BackgroundImage;