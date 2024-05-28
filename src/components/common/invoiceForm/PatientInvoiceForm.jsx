// InvoiceForm.js
import { useFormik } from "formik";
import TextFieldInput from "../../common/inputbox";
import SelectBox from "../../common/SelectBox";
import { Grid } from "@mui/material";
import useToast from "../../../hooks/useToast";


const formFields = [
  { label: "Invoice ID", name: "invoiceId", type: "text", },
  { label: "Entered by", name: "Entered by", type: "text", },
  { label: "Name", name: "name", type: "text" },
  { label: "Age", name: "age", type: "number" },
  { label: "Address", name: "address", type: "text" },
  { label: "Gender",  name: "gender", type: "dropdown", options: ["Male", "Female", "Other"] },
  { label: "Doctor",  name: "doctor", type: "dropdown", options: ["Dr. Smith", "Dr. Johnson", "Dr. Miller"] },
  { label: "Dept Type", name: "deptType", type: "dropdown", options: ["Cardiology", "Orthopedics", "Neurology"] },
  { label: "Visitor Type", name: "visitorType", type: "dropdown", options: ["Regular", "Emergency", "Scheduled"]},
  { label: "Patient Type", name: "patientType", type: "dropdown", options: ["Inpatient", "Outpatient", "Emergency"]},
  { label: "Procedure Type", name: "procedureType", type: "dropdown", options: ["Type A", "Type B", "Type C"] },
  { label: "Sales Amount", name: "salesAmount", type: "number" },
  { label: "Procedure Amount", name: "procedureAmount", type: "number" },
  { label: "Amount Method", name: "amountMethod", type: "dropdown", options: ["Cash", "Credit Card", "Insurance"] },
  { label: "Total Amount", name: "totalAmount", type: "number",   },
  // disabled: true,
];

const InvoiceForm = () => {

  const showToast = useToast()
  const formik = useFormik({
    initialValues: formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: "" }),
      {}
    ),
    validate: (values) => {
      const errors = {};

      formFields.forEach((field) => {
        const value = values[field.name];
        if (field.type === "dropdown") {
          // Dropdown validation (if required)
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          }
        } else if (field.type === "number") {
          // Number field validation
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          } else if (value && (!/^\d+$/.test(value) || value < 0)) {
            errors[
              field.name
            ] = `${field.label} must be a valid number greater than or equal to 0`;
          }
        } else if (field.name === "age") {
          const ageValue = parseInt(value, 10);
          if (ageValue < 0 || ageValue > 110) {
            errors[field.name] = `${field.label} must be between 0 and 110`;
          }
        } else {
          // Text field validation
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          } else if (typeof value === "string" && value.trim() !== value) {
            errors[field.name] = `${field.label} cannot start with a space`;
          }
        }
      });

      return errors;
    },
    onSubmit: (values) => { 
      showToast('Registration Completed', 'success');
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto p-4">
      <Grid container spacing={2} justifyContent="center">
        {formFields.map((field, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i + field.name}>
            {field.type === "dropdown" ? (
              <SelectBox
                id={field.name}
                label={field.label}
                options={field.options}
                onChange={(selectedValue) =>
                  formik.setFieldValue(field.name, selectedValue)
                }
                value={formik.values[field.name] || null}
                onBlur={formik.handleBlur}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                }
                fullWidth
              />
            ) : (
              <TextFieldInput
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                disabled={field.disabled}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                }
              />
            )}
          </Grid>
        ))}
      </Grid>

      <button
        type="submit"
        className="bg-[#ee7203] text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        Submit
      </button>
    </form>
  );
};

export default InvoiceForm;
