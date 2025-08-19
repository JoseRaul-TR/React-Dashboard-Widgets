import React, { useState } from "react";
import { Settings, X } from "lucide-react";
import useWeather from "../hooks/useWeather";


/**
 * WeatherWidget.jsx - A React component for fetching and displaying current weather
 * and a 5-day forecast. The logic is handled by the useWeather custom hook.
 */
const WeatherWidget = () => {
  const {
    currentWeather,
    forecast,
    isLoading,
    errorMessage,
    loadWeatherByCity,
    loadWeatherByGeolocation,
  } = useWeather();

  const [locationName, setLocationName] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);

    // --- Helper function to proccess forecast data ---
  const getDailyForecast = (data) => {
    if (!data?.list) return [];
    const dailyForecast = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecast[date]) {
        // Use the first available entry for the day as the representative forecast
        dailyForecast[date] = item;
      }
    });

    const today = new Date().toLocaleDateString();
    return Object.keys(dailyForecast)
      .filter((date) => date !== today)
      .slice(0, 5) // Display a maximum of 5 days
      .map((date) => {
        const item = dailyForecast[date];
        const day = new Date(item.dt * 1000);
        return {
          dayOfWeek: day.toLocaleDateString("en-UK", { weekday: "long" }),
          temp: Math.round(item.main.temp - 273.15),
          description: item.weather[0].description,
          iconCode: item.weather[0].icon,
        };
      });
  };

  const dailyForecastData = getDailyForecast(forecast);

  const handleManualFetch = (e) => {
    e.preventDefault();
    if (locationName.trim()) {
      loadWeatherByCity(locationName);
      setIsConfigOpen(false); // Close config after fetch.
      setLocationName(""); // Clear input after search
    }
  };

  const handleGeolocationFetch = () => {
    loadWeatherByGeolocation();
    setIsConfigOpen(false);
  };


 return (
    <div className="relative w-full max-w-sm p-6 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 text-slate-200">
      <h2 className="text-xl font-bold mb-4 text-center">Weather</h2>

      <button
        className={`absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 transition-transform duration-300 ease-in-out ${
          isConfigOpen ? "rotate-90" : ""
        }`}
        onClick={() => setIsConfigOpen(!isConfigOpen)}
      >
        {isConfigOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {isConfigOpen && (
        <div className="flex flex-col space-y-4 mb-4">
          <form onSubmit={handleManualFetch} className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter City"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="flex-grow px-4 py-2 bg-slate-700 text-slate-200 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              Search
            </button>
          </form>
          <button
            onClick={handleGeolocationFetch}
            className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            Use My Location
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-slate-400">Loading weather...</p>
      ) : errorMessage ? (
        <p className="text-center text-red-400">{errorMessage}</p>
      ) : currentWeather ? (
        <>
          <div className="flex flex-col items-center justify-center mb-6">
            <h3 className="text-xl font-bold text-sky-400 text-center">
              {currentWeather.name}, {currentWeather.sys.country}
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt={currentWeather.weather[0].description}
                className="w-20 h-20"
              />
              <div className="text-left">
                <p className="text-5xl font-extrabold text-white">
                  {Math.round(currentWeather.main.temp - 273.15)}°C
                </p>
                <p className="text-sm text-slate-400">
                  {currentWeather.weather[0].description.charAt(0).toUpperCase() +
                    currentWeather.weather[0].description.slice(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-2 text-center overflow-x-auto">
            {dailyForecastData.length > 0 ? (
              dailyForecastData.map((day, index) => (
                <div key={index} className="flex-shrink-0 w-24 p-2 bg-slate-700/50 rounded-xl shadow-inner">
                  <p className="text-xs font-semibold mb-1 text-sky-300">
                    {day.dayOfWeek}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.iconCode}@2x.png`}
                    alt={day.description}
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-sm font-bold mt-1">{day.temp}°C</p>
                </div>
              ))
            ) : (
              <p className="w-full text-center text-sm text-slate-400">
                No forecast available.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-slate-400">
          Please enter a location or use geolocation to get started.
        </p>
      )}
    </div>
  );
};

export default WeatherWidget;