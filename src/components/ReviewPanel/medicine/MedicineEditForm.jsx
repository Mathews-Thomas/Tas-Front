import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { useFormik } from "formik";
import Axios from "../../../config/axios";

// date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MedicineEditForm = ({
  refresh,
  setRefresh,
  initialData,
  selectedOptionName,
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [branches, setBranches] = useState([]);
  const [mainDepartments, setMainDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const jobRole = localStorage.getItem("jobRole");

  useEffect(() => {
    Axios.get("/admin/get-addOns")
      .then((resp) => {
        const branchOptions = resp?.data?.Branches?.map((branch) => ({
          option: branch?.branchName,
          id: branch?._id,
        }));
        const mainDepartmentsData = resp?.data?.MainDepartments?.map(
          (Main) => ({
            option: Main?.Name,
            id: Main?._id,
            subOption: Main?.BranchID?.branchName,
            BranchID: Main?.BranchID?._id,
          })
        );
        setBranches(branchOptions);
        setMainDepartments(mainDepartmentsData);
      })
      .catch((err) => {
        console.error("Error fetching branches and main departments:", err);
      });
  }, []);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // form data extraction
  const extractFormDataValues = (formData) => ({
    branch: formData.branch.id || "",
    departments: formData.departments || [],
    medicineName: formData.medicineName || "",
    manufactureName: formData.manufacturerName || "",
    quantity: formData.quantity || "",
    price: formData.price || "",
    batchNumber: formData.batchNumber || "",
    gstOption: formData.gst ? "nonException" : "exception",
    gst: formData.gst || "",
    expirationDate: formData.expirationDate
      ? formatDate(formData.expirationDate)
      : "",
    approved: formData.approved ? "true" : "false",
    _id: formData._id || "",
  });

  const formik = useFormik({
    initialValues: {
      id: "" || "",
      branch: "",
      departments: [],
      medicineName: "",
      manufactureName: "",
      quantity: "",
      price: "",
      batchNumber: "",
      expirationDate: "",
      approved: "",
      gst: "",
      gstOption: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.branch) errors.branch = "Branch is required";
      if (!values.departments || values.departments.length === 0)
        errors.departments = "At least one Department is required";
      if (!values.medicineName)
        errors.medicineName = "Medicine Name is required";

      if (!values.quantity) {
        errors.quantity = "Quantity is required";
      } else if (isNaN(values.quantity) || values.quantity <= 0) {
        errors.quantity = "Quantity must be a positive number";
      }

      if (!values.price) {
        errors.price = "Price is required";
      } else if (isNaN(values.price) || values.price <= 0) {
        errors.price = "Price must be a positive number";
      }
      if (!values.batchNumber) {
        errors.batchNumber = "Batch Number is required";
      }
      if (!values.approved) {
        errors.approved = "Value is required";
      }
      if (!values.expirationDate) {
        errors.expirationDate = "Expiration Date is required";
      } else if (new Date(values.expirationDate) <= new Date()) {
        errors.expirationDate = "Expiration Date must be in the future";
      }
      if (!values.manufactureName) {
        errors.manufactureName = "Manufacture Name is required";
      }
      if (!values.gstOption) {
        errors.gstOption = "GST Option is required";
      }
      if (values.gstOption === "nonException" && !values.gst) {
        errors.gst = "GST is required";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log(values);
        await Axios.put("/admin/medicine/edit-medicine", values);
        console.log("Form data updated successfully");
        toast.success("Medicine updated successfully");
        console.log(values, "the submitted values");
        setSubmitting(false);
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error updating form data:", error);
        toast.error(error);
      }
    },
  });

  useEffect(() => {
    if (formData) {
      const extractedValues = extractFormDataValues(formData);
      formik.setValues(extractedValues);
    }
  }, [formData]);

  // cancel function
  const handleCancel = () => {
    formik.handleReset(); // Reset the form using Formik's handleReset
    onClose(); // Close the modal
  };

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
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Medicine</DialogTitle>
        <DialogContent>
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
                    error={
                      formik.touched.branch && Boolean(formik.errors.branch)
                    }
                    helperText={formik.touched.branch && formik.errors.branch}
                    disabled={jobRole === "user"}
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
                      value={formik.values.departments.map(
                        (department) => department.id
                      )}
                      onChange={(event) => {
                        const selectedIds = event.target.value;
                        const selectedDepartments = selectedIds
                          .map((id) =>
                            filteredDepartments.find((dep) => dep.id === id)
                          )
                          .filter((dep) => dep); // Filter out undefined values
                        formik.setFieldValue(
                          "departments",
                          selectedDepartments
                        );
                      }}
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) =>
                              filteredDepartments.find((dep) => dep.id === id)
                                ?.option
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
                            checked={formik.values.departments.some(
                              (dep) => dep.id === option.id
                            )}
                          />
                          <ListItemText
                            primary={`${option.option} (${option.subOption})`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.departments &&
                      formik.errors.departments && (
                        <div style={{ color: "red", marginTop: "0.5rem" }}>
                          {formik.errors.departments}
                        </div>
                      )}
                  </FormControl>
                </Grid>
                {filteredDepartments.length > 0 &&
                  Object.keys(formik.values)
                    .filter(
                      (key) =>
                        key !== "branch" &&
                        key !== "departments" &&
                        key !== "_id" &&
                        key !== "gstOption" &&
                        key !== "gst" &&
                        key !== "manufactureName"
                    )
                    .map((key) => (
                      <Grid item xs={12} sm={6} key={key}>
                        {key === "approved" ? (
                         
                            <FormControl
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            >
                              <InputLabel id="approved-label">
                                Approved
                              </InputLabel>
                              <Select
                                labelId="approved-label"
                                id="approved"
                                name="approved"
                                value={formik.values.approved}
                                onChange={formik.handleChange}
                                label="Approved"
                                error={
                                  formik.touched.approved &&
                                  Boolean(formik.errors.approved)
                                }
                                disabled={formik.values.approved === "true"}
                              >
                                <MenuItem value="true">true</MenuItem>
                                <MenuItem value="false">false</MenuItem>
                              </Select>
                              {formik.touched.approved &&
                                formik.errors.approved && (
                                  <div
                                    style={{
                                      color: "red",
                                      marginTop: "0.5rem",
                                    }}
                                  >
                                    {formik.errors.approved}
                                  </div>
                                )}
                            </FormControl>
                          
                        ) : (
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
                            error={
                              formik.touched[key] && Boolean(formik.errors[key])
                            }
                            helperText={
                              formik.touched[key] && formik.errors[key]
                            }
                            type={key === "expirationDate" ? "date" : "text"}
                            InputLabelProps={
                              key === "expirationDate" ? { shrink: true } : {}
                            }
                            disabled={!areBranchAndDepartmentSelected}
                          />
                        )}
                      </Grid>
                    ))}
                {filteredDepartments.length > 0 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="manufactureName"
                        name="manufactureName"
                        label="Manufacture Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.manufactureName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.manufactureName &&
                          Boolean(formik.errors.manufactureName)
                        }
                        helperText={
                          formik.touched.manufactureName &&
                          formik.errors.manufactureName
                        }
                      />
                    </Grid>
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
                          error={
                            formik.touched.gst && Boolean(formik.errors.gst)
                          }
                          helperText={formik.touched.gst && formik.errors.gst}
                        />
                      </Grid>
                    )}
                  </>
                )}
              </Grid>

              <Grid
                container
                justifyContent="center"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleCancel}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicineEditForm;
