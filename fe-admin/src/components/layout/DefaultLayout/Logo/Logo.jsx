import React from "react";
import { useConfig } from "../../../pages/SettingPage/ConfigProvider";
import "./logo.css";
function Logo() {
  const { config } = useConfig();
  const handleToggleSidebar = () => {
    document.body.classList.toggle("toggle-sidebar");
  };
  return (
    <div className="d-flex align-items-center justify-content-between ms-1 me-2">
      <a href="/" className="logo d-flex align-items-center">
        <div
          className="home-icon me-2"
          style={{
            backgroundImage: `url(${config.logoUrl})`,
          }}
        ></div>

        <div class="header-top">
          <div class="header-top1">{config.siteName}</div>
          <div class="clearfix"></div>
          <div class="header-top2 mt-1">{config.subSiteName}</div>
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
