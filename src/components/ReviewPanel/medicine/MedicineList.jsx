import React, { useCallback, useEffect, useState } from 'react';
import Axios from "../../../config/axios";
import { Pagination, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import Table from "./Table";
import Select_Branch_ID from "../../ReviewPanel/commen/BranchIDSelection";

const MedicineList = ({ refresh, setRefresh, list = 10 }) => {
  const [loader, setLoader] = useState(true);
  const [medicineList, setMedicineList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [branch, setBranch] = useState({});
  const [mainDepartments, setMainDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedMainDepartment, setSelectedMainDepartment] = useState("");

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(async () => {
    if (!branch?.id) return; // Ensure branch ID is present
    try {
      const response = await Axios.get(`admin/medicine/get-medicine/${branch?.id}`, {
        params: {
          search: searchTerm,
          page,
          list,
          DepartmentID : selectedMainDepartment
        },
      });
      setLoader(false);
      setMedicineList(response.data.medicines);
      setTotalPages(response.data.totalPages);
      console.log(response.data.medicines);
      console.log(branch?.id);
    } catch (error) {
      console.error("Error fetching medicine list:", error);
    }
  }, [branch?.id, searchTerm, page, list, selectedMainDepartment]);

  useEffect(() => {
    if (branch?.id) {
      setLoader(true);
      fetchData();
    }
  }, [branch, page, list, fetchData]);

  useEffect(() => {
    if (searchTerm || refresh) {
      const handleSearch = setTimeout(() => {
        fetchData();
        setRefresh(false);
      }, 500); // Debounce time
      return () => clearTimeout(handleSearch);
    }
  }, [searchTerm, fetchData, refresh, setRefresh]);

  useEffect(() => {
    Axios.get('/admin/get-addOns')
      .then((resp) => {
        const mainDepartmentsData = resp?.data?.MainDepartments?.map(Main => ({
          option: Main?.Name,
          id: Main?._id,
          subOption: Main?.BranchID?.branchName,
          BranchID: Main?.BranchID?._id
        }));
        setMainDepartments(mainDepartmentsData);
      })
      .catch((err) => {
        console.error('Error fetching branches and main departments:', err);
      });
  }, []);

  useEffect(() => {
    if (branch?.id) {
      const filtered = mainDepartments.filter(dept => dept.BranchID === branch.id);
      setFilteredDepartments(filtered);
      setSelectedMainDepartment(""); // Reset department selection when branch changes
    } else {
      setFilteredDepartments([]);
    }
  }, [branch, mainDepartments]);

  const columns = ["medicineName", "category", "quantity", "price", "createdBy"]; // Adjust as per your data structure
  const tableHeaders = ["Medicine Name", "Category", "Quantity", "Price", "Created By"]; // Adjust as per your data structure

  const endpoints = {
    update: 'medicine/update-status', // Adjust the endpoint for updating medicine status
    approve: 'medicine/approve', // Adjust the endpoint for approving medicine
  };

  return (
    <div className="topbar m-5 p-8 bg-white">
      <div className="flex justify-center w-full">
        <div className="flex justify-start w-full items-center">
          <h2 className="text-xl text-center uppercase font-bold py-5">
            Medicine Directory - {branch?.type}
          </h2>
        </div>
        <div className="w-full flex justify-end items-center">
          <div className="flex gap-5 justify-end items-center w-full">
            <Select_Branch_ID value={branch} onChange={setBranch} />
            <FormControl variant="outlined" className="w-2/3">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                value={selectedMainDepartment}
                onChange={(e) => setSelectedMainDepartment(e.target.value)}
                label="Department"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {filteredDepartments.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-[0.965rem] border w-[50%] border-gray-300 rounded mt-2 focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>
      </div>

      <Table
        Head={tableHeaders}
        columns={columns}
        Data={medicineList}
        endpoints={endpoints}
        selectedTable="Medicines"
        refresh={refresh}
        setRefresh={setRefresh}
        page={page}
        limit={list}
        loader={loader}
      />

      <Pagination
        className="mt-5"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default MedicineList;
