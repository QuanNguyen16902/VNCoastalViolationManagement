// ConfigContext.js
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import authHeader from "../../../service/auth-header";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    tokenExpiry: "",
    tokenSecret: "",

    // UI Settings
    theme: "",
    // Mail Settings
    mailHost: "",
    mailPort: "",
    mailUsername: "",
    mailPassword: "",
    smtpAuth: "",
    smtpStartTls: "",
  });
  // Hàm để tải cấu hình từ server
  const loadConfig = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/settings/jwt-config",
        { headers: authHeader() }
      );
      setConfig(response.data);
    } catch (error) {
      console.error("Error loading config:", error);
    }
  };

  // Hàm để cập nhật cấu hình tại client
  const updateConfig = (key, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  // Tải cấu hình khi component được mount
  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
