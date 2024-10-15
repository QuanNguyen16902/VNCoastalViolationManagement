import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import permissionService from '../../../service/permission.service';

const validationSchema = Yup.object({
  name: Yup.string().required('Chưa điền tên phân quyền'),
  description: Yup.string().required('Chưa điền mô tả'),
});

function AddPermissionModal({ open, onClose, onAddPermission }) {

  const handleSubmit = async (values) => {
    try {
      
      await permissionService.addPermission(values);
      toast.success('Thêm phân quyền thành công!');
      onAddPermission(); 
      onClose();
      
    } catch (error) {
      const errorMessage = error.response?.data;
      console.log(error.response)
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="add-permission-dialog-title"  
    >
      <DialogTitle id="add-permission-dialog-title">Thêm phân quyền</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            name: '',
            description: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <Form id="add-permission-form">
              <Field
                as={TextField}
                name="name"
                label="Tên phân quyền"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
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
        <Button type="submit" form="add-permission-form" autoFocus>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPermissionModal;
