import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useFormik } from 'formik';

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const DynamicEditModal = ({ open, onClose, entity, onUpdate }) => {
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    // Assuming your entity object contains a fields array with the current values
    const values = entity?.fields?.reduce((acc, field) => {
      acc[field.name] = field.value || ''; // Replace 'field.value' with the correct way to access the current value of each field
      return acc;
    }, {});

    setInitialValues(values);
  }, [entity]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      onUpdate(entity?.apiEndPoint, values); // Function to call API and update the entity
      onClose(); // Close modal after submission
    },
    enableReinitialize: true, // Reinitialize form when initialValues change
  });

  const renderField = (field) => {
    switch (field?.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            id={field.name}
            name={field.name}
            label={field.label}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            margin="normal"
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            id={field.name}
            name={field.name}
            label={field.label}
            type="number"
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            margin="normal"
          />
        );
      case 'dropdown':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{field.label}</InputLabel>
            <Select
              id={field.name}
              name={field.name}
              value={formik.values[field.name]}
              label={field.label}
              onChange={formik.handleChange}
            >
              {field.options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      // Add cases for other field types as needed
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="dynamic-modal-title"
      aria-describedby="dynamic-modal-description"
    >
      <Box sx={style}>
      <Typography
            id="dynamic-modal-title"
            variant="h4"
            className="text-center uppercase"
            component="h4"
          >
            {selectedOptionName}
          </Typography>
          <hr />
        <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} >
          {selectedOption?.fields?.map((field) => (
            <Grid item xs={gridItemSize} key={field.name}>
            {" "}
            {renderField(field)}
          </Grid>
          ))}
           </Grid>
          <Box textAlign="center" marginTop={2}>
            <Button color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary" sx={{ marginLeft: 2 }}>
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default DynamicEditModal;
