import React from 'react'
import MedicineForm from "../../components/ReviewPanel/medicine/MedicineForm"
import Axios from "../../config/axios"
const Addmedicine = () => {
  const handleSubmit = async (formValues) => {
    try {
      // Send form data to the API
      console.log(formValues,"this is the form values");
      const response = await Axios.post('admin/medicine/add-medicine', formValues);
      console.log('Response:', response.data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };
  return (
    <div className='my-7'>
         <div className='text-center text-2xl uppercase my-16 font-semibold'>Add details of Medicine</div>
     <MedicineForm onSubmit={handleSubmit}/>
    </div>
  )
}

export default Addmedicine;