import { useEffect, useState } from "react";
import Axios from "../../../config/axios";
import Doctorlist_Model from "../DoctorList/Doctor_List_Modal";
import View_More_Modal from "../../ReviewPanel/commen/View_More_Modal";
import ProgressBar from "../../common/ProgressBar/ProgressBar";
import MedicineEditForm from "./MedicineEditForm";

function CustomTable({
  Head,
  columns,
  Data,
  endpoints,
  selectedTable,
  refresh,
  setRefresh,
  page,
  limit,
  loader,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [data, setData] = useState(Data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedViewMoreData, setSelectedViewMoreData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [jobRole, setJobRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("jobRole");
    setJobRole(role);
  }, []);
  
  // status changing logic
  const handleToggleChange = async (id, currentStatus) => {
    try {
      const response = await Axios.put(
        "/admin/medicine/update-medicine-status",
        { _id: id, status: !currentStatus }
      );
      if (response.status === 200) {
        setData((prevData) => {
          const newData = prevData.map((item) => {
            return item._id === id ? { ...item, status: !currentStatus } : item;
          });
          return newData;
        });
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.log("Error updating status", err);
    }
  };

  useEffect(() => {
    if (jobRole) {
      if (jobRole === 'admin') {
        setData(Data);
      } else {
        const filteredData = Data.filter(item => item.status === true);
        setData(filteredData);
      }
    }
  }, [jobRole, Data]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openDoctorModal = () => setShowModal(true);
  const openViewMoreModal = () => setShowViewMoreModal(true);

  const handleRowClick = (option, row) => {
    setSelectedRowData(row);
    openModal();
    setSelectedOption(option);
  };

  const handleDoctorRowClick = (row) => {
    setSelectedRowData(row);
    openDoctorModal();
  };

  const handleViewMoreClick = (row) => {
    setSelectedViewMoreData(row);
    openViewMoreModal();
  };

  return (
    <div className="flex flex-col justify-center items-center mx-auto">
      {isModalOpen && (
        <MedicineEditForm
          refresh={refresh}
          setRefresh={setRefresh}
          initialData={selectedRowData}
          selectedOptionName={selectedOption}
          open={isModalOpen}
          onClose={closeModal}
        />
      )}
      {showModal && (
        <Doctorlist_Model
          data={selectedRowData}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      {showViewMoreModal && (
        <View_More_Modal
          data={selectedViewMoreData}
          setShowModal={setShowViewMoreModal}
          showModal={showViewMoreModal}
        />
      )}
      <h1 className="text-xl text-center uppercase font-bold py-5">
        {selectedTable} Directory
      </h1>
      <table className="border-collapse text-left bg-white border-8 w-full capitalize">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">
            <th className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs">
              Sl.No
            </th>
            {Head?.map((Head, index) => (
              <th
                key={index}
                className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs"
              >
                {Head}
              </th>
            ))}
             {jobRole === "admin" && (
              <th className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs">
                Approval
              </th>
            )}
            <th className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs">
              Action
            </th>
            {jobRole === "admin" && (
              <th className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs">
                Visibility
              </th>
            )}
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
            <>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                >
                  <td className="px-3 py-3 border-b border-gray-200">
                    {index + 1 + (page - 1) * limit}
                  </td>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 py-3 border-b border-gray-200 cursor-pointer"
                    >
                      {row[column]}
                    </td>
                  ))}
                    {jobRole === "admin" && (
                  <td className="px-3 py-3 border-b border-gray-200">
                    {row.approved ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="green"
                        className="w-6 h-6 flex"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="red"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </td>)}
                  <td className="px-3 py-3 border-b border-gray-200">
                    <div className="flex flex-col items-center lg:flex-row gap-4">
                      {(selectedTable === "Doctors" ||
                        selectedTable === "Main Department") && (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            selectedTable === "Doctors"
                              ? handleDoctorRowClick(row)
                              : selectedTable === "Main Department"
                              ? handleViewMoreClick(row)
                              : " ";
                          }}
                        >
                          <svg
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width={30}
                            viewBox="0 0 461.312 461.312"
                            style={{
                              enableBackground: "new 0 0 461.312 461.312",
                            }}
                          >
                            <g>
                              <g>
                                <path
                                  d="M230.656,156.416c-40.96,0-74.24,33.28-74.24,74.24s33.28,74.24,74.24,74.24s74.24-33.28,74.24-74.24
                        S271.616,156.416,230.656,156.416z M225.024,208.64c-9.216,0-16.896,7.68-16.896,16.896h-24.576
                        c0.512-23.04,18.944-41.472,41.472-41.472V208.64z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M230.656,0C103.424,0,0,103.424,0,230.656s103.424,230.656,230.656,230.656s230.656-103.424,230.656-230.656
                        S357.888,0,230.656,0z M230.656,421.888c-105.984,0-191.232-85.248-191.232-191.232S124.672,39.424,230.656,39.424
                        s191.232,85.248,191.232,191.232S336.64,421.888,230.656,421.888z"
                                />
                              </g>
                            </g>
                          </svg>
                        </div>
                      )}
                      {(selectedTable === "Category" ||
                        selectedTable === "Sub Department" ||
                        selectedTable === "Medicine") && (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleViewMoreClick(row)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width={30}
                            height={30}
                            stroke="currentColor"
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="css-i6dzq1"
                          >
                            <circle cx={12} cy={12} r={10} />
                            <line x1={12} y1={16} x2={12} y2={12} />
                            <line x1={12} y1={8} x2="12.01" y2={8} />
                          </svg>
                        </div>
                      )}
                      {selectedTable === "Main Department" && (
                        <div className="cursor-pointer">
                          <svg
                            height={20}
                            viewBox="0 0 20 20"
                            width={20}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 15l-5.4-5.4c-.5-.5-.5-1.3 0-1.8s1.3-.5 1.8 0L10 11.4l3.6-3.6c.5-.5 1.3-.5 1.8 0s.5 1.3 0 1.8L10 15z" />
                          </svg>
                        </div>
                      )}
                      <button
                        title="Edit"
                        onClick={() => handleRowClick(selectedTable, row)}
                      >
                        <svg
                          height="20"
                          viewBox="0 -1 401.52289 401"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#007BFF"
                            d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0"
                          />
                          <path
                            fill="#007BFF"
                            d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  {jobRole === "admin" && (
                    <td className="px-3 py-3 border-b border-gray-200">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.status}
                          onChange={() =>
                            handleToggleChange(row._id, row.status)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`relative toggle w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                            row.status ? "bg-[#28A745]" : "bg-[#6C757D]"
                          }`}
                        >
                          <span
                            className={`absolute right-5 top-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                              row.status ? "translate-x-full" : ""
                            }`}
                            style={{
                              transform: `translateX(${
                                row.status ? "100%" : "0%"
                              })`,
                            }}
                          ></span>
                        </div>
                      </label>
                    </td>
                    
                  )}
                </tr>    
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
