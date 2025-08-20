import React, { useState, useCallback } from "react";

/**
 * Calculator.jsx - A self-contained calculator widget component.
 *
 * This component handles all the state and logic for a basic calculator.
 * It is designed to be easily integrated into a larger dashboard or application.
 */
export default function CalculatorWidget() {
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  // Define the core calculation logic
  const calculate = (prev, next, op) => {
    switch (op) {
      case "+":
        return prev + next;
      case "-":
        return prev - next;
      case "*":
        return prev * next;
      case "/":
        // Handle division by zero
        if (next === 0) return "Error";
        return prev / next;
      default:
        return next;
    }
  };

  // Handles all button clicks, delegating to specific functions based on button type
  const handleButtonClick = useCallback(
    (type, value) => {
      switch (type) {
        case "number":
          // If we are waiting for a new value, start a new number.
          // Otherwise, append the digit, ensuring no double decimals or leading zeros.
          if (waitingForNewValue) {
            setDisplayValue(String(value));
            setWaitingForNewValue(false);
          } else {
            // Prevent multiple decimals.
            if (value === "." && displayValue.includes(".")) {
              return;
            }
            // Avoid leading zeros unless it's a decimal.
            setDisplayValue((prev) =>
              prev === "0" && value !== "." ? String(value) : prev + value
            );
          }
          break;

        case "operator":
          // If an operator is already active, perform the previous calculation.
          if (operator && previousValue !== null) {
            const result = calculate(
              previousValue,
              parseFloat(displayValue),
              operator
            );
            setPreviousValue(result);
            setDisplayValue(String(result));
          } else {
            // Otherwise, set the current display value as the previous valus for the next calculation.
            setPreviousValue(parseFloat(displayValue));
          }
          setOperator(value);
          setWaitingForNewValue(true);
          break;

        case "equals":
          // Perform the final calculation
          if (operator && previousValue !== null) {
            const result = calculate(
              previousValue,
              parseFloat(displayValue),
              operator
            );
            setDisplayValue(String(result));
            setPreviousValue(null);
            setOperator(null);
            setWaitingForNewValue(false);
          }
          break;

        case "clear":
          // Reset all state
          setDisplayValue("0");
          setOperator(null);
          setPreviousValue(null);
          setWaitingForNewValue(false);
          break;

        case "sign":
          setDisplayValue((prev) => (parseFloat(prev) * -1).toString());
          break;

        case "percentage":
          setDisplayValue((prev) => (parseFloat(prev) / 100).toString());
          break;

        default:
          break;
      }
    },
    [displayValue, operator, previousValue, waitingForNewValue]
  );

  // Centralized button configuration
  const buttons = [
    { type: "clear", value: "C", className: "bg-gray-300 text-gray-800" },
    { type: "sign", value: "+/-", className: "bg-gray-300 text-gray-800" },
    { type: "percentage", value: "%", className: "bg-gray-300 text-gray-800" },
    { type: "operator", value: "/", className: "bg-amber-500 text-white" },
    { type: "number", value: "7", className: "bg-gray-600 text-white" },
    { type: "number", value: "8", className: "bg-gray-600 text-white" },
    { type: "number", value: "9", className: "bg-gray-600 text-white" },
    { type: "operator", value: "*", className: "bg-amber-500 text-white" },
    { type: "number", value: "4", className: "bg-gray-600 text-white" },
    { type: "number", value: "5", className: "bg-gray-600 text-white" },
    { type: "number", value: "6", className: "bg-gray-600 text-white" },
    { type: "operator", value: "-", className: "bg-amber-500 text-white" },
    { type: "number", value: "1", className: "bg-gray-600 text-white" },
    { type: "number", value: "2", className: "bg-gray-600 text-white" },
    { type: "number", value: "3", className: "bg-gray-600 text-white" },
    { type: "operator", value: "+", className: "bg-amber-500 text-white" },
    {
      type: "number",
      value: "0",
      className: "bg-gray-600 text-white col-span-2",
    },
    { type: "number", value: ".", className: "bg-gray-600 text-white" },
    { type: "equals", value: "=", className: "bg-amber-500 text-white" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-2xl">
      {/* Calculator Display */}
      <div className="w-full h-20 bg-gray-900 rounded-xl mb-4 flex items-center justify-end p-4 shadow-inner">
        <span className="text-white text-5xl font-light overflow-hidden whitespace-nowrap">
          {displayValue}
        </span>
      </div>
      {/* Calculator Buttons Grid */}
      <div className="grid grid-cols-4 gap-4 w-full">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={`col-span-1 p-4 rounded-xl text-2xl font-semibold shadow-lg transition-transform transform hover:scale-105 active:scale-95 ${btn.className}`}
            onClick={() => handleButtonClick(btn.type, btn.value)}
          >
            {btn.value}
          </button>
        ))}
      </div>
    </div>
  );
}
