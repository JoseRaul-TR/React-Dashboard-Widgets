import React from "react";

export default function Footer() {
  // Get the current year
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>
        &copy; {currentYear} José Raúl Tenza Ramírez
        <br />
        All rights reserved
      </p>
    </footer>
  );
}
