import { useState, useEffect, useCallback } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords, getCurrentPosition } from "../services/weatherService";

const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const clearState = () => {
        setCurrentWeather(null);
        setForecast(null);
        setErrorMessage(null);
    };

    const loadWeather = useCallback(async (location) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            let data;
            if (location.type === 'city') {
                data = await fetchWeatherByCity(location.name);
            } else {
                data = await fetchWeatherByCoords (location.lat, location.lon);
            }
            setCurrentWeather(data.currentWeather);
            setForecast(data.forecastData);
            localStorage.setItem('lastLocation', JSON.stringify(location));
        } catch (error) {
            console.error("Failed to load weather: ", error);
            setErrorMessage(error.message || "Failed to load weather data.");
            clearState();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadWeatherByGeolocation = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const { latitude, longitude } = await getCurrentPosition();
            const data = await fetchWeatherByCoords(latitude, longitude);
            setCurrentWeather(data.currentWeather);
            setForecast(data.forecastData);
            localStorage.setItem('lastLocation', JSON.stringify({ type: 'coords', lat: latitude, lon: longitude }));
        } catch (error) {
            console.error("Geolocation error: ", error);
            setErrorMessage(error.message || "Could not get your location.");
            clearState()
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to load initial data on component mount
    useEffect (() => {
        const storedLocation = localStorage.getItem("lastLocation");
        if (storedLocation) {
            const location = JSON.parse(storedLocation);
            loadWeather(location);
        } else {
            loadWeatherByGeolocation();
        }
    }, [loadWeather, loadWeatherByGeolocation]);

    return {
        currentWeather,
        forecast,
        isLoading,
        errorMessage,
        loadWeatherByCity: (city) => loadWeather({ type: 'city', name: city }),
        loadWeatherByGeolocation,
    };
};

export default useWeather;