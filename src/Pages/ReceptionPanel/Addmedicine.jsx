import React from "react";
import MedicineForm from "../../components/ReceptionPanel/medicine/MedicineForm";
import Axios from "../../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addmedicine = () => {
  const handleSubmit = async (formValues) => {
    try {
      // Send form data to the API
      const response = await Axios.post("/medicine/add-medicine", formValues);
      console.log("Response:", response.data);
      toast.success("Form submitted successfully!");
    } catch (error) {
      // Check if the error has a response and data object

      toast.error(error.response.data.error);
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
