/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../config/axios";
import NewVisitor from "./NewVisitor";
import ReVisitor from "./ReVisitor";

const ProgressReport = ({setloader}) => {
  const [newVisitor, setNewVisitor] = useState([]);
  const [reVisitor, setReVisitor] = useState([]);
  const [date, setDate] = useState(null);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  useEffect(() => {
    Axios.get(
      `/admin/consolidated-progress-reports/?BranchID=${BranchID}`
    ).then((resp) => {
      // console.log(resp?.data.date)
      setDate(resp?.data.date);
      function transformData(aggregatedResults, branches) {
        const branchMap = new Map(
          branches.map((branch) => [branch?._id, branch?.branchName])
        );
        const structureMap = new Map();
        aggregatedResults.forEach((result) => {
          const {
            _id: { BranchID, MainDepartmentID },
            newVisitors,
            departmentName,
            mainDepartmentName,
          } = result;
          const branchName = branchMap?.get(BranchID);
          if (!structureMap.has(BranchID)) {
            structureMap.set(BranchID, {
              branchName,
              New_visitors: 0,
              mainDepartments: new Map(),
            });
          }

          const branch = structureMap.get(BranchID);
          branch.New_visitors += newVisitors; // Accumulate new visitors at the branch level

          if (!branch.mainDepartments.has(MainDepartmentID)) {
            branch.mainDepartments.set(MainDepartmentID, {
              mainDepartmentName,
              New_visitors: 0,
              departments: [],
            });
          }
          const mainDepartment = branch.mainDepartments.get(MainDepartmentID);
          mainDepartment.New_visitors += newVisitors; // Accumulate new visitors at the main department level
          mainDepartment.departments.push({
            departmentName,
            New_visitors: newVisitors,
          });
        });

        // Convert the Map to the desired array structure
        const structuredData = Array.from(structureMap.values()).map(
          (branch) => ({
            branchName: branch.branchName,
            New_visitors: branch.New_visitors,
            mainDepartments: Array.from(branch.mainDepartments.values()).map(
              (md) => ({
                mainDepartmentName: md.mainDepartmentName,
                New_visitors: md.New_visitors,
                departments: md.departments,
              })
            ),
          })
        );

        return structuredData;
      }

      const NewToday = transformData(
        resp.data.results.today,
        resp.data.branches
      );
      const NewThisMonth = transformData(
        resp.data.results.thisMonth,
        resp.data.branches
      );

      const NewResult = {
        Today: NewToday,
        thisMonth: NewThisMonth,
      };

      // setNewVisitor(NewResult);
      //=========================================================================================================

      const branchesMap = new Map(
        resp.data.branches.map((branch) => [
          String(branch._id),
          branch.branchName,
        ])
      );

      const mainDepartmentsMap = new Map(
        resp.data.MainDepartments.flatMap((mainDepartment) =>
          mainDepartment.departments.map((departmentId) => [
            String(departmentId),
            {
              mainDepartmentId: String(mainDepartment._id),
              mainDepartmentName: String(mainDepartment.Name),
              BranchID: String(mainDepartment.BranchID), // Convert to string if necessary
            },
          ])
        )
      );

      function transformVisitResults(
        visitResults,
        branchesMap,
        mainDepartmentsMap
      ) {
        const branchData = {};

        visitResults.forEach((result) => {
          const branchName = branchesMap.get(String(result.BranchID));

          const { mainDepartmentName } =
            mainDepartmentsMap.get(String(result.department)) || {};
          const departmentData = {
            departmentName: result.department,
            visitors: result.uniquePatients,
          };

          if (!branchData[branchName]) {
            branchData[branchName] = { visitors: 0, mainDepartments: {} };
          }

          const branch = branchData[branchName];
          branch.visitors += result.uniquePatients;

          if (!branch.mainDepartments[mainDepartmentName]) {
            branch.mainDepartments[mainDepartmentName] = {
              visitors: 0,
              departments: [],
            };
          }

          const mainDepartment = branch.mainDepartments[mainDepartmentName];
          mainDepartment.visitors += result.uniquePatients;

          const existingDepartmentIndex = mainDepartment.departments.findIndex(
            (dept) => dept.departmentName === departmentData.departmentName
          );
          if (existingDepartmentIndex > -1) {
            mainDepartment.departments[existingDepartmentIndex].visitors +=
              departmentData.visitors;
          } else {
            mainDepartment.departments.push(departmentData);
          }
        });

        return Object.entries(branchData).map(([branchName, data]) => ({
          branchName,
          visitors: data.visitors,
          mainDepartments: Object.entries(data.mainDepartments).map(
            ([mainDepartmentName, mdData]) => ({
              mainDepartmentName,
              visitors: mdData.visitors,
              departments: mdData.departments,
            })
          ),
        }));
      }

      const visitResults = {
        today: transformVisitResults(
          resp.data.vistorResults.today,
          branchesMap,
          mainDepartmentsMap
        ),
        thisMonth: transformVisitResults(
          resp.data.vistorResults.thisMonth,
          branchesMap,
          mainDepartmentsMap
        ),
      };

      setReVisitor(visitResults);
      setloader(false)
    });
  }, [BranchID]);

  return (
    <div className="flex gap-2 justify-around flex-wrap w-auto">
      <div className="w-full lg:w-[45%] ">
        <h2 className="text-center font-bold text-md p-2 uppercase">New</h2>
        <NewVisitor data={newVisitor.Today} Head={"Today"} />
        <NewVisitor
          data={newVisitor.thisMonth}
          Head={"Month "}
          date={date && `[${date?.lastMonthStart} - ${date.todayStartData}]`}
           
        />
      </div>
      <div className="w-full lg:w-[45%]">
        <h2 className="text-center font-bold text-md p-2 uppercase">Visit</h2>
        <ReVisitor data={reVisitor.today} Head={"Today"} />
        <ReVisitor
          data={reVisitor.thisMonth}
          Head={"Month "}
          date={date && `[${date?.lastMonthStart} - ${date.todayStartData}]`}
        />
      </div>
    </div>
  );
};

export default ProgressReport;
