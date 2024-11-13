import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import violationInfoService from "../../../../service/violation-info.service";
// Schema xác thực
const validationSchema = Yup.object({
  soHieuTau: Yup.string().required("Số hiệu tàu là bắt buộc"),
  diaDiem: Yup.string().required("Địa điểm là bắt buộc"),
  tongDungTich: Yup.string().required("Tổng dung tích là bắt buộc"),
  thoiGianViPham: Yup.string().required("Thời gian vi phạm là bắt buộc"),
  congSuat: Yup.string().required("Công suất là bắt buộc"),
  haiTrinhCapPhep: Yup.string().required("Hải trình cấp phép là bắt buộc"),
  toaDoX: Yup.date().required("Tọa độ Y là bắt buộc"),
  toaDoY: Yup.string().required("Tọa độ X là bắt buộc"),
  haiTrinhThucTe: Yup.string().required("Hải trình thực tế là bắt buộc"),
  soLanViPham: Yup.number()
    .typeError("Số lần vi phạm phải là số")
    .min(0, "Số lần vi phạm không hợp lệ"),
});
const years = [];
for (let year = 1920; year <= 2024; year++) {
  years.push(year);
}
function EditViolationShipDialog({ open, onClose, onEditShip, shipId }) {
  const [ship, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (shipId) {
        try {
          const response = await violationInfoService.getViolationShip(shipId);
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
  }, [shipId]);

  const handleSubmit = async (values) => {
    console.log("Submit button clicked");
    try {
      const shipData = { ...values };
      const response = await violationInfoService.editViolationShip(
        shipId,
        shipData
      );
      console.log("Response Data:", response.data);
      toast.success("Cập nhật thông tin tàu vi phạm thành công!");
      onEditShip();
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
      aria-labelledby="edit-ship-dialog-title"
    >
      <DialogTitle id="edit-ship-dialog-title">
        Chỉnh sửa Thông tin tàu vi phạm (ID: {shipId})
      </DialogTitle>
      <DialogContent>
        {ship ? (
          <Formik
            initialValues={{
              soHieuTau: ship.soHieuTau || "",
              diaDiem: ship.diaDiem || "",
              thoiGianViPham: ship.thoiGianViPham
                ? new Date(ship.thoiGianViPham).toISOString().slice(0, 16)
                : "",
              tongDungTich: ship.tongDungTich || "",
              congSuat: ship.congSuat || "",
              haiTrinhCapPhep: ship.haiTrinhCapPhep || "",
              toaDoX: ship.toaDoX || "",
              toaDoY: ship.toaDoY || "",
              haiTrinhThucTe: ship.haiTrinhThucTe || "",
              soLanViPham: ship.soLanViPham || 0,
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
                      name="soHieuTau"
                      label="Số hiệu tàu"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.soHieuTau && Boolean(errors.soHieuTau)}
                      helperText={touched.soHieuTau && errors.soHieuTau}
                    />

                    <Field
                      as={TextField}
                      name="diaDiem"
                      label="Địa điểm"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.soHieuTau && Boolean(errors.soHieuTau)}
                      helperText={touched.soHieuTau && errors.soHieuTau}
                    />

                    <Field
                      as={TextField}
                      name="thoiGianViPham"
                      label="Thời gian vi phạm"
                      type="datetime-local"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={
                        touched.thoiGianViPham && Boolean(errors.thoiGianViPham)
                      }
                      helperText={
                        touched.thoiGianViPham && errors.thoiGianViPham
                      }
                    />

                    <Field
                      as={TextField}
                      name="tongDungTich"
                      label="Tổng dung tích"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={
                        touched.tongDungTich && Boolean(errors.tongDungTich)
                      }
                      helperText={touched.tongDungTich && errors.tongDungTich}
                    />

                    <Field
                      as={TextField}
                      name="congSuat"
                      label="Công suất máy chính"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.congSuat && Boolean(errors.congSuat)}
                      helperText={touched.congSuat && errors.congSuat}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="toaDoX"
                      label="Tọa độ X"
                      type="number"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={touched.toaDoX && Boolean(errors.toaDoX)}
                      helperText={touched.toaDoX && errors.toaDoX}
                    />

                    <Field
                      as={TextField}
                      name="toaDoY"
                      label="Tọa độ Y"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.toaDoX && Boolean(errors.toaDoX)}
                      helperText={touched.toaDoX && errors.toaDoX}
                    />
                    <Field
                      as={TextField}
                      name="haiTrinhCapPhep"
                      label="Hải trình cấp phép"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={touched.toaDoX && Boolean(errors.toaDoX)}
                      helperText={touched.toaDoX && errors.toaDoX}
                    />

                    <Field
                      as={TextField}
                      name="haiTrinhThucTe"
                      label="Hải trình thực tế"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={
                        touched.haiTrinhThucTe && Boolean(errors.haiTrinhThucTe)
                      }
                      helperText={
                        touched.haiTrinhThucTe && errors.haiTrinhThucTe
                      }
                    />

                    {/* <Field
                      as={TextField}
                      name="soLanViPham"
                      label="Số lần vi phạm"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.soLanViPham && Boolean(errors.soLanViPham)}
                      helperText={touched.soLanViPham && errors.soLanViPham}
                    /> */}
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

export default EditViolationShipDialog;
