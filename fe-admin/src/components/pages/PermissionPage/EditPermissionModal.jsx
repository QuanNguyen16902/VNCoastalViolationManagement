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
import permissionService from "../../../service/permission.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Chưa điền tên quyền"),
  description: Yup.string().required("Chưa điền mô tả"),
});

function EditPermissionModal({
  open,
  onClose,
  onEditPermission,
  permissionId,
}) {
  const [permission, setRole] = useState(null);

  useEffect(() => {
    if (permissionId) {
      const fetchPermission = async () => {
        try {
          const response = await permissionService.getPermission(permissionId);
          setRole(response.data);
        } catch (error) {
          console.error("Lỗi khi tải quyền", error);
          toast.error("Không thể tải dữ liệu quyền");
        }
      };
      fetchPermission();
    }
  }, [permissionId]);

  const handleSubmit = async (values) => {
    try {
      const permissionData = {
        ...values,
      };
      await permissionService.editPermission(permissionId, permissionData);
      toast.success("Quyền đã được cập nhật thành công!");
      onEditPermission();
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
      aria-labelledby="edit-permission-dialog-title"
    >
      <DialogTitle id="edit-permission-dialog-title">
        Chỉnh sửa phân Quyền
      </DialogTitle>
      <DialogContent>
        {permission ? (
          <Formik
            initialValues={{
              name: permission.name || "",
              description: permission.description || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, errors, touched }) => (
              <Form id="form-edit-permission">
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
          form="form-edit-permission"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPermissionModal;
