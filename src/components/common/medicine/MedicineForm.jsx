import React from 'react';
import { Container, TextField, Button, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';

const branches = ['Branch 1', 'Branch 2', 'Branch 3','Branch 4']; // Example branches
const departments = ['Department 1', 'Department 2', 'Department 3','Department 4']; // Example departments

const MedicineForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      branch: '',
      department: '',
      medicineName: '',
      category: '',
      quantity: '',
      strength: '',
      price: '',
      batchNumber: '',
      expirationDate: '',
    },
    validate: values => {
      const errors = {};

      if (!values.branch) errors.branch = 'Required';
      if (!values.department) errors.department = 'Required';
      if (!values.medicineName) errors.medicineName = 'Required';
      if (!values.category) errors.category = 'Required';
      if (!values.quantity) errors.quantity = 'Required';
      if (!values.strength) errors.strength = 'Required';
      if (!values.price) errors.price = 'Required';
      if (!values.batchNumber) errors.batchNumber = 'Required';
      if (!values.expirationDate) errors.expirationDate = 'Required';
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    },
  });

  const areBranchAndDepartmentSelected = formik.values.branch && formik.values.department;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              id="branch"
              name="branch"
              label="Branch"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formik.values.branch}
              onChange={formik.handleChange}
              error={formik.touched.branch && Boolean(formik.errors.branch)}
              helperText={formik.touched.branch && formik.errors.branch}
            >
              {branches.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              id="department"
              name="department"
              label="Department"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formik.values.department}
              onChange={formik.handleChange}
              error={formik.touched.department && Boolean(formik.errors.department)}
              helperText={formik.touched.department && formik.errors.department}
            >
              {departments.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {Object.keys(formik.initialValues).filter(key => key !== 'branch' && key !== 'department').map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                id={key}
                name={key}
                label={key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                variant="outlined"
                fullWidth
                margin="normal"
                value={formik.values[key] || ''}
                onChange={formik.handleChange}
                error={formik.touched[key] && Boolean(formik.errors[key])}
                helperText={formik.touched[key] && formik.errors[key]}
                type={key === 'expirationDate' ? 'date' : 'text'}
                InputLabelProps={
                  key === 'expirationDate' ? { shrink: true } : {}
                }
                disabled={!areBranchAndDepartmentSelected}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={formik.handleReset}
              sx={{ bgcolor: 'grey.500', width: '150px', height: '50px' }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: '150px', height: '50px' }}
              disabled={!areBranchAndDepartmentSelected}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default MedicineForm;
