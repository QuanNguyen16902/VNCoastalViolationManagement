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
import { default as violationInfoService } from "../../../../service/violation-info.service";
// Schema xác thực
const validationSchema = Yup.object({
  itemName: Yup.string().required("Tên tang vật là bắt buộc"),
  description: Yup.string().required("Mô tả là bắt buộc"),
  quantity: Yup.string().required("Số lượng là bắt buộc"),
  seizureDate: Yup.string().required("Ngày thu giữ là bắt buộc"),
  status: Yup.string().required("Tình trạng là bắt buộc"),
});

function EditViolationPersonDialog({
  open,
  onClose,
  onEditSeizedItem,
  seizedItemId,
}) {
  const [seizedItem, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (seizedItemId) {
        try {
          const response = await violationInfoService.getSeizedItem(
            seizedItemId
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
  }, [seizedItemId]);

  const handleSubmit = async (values) => {
    console.log("Submit button clicked");
    try {
      const seizedItemData = { ...values };
      const response = await violationInfoService.editSeizedItem(
        seizedItemId,
        seizedItemData
      );
      console.log("Response Data:", response.data);
      toast.success("Cập nhật thông tin người vi phạm thành công!");
      onEditSeizedItem();
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
      aria-labelledby="edit-seizedItem-dialog-title"
    >
      <DialogTitle id="edit-seizedItem-dialog-title">
        Chỉnh sửa Thông tin tang vật (ID: {seizedItemId})
      </DialogTitle>
      <DialogContent>
        {seizedItem ? (
          <Formik
            initialValues={{
              itemName: seizedItem.itemName || "",
              description: seizedItem.description || "",
              quantity: seizedItem.quantity || "",
              seizureDate: seizedItem.seizureDate
                ? new Date(seizedItem.seizureDate).toISOString().slice(0, 16)
                : "",
              status: seizedItem.status || "",
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
                      name="itemName"
                      label="Tên tang vật"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.itemName && Boolean(errors.itemName)}
                      helperText={touched.itemName && errors.itemName}
                    />

                    <Field
                      as={TextField}
                      name="description"
                      label="Mô tả"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />

                    <Field
                      as={TextField}
                      name="quantity"
                      label="Số lượng"
                      fullWidth
                      type="number"
                      margin="normal"
                      variant="outlined"
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Tình trạng</InputLabel>
                      <Field
                        as={Select}
                        name="status"
                        label="Tình trạng"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="Đã thu giữ">Đã thu giữ</MenuItem>
                        <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                        <MenuItem value="Đã trả lại">Đã trả lại</MenuItem>
                      </Field>
                    </FormControl>

                    <Field
                      as={TextField}
                      name="seizureDate"
                      label="Ngày thu giữ"
                      type="datetime-local"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={touched.seizureDate && Boolean(errors.seizureDate)}
                      helperText={touched.seizureDate && errors.seizureDate}
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
