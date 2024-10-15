import React from "react";
import "./main.css";
function Main({ children }) {
  return (
    <div className="main mb-5" id="main">
      {children}
    </div>
  );
}

export default Main;
