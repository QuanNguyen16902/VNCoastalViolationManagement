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
import RoleService from "../../../service/role.service";
import userGroupService from "../../../service/user-group.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Tên bắt buộc"),
  description: Yup.string().required("Mô tả bắt buộc"),
});

function AddUserGroupModal({ open, onClose, onAddUserGroup }) {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RoleService.getRoles();
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (values) => {
    console.log("Submitted roles:", values.roles);
    console.log("Submitted users:", values.users);
    try {
      const groupData = {
        ...values,
      };

      await userGroupService.addGroup(groupData);

      // const rolesAssignData = {
      //   userIds: values.users,
      //   roleIds: values.roles,
      // };
      // await userService.assignRolesToUsers(rolesAssignData);
      toast.success("Nhóm người dùng đã được thêm thành công!");
      onAddUserGroup();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data || "Có lỗi xảy ra";
      console.error("Error:", error.response.data);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-user-dialog-title"
    >
      <DialogTitle id="add-user-dialog-title">Thêm Nhóm người dùng</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            name: "",
            description: "",
            roles: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form id="add-user-group-form">
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
              {/* 
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="user-label">Chọn người dùng</InputLabel>
                <Select
                  label="Chọn người dùng"
                  multiple
                  value={values.users}
                  onChange={(event) =>
                    setFieldValue("users", event.target.value)
                  }
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) => users.find((user) => user.id === id)?.username
                      )
                      .join(", ")
                  }
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 200 },
                    },
                  }}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox checked={values.users.includes(user.id)} />
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </Form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="submit" form="add-user-group-form" autoFocus>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUserGroupModal;
