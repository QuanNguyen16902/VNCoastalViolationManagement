import { TextField } from "@mui/material";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useConfig } from "./ConfigProvider";

const MailTemplate = () => {
  const { config, loadConfig, updateConfig } = useConfig();

  return (
    <>
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Email Subject:</label>
        <div className="col-sm-10">
          <TextField
            fullWidth
            label="Violation Confirmation Subject"
            name="mailViolationConfirmSubject"
            variant="outlined"
            required
            value={config.mailViolationConfirmSubject}
            onChange={(e) =>
              updateConfig("mailViolationConfirmSubject", e.target.value)
            }
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Email Content:</label>
        <div className="col-sm-10">
          <ReactQuill
            theme="snow"
            value={config.mailViolationConfirmContent}
            onChange={(value) =>
              updateConfig("mailViolationConfirmContent", value)
            }
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default MailTemplate;
