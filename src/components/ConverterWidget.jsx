import { Currency } from "lucide-react";
import React, { useState, useCallback, useMemo, useEffect } from "react";

// Define non-currency conversion factors outside of the component.
// This data is static and doesn't need to be recreated on every render.
const staticConversions = {
  Length: {
    units: {
      meters: 1,
      feet: 3.28084,
      kilometers: 0.001,
      miles: 0.000621371,
      inches: 39.3701,
      centimeters: 100,
    },
    label: "Length",
  },
  Temperature: {
    // Temperature requires specific formulas, not simple ratios
    units: {
      celsius: { toBase: (c) => c, fromBase: (c) => c },
      fahrenheit: {
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      kelvin: { toBase: (k) => k - 273.15, fromBase: (c) => c + 273.15 },
    },
    label: "Temperature",
  },
  Weight: {
    units: {
      kilograms: 1,
      pounds: 2.20462,
      grams: 1000,
      ounces: 35.274,
      metric_tons: 0.001,
    },
    label: "Weight",
  },
  Volume: {
    units: {
      liters: 1,
      gallons: 0.264172,
      quarts: 1.05669,
      milliliters: 1000,
      cubic_meters: 0.001,
    },
    label: "Volume",
  },
  Speed: {
    units: {
      kph: 1,
      mph: 0.621371,
      m_per_s: 0.277778,
      ft_per_s: 0.911344,
    },
    label: "Speed",
  },
  Time: {
    units: {
      seconds: 1,
      minutes: 0.0166667,
      hours: 0.000277778,
      days: 0.000011574,
    },
    label: "Time",
  },
};

/**
 * Converter.jsx - A comprehensive unit converter widget component.
 *
 * This refactored version improves readability by separating static data from
 * component state and logic, and uses clearer variable names for API fetching.
 */
export default function ConverterWidget() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("EUR");
  const [toUnit, setToUnit] = useState("USD");
  const [result, setResult] = useState("");
  const [conversionType, setConversionType] = useState("Currency");
  const [currencyRates, setCurrencyRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the full conversion object to avoid re-creation on every render
  const conversions = useMemo(
    () => ({
      Currency: {
        units: currencyRates,
        label: "Currency",
      },
      ...staticConversions,
    }),
    [currencyRates]
  );

  // Fetches live currency exchange rates from API
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/EUR");
        if (!response.ok) {
          throw new Error("Failed to fetch currency rates.");
        }
        const data = await response.json();
        setCurrencyRates(data.rates);
      } catch (error) {
        console.error("Failed to etch currency rates:", error);
        setError("Failed to load currency rates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []); // Run only on component mount

  // Handles the conversion calculation
  const handleConvert = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Invalid input");
      return;
    }

    const currentConversion = conversions[conversionType];
    const fromUnitData = currentConversion?.units?.[fromUnit];
    const toUnitData = currentConversion?.units?.[toUnit];

    if (!fromUnitData || !toUnitData) {
      setResult("Invalid units selected");
      return;
    }

    let convertedValue;
    if (conversionType === "Temperature") {
      const baseValue = fromUnitData.toBase(value);
      convertedValue = toUnitData.fromBase(baseValue);
    } else {
      const baseValue = value / fromUnitData;
      convertedValue = baseValue * toUnitData;
    }

    setResult(convertedValue.toFixed(4));
  }, [inputValue, fromUnit, toUnit, conversionType, conversions]);

  // Update result when input or units change
  useEffect(() => {
    if (inputValue) {
      handleConvert();
    } else {
      setResult("");
    }
  }, [inputValue, fromUnit, toUnit, handleConvert]);

  const unitOptions = useMemo(() => {
    const currentUnits = conversions[conversionType]?.units;
    if (currentUnits) {
      return Object.keys(currentUnits);
    }
    return [];
  }, [conversionType, conversions]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-2xl space-y-4">
      <h2 className="text-white text-3xl font-bold">Converter</h2>
      <div className="w-full flex flex-col space-y-4">
        {/* Conversion Type Selector */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Conversion Type:</label>
          <select
            value={conversionType}
            onChange={(e) => {
              const newType = e.target.value;
              setConversionType(newType);
              const units = Object.keys(conversions[newType].units);
              if (units.length > 1) {
                setFromUnit(units[0]);
                setToUnit(units[1]);
              }
              setInputValue("");
              setResult("");
            }}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {Object.keys(conversions).map((type) => (
              <option key={type} value={type}>
                {conversions[type].label}
              </option>
            ))}
          </select>
        </div>

        {/* Input and Unit Selectors */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Enter Value:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g., 123"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex flex-col flex-1">
            <label className="text-gray-300 mb-1">From Unit:</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.replace(/_/g, "")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-gray-300mb-1">To Unit:</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="w-full p-4 rounded-lg bg-amber-500 text-white font-bold text-center text-2xl shadow-lg">
        {isLoading ? "Loading rates..." : error || result || "Result"}
      </div>
    </div>
  );
}
