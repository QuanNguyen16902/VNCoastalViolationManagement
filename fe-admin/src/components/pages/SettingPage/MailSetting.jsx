// src/components/MailSettings.jsx
import { Grid, TextField } from "@mui/material";
import React from "react";
import { useConfig } from "./ConfigProvider";

export default function MailSettings() {
  const { config, updateConfig } = useConfig();

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mail Host"
            name="mailHost"
            variant="outlined"
            type="text"
            required
            value={config.mailHost}
            onChange={(e) => updateConfig("mailHost", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mail Port"
            name="mailPort"
            variant="outlined"
            type="number"
            required
            value={config.mailPort}
            onChange={(e) => updateConfig("mailPort", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mail Username"
            name="mailUsername"
            variant="outlined"
            type="text"
            required
            value={config.mailUsername}
            onChange={(e) => updateConfig("mailUsername", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mail Password"
            name="mailPassword"
            variant="outlined"
            type="text"
            required
            value={config.mailPassword}
            onChange={(e) => updateConfig("mailPassword", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP Authentication"
            name="smtpAuth"
            variant="outlined"
            type="text"
            value={config.smtpAuth}
            onChange={(e) => updateConfig("smtpAuth", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP StartTLS"
            name="smtpStartTls"
            variant="outlined"
            type="text"
            value={config.smtpStartTls}
            onChange={(e) => updateConfig("smtpStartTls", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mail From"
            name="mailFrom"
            variant="outlined"
            type="text"
            value={config.mailFrom}
            onChange={(e) => updateConfig("mailFrom", e.target.value)}
          />
        </Grid>
      </Grid>
    </form>
  );
}
