import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import roleService from "../../../service/role.service";
import userService from "../../../service/user.service";
import AvatarUpload from "./AvatarUpload";

const validationSchema = Yup.object({
  username: Yup.string().required("Tên người dùng bắt buộc"),
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Email bắt buộc"),
  password: Yup.string().required("Mật khẩu bắt buộc"),
  enabled: Yup.boolean().required("Trạng thái bắt buộc"),
});

function EditUserDialog({ open, onClose, onEditUser, userId }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getRoles();
        setRoles(response.data);
      } catch (error) {
        console.error("Lỗi truy xuất quyền", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    let isMounted = true; // Khai báo biến cờ
    const fetchUser = async () => {
      if (userId) {
        try {
          const response = await userService.getUser(userId);
          if (isMounted) {
            setUser(response.data);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Lỗi khi tải người dùng", error);
            toast.error("Không thể tải dữ liệu người dùng");
          }
        }
      }
    };
    fetchUser();
    return () => {
      isMounted = false; // Đặt cờ là false khi component unmount
    };
  }, [userId]);

  const handleSubmit = async (values) => {
    try {
      const userData = {
        ...values,
        // rolesName: roles.filter(role => values.roles.includes(role.id)).map(role => role.name)
      };
      const response = await userService.editUser(userId, userData);
      console.log(response.data);
      console.log(values);
      toast.success("Người dùng đã được cập nhật thành công!");
      onEditUser();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data;
      console.log(error.response.data);
      toast.error(errorMessage || "Cập nhật thất bại!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-user-dialog-title"
    >
      <DialogTitle id="edit-user-dialog-title">
        Chỉnh sửa Người Dùng
      </DialogTitle>
      <DialogContent>
        {user ? (
          <Formik
            initialValues={{
              username: user.username || "",
              email: user.email || "",
              password: user.password || "",
              roles: user.roles.map((role) => role.id) || [],
              enabled: user.enabled !== undefined ? user.enabled : true,
              profile: {
                fullName: user.profile?.fullName || "",
                position: user.profile?.position || "",
                department: user.profile?.department || "",
                rank: user.profile?.rank || "",
                photo: user.profile?.photo || "",
              },
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              errors,
              touched,
            }) => (
              <Form noValidate id="form-edit">
                <Grid container spacing={3} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Thông tin cá nhân
                    </Typography>

                    <Field
                      as={TextField}
                      name="profile.fullName"
                      label="Full Name"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <Field
                      as={TextField}
                      name="profile.department"
                      label="Đơn vị"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <Field
                      as={TextField}
                      name="profile.position"
                      label="Chức vụ"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <Field
                      as={TextField}
                      name="profile.rank"
                      label="Cấp bậc"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <AvatarUpload
                      userId={userId} // Ensure userId is correctly passed down
                      initialPhoto={user.profile?.photo} // Pass the initial photo URL
                      onAvatarChange={(newImage) => {
                        setImagePreview(newImage); // Update the local state with the new preview URL
                        setFieldValue("profile.photo", newImage); // Bind the selected file to Formik
                      }}
                    />
                  </Grid>

                  {/* Right Column - Account Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Thông tin tài khoản
                    </Typography>

                    <Field
                      as={TextField}
                      name="username"
                      label="Username"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />

                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      type="email"
                    />

                    <Field
                      as={TextField}
                      name="password"
                      label="Mật khẩu"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      type="password"
                    />

                    <FormControl fullWidth margin="normal" variant="outlined">
                      <InputLabel>Tình trạng</InputLabel>
                      <Select
                        name="enabled"
                        value={values.enabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Tình trạng"
                      >
                        <MenuItem value={true}>Kích hoạt</MenuItem>
                        <MenuItem value={false}>Chưa kích hoạt</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl component="fieldset" margin="normal">
                      <Typography variant="subtitle1">Quyền</Typography>
                      <FormGroup>
                        {roles.map((role) => (
                          <FormControlLabel
                            key={role.id}
                            control={
                              <Checkbox
                                checked={values.roles.includes(role.id)}
                                onChange={(event) => {
                                  const isChecked = event.target.checked;
                                  let updatedRoles;
                                  if (isChecked) {
                                    updatedRoles = [...values.roles, role.id];
                                  } else {
                                    updatedRoles = values.roles.filter(
                                      (id) => id !== role.id
                                    );
                                  }
                                  setFieldValue("roles", updatedRoles);
                                }}
                              />
                            }
                            label={role.name}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        ) : (
          "Đang tải dữ liệu..."
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          form="form-edit"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserDialog;
