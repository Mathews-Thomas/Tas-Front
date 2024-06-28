import React, { useCallback, useEffect, useState } from 'react';
import Axios from "../../../config/axios";
import { Pagination, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import Table from "../../ReviewPanel/medicine/Table";

const MedicineList = ({ refresh, setRefresh, list = 10 }) => {
  const [loader, setLoader] = useState(true);
  const [medicineList, setMedicineList] = useState([]);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [mainDepartments, setMainDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedMainDepartment, setSelectedMainDepartment] = useState("");

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.get(`medicine/get-medicines/${BranchID}`, {
        params: {
          search: searchTerm,
          page,
          list,
          DepartmentID: selectedMainDepartment
        },
      });
      setLoader(false);
      setMedicineList(response?.data?.medicines);
      setTotalPages(response?.data?.totalPages);
      // console.log(response?.data?.medicines);
    } catch (error) {
      console.error("Error fetching medicine list:", error);
    }
  }, [BranchID, searchTerm, page, list, selectedMainDepartment]);



  useEffect(() => {
    setLoader(true);
    fetchData();
  }, [page, list, fetchData]);

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
        console.error('Error fetching departments:', err);
      });
  }, []);

  useEffect(() => {
    if (BranchID) {
      const filtered = mainDepartments.filter(dept => dept.BranchID === BranchID);
      setFilteredDepartments(filtered);
      setSelectedMainDepartment(""); // Reset department selection when branch changes
    } else {
      setFilteredDepartments([]);
    }
  }, [BranchID, mainDepartments]);

  const columns = ["medicineName", "manufacturerName", "quantity", "price", "createdBy"];  // Adjust as per your data structure
  const tableHeaders = ["Medicine Name", "Manufacture", "Quantity", "Price", "Created By"];  // Adjust as per your data structure

  const endpoints = {
    update: 'medicine/update-status',  // Adjust the endpoint for updating medicine status
  };

  return (
    <div className="topbar m-5 p-8 bg-white">
      <div className="flex justify-center w-full">
        <div className="flex justify-start w-full items-center">
          <h2 className="text-xl text-center uppercase font-bold py-5">
            Medicine Directory
          </h2>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex gap-5 justify-end items-center w-full">
            <FormControl variant="outlined" className='w-[25rem]'>
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

      {loader ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
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
        />
      )}

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
