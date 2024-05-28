import React from 'react'
import MedicineForm from "../../components/common/medicine/MedicineForm"
const Addmedicine = () => {
  const handleSubmit = (formValues) => {
    // This function will handle the form values, e.g., send them to an API
    console.log('Form submitted with values:', formValues);
    // Simulate a server request with a timeout
    setTimeout(() => {
      alert('Form submitted successfully!');
    }, 1000);
  };
  return (
    <div className='my-7'>
         <div className='text-center text-2xl uppercase my-16 font-semibold'>Add details of Medicine</div>
     <MedicineForm onSubmit={handleSubmit}/>
    </div>
  )
}

export default Addmedicine;