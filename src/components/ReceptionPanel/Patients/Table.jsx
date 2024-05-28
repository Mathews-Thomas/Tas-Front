import { useState } from "react";
import { Link } from "react-router-dom";
import Patient_Model from "../../ReviewPanel/Patients/PatientPreviewModal"
import ProgressBar from "../../common/ProgressBar/ProgressBar";

/* eslint-disable react/prop-types */
const PatientList = ({data,fetchData,loader}) => {
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const branch = localStorage.getItem('branch')
  const BranchID = branch?.split(',')[1]

  const handleRowClick = (patient) => {  
    setRowData(patient);
    setShowModal(true);
  };


  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="min-w-full table-auto border-8">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Age</th>
            <th className="py-3 px-6 text-center">Gender</th>
            <th className="py-3 px-6 text-center">Phone</th>
            <th className="py-3 px-6 text-center">Date</th>
            <th className="py-3 px-6 text-center">Invoice</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
        {loader ? ( <tr>
              <td colSpan="9" className="text-center font-bold text-red-600 py-4">
              <ProgressBar/>  
              </td>
            </tr>   ): (data.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                No data available
              </td>
            </tr>
          ) : (data?.map((patient, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
              onClick={() => {
                handleRowClick(patient);
              }}
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient?.PatientID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient?.Name}
              </td>
              <td className="py-3 px-6 text-left">{patient?.age}</td>
              <td className="py-3 px-6 text-center">{patient?.Gender}</td>
              <td className="py-3 px-6 text-center">{patient?.phone}</td>
              <td className="py-3 px-6 text-center">{patient?.createdAtIST}</td>
              <td className="py-3 px-6 flex justify-center items-center">
                <Link
                  to={`/patient-invoice/?BranchID=${BranchID}&PatientID=${patient?.PatientID}`}
                >
                  <button className="px-4 py-2 bg-[#387ADF] hover:bg-[#387ADF] text-white font-bold rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex gap-2 items-center justify-center">
                    <svg
                      fill="#FFFFFF"
                      width="25"
                      viewBox="0 -11 493.78 493"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m378.351562 70.472656c.214844.015625.429688.03125.648438.03125.371094 0 .742188-.03125 1.105469-.082031 9.722656.199219 17.503906 8.128906 17.515625 17.851563 0 4.417968 3.582031 8 8 8 4.417968 0 8-3.582032 8-8-.019532-15.902344-11.089844-29.660157-26.621094-33.082032v-7.6875c0-4.417968-3.582031-8-8-8s-8 3.582032-8 8v8.050782c-16.421875 4.390624-27.046875 20.277343-24.832031 37.132812 2.214843 16.855469 16.582031 29.457031 33.582031 29.457031 9.871094 0 17.871094 8.003907 17.871094 17.875 0 9.867188-8 17.871094-17.871094 17.871094s-17.871094-8.003906-17.871094-17.871094c0-4.417969-3.582031-8-8-8-4.417968 0-8 3.582031-8 8 .019532 15.328125 10.316406 28.738281 25.121094 32.71875v8.765625c0 4.417969 3.582031 8 8 8s8-3.582031 8-8v-8.398437c16.894531-3.699219 28.289062-19.535157 26.425781-36.730469-1.859375-17.195312-16.378906-30.226562-33.675781-30.222656-9.597656.003906-17.484375-7.574219-17.863281-17.164063-.375-9.589843 6.894531-17.765625 16.464843-18.511719zm0 0" />
                      <path d="m380.207031.390625c-49.214843 0-91.214843 32.113281-106.949219 75.113281h-198.558593c-4.398438 0-7.96875 3.964844-8 8.359375l-1.890625 280.640625h-56.597656c-4.417969 0-8.210938 3.199219-8.210938 7.625v35.613282c.101562 33.527343 26.507812 61.070312 60 62.585937v.175781h247v-.234375c2 .074219 2.824219.234375 4.089844.234375h.171875c34.664062-.054687 62.738281-28.171875 62.738281-62.835937v-180.0625c2 .109375 4.117188.167969 6.1875.167969 62.628906 0 113.59375-51.0625 113.59375-113.695313 0-62.628906-50.941406-113.6875-113.574219-113.6875zm-317.164062 454.113281h-.050781c-25.878907-.035156-46.875-20.960937-46.992188-46.84375v-27.15625h232v27.042969c.011719 16.695313 6.679688 32.699219 18.523438 44.46875.839843.839844 1.882812 1.488281 2.761718 2.488281zm294.957031-46.84375c.003906 25.835938-20.914062 46.792969-46.746094 46.84375h-.152344c-25.9375-.046875-46.972656-21.015625-47.101562-46.949218v-35.425782c.066406-2.046875-.714844-4.027344-2.164062-5.472656-1.449219-1.445312-3.429688-2.222656-5.472657-2.152344h-175.554687l1.835937-273h186.171875c-1.417968 7.324219-2.152344 14.761719-2.191406 22.21875-.015625 15.769532 3.273438 31.363282 9.65625 45.78125h-75.5625c-4.421875 0-8 3.582032-8 8 0 4.417969 3.578125 8 8 8h84.242188c16.503906 25.953125 42.886718 44.046875 73.039062 50.101563zm22.207031-195.882812c-53.890625 0-97.582031-43.6875-97.578125-97.582032 0-53.894531 43.6875-97.582031 97.582032-97.582031 53.890624 0 97.578124 43.691407 97.578124 97.582031-.058593 53.867188-43.710937 97.523438-97.582031 97.582032zm0 0" />
                      <path d="m149.367188 212.746094c-14.121094 0-25.605469 11.121094-25.605469 24.792968 0 13.671876 11.484375 24.792969 25.605469 24.792969 14.121093 0 25.609374-11.121093 25.609374-24.792969 0-13.671874-11.488281-24.792968-25.609374-24.792968zm0 33.585937c-5.300782 0-9.605469-3.945312-9.605469-8.792969 0-4.851562 4.308593-8.792968 9.605469-8.792968 5.296874 0 9.609374 3.945312 9.609374 8.792968 0 4.847657-4.3125 8.792969-9.609374 8.792969zm0 0" />
                      <path d="m192.71875 237.503906c0 4.417969 3.578125 8 8 8h106.65625c4.417969 0 8-3.582031 8-8 0-4.417968-3.582031-8-8-8h-106.65625c-4.421875 0-8 3.582032-8 8zm0 0" />
                      <path d="m149.367188 143.203125c-14.121094 0-25.605469 11.125-25.605469 24.796875s11.484375 24.792969 25.605469 24.792969c14.121093 0 25.609374-11.121094 25.609374-24.792969s-11.488281-24.796875-25.609374-24.796875zm0 33.589844c-5.300782 0-9.605469-3.945313-9.605469-8.792969s4.308593-8.796875 9.605469-8.796875c5.296874 0 9.609374 3.945313 9.609374 8.796875 0 4.847656-4.3125 8.796875-9.609374 8.796875zm0 0" />
                      <path d="m149.367188 282.28125c-14.121094 0-25.605469 11.121094-25.605469 24.792969s11.484375 24.792969 25.605469 24.792969c14.121093 0 25.609374-11.121094 25.609374-24.792969s-11.488281-24.792969-25.609374-24.792969zm0 33.585938c-5.300782 0-9.605469-3.941407-9.605469-8.792969 0-4.847657 4.308593-8.792969 9.605469-8.792969 5.296874 0 9.609374 3.945312 9.609374 8.792969 0 4.847656-4.3125 8.792969-9.609374 8.792969zm0 0" />
                      <path d="m307.375 299.503906h-106.65625c-4.421875 0-8 3.582032-8 8 0 4.417969 3.578125 8 8 8h106.65625c4.417969 0 8-3.582031 8-8 0-4.417968-3.582031-8-8-8zm0 0" />
                    </svg>
                    <span>Generate</span>
                  </button>
                </Link>
              </td>
            </tr>
          ))))}
        </tbody>
      </table>
      <Patient_Model
        showModal={showModal}
        data={rowData}
        setShowModal={setShowModal}
        fetchData={fetchData}
      />
    </div>
  );
};

export default PatientList;
