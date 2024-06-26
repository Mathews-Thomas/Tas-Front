import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
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
        setMainDepartments(mainDepartmentsData);
      })
      .catch((err) => {
        console.error('Error fetching branches and main departments:', err);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      branch: '',
      departments: [],
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
      if (!values.departments || values.departments.length === 0) errors.departments = 'At least one Department is required';
      if (!values.medicineName) errors.medicineName = 'Medicine Name is required';
      if (!values.category) errors.category = 'Category is required';
      if (!values.quantity) {
        errors.quantity = 'Quantity is required';
      } else if (isNaN(values.quantity) || values.quantity <= 0) {
        errors.quantity = 'Quantity must be a positive number';
      }
      if (!values.strength) {
        errors.strength = 'Strength is required';
      } else if (isNaN(values.strength) || values.strength <= 0) {
        errors.strength = 'Strength must be a positive number';
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
    onSubmit: (values, { setSubmitting, resetForm }) => {
      onSubmit(values);
      setSubmitting(false);
      resetForm();
    },
  });

  useEffect(() => {
    if (formik.values.branch) {
      const filtered = mainDepartments.filter(dept => dept.BranchID === formik.values.branch);
      setFilteredDepartments(filtered);
    }
  }, [formik.values.branch, mainDepartments]);

  const areBranchAndDepartmentSelected = formik.values.branch && formik.values.departments.length > 0;



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
                <MenuItem key={option.id} value={option.id}>
                  {option.option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="departments-label">Departments</InputLabel>
              <Select
                labelId="departments-label"
                id="departments"
                name="departments"
                multiple
                value={formik.values.departments}
                onChange={(event) => formik.setFieldValue('departments', event.target.value)}
                renderValue={(selected) => selected.map(id => filteredDepartments.find(dep => dep.id === id)?.option).join(', ')}
                error={formik.touched.departments && Boolean(formik.errors.departments)}
                label="Departments"
              >
                {filteredDepartments.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox checked={formik.values.departments.includes(option.id)} />
                    <ListItemText primary={`${option.option} (${option.subOption})`} />
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.departments && formik.errors.departments && (
                <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.departments}</div>
              )}
            </FormControl>
          </Grid>
          {filteredDepartments.length > 0 && Object.keys(formik.values)
            .filter((key) => key !== 'branch' && key !== 'departments')
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
