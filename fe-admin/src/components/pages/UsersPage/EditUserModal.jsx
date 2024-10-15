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
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import roleService from "../../../service/role.service";
import userService from "../../../service/user.service";

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
      await userService.editUser(userId, userData);
      toast.success("Người dùng đã được cập nhật thành công!");
      onEditUser();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data;
      console.log(error.response);
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
                                updatedRoles = [...values.roles, role.id]; // Thêm role nếu checked
                              } else {
                                updatedRoles = values.roles.filter(
                                  (id) => id !== role.id
                                ); // Loại bỏ role nếu unchecked
                              }
                              setFieldValue("roles", updatedRoles); // Cập nhật lại roles
                            }}
                          />
                        }
                        label={role.name}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
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
