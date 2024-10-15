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
import RoleService from "../../../service/role.service";
import userService from "../../../service/user.service";

const validationSchema = Yup.object({
  username: Yup.string().required("Tên người dùng bắt buộc"),
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Email bắt buộc"),
  password: Yup.string().required("Mật khẩu bắt buộc"),
  enabled: Yup.boolean().required("Trạng thái bắt buộc"),
  // enabled: Yup.boolean().oneOf([true, false], 'Invalid enabled').required('enabled is required'),
});

function AddUserModal({ open, onClose, onAddUser }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RoleService.getRoles();
        setRoles(response.data);
      } catch (error) {
        console.error("Lỗi truy xuất quyền", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const userData = {
        ...values,
        // rolesName: roles.filter(role => values.roles.includes(role.id)).map(role => role.name)
      };
      await userService.addUser(userData);
      toast.success("Người dùng đã được thêm thành công!");
      onAddUser();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data;
      console.log(error.response);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-user-dialog-title"
    >
      <DialogTitle id="add-user-dialog-title">Thêm Người Dùng</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            roles: [],
            enabled: true,
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
            <Form id="add-user-form">
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
                  <MenuItem value={false}>Không kích hoạt</MenuItem>
                </Select>
              </FormControl>
              <FormControl component="fieldset" margin="normal">
                {/* <FormLabel>Chọn quyền</FormLabel> */}
                <FormGroup>
                  {roles.map((role) => (
                    <FormControlLabel
                      key={role.id}
                      control={
                        <Checkbox
                          checked={values.roles.includes(role.id)}
                          onChange={(event) => {
                            const updatedRoles = event.target.checked
                              ? [...values.roles, role.id]
                              : values.roles.filter((id) => id !== role.id);
                            setFieldValue("roles", updatedRoles);
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="submit" form="add-user-form" autoFocus>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUserModal;
