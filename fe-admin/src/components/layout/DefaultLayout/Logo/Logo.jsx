import React from "react";
import "./logo.css";
function Logo() {
  const handleToggleSidebar = () => {
    document.body.classList.toggle("toggle-sidebar");
  };
  return (
    <div className="d-flex align-items-center justify-content-between ms-1 me-2">
      <a href="/" className="logo d-flex align-items-center">
        <div className="home-icon me-2"></div>

        <div class="header-top">
          <div class="header-top1">QUẢN LÝ - XỬ LÝ VI PHẠM HÀNH CHÍNH</div>
          <div class="clearfix"></div>
          <div class="header-top2 mt-1">TRÊN VÙNG BIỂN VIỆT NAM</div>
        </div>
      </a>
      <i
        className="bi bi-list toggle-sidebar-btn"
        onClick={handleToggleSidebar}
      ></i>
    </div>
  );
}

export default Logo;
