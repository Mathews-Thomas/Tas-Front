import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import Axios from '../../../config/axios';

const MedicineForm = ({ onSubmit }) => {
  const [branches, setBranches] = useState([]);
  const [mainDepartments, setMainDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  useEffect(() => {
    Axios.get('/admin/get-addOns')
      .then((resp) => {
        const branchOptions = resp?.data?.Branches?.map(branch => ({ option: branch?.branchName, id: branch?._id }));
        const mainDepartmentsData = resp?.data?.MainDepartments?.map(Main => ({
          option: Main?.Name,
          id: Main?._id,
          subOption: Main?.BranchID?.branchName,
          BranchID: Main?.BranchID?._id
        }));
        setBranches(branchOptions);
        console.log(branchOptions)
        setMainDepartments(mainDepartmentsData);
        console.log(mainDepartmentsData)
      })
      .catch((err) => {
        console.error('Error fetching branches and main departments:', err);
      });
  }, []);

  const { handleSubmit, handleChange, handleReset, values, touched, errors } = useFormik({
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
    validate: (values) => {
      const errors = {};
      if (!values.branch) errors.branch = 'Branch is required';
      if (!values.department) errors.department = 'Department is required';
      if (!values.medicineName) errors.medicineName = 'Medicine Name is required';
      if (!values.category) errors.category = 'Category is required';
      if (!values.quantity) {
        errors.quantity = 'Quantity is required';
      } else if (isNaN(values.quantity) || values.quantity <= 0) {
        errors.quantity = 'Quantity must be a positive number';
      }
      if (!values.strength) {
        errors.strength = 'Strength is required';
      }
      if (!values.price) {
        errors.price = 'Price is required';
      } else if (isNaN(values.price) || values.price <= 0) {
        errors.price = 'Price must be a positive number';
      }
      if (!values.batchNumber) {
        errors.batchNumber = 'Batch Number is required';
      }
      if (!values.expirationDate) {
        errors.expirationDate = 'Expiration Date is required';
      } else if (new Date(values.expirationDate) <= new Date()) {
        errors.expirationDate = 'Expiration Date must be in the future';
      }
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (values.branch) {
      const filtered = mainDepartments.filter(dept => dept.BranchID === values.branch);
      setFilteredDepartments(filtered);
    }
  }, [values.branch, mainDepartments]);

  const areBranchAndDepartmentSelected = values.branch && values.department;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <form onSubmit={handleSubmit}>
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
              value={values.branch}
              onChange={handleChange}
              error={touched.branch && Boolean(errors.branch)}
              helperText={touched.branch && errors.branch}
            >
              {branches.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.option}
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
              value={values.department}
              onChange={handleChange}
              error={touched.department && Boolean(errors.department)}
              helperText={touched.department && errors.department}
              disabled={!values.branch}
            >
              {filteredDepartments.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.option} {option.subOption}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {filteredDepartments.length > 0 && Object.keys(values)
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
                  value={values[key] || ''}
                  onChange={handleChange}
                  error={touched[key] && Boolean(errors[key])}
                  helperText={touched[key] && errors[key]}
                  type={key === 'expirationDate' ? 'date' : 'text'}
                  InputLabelProps={key === 'expirationDate' ? { shrink: true } : {}}
                  disabled={!areBranchAndDepartmentSelected}
                />
              </Grid>
            ))}
        </Grid>
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleReset}
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
