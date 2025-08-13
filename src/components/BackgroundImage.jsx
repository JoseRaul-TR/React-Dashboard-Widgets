import React, { useState, useEffect } from "react";

const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

export default function BackgroundImage({ onBackgroundChange }) {
  // State to hold the user's search query
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch image from Unsplash API and set it as background
  const fetchAndSetBackgroundImage = async (query = "") => {
    try {
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
        onBackgroundChange(newImageUrl); // Pass URL to parent component
        localStorage.setItem("lastBackgroundImage", newImageUrl);
      } else {
        setError("No image found. Please try a different search.");
      }
    } catch (error) {
      setError(`Failed to fetch image_ ${error.message}. Please try again.`);
      console.error("Error fetching image from Unslpash API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle button clicks
  const handleRandomBackground = () => {
    fetchAndSetBackgroundImage();
  };

  const handleSearchBackground = () => {
    fetchAndSetBackgroundImage(searchInput);
  };

  return (
    <section id="backgroundImage">
      <button onClick={handleRandomBackground} disabled={isLoading}>
        <i className="fas fa-arrows-rotate" /> Random background
      </button>
      <p>eller</p>
      <div id="searchSelectorContent">
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search image..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
          />
          <button onClick={handleSearchBackground} disabled={isLoading}>
            Search
          </button>
        </div>
      </div>
      {isLoading && <p>Loading background image ...</p>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </section>
  );
}
