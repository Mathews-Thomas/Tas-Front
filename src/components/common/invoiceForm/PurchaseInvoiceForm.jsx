import { useFormik } from 'formik';
import TextFieldInput from '../../common/inputbox';
import SelectBox from '../../common/SelectBox';
import Grid from '@mui/material/Grid';

const formFields = [
  { label: 'Purchase Item', name: 'purchaseItem', type: 'text' },
  { label: 'Purchase Quantity', name: 'purchaseQuantity', type: 'number' },
  { label: 'Approved by Doctor', name: 'approvedByDoctor', type: 'dropdown', options: ['Dr. Smith', 'Dr. Johnson', 'Dr. Miller'] },
  { label: 'Vendor Name', name: 'vendorName', type: 'text' },
  { label: 'Type of Purchase', name: 'typeOfPurchase', type: 'dropdown', options: ['Type A', 'Type B', 'Type C'] },
  { label: 'Amount Method', name: 'amountMethod', type: 'dropdown', options: ['Cash', 'Credit Card', 'Insurance'] },
  { label: 'Total Amount + GST from Invoice', name: 'totalAmount', type: 'number' },
];

const PurchaseForm = () => {
  const formik = useFormik({
    initialValues: formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
    validate: (values) => {
      const errors = {};
      formFields.forEach((field) => {
        const value = values[field.name];
    
        if (field.type === 'dropdown') {
          // Dropdown validation (if required)
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          }
        } else if (field.type === 'number') {
          // Number field validation
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          } else if (value && (!/^\d+$/.test(value) || value < 0)) {
            errors[field.name] = `${field.label} must be a valid number greater than or equal to 0`;
          }
        } else {
          // Text field validation
          if (!value) {
            errors[field.name] = `${field.label} is required`;
          } else if (typeof value === 'string' && value.trim() !== value) {
            errors[field.name] = `${field.label} cannot start with a space`;
          }
        }
      });

      return errors;
    },
    onSubmit: (values) => {
      // Handle form submission logic here
      console.log('Form submitted with values:', values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto p-4">
      <Grid container spacing={2} justifyContent="center">
        {formFields.map((field) => (
          <Grid item xs={12} md={6} lg={4} key={field.name}>
            {field.type === 'dropdown' ? (
              <SelectBox
                id={field.name}
                label={field.label}
                options={field.options}
                onChange={(selectedValue) => formik.setFieldValue(field.name, selectedValue)}
                value={formik.values[field.name] || null}
                error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
              />
            ) : (
              <TextFieldInput
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type={field.type}
                fullWidth
                error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <button  type="submit" className="bg-[#ee7203] text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
        Submit
      </button>
    </form>
  );
};

export default PurchaseForm;
