import React, { useState, useEffect } from "react";
import Date_picker from "./date_changer";
import Axios from "../../../config/axios";
import { format, startOfMonth, endOfMonth } from "date-fns";

const Medicine_consolidated_report = () => {
  const [todayData, setTodayData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const fetchReport = async (startDate, endDate) => {
    try {
      const response = await Axios.get("/admin/medicine/consolidated-report", {
        params: { startDate, endDate },
      });
      const todayData = response.data.filter((item) => item.isToday);
      const monthData = response.data.filter((item) => !item.isToday);

      setTodayData(todayData || []);
      setMonthData(monthData || []);
    } catch (error) {
      console.error("Error fetching the report:", error);
      setTodayData([]);
      setMonthData([]);
    }
  };

  const setupCustomDate = ({ StartDate, EndDate }) => {
    setCustomStartDate(StartDate);
    setCustomEndDate(EndDate);
    fetchReport(StartDate, EndDate);
  };

  const fetchCurrentMonthReport = () => {
    setCustomStartDate(null);
    setCustomEndDate(null);
    const today = new Date();
    const startMonth = format(startOfMonth(today), "yyyy-MM-dd");
    const endMonth = format(endOfMonth(today), "yyyy-MM-dd");
    fetchReport(startMonth, endMonth);
  };

  useEffect(() => {
    fetchCurrentMonthReport();
  }, []);

  const renderDateRange = () => {
    if (customStartDate && customEndDate) {
      return `${format(new Date(customStartDate), "dd/MM/yyyy")} - ${format(
        new Date(customEndDate),
        "dd/MM/yyyy"
      )}`;
    } else {
      return `${format(startOfMonth(new Date()), "dd/MM/yyyy")} - ${format(
        endOfMonth(new Date()),
        "dd/MM/yyyy"
      )}`;
    }
  };

  return (
    <>
      <div className="px-1">
        <div className="py-5 overflow-x-auto">
          <Date_picker
            ModalOpen={modalOpen}
            setModalOpen={setModalOpen}
            Submit={setupCustomDate}
          />

          <table className="w-full text-left border-8 uppercase">
            <thead>
              <tr>
                <th className="border px-2 py-1">Branch</th>
                <th className="border px-2 py-1">Branch Total</th>
                <th className="border px-2 py-1">Invoice Total Count</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Department Total</th>
                <th className="border px-2 py-1">Invoice Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="text-center bg-gray-300 font-bold">
                  TODAY - {format(new Date(), "dd/MM/yyyy")}
                </td>
              </tr>
              {Array.isArray(todayData) && todayData.length > 0 ? (
                todayData.map((branch, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        className="border px-2 py-1"
                        rowSpan={branch.departments.length}
                      >
                        {branch.branch}
                      </td>
                      <td
                        className="border px-2 py-1"
                        rowSpan={branch.departments.length}
                      >
                        {branch.totalAmountCollectedByBranch}
                      </td>
                      <td
                        className="border px-2 py-1"
                        rowSpan={branch.departments.length}
                      >
                        {branch.branchInvoiceCount}
                      </td>
                      <td className="border px-2 py-1">
                        {branch.departments[0].department.Name}
                      </td>
                      <td className="border px-2 py-1">
                        {branch.departments[0].totalAmountCollected}
                      </td>
                      <td className="border px-2 py-1">
                        {branch.departments[0].departmentInvoiceCount}
                      </td>
                    </tr>
                    {branch.departments.slice(1).map((dept, deptIndex) => (
                      <tr key={deptIndex}>
                        <td className="border px-2 py-1">
                          {dept.department.Name}
                        </td>
                        <td className="border px-2 py-1">
                          {dept.totalAmountCollected}
                        </td>
                        <td className="border px-2 py-1">
                          {dept.departmentInvoiceCount}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-red-500">
                    NO DATA AVAILABLE
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="6" className="text-center bg-gray-300 font-bold">
                  MONTH - {renderDateRange()}
                </td>
              </tr>
              {Array.isArray(monthData) && monthData.length > 0 ? (
                monthData.map((branch, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        className="border px-2 py-1"
                        rowSpan={branch.departments.length}
                      >
                        {branch.branch}
                      </td>
                      <td
                        className="border px-2 py-1"
                        rowSpan={branch.departments.length}
                      >
                        {branch.totalAmountCollectedByBranch}
                      </td>
                      <td
                        className="border px-2 py-1"
                        rowSpan={branch.departments.length}
                      >
                        {branch.branchInvoiceCount}
                      </td>
                      <td className="border px-2 py-1">
                        {branch.departments[0].department.Name}
                      </td>
                      <td className="border px-2 py-1">
                        {branch.departments[0].totalAmountCollected}
                      </td>
                      <td className="border px-2 py-1">
                        {branch.departments[0].departmentInvoiceCount}
                      </td>
                    </tr>
                    {branch.departments.slice(1).map((dept, deptIndex) => (
                      <tr key={deptIndex}>
                        <td className="border px-2 py-1">
                          {dept.department.Name}
                        </td>
                        <td className="border px-2 py-1">
                          {dept.totalAmountCollected}
                        </td>
                        <td className="border px-2 py-1">
                          {dept.departmentInvoiceCount}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-red-500">
                    NO DATA AVAILABLE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="w-full flex justify-end items-center hover:cursor-pointer gap-2">
            <div className="w-fit">
              <div
                title="Custom Date"
                className="text-xs capitalize flex gap-1 text-blue-800 py-2 pr-1 group"
                onClick={() => setModalOpen(true)}
              >
                <span className="cursor-pointer group-hover:scale-105 duration-300">
                  Custom Report Generation
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={17}
                  viewBox="0 0 24 24"
                  width={20}
                  fill="#387ADF"
                  className="cursor-pointer group-hover:scale-105 duration-300"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </div>
              <hr className="border-1" />
            </div>
            <div className="w-fit">
              <div
                title="Go to This Month Report"
                className="text-xs capitalize flex gap-1 text-blue-800 py-2 pr-1 group"
                onClick={fetchCurrentMonthReport}
              >
                <span className="cursor-pointer group-hover:scale-105 duration-300">
                  Go to This Month Report
                </span>
              </div>
              <hr className="border-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Medicine_consolidated_report;
