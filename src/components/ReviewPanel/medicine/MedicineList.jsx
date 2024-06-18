import React, { useCallback, useEffect, useState } from 'react';
import Axios from "../../../config/axios";
import { Pagination } from "@mui/material";
import Table from "./Table"

const MedicineList = ({ refresh, setRefresh, list = 10 }) => {
  const [loader, setLoader] = useState(true);
  const [medicineList, setMedicineList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.get(`admin/medicine/get-medicine`, {
        params: { search: searchTerm, page, list },
      });
      setLoader(false);
      setMedicineList(response?.data?.medicines);
      setTotalPages(response?.data?.totalPages);
      console.log(medicineList)
    } catch (error) {
      console.error("Error fetching medicine list:", error);
    }
  }, [searchTerm, page, list]);

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

  const columns = ["medicineName", "category", "quantity", "price","createdBy"];  // Adjust as per your data structure
  const tableHeaders = ["Medicine Name", "Category", "Quantity", "Price","createdBy"];  // Adjust as per your data structure

  const endpoints = {
    update: 'medicine/update-status',  // Adjust the endpoint for updating medicine status
    approve: 'medicine/approve',  // Adjust the endpoint for approving medicine
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
