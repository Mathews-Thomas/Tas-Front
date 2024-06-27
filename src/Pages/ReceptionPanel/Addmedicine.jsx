import React from 'react';
import MedicineForm from '../../components/ReviewPanel/medicine/MedicineForm';
import Axios from '../../config/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addmedicine = () => {
  const handleSubmit = async (formValues) => {
    try {
      console.log('Form values:', formValues); // Debugging line
      const response = await Axios.post('admin/medicine/add-medicine', formValues);
      console.log('Response:', response.data); // Debugging line
      toast.success('Medicine added successfully');
    } catch (error) {
      console.error('Error submitting form:', error); // Debugging line
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="my-7">
      <div className="text-center text-2xl uppercase my-16 font-semibold">
        Add details of Medicine
      </div>
      <MedicineForm onSubmit={handleSubmit} />
    </div>
  );
};

export default Addmedicine;
