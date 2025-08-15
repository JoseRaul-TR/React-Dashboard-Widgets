import React from "react";

export default function Footer() {
  // Get the current year
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-center p-1 bg-block/50 backdrop-blur-md rounded-x1 shadow-lg transition-all duration-300 ease-in-out">
      <p className="text-center">
        &copy; {currentYear} José Raúl Tenza Ramírez
        <br />
        All rights reserved
      </p>
    </footer>
  );
}
