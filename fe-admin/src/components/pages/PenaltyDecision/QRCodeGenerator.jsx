import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import apiConfig from "../../../utils/config";
const ReportGeneratorModal = ({ open, onClose, id }) => {
  const [format, setFormat] = useState("pdf");
  const [qrCode, setQrCode] = useState(null);

  // Hàm gọi API để tạo mã QR
  const generateQRCode = async () => {
    try {
      const response = await axios.get(
        `${apiConfig.apiBaseUrl}auth/generate-qr/${format}/${id}`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setQrCode(imageUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  // Hàm gọi API để mở báo cáo PDF
  const viewReport = () => {
    window.open(
      `${apiConfig.apiBaseUrl}auth/view-report?id=${id}&format=${format}`,
      "_blank"
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generate Report & QR Code</DialogTitle>
      <DialogContent>
        <TextField
          label="Report ID"
          type="number"
          value={id}
          fullWidth
          margin="normal"
          disabled // ID không thay đổi
        />
        <Select
          label="Format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="pdf">PDF</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={viewReport} color="primary">
          Xem quyết định xử phạt
        </Button>

        <Button onClick={generateQRCode} color="primary">
          Tạo QR Code
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
      {qrCode && (
        <DialogContent>
          <h2>QR Code:</h2>
          <img src={qrCode} alt="QR Code" style={{ width: "50%" }} />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ReportGeneratorModal;
