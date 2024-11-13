import { Avatar, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/auth";
import apiConfig from "../../../utils/config";
const AvatarUpload = ({ userId, onAvatarChange, initialPhoto }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(initialPhoto); // Set initial preview to initialPhoto

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // Set preview to new file URL
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const response = await axios.post(
        `${apiConfig.apiBaseUrl}users/${userId}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + getToken(),
          },
        }
      );
      const newImageUrl = response.data.photoUrl; // Assume response returns updated URL
      onAvatarChange(newImageUrl); // Update parent component with new avatar URL
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar", error);
      toast.error("Failed to update avatar.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h6">Ảnh cá nhân</Typography>
      <Avatar
        src={preview || "/path/to/default-avatar.jpg"}
        alt="Avatar Preview"
        sx={{ width: 100, height: 100, margin: "0 auto" }}
      />
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile}
        sx={{ marginTop: 2 }}
      >
        Upload
      </Button>
    </div>
  );
};
export default AvatarUpload;
