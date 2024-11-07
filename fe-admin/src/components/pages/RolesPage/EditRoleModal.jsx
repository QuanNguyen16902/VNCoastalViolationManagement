import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import permissionService from "../../../service/permission.service";
import roleService from "../../../service/role.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Chưa điền tên quyền"),
  link: Yup.string().required("Chưa điền link"),
  description: Yup.string().required("Chưa điền mô tả"),
});

function EditRoleDialog({ open, onClose, onEditRole, roleId }) {
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const responseData = await permissionService.getListPermissions();
        setPermissions(responseData.data);
        console.log(responseData);
      } catch (e) {
        toast.error(e);
      }
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (roleId) {
      const fetchRole = async () => {
        try {
          const response = await roleService.getRole(roleId);
          if (isMounted) {
            setRole(response.data);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Lỗi khi tải quyền", error);
            toast.error("Không thể tải dữ liệu quyền");
          }
        }
      };

      fetchRole();
    }
    // Cleanup function để đảm bảo chỉ gọi khi component được mounted
    return () => {
      isMounted = false;
    };
  }, [roleId]);

  const handleSubmit = async (values) => {
    try {
      const permissionsData = values.permissions.map((permissionId) => {
        const permission = permissions.find((perm) => perm.id === permissionId);
        if (!permission) {
          throw new Error(`Permission with ID ${permissionId} not found`);
        }
        return permission;
      });

      const roleData = {
        ...values,
        permissions: permissionsData,
      };
      console.log(roleData);
      await roleService.editRole(roleId, roleData);
      toast.success("Quyền đã được cập nhật thành công!");
      onEditRole();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Có lỗi xảy ra";
      console.error("Error updating role:", error); // Log the error for debugging
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-role-dialog-title"
    >
      <DialogTitle id="edit-role-dialog-title">Chỉnh sửa Quyền</DialogTitle>
      <DialogContent>
        {role ? (
          <Formik
            initialValues={{
              name: role.name || "",
              link: role.link || "",
              description: role.description || "",
              permissions: role.permissions.map((role) => role.id) || [],
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
              <Form id="form-edit-role">
                <Field
                  as={TextField}
                  name="name"
                  label="Tên quyền"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="link"
                  label="Link"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.link && Boolean(errors.link)}
                  helperText={touched.link && errors.link}
                />

                <Field
                  as={TextField}
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="permissions-label">Permission</InputLabel>
                  <Select
                    label="Permissions"
                    multiple
                    value={values.permissions}
                    onChange={(event) =>
                      setFieldValue("permissions", event.target.value)
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => {
                          const permission = permissions.find(
                            (permission) => permission.id === id
                          );
                          return permission ? (
                            <Chip key={id} label={permission.name} />
                          ) : null;
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 200 },
                      },
                    }}
                  >
                    {permissions.map((permission) => (
                      <MenuItem key={permission.id} value={permission.id}>
                        <Checkbox
                          checked={values.permissions.includes(permission.id)}
                        />
                        {permission.name}
                      </MenuItem>
                    ))}
                  </Select>
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
          form="form-edit-role"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRoleDialog;
