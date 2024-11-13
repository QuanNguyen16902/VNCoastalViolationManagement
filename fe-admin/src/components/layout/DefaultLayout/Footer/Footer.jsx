import React from "react";
import { useConfig } from "../../../pages/SettingPage/ConfigProvider";
import "./footer.css";
export default function Footer() {
  const { config } = useConfig();

  return (
    <footer
      id="footer"
      className="footer fixed-bottom d-flex align-items-center"
      style={{ backgroundColor: "#E4EBF3" }}
    >
      {config.footerText} &copy; {new Date().getFullYear()}
    </footer>
  );
}
