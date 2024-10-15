import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React from "react";

export default function GeneralSettings() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Site Name"
          name="SITE_NAME"
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Copyright"
          name="COPYRIGHT"
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Logo URL"
          name="LOGO_URL"
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website Description"
          name="SITE_DESC"
          variant="outlined"
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  );
}
