import React, { useCallback, useState } from "react";
import ProgressBar from "../../common/ProgressBar/ProgressBar";

function MedicineTable({ data, loader }) {
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="border-collapse text-left bg-white min-w-full border-8">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              ID
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Date
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Patient Name
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
             Consuambles
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Doctor
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Total Discount
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Amount Paid
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-sm font-light">
          {loader ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                <ProgressBar />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                No data available
              </td>
            </tr>
          ) : (
            data?.map((invoice, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                onClick={() => handleRowClick(invoice)}
              >
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.invoiceID}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {formatDate(invoice?.createdAt)}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.patientID?.Name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.items?.map((item, i) => (
                    <span key={i}>
                      {item?.MedicineID?.medicineName}
                      <br />
                    </span>
                  ))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.doctorID?.name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.totalDiscount}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.totalAmount}
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-6 py-3  border-gray-200 capitalize flex gap-3 justify-center items-center   "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    viewBox="0 0 24 24"
                    width={20}
                    fill="#387ADF"
                    onClick={() => {
                      handleEditClick(invoice);
                    }}
                    className="cursor-pointer hover:scale-125 duration-300"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>

                  <svg
                    onClick={() => {
                      index === 0
                        ? handleDeleteClick(invoice)
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* <Invoive_Edit_Modal
        fetchData={fetchData}
        invoice={invoice}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      /> */}
    </div>
  );
}

export default MedicineTable;
