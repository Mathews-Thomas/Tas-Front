/* eslint-disable react/prop-types */
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import Axios from "../../../config/axios";
import { formatDate } from "../../../commonFn/Datefn";
import Logo from "../../../assets/NavBar/logo 1.png";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import ProgressBar from "../../common/ProgressBar/ProgressBar";

const MedicineTable = ({ data, fetchData, loader }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [branchDetails, setBranchDetails] = useState({});
  const [invoice, setInvoice] = useState(null);

 
  const fetchBranchDetails = useCallback(
    async (BranchID) => {
      // Early return if data is already cached
      if (branchDetails[BranchID]) {
        return branchDetails[BranchID];
      }
      try {
        const { data } = await Axios.get(`/get-branch/${BranchID}`);
        // Cache fetched data
        setBranchDetails((prev) => ({
          ...prev,
          [BranchID]: data,
        }));
        return data;
      } catch (error) {
        console.error("Failed to fetch branch details:", error);
        return null;
      }
    },
    [branchDetails]
  );

  const handleRowClick = useCallback(
    async (row) => {
      await fetchBranchDetails(row.BranchID);
      setSelectedRow(row);
      setShowModal(true);
    },
    [fetchBranchDetails]
  );

  const handleEditClick = (selectedRow) => {
    setInvoice(selectedRow);
    setShowEditModal(true);
    console.log(selectedRow)
  };
 

  const handleDeleteClick = async (selectedRow) => {
    const invoiceCreatedAt = moment(selectedRow.createdAt);
    const now = moment();
    const hoursDiff = now.diff(invoiceCreatedAt, "hours");
    const daysDiff = now.diff(invoiceCreatedAt, "days");
    const jobRole = localStorage.getItem("jobRole");
    // Assuming 'reception' role has 8 hours to delete and 'admin' has 30 days
    let canDelete = false;
    if (jobRole === "user" && hoursDiff <= 8) {
      canDelete = true;
    } else if (jobRole === "admin" && daysDiff <= 4) {
      canDelete = true;
    }

    if (canDelete) {
      // SweetAlert2 confirmation dialog
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the delete operation
          Axios.delete(`/delete-invoice/${selectedRow._id}`)
            .then(() => {
              fetchData(); // Refresh the data
              Swal.fire("Deleted!", "The invoice has been deleted.", "success");
            })
            .catch((error) => {
              console.error("Failed to delete invoice:", error);
              Swal.fire("Failed!", "Failed to delete the invoice.", "error");
            });
        }
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "You are not allowed to delete this invoice.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const invoicemodelprint = () => {
    const printWindow = window.open(" ", "_blank");
    document.getElementById("PrintButton").hidden = true;

    const invoice = document.querySelector("#invoicemodelid").outerHTML; // Adjust the selector to target your specific table
    const tailwindCssLink =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">';
    printWindow.document.write(`
    <html>
      <head> 
        ${tailwindCssLink}  
      </head>
      <body>
        ${invoice}  
      </body>
    </html> `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
    document.getElementById("PrintButton").hidden = false;
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="border-collapse text-left bg-white min-w-full border-8">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">

            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Medicine Name
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Category
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Quantity
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Price
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Batch Number
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Expiration Date
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-sm font-light">
          {loader ? (
            <tr>
              <td colSpan="9" className="text-center font-bold text-red-600 py-4">
                <ProgressBar />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center font-bold text-red-600 py-4">
                No data available
              </td>
            </tr>
          ) : (
            data.map((medicine, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 even:bg-slate-100 odd:bg-white cursor-pointer"
                onClick={() => handleRowClick(medicine)}
              >
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {medicine?.medicineName}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {medicine?.category}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {medicine?.quantity}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {medicine?.price}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {medicine?.batchNumber}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {formatDate(medicine?.expirationDate)}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  <div className="flex justify-center items-center gap-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={20}
                      viewBox="0 0 24 24"
                      width={20}
                      fill="#387ADF"
                      onClick={() => handleEditClick(medicine)}
                      className="cursor-pointer hover:scale-125 duration-300"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    <svg
                  onClick={() => {
                    index === 0
                      ? handleDeleteClick(medicine)
                      : Swal.fire({
                          title: "Error!",
                          text: "You are not allowed to delete this invoice.",
                          icon: "error",
                          confirmButtonText: "OK",
                        });
                  }}
                  className="cursor-pointer hover:scale-125 duration-300"
                  id="Layer_1"
                  enableBackground="new 0 0 512 512"
                  height="20"
                  viewBox="0 0 512 512"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill={` ${index === 0 ? "#387ADF" : "#FF0000"} `}
                >
                  <path d="m320.99 435.003 20.021-273.71c.362-4.958 4.688-8.692 9.632-8.319 4.958.362 8.683 4.675 8.319 9.632l-20.021 273.71c-.346 4.734-4.294 8.344-8.966 8.344-.221 0-.442-.008-.666-.024-4.957-.364-8.682-4.676-8.319-9.633zm-155.463 1.312c.346 4.734 4.294 8.344 8.966 8.344.221 0 .443-.008.666-.024 4.958-.362 8.683-4.675 8.319-9.632l-20.021-273.71c-.362-4.957-4.693-8.688-9.632-8.319-4.958.362-8.683 4.675-8.319 9.632zm85.078 8.344c4.971 0 9-4.029 9-9v-275.883c0-4.971-4.029-9-9-9s-9 4.029-9 9v275.883c0 4.971 4.03 9 9 9zm222.237-331.5c-.945 4.924-5.755 8.065-10.536 7.142l-21.601-4.147-36.156 320.514c-2.292 20.321-10.735 39.03-23.773 52.68-13.954 14.607-32.602 22.652-52.511 22.652h-152.061c-19.909 0-38.558-8.045-52.511-22.652-13.038-13.65-21.481-32.358-23.773-52.68l-36.929-327.364c-.287-2.546.524-5.095 2.232-7.006 1.707-1.91 4.148-3.003 6.711-3.003h280.959l-306.593-58.862c-4.881-.938-8.078-5.654-7.142-10.536.937-4.881 5.651-8.076 10.536-7.142l143.697 27.588 4.626-24.094c1.624-8.46 6.466-15.795 13.634-20.653 7.168-4.859 15.777-6.637 24.234-5.016l65.072 12.493c8.46 1.624 15.795 6.466 20.654 13.634 4.858 7.167 6.64 15.773 5.016 24.233l-4.626 24.094 143.699 27.589c4.881.938 8.078 5.654 7.142 10.536zm-50.38 4.136h-340.455l35.8 317.355c3.941 34.944 27.955 59.35 58.397 59.35h152.061c30.442 0 54.456-24.405 58.397-59.35zm-211.393-63.558 93.255 17.904 4.626-24.094c.718-3.738-.077-7.553-2.237-10.74-2.161-3.188-5.41-5.338-9.148-6.056l-65.073-12.493c-3.736-.719-7.553.076-10.74 2.237-3.188 2.16-5.338 5.409-6.056 9.147z" />
                </svg>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for viewing invoice details */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-4xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <img src={Logo} alt="Logo" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-semibold text-gray-900"
                      id="modal-headline"
                    >
                      Medicine Details
                    </h3>
                    <div className="mt-4">
                      <div className="text-md font-medium text-gray-700">
                        <p>
                          <span className="font-semibold">Medicine Name: </span>
                          {selectedRow?.medicineName}
                        </p>
                        <p>
                          <span className="font-semibold">Category: </span>
                          {selectedRow?.category}
                        </p>
                        <p>
                          <span className="font-semibold">Quantity: </span>
                          {selectedRow?.quantity}
                        </p>
                        <p>
                          <span className="font-semibold">Price: </span>
                          {selectedRow?.price}
                        </p>
                        <p>
                          <span className="font-semibold">Batch Number: </span>
                          {selectedRow?.batchNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Expiration Date: </span>
                          {formatDate(selectedRow?.expirationDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-4xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <img src={Logo} alt="Logo" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-semibold text-gray-900"
                      id="modal-headline"
                    >
                      Edit Medicine Details
                    </h3>
                    <div className="mt-4">
                      <div className="text-md font-medium text-gray-700">
                        <p>
                          <span className="font-semibold">Medicine Name: </span>
                          {invoice?.medicineName}
                        </p>
                        <p>
                          <span className="font-semibold">Category: </span>
                          {invoice?.category}
                        </p>
                        <p>
                          <span className="font-semibold">Quantity: </span>
                          {invoice?.quantity}
                        </p>
                        <p>
                          <span className="font-semibold">Price: </span>
                          {invoice?.price}
                        </p>
                        <p>
                          <span className="font-semibold">Batch Number: </span>
                          {invoice?.batchNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Expiration Date: </span>
                          {formatDate(invoice?.expirationDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;

