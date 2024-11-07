import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import roleService from "../../../service/role.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Chưa điền tên quyền"),
  link: Yup.string().required("Chưa điền link"),
  description: Yup.string().required("Chưa điền mô tả"),
});

function AddRoleDialog({ open, onClose, onAddRole }) {
  const handleSubmit = async (values) => {
    try {
      const response = await roleService.addRole(values);
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        const role = response.data; // Lấy role từ phản hồi
        toast.success(`Thêm quyền thành công: ${role.name}`);
        onAddRole(); // Cập nhật lại danh sách quyền nếu cần
        onClose(); // Đóng dialog
      } else {
        throw new Error("Thêm quyền thất bại");
      }
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi!";

      if (error.response) {
        errorMessage = error.response.data || "Có lỗi xảy ra!";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-role-dialog-title"
    >
      <DialogTitle id="add-role-dialog-title">Thêm Quyền</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            name: "",
            link: "",
            description: "",
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
            <Form id="add-role-form">
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

              <TextField
                id="outlined-multiline-static"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="submit" form="add-role-form" autoFocus>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRoleDialog;
