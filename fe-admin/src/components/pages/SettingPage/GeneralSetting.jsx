import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React from "react";
import { useConfig } from "./ConfigProvider";

export default function GeneralSettings() {
  const { config, loadConfig, updateConfig } = useConfig();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Site Name"
          name="siteName"
          variant="outlined"
          required
          value={config.siteName}
          onChange={(e) => updateConfig("siteName", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Sub Site Name"
          name="subSiteName"
          variant="outlined"
          required
          value={config.subSiteName}
          onChange={(e) => updateConfig("subSiteName", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Footer Text"
          name="footerText"
          variant="outlined"
          required
          value={config.footerText}
          onChange={(e) => updateConfig("footerText", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Logo URL"
          name="logoUrl"
          variant="outlined"
          required
          value={config.logoUrl}
          onChange={(e) => updateConfig("logoUrl", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website Description"
          name="websiteDescription"
          variant="outlined"
          multiline
          rows={3}
          value={config.websiteDescription || ""}
          onChange={(e) => updateConfig("websiteDescription", e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
