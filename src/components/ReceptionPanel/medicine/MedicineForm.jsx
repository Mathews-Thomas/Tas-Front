import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import Axios from '../../../config/axios';

const MedicineForm = ({ onSubmit }) => {
  const [mainDepartments, setMainDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [initialBranchId, setInitialBranchId] = useState('');
  const [initialBranchName, setInitialBranchName] = useState('');

  useEffect(() => {
    const storedBranch = localStorage.getItem('branch');
    if (storedBranch) {
      const [branchName, branchId] = storedBranch.split(',');
      setInitialBranchName(branchName);
      setInitialBranchId(branchId);

      Axios.get('/admin/get-addOns')
        .then((resp) => {
          const mainDepartmentsData = resp?.data?.MainDepartments?.map(Main => ({
            option: Main?.Name,
            id: Main?._id,
            subOption: Main?.BranchID?.branchName,
            BranchID: Main?.BranchID?._id
          }));
          setMainDepartments(mainDepartmentsData);

          if (branchId) {
            const filtered = mainDepartmentsData.filter(dept => dept.BranchID === branchId);
            setFilteredDepartments(filtered);
          }
        })
        .catch((err) => {
          console.error('Error fetching main departments:', err);
        });
    }
  }, []);

  const validate = (values) => {
    const errors = {};

    if (!values.department) {
      errors.department = 'Required';
    }
    if (!values.medicineName) {
      errors.medicineName = 'Required';
    } else if (values.medicineName.length < 3) {
      errors.medicineName = 'Medicine name must be at least 3 characters long';
    }
    if (!values.category) {
      errors.category = 'Required';
    }
    if (!values.quantity) {
      errors.quantity = 'Required';
    } else if (!/^\d+$/.test(values.quantity)) {
      errors.quantity = 'Quantity must be a number';
    }
    if (!values.strength) {
      errors.strength = 'Required';
    }
    if (!values.price) {
      errors.price = 'Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.price)) {
      errors.price = 'Price must be a valid number';
    }
    if (!values.batchNumber) {
      errors.batchNumber = 'Required';
    }
    if (!values.expirationDate) {
      errors.expirationDate = 'Required';
    } else if (new Date(values.expirationDate) <= new Date()) {
      errors.expirationDate = 'Expiration date must be in the future';
    }

    return errors;
  };

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
    validate,
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
      console.log(values)
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (initialBranchId) {
      formik.setFieldValue('branch', initialBranchId);
    }
  }, [initialBranchId, formik.setFieldValue]);

  useEffect(() => {
    if (formik.values.branch) {
      const filtered = mainDepartments.filter(dept => dept.BranchID === formik.values.branch);
      setFilteredDepartments(filtered);
    }
  }, [formik.values.branch, mainDepartments]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="branch"
              name="branch"
              label="Branch"
              variant="outlined"
              fullWidth
              margin="normal"
              value={initialBranchName}
              disabled
            />
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
              {filteredDepartments.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.option} {option.subOption}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {filteredDepartments.length > 0 && Object.keys(formik.values)
            .filter((key) => key !== 'branch' && key !== 'department')
            .map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  id={key}
                  name={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formik.values[key] || ''}
                  onChange={formik.handleChange}
                  error={formik.touched[key] && Boolean(formik.errors[key])}
                  helperText={formik.touched[key] && formik.errors[key]}
                  type={key === 'expirationDate' ? 'date' : 'text'}
                  InputLabelProps={key === 'expirationDate' ? { shrink: true } : {}}
                  
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
