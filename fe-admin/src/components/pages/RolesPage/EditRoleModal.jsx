import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import roleService from "../../../service/role.service";

const validationSchema = Yup.object({
  name: Yup.string().required('Chưa điền tên quyền'),
  link: Yup.string().required('Chưa điền link'),
  description: Yup.string().required('Chưa điền mô tả'),
});

function EditRoleDialog({ open, onClose, onEditRole, roleId }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (roleId) {
      const fetchRole = async () => {
        try {
          const response = await roleService.getRole(roleId);
          setRole(response.data);
        } catch (error) {
          console.error("Lỗi khi tải quyền", error);
          toast.error("Không thể tải dữ liệu quyền");
        }
      };
      fetchRole();
    }
  }, [roleId]);

  const handleSubmit = async (values) => {
    try {
      const roleData = {
        ...values,
        };
      await roleService.editRole(roleId, roleData);
      toast.success("Quyền đã được cập nhật thành công!");
      onEditRole();
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
