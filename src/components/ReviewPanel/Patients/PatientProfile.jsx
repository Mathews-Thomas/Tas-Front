import man from "../../../../src/assets/Account Icon/man.png";
import woman from "../../../../src/assets/Account Icon/woman.png";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import { CiCalendar } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";

const PatientProfile = () => {
  // const { patientId } = useParams();
  // const [patient, setPatient] = useState(null);

  // useEffect(() => {
  //   const fetchPatientData = async () => {
  //     try {
  //       const response = await Axios.get(`/patient-list/${patientId}`);
  //       setPatient(response.data.patient);
  //     } catch (error) {
  //       console.error("Error fetching patient data:", error);
  //     }
  //   };

  //   fetchPatientData();
  // }, [patientId]);


  const titles = ["Appointments", "Doctors", "Treatment", "Vital Sign", "Billing"];

  // console.log(patient);
  return (
    <>
      {/* main container for the profile */}
      <div className="w-full h-full bg-[#F6F6F6] flex justify-center ">
        {/* inner container for the content */}
        <div className="w-[70rem] flex flex-col bg-white my-10 rounded-lg">
          {/* heading div */}
          <div className="flex items-start  ml-9 mt-5">
            <h1 className="text-2xl text-blue-800 font-semibold">
              Patient Profile
            </h1>
          </div>
          {/* details container  */}
          <div className="w-full   flex flex-row items-center justify-between  ">
            {/* patient left side information container */}
            <div className="w-[20rem] flex flex-col h-[15rem] m-10 shadow-md  justify-center rounded-xl border border-gray-300">
              {/* name div */}
              <div className="flex flex-row gap-2 m-5">
                <img src={man} alt="Avatar icon" className="w-16" />
                <h1 className="text-2xl mt-2 ml-2">Patient name</h1>
              </div>
              {/* contact details container */}
              <div className="flex flex-col gap-3 ml-4 mr-4 mb-4">
                <h1 className="text-lg font-semibold">Contact Details:</h1>
                <div>phone</div>
                <div>Mail</div>
                <div>address</div>
              </div>
            </div>
            {/* patient overview container */}
            <div className=" flex flex-col   w-[40rem] rounded-xl border mr-5 border-gray-300 shadow-md">
              {/* heading container */}
              <div className="flex text-start m-5">
                <h1 className="font-bold capitalize text-xl">overview :</h1>
              </div>
              {/* contents container */}
              <div className="flex flex-col w-auto m-5 gap-5">
                <div className="flex  flex-row justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-[#219ebc] capitalize font-semibold">
                      gender :
                    </h1>
                    <h1>female</h1>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[#219ebc] capitalize font-semibold">
                      Date of birth :
                    </h1>
                    <h1>10/02/2001</h1>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[#219ebc] capitalize font-semibold">
                      Created At :
                    </h1>
                    <h1>10/02/2001</h1>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-[#219ebc] capitalize font-semibold">
                      Allergies :
                    </h1>
                    <h1>date</h1>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[#219ebc] capitalize font-semibold">
                      Next visit :
                    </h1>
                    <h1>date</h1>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[#219ebc] capitalize font-semibold">
                      Next visit :
                    </h1>
                    <h1>date</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Options container */}
          <div className="w-full">
            <div className="grid grid-cols-3 gap-8 border border-gray-300 m-7 rounded-lg">
              {/* Mapping card containers */}
              {titles.map((title, index) => (
                <div key={index} className="flex h-[100px] rounded-lg">
                  {/* card container */}
                  <div className="flex justify-center items-center flex-row w-[250px] h-[50px] rounded-lg border border-gray-300 m-6 gap-3">
                    <CiCalendar />
                    <h1 className="text-[#4361ee] font-bold">{title}</h1>
                    <IoIosArrowForward />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
