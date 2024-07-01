/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import MedicineTable from "./MedicineTable";
import Axios from "../../../config/axios";
import { Pagination } from "@mui/material";
import Select_Branch_ID from "../commen/BranchIDSelection";

const MedicineInvoiceList = ({ setRefresh, refresh, list = 20 }) => {
  const [loader, setLoader] = useState(true);
  const [medicineInvoiceList, setMedicineInvoiceList] = useState([]);
  const [branch, setBranch] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  
  const fetchData = useCallback(() => {
    setLoader(true);
    Axios.get(branch?.id ? `admin/medicine/get-invoice-list/${branch?.id}` : 'admin/medicine/get-medicine', {
      params: { search: searchTerm, page: page, limit: list },
    })
      .then((response) => {
        setLoader(false);
        setMedicineInvoiceList(response?.data?.medicineInvoice);
        setTotalPages(response?.data?.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching medicine list:", error);
      });
  }, [branch?.id, page, searchTerm, list]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchData();
      setRefresh(false);
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [branch?.id, searchTerm, fetchData, refresh, setRefresh]);

  useEffect(() => {
    fetchData();
  }, [branch?.id, page, fetchData]);
  console.log(medicineInvoiceList,"medicineInvoiceList")

  return (
    <div className="topbar p-10 bg-white">
      <div className="flex justify-center w-full">
        <div className="w-1/2 flex justify-start">
          <h2 className="text-xl font-Inter font-bold uppercase tracking-normal">
            Medicine Invoice List -{branch?.type}
          </h2>
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="search-bar w-full">
            <div className="flex justify-center items-center w-full gap-5">
              <Select_Branch_ID value={branch} onChange={setBranch} />
              <input
                type="text"
                placeholder="Search Patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-[0.965rem] border border-gray-300 rounded w-full mt-2 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <MedicineTable
        data={medicineInvoiceList}
        fetchData={fetchData}
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

export default MedicineInvoiceList;
