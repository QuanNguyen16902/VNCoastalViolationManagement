import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
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
  const [imagePreview, setImagePreview] = useState(null);
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
      console.log("data: " + userData);
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
            enabled: false,
            photo: null, // Thêm trường photo
            profile: {
              department: "",
              fullName: "",
              position: "",
              rank: "",
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
            <Form id="add-user-form">
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* Left Side Fields */}
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="profile.fullName"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                  />

                  <Field
                    as={TextField}
                    name="profile.department"
                    label="Đơn vị"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                  />

                  <Field
                    as={TextField}
                    name="profile.position"
                    label="Chức vụ"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                  />

                  <Field
                    as={TextField}
                    name="profile.rank"
                    label="Cấp bậc"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                  />
                </Grid>

                {/* Divider */}
                <Grid item xs={12} md={1}>
                  <Divider orientation="vertical" flexItem />
                </Grid>

                {/* Right Side Fields */}
                <Grid item xs={12} md={5}>
                  <Field
                    as={TextField}
                    name="username"
                    label="Username"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                  />

                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                    type="email"
                  />

                  <Field
                    as={TextField}
                    name="password"
                    label="Mật khẩu"
                    // value={values.password}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                    type="password"
                  />

                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Tình trạng</InputLabel>
                    <Select
                      name="enabled"
                      label="Tình trạng"
                      value={values.enabled} // Set value from Formik's state
                      onChange={handleChange} // Use Formik's handleChange to update state
                      onBlur={handleBlur} // Optional: Use handleBlur for validation
                    >
                      <MenuItem value={true}>Kích hoạt</MenuItem>
                      <MenuItem value={false}>Không kích hoạt</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Roles Selection */}
                  <FormControl component="fieldset" margin="normal">
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
                </Grid>
              </Grid>
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
