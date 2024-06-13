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
    // Retrieve branch data from local storage
    const storedBranch = localStorage.getItem('branch');
    if (storedBranch) {
      const [branchName, branchId] = storedBranch.split(',');
      setInitialBranchName(branchName);
      setInitialBranchId(branchId);
    }

    Axios.get('/admin/get-addOns')
      .then((resp) => {
        const mainDepartmentsData = resp?.data?.MainDepartments?.map(Main => ({
          option: Main?.Name,
          id: Main?._id,
          subOption: Main?.BranchID?.branchName,
          BranchID: Main?.BranchID?._id
        }));
        setMainDepartments(mainDepartmentsData);

        // Filter departments based on the initialBranchId
        if (branchId) {
          const filtered = mainDepartmentsData.filter(dept => dept.BranchID === branchId);
          setFilteredDepartments(filtered);
        }
      })
      .catch((err) => {
        console.error('Error fetching main departments:', err);
      });
  }, []);

  const { handleSubmit, handleChange, handleReset, values, touched, errors, setFieldValue } = useFormik({
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
      Object.keys(values).forEach(key => {
        if (!values[key]) errors[key] = 'Required';
      });
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (initialBranchId) {
      setFieldValue('branch', initialBranchId);
    }
  }, [initialBranchId, setFieldValue]);

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
              value={values.department}
              onChange={handleChange}
              error={touched.department && Boolean(errors.department)}
              helperText={touched.department && errors.department}
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
