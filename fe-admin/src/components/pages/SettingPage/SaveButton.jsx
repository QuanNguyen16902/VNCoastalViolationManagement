// SaveButton.jsx
import { Box, Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import authHeader from "../../../service/auth-header";
import { useConfig } from "./ConfigProvider"; // Import context

const SaveButton = () => {
  const { config, loadConfig } = useConfig();

  const handleSubmit = async () => {
    const configData = {
      tokenExpiry: config.tokenExpiry,
      tokenSecret: config.tokenSecret,

      mailHost: config.mailHost,
      mailPort: config.mailPort,
      mailUsername: config.mailUsername,
      mailPassword: config.mailPassword,
      smtpAuth: config.smtpAuth,
      smtpStartTls: config.smtpStartTls,
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/api/admin/settings/jwt-config",
        configData,
        { headers: authHeader() }
      );
      console.log("Response from server:", response.data);
      toast.success("Cập nhật thành công");
      await loadConfig();
      // Xử lý phản hồi thành công tại đây
    } catch (error) {
      console.error("Error while submitting data:", error);
      // Xử lý lỗi tại đây
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        size="large"
      >
        Save
      </Button>
    </Box>
  );
};

export default SaveButton;
