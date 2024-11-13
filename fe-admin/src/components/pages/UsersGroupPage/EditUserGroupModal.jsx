import {
  Button,
  Checkbox,
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
import roleService from "../../../service/role.service";
import userGroupService from "../../../service/user-group.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Tên bắt buộc"),
  description: Yup.string().required("Mô tả bắt buộc"),
});

function EditUserGroupDialog({ open, onClose, onEditUserGroup, userGroupId }) {
  const [userGroup, setUserGroup] = useState(null);
  const [roles, setRoles] = useState([]);
  // Truy xuat roles
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
    if (userGroupId) {
      const fetchUser = async () => {
        try {
          const response = await userGroupService.getGroup(userGroupId);
          setUserGroup(response.data);
        } catch (error) {
          console.error("Lỗi khi tải người dùng", error);
          toast.error("Không thể tải dữ liệu người dùng");
        }
      };
      fetchUser();
    }
  }, [userGroupId]);

  const handleSubmit = async (values) => {
    console.log("Form values on submit:", values); // Debugging line

    try {
      const userGroupData = {
        ...values,
        roleIds: roles
          .filter((role) => values.roles.includes(role.id))
          .map((role) => role.id),
      };

      // Gọi API cập nhật nhóm người dùng
      await userGroupService.editGroup(userGroupId, userGroupData);

      // Thông báo thành công
      toast.success("Nhóm dùng đã được cập nhật thành công!");
      onEditUserGroup();
      onClose();
    } catch (error) {
      // Bắt lỗi và hiển thị thông báo
      const errorMessage = error.response?.data;
      console.log("Error response:", error.response); // Debugging line
      toast.error(errorMessage || "Cập nhật thất bại!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-userGroup-dialog-title"
    >
      <DialogTitle id="edit-userGroup-dialog-title">
        Chỉnh sửa Nhóm người dùng
      </DialogTitle>
      <DialogContent>
        {userGroup ? (
          <Formik
            initialValues={{
              name: userGroup.name || "",
              description: userGroup.description || "",
              roles: userGroup.roles.map((role) => role.id) || [],
              users: userGroup.users.map((user) => user.id) || [],
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
              <Form id="form-edit">
                <Field
                  as={TextField}
                  name="name"
                  label="Tên"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
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
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />

                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="roles-label">Chọn roles</InputLabel>
                  <Select
                    label="Chọn roles"
                    multiple
                    value={values.roles}
                    onChange={(event) =>
                      setFieldValue("roles", event.target.value)
                    }
                    renderValue={(selected) =>
                      selected
                        .map((id) => roles.find((role) => role.id === id)?.name)
                        .join(", ")
                    }
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 200 },
                      },
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Checkbox checked={values.roles.includes(role.id)} />
                        {role.name}
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
          form="form-edit"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserGroupDialog;
