import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
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
import diaphuongData from "../../../../data/diaphuong.json";
import violationPersonService from "../../../../service/violation-info.service";
// Schema xác thực
const validationSchema = Yup.object({
  nguoiViPham: Yup.string().required("Tên người vi phạm là bắt buộc"),
  namSinh: Yup.number()
    .typeError("Năm sinh phải là số")
    .min(1920, "Năm sinh không hợp lệ")
    .max(new Date().getFullYear(), "Năm sinh không hợp lệ")
    .required("Năm sinh là bắt buộc"),
  ngheNghiep: Yup.string().required("Nghề nghiệp là bắt buộc"),
  diaChi: Yup.string().required("Địa chỉ là bắt buộc"),
  canCuoc: Yup.string().required("Căn cước là bắt buộc"),
  noiCap: Yup.string().required("Nơi cấp là bắt buộc"),
  ngayCap: Yup.date().required("Ngày cấp là bắt buộc"),
  quocTich: Yup.string().required("Quốc tịch là bắt buộc"),
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Email là bắt buộc"),
  soLanViPham: Yup.number()
    .typeError("Số lần vi phạm phải là số")
    .min(0, "Số lần vi phạm không hợp lệ"),
});
const years = [];
for (let year = 1920; year <= 2024; year++) {
  years.push(year);
}
function EditViolationPersonDialog({ open, onClose, onEditUser, userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (userId) {
        try {
          const response = await violationPersonService.getViolationPerson(
            userId
          );
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
      isMounted = false;
    };
  }, [userId]);

  const handleSubmit = async (values) => {
    console.log("Submit button clicked");
    try {
      const userData = { ...values };
      const response = await violationPersonService.editViolationPerson(
        userId,
        userData
      );
      console.log("Response Data:", response.data);
      toast.success("Cập nhật thông tin người vi phạm thành công!");
      onEditUser();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data || "Cập nhật thất bại!";
      console.error("Error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-user-dialog-title"
    >
      <DialogTitle id="edit-user-dialog-title">
        Chỉnh sửa Thông tin người vi phạm (ID: {userId})
      </DialogTitle>
      <DialogContent>
        {user ? (
          <Formik
            initialValues={{
              nguoiViPham: user.nguoiViPham || "",
              namSinh: user.namSinh || "",
              ngheNghiep: user.ngheNghiep || "",
              diaChi: user.diaChi || "",
              canCuoc: user.canCuoc || "",
              noiCap: user.noiCap || "",
              ngayCap: user.ngayCap || "",
              quocTich: user.quocTich || "",
              email: user.email || "",
              soLanViPham: user.soLanViPham || 0,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, touched, errors }) => (
              <Form noValidate id="form-person-edit">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="nguoiViPham"
                      label="Người vi phạm"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.nguoiViPham && Boolean(errors.nguoiViPham)}
                      helperText={touched.nguoiViPham && errors.nguoiViPham}
                    />

                    <FormControl fullWidth margin="normal">
                      <InputLabel>Năm sinh</InputLabel>
                      <Field
                        as={Select}
                        name="namSinh"
                        label="Năm sinh"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {years.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>

                    <Field
                      as={TextField}
                      name="ngheNghiep"
                      label="Nghề nghiệp"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.ngheNghiep && Boolean(errors.ngheNghiep)}
                      helperText={touched.ngheNghiep && errors.ngheNghiep}
                    />

                    <Field
                      as={TextField}
                      name="diaChi"
                      label="Địa chỉ"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.diaChi && Boolean(errors.diaChi)}
                      helperText={touched.diaChi && errors.diaChi}
                    />

                    <Field
                      as={TextField}
                      name="canCuoc"
                      label="Căn cước"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.canCuoc && Boolean(errors.canCuoc)}
                      helperText={touched.canCuoc && errors.canCuoc}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Nơi cấp</InputLabel>
                      <Field
                        as={Select}
                        name="noiCap"
                        label="Nơi cấp"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {diaphuongData.map((locality) => (
                          <MenuItem
                            key={locality.stt}
                            value={locality.dia_phuong}
                          >
                            {locality.dia_phuong}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>

                    <Field
                      as={TextField}
                      name="ngayCap"
                      label="Ngày cấp"
                      type="date"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={touched.ngayCap && Boolean(errors.ngayCap)}
                      helperText={touched.ngayCap && errors.ngayCap}
                    />

                    <Field
                      as={TextField}
                      name="quocTich"
                      label="Quốc tịch"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.quocTich && Boolean(errors.quocTich)}
                      helperText={touched.quocTich && errors.quocTich}
                    />

                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />

                    <Field
                      as={TextField}
                      name="soLanViPham"
                      label="Số lần vi phạm"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.soLanViPham && Boolean(errors.soLanViPham)}
                      helperText={touched.soLanViPham && errors.soLanViPham}
                    />
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
          form="form-person-edit"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditViolationPersonDialog;
