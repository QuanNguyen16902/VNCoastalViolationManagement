import React from "react";
import "./footer.css";
export default function Footer() {
  return (
    <div>
      <footer
        id="footer"
        className="footer fixed-bottom d-flex align-items-center"
        style={{ backgroundColor: "#E4EBF3" }}
      >
        &copy; {new Date().getFullYear()} QuanNguyen.
        {/* All rights reserved. */}
      </footer>
    </div>
  );
}
