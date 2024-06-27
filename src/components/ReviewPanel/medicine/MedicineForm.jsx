import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useFormik } from "formik";
import Axios from "../../../config/axios";

const MedicineForm = ({ onSubmit }) => {
  const [branches, setBranches] = useState([]);
  const [mainDepartments, setMainDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);


  // getting the jobrole for conditonally rendering
  const jobRole = localStorage.getItem('jobRole');
  const storedBranch = localStorage.getItem('branch');
  const [initialBranchName, initialBranchId] = storedBranch ? storedBranch.split(',') : ['', ''];

  
  // getting the main department based on branch
  useEffect(() => {
    Axios.get("/admin/get-addOns")
      .then((resp) => {
        const branchOptions = resp?.data?.Branches?.map((branch) => ({
          option: branch?.branchName,
          id: branch?._id,
        }));
        setBranches(branchOptions); // Ensure branches are set correctly

        const mainDepartmentsData = resp?.data?.MainDepartments?.map(
          (Main) => ({
            option: Main?.Name,
            id: Main?._id,
            subOption: Main?.BranchID?.branchName,
            BranchID: Main?.BranchID?._id,
          })
        );
        setMainDepartments(mainDepartmentsData);

        // Set filtered departments if initialBranchId is available
        if (initialBranchId) {
          const filtered = mainDepartmentsData.filter(dept => dept.BranchID === initialBranchId);
          setFilteredDepartments(filtered);
        }
      })
      .catch((err) => {
        console.error("Error fetching branches and main departments:", err);
      });
  }, [initialBranchId]);

  const initialValues = {
    branch: jobRole === 'admin' ? '' : initialBranchId,
    departments: [],
    medicineName: "",
    HSNCode: "",
    quantity: "",
    manufacturerName: "",
    price: "",
    batchNumber: "",
    expirationDate: "",
    gstOption: "",
    gst: "",
  };

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors = {};
      if (!values.branch) errors.branch = "Branch is required";
      if (!values.departments || values.departments.length === 0)
        errors.departments = "At least one Department is required";
      if (!values.medicineName)
        errors.medicineName = "Medicine Name is required";
      if (!values.HSNCode) errors.HSNCode = "HSN code is required";
      if (!values.quantity) {
        errors.quantity = "Quantity is required";
      } else if (isNaN(values.quantity) || values.quantity <= 0) {
        errors.quantity = "Quantity must be a positive number";
      }
      if (!values.manufacturerName) {
        errors.manufacturerName = "Manufacturer Name is required";
      }
      if (!values.price) {
        errors.price = "Price is required";
      } else if (isNaN(values.price) || values.price <= 0) {
        errors.price = "Price must be a positive number";
      }
      if (!values.batchNumber) {
        errors.batchNumber = "Batch Number is required";
      }
      if (!values.gstOption) {
        errors.gstOption = "GST Option is required";
      }
      if (!values.expirationDate) {
        errors.expirationDate = "Expiration Date is required";
      } else if (new Date(values.expirationDate) <= new Date()) {
        errors.expirationDate = "Expiration Date must be in the future";
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
      const filtered = mainDepartments.filter(
        (dept) => dept.BranchID === formik.values.branch
      );
      setFilteredDepartments(filtered);
    }
  }, [formik.values.branch, mainDepartments]);

  const areBranchAndDepartmentSelected =
    formik.values.branch && formik.values.departments.length > 0;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="center" spacing={2}>
          {jobRole === 'admin' ? (
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
          ) : (
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
          )}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="departments-label">Departments</InputLabel>
              <Select
                labelId="departments-label"
                id="departments"
                name="departments"
                multiple
                value={formik.values.departments}
                onChange={(event) =>
                  formik.setFieldValue("departments", event.target.value)
                }
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) =>
                        filteredDepartments.find((dep) => dep.id === id)?.option
                    )
                    .join(", ")
                }
                error={
                  formik.touched.departments &&
                  Boolean(formik.errors.departments)
                }
                label="Departments"
              >
                {filteredDepartments.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox
                      checked={formik.values.departments.includes(option.id)}
                    />
                    <ListItemText
                      primary={`${option.option} (${option.subOption})`}
                    />
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.departments && formik.errors.departments && (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {formik.errors.departments}
                </div>
              )}
            </FormControl>
          </Grid>
          <Grid container spacing={1}>
            {filteredDepartments.length > 0 &&
              Object.keys(formik.values)
                .filter(
                  (key) =>
                    key !== "branch" &&
                    key !== "departments" &&
                    key !== "gstOption" &&
                    key !== "gst"
                )
                .map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      id={key}
                      name={key}
                      label={key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={formik.values[key] || ""}
                      onChange={formik.handleChange}
                      error={formik.touched[key] && Boolean(formik.errors[key])}
                      helperText={formik.touched[key] && formik.errors[key]}
                      type={key === "expirationDate" ? "date" : "text"}
                      InputLabelProps={
                        key === "expirationDate" ? { shrink: true } : {}
                      }
                      disabled={!areBranchAndDepartmentSelected}
                    />
                  </Grid>
                ))}

            {filteredDepartments.length > 0 && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    id="gstOption"
                    name="gstOption"
                    label="GST Option"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.gstOption}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.gstOption &&
                      Boolean(formik.errors.gstOption)
                    }
                    helperText={
                      formik.touched.gstOption && formik.errors.gstOption
                    }
                  >
                    <MenuItem value="exception">Exception</MenuItem>
                    <MenuItem value="nonException">Non Exception</MenuItem>
                  </TextField>
                </Grid>

                {formik.values.gstOption === "nonException" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="gst"
                      name="gst"
                      label="GST"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={formik.values.gst}
                      onChange={formik.handleChange}
                      error={formik.touched.gst && Boolean(formik.errors.gst)}
                      helperText={formik.touched.gst && formik.errors.gst}
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={formik.handleReset}
              sx={{ bgcolor: "grey.500", width: "150px", height: "50px" }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "150px", height: "50px" }}
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
