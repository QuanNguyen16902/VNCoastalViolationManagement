import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import * as React from "react";
import { ConfigProvider } from "./ConfigProvider";
import GeneralSettings from "./GeneralSetting";
import MailSettings from "./MailSetting";
import SaveButton from "./SaveButton";
import SecuritySettings from "./SecuritySetting";
import UISettings from "./UISetting";

export default function Settings() {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ConfigProvider>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          typography: "body1",
          backgroundColor: "#FFFFFFFF",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          p: 3,
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="General" value="1" />
              <Tab label="Security Setting" value="2" />
              <Tab label="UI Settings" value="3" />
              <Tab label="Mail Settings" value="4" />
            </TabList>
          </Box>

          {/* General Settings */}
          <TabPanel value="1">
            <GeneralSettings />
          </TabPanel>

          {/* Security Settings */}
          <TabPanel value="2">
            <SecuritySettings />
          </TabPanel>

          {/* UI Settings */}
          <TabPanel value="3">
            <UISettings />
          </TabPanel>
          <TabPanel value="4">
            <MailSettings />
          </TabPanel>
        </TabContext>

        {/* Save Button */}
        <SaveButton />
      </Box>
    </ConfigProvider>
  );
}
