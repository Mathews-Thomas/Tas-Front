import CompanyInfo from "../../components/ReviewPanel/companyInfo";
import ChartSesion from "../../components/ReviewPanel/Homepage/ChartSesion";
import Cards from "../../components/ReviewPanel/Homepage/Analyticalcards";
import Alertform from "../../components/ReviewPanel/Homepage/Alertform";
import TaskReminder from "../../components/ReviewPanel/Homepage/Taskbox";
import Collection from "../../components/ReviewPanel/Homepage/DoctorCollection";
import TopProcedures from "../../components/ReviewPanel/Homepage/TopProceduresList";
import EmployeeList from "../../components/ReviewPanel/Homepage/Employee";
import { useEffect, useState } from "react";
import Axios from "../../config/axios";

const Dashboard = () => {
  const [report, setReport] = useState([]);
  useEffect(() => {
    Axios.get("/admin/adminhome-reports")
      .then((resp) => {
        setReport(resp?.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="p-4 lg:p-8">
      <CompanyInfo type={" Reception panel"} />
      <Cards report={report} />
      <div className="flex gap-10">
        <div className="w-1/2">
          <Alertform />
        </div>
        <div className="w-1/2">
          <TaskReminder />
        </div>
      </div>
      <div className="flex gap-10">
        <div className="w-[48%]">
          <Collection report={report} />
        </div>
        <div className="w-[48%]">
          <TopProcedures report={report} />
        </div>
      </div>
      <EmployeeList report={report} />
      <div className="mt-20">
        <h1 className="uppercase text-2xl font-semibold">
          Analytical Represenatation
        </h1>
        <ChartSesion />
      </div>
    </div>
  );
};

export default Dashboard;
