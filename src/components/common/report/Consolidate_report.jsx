/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../config/axios";
import SumReportTable from "./SumReportTable";
import ProgressReport from "./ProgressReport";
import Loader from "../ProgressBar/FullLoader";
import DateSelectionForm from "./dateChanger";

const ConsolidatedReport = () => {
  const [loader, setloader] = useState(true);
  const [data, setData] = useState("");
  const [date, setDate] = useState("");
  const [doctoprData, setDoctorData] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateModal, setDateModal] = useState(false);
  const [filterDate, setFilterDate] = useState({ StartDate: "", EndDate: "" });
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  useEffect(() => {
    Axios.get(
      `/admin/consolidated-reports/?BranchID=${BranchID}&StartDate=${filterDate.StartDate}&EndDate=${filterDate.EndDate}`
    ).then((resp) => {
      setData(resp?.data);
      setDate(resp?.data.date);
      const transformedDoctorsCollection = transformDoctorsByBranches(
        resp?.data.DoctorsColloction,
        resp?.data.branches
      );
      setDoctorData(transformedDoctorsCollection);
    });
  }, [BranchID, filterDate]);

  const transformDoctorsByBranches = (doctorsResult, branches) => {
    const doctorsGroupedByBranch = doctorsResult.reduce((acc, doctor) => {
      const { branchId } = doctor;
      if (!acc[branchId]) {
        acc[branchId] = [];
      }
      acc[branchId].push(doctor);
      return acc;
    }, {});

    // Then, for each branch, aggregate doctors' information
    const branchesWithDoctors = Object.entries(doctorsGroupedByBranch).map(
      ([branchId, doctors]) => {
        const branchName =
          branches.find((branch) => branch._id === branchId)?.branchName ||
          "Unknown Branch";
        const doctorsAggregated = doctors.reduce((acc, cur) => {
          const { doctorName, procedure, totalInvoiceSum, procedureCount } =
            cur;
          if (!acc[doctorName]) {
            acc[doctorName] = {
              doctorName,
              procedures: [],
              totalInvoiceSum: 0,
            };
          }
          acc[doctorName].procedures.push({ procedure, procedureCount });
          acc[doctorName].totalInvoiceSum += totalInvoiceSum;
          return acc;
        }, {});

        return {
          branchId,
          branchName,
          doctors: Object.values(doctorsAggregated),
        };
      }
    );

    return branchesWithDoctors;
  };

  const setupCustomDate = (date) => {
    setFilterDate(date);
  };

  return (
    <div className="px-10 ">
      {loader && <Loader />}
      <div className="py-10 overflow-x-auto">
        <h2 className="text-center font-bold text-2xl p-2 uppercase mb-5">
          Consolidated Report
        </h2>
        <DateSelectionForm
          ModalOpen={dateModal}
          setModalOpen={setDateModal}
          Submit={setupCustomDate}
        />
        <table className="w-full text-left border-8 uppercase ">
          <thead>
            <tr>
              <th className="border px-2 py-1">Branch</th>
              <th className="border px-2 py-1">Branch Total</th>
              <th className="border px-2 py-1">Invoice Count</th>
              <th className="border px-2 py-1">Department</th>
              <th className="border px-2 py-1">Department Total</th>
              <th className="border px-2 py-1">Sub Department</th>
              <th className="border px-2 py-1">Sub Department total</th>
              <th className="border px-2 py-1">Invoice Count</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-gray-300">
              <th colSpan={10} className="text-center py-2">
                Today -{" "}
                <span className="text-blue-800">{date.todayStartData}</span>
              </th>
            </tr>
            {data.today?.length ? (
              <SumReportTable data={data?.today} />
            ) : (
              <tr>
                <th className="text-red-400 text-center" colSpan={10}>
                  No data Available
                </th>
              </tr>
            )}

            <tr className="bg-gray-300 ">
              <th colSpan={10} className="py-2 w-full">
                <span className="flex justify-center items-center gap-1">
                  Month -
                  <span className="text-blue-800 flexitems-center gap-2">
                    {date && `${date.lastMonthStart}  -  ${date.lastMonthEnd}`}
                  </span>
                </span>
              </th>
            </tr>
            <SumReportTable data={data?.asOfLastMonth} />
          </tbody>
        </table>

        <div className=" w-full flex justify-end items-center    hover:cursor-pointer  ">
          <div className="w-fit">
            <div
              title="Custom Date"
              className="text-xs capitalize flex gap-1 text-blue-800 py-2 pr-1  group  "
              onClick={() => {
                setDateModal(true);
              }}
            >
             <span className="cursor-pointer group-hover:scale-105 duration-300">Custom Report Generation</span> 
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
        </div>
      </div>
      <ProgressReport setloader={setloader} />
      <div className="w-full flex justify-around py-5">
        <div className="w-full flex flex-wrap justify-around py-5">
          {doctoprData.map((group) => (
            <div key={group.branchName} className="w-full md:w-1/2 p-4  ">
              <div className="flex flex-col text-center font-bold text-xl p-2 uppercase mt-5">
                <h2 className="text-center font-bold text-xl p-2 uppercase ">
                  {group.branchName}{" "}
                </h2>
                <span className="text-blue-800">
                  [{date.lastMonthStart + " - " + date.lastMonthEnd}]
                </span>
              </div>

              <div className="max-w-full h-[600px] mx-auto p-6 ">
                <div className="max-h-[500px] h-[500px] overflow-y-auto border-8">
                  <table className="text-sm text-left text-gray-500 w-full ">
                    <thead className="text-xs text-gray-700 bg-gray-200 text-center uppercase ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Collection
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.doctors.map((doctor, i) => (
                        <tr
                          key={i}
                          className="odd:bg-white border text-center hover:bg-slate-200"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                          }}
                        >
                          <td className="px-6 py-4">{doctor.doctorName}</td>
                          <td className="px-6 py-4">{`Rs ${doctor.totalInvoiceSum}/-`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!!selectedDoctor && (
          <div className="w-1/2 ml-5 mt-9 ">
            <h2 className="text-center font-bold text-2xl p-2 uppercase mb-5 mt-7">
              Detailed Report
            </h2>
            <div className="w-full border-2 border-black mt-14">
              <div className="py-3 border-b-2 border-black">
                <div className="flex flex-col mt-2">
                  <span className="text-lg text-center">
                    {selectedDoctor?.doctorName}
                  </span>
                  <span className="text-lg text-center">
                    Rs- {selectedDoctor?.totalInvoiceSum}/-{" "}
                    <span className="text-xs capitalize">
                      (Total Collection)
                    </span>
                  </span>
                </div>
              </div>

              <table className="text-sm text-gray-500 w-full">
                <thead className="text-xs text-gray-700 uppercase">
                  <tr className="border">
                    <th className="py-4">Procedure</th>
                    <th className="py-4">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDoctor?.procedures?.map((Procedure, i) => (
                    <tr
                      key={i}
                      className="odd:bg-white even:bg-gray-200 text-center"
                    >
                      <td className="py-4">
                        <span className="flex flex-col">
                          {Procedure.procedure}
                        </span>
                      </td>
                      <td className="py-4">{`  ${Procedure?.procedureCount} `}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsolidatedReport;
