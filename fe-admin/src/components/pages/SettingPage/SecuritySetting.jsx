// SecuritySettings.jsx
import { Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useConfig } from "./ConfigProvider"; // Import context

export default function SecuritySettings() {
  const { config, loadConfig, updateConfig } = useConfig();
  useEffect(() => {
    loadConfig();
  }, []);
  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Login Attempts"
            name="maxLoginAttempts"
            variant="outlined"
            type="number"
            required
            value={config.maxLoginAttempts}
            onChange={(e) => updateConfig("maxLoginAttempts", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Token Expiry (giờ)"
            name="tokenExpiry"
            variant="outlined"
            type="number"
            value={config.tokenExpiry}
            onChange={(e) => updateConfig("tokenExpiry", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Token Secret"
            name="tokenSecret"
            variant="outlined"
            type="text"
            value={config.tokenSecret}
            onChange={(e) => updateConfig("tokenSecret", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Session Timeout"
            name="sessionTimeout"
            variant="outlined"
            type="number"
            value={config.sessionTimeout}
            onChange={(e) => updateConfig("sessionTimeout", e.target.value)}
          />
        </Grid>
      </Grid>
    </form>
  );
}
