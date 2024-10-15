import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

export default function UISettings() {
  const [themeColor, setThemeColor] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("");

  const handleChange = (event) => {
    setThemeColor(event.target.value);
  };
  const handleLanguage = (event) => {
    setDefaultLanguage(event.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Items Per Page"
          name="ITEMS_PER_PAGE"
          variant="outlined"
          type="number"
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="default-language-label">Default Language</InputLabel>
          <Select
            labelId="default-language-label"
            value={defaultLanguage}
            onChange={handleLanguage}
            label="Default Language"
            fullWidth
          >
            <MenuItem value="vietnamese">Vietnamese</MenuItem>
            <MenuItem value="english">English</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="theme-color-label">Theme Color</InputLabel>
          <Select
            labelId="theme-color-label"
            value={themeColor}
            onChange={handleChange}
            label="Theme Color"
            fullWidth
          >
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="light">Light</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
