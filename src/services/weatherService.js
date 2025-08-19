const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Validates a string as a valid URL.
 * @param {string} url The URL to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Fetches current weather and forecast data from the OpenWeather API.
 * @param {string} urlCurrent The URL for current weather data.
 * @param {string} urlForecast The URL for forecast data.
 * @returns {Promise<{currentWeather: object, forecastData: object} | {currentWeather: null, forecastData: null}>}
 */
export const fetchWeatherData = async (urlCurrent, urlForecast) => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("API key not provided.");
  }

  // Basic validation of URLs
  if (!isValidUrl(urlCurrent) || !isValidUrl(urlForecast)) {
    throw new Error("Invalid API URLs.");
  }

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(urlCurrent),
      fetch(urlForecast),
    ]);

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(
        errorData.cod === "404"
          ? "City not found."
          : "Failed to fetch current weather."
      );
    }

    const currentWeather = await currentResponse.json();
    let forecastData = null;
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json();
    } else {
      console.warn(
        `Failed to fetch forecast data: ${forecastResponse.statusText}`
      );
    }

    return { currentWeather, forecastData };
  } catch (error) {
    console.error("Error in fetchWeatherData: ", error);
    throw error;
  }
};

/**
 * Fetches weather by geographical coordinates.
 * @param {number} lat Latitude.
 * @param {number} lon Longitude.
 * @returns {Promise<object>}
 */
export const fetchWeatherByCoords = (lat, lon) => {
  const urlCurrent = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&lang=en`;
  const urlForecast = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&lang=en`;
  return fetchWeatherData(urlCurrent, urlForecast);
};

/**
 * Fetches weather by city name.
 * @param {string} city The city name.
 * @returns {Promise<object>}
 */
export const fetchWeatherByCity = (city) => {
  const urlCurrent = `${BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&lang=en`;
  const urlForecast = `${BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&lang=en`;
  return fetchWeatherData(urlCurrent, urlForecast);
};

/**
 * Gets the user's current geographical position.
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position && position.coords) {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } else {
          reject(new Error("Position data not available."));
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};
