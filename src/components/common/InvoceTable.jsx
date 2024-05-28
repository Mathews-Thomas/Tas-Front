/* eslint-disable react/prop-types */
import { useState } from "react";
import Logo from "../../assets/NavBar/logo 1.png";
import { formatDate } from "../../commonFn/Datefn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import Axios from "../../config/axios";
import { useCallback } from "react"; 

const DataTable = ({
  data,
  setFilterOpen,
  openFilter,
  summaries,
  globelSum,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [branchDetails, setBranchDetails] = useState({});

  const fetchBranchDetails = useCallback(
    async (BranchID) => { 
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

  const handleRowClick = useCallback(
    async (row) => {
      await fetchBranchDetails(row.BranchID);
      setShowModal(true);
      setSelectedRow(row);
    },
    [fetchBranchDetails]
  );

  const printTable = () => {
    const printWindow = window.open("", "_blank");

    const tableHtml = document.getElementById("printInvoiceReport").innerHTML; // Adjust the selector to target your specific table

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
          body {
            font-family: 'Arial', sans-serif;
          }
          #actioncolumn, #td {
            display: none !important;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          #gst{
            border: 1px solid black;             
          }
          </style>
        </head>
        <body>
          ${tableHtml}  
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };

  const invoicemodelprint = () => {
    const printWindow = window.open(" ", "_blank");
    document.getElementById("PrintButton").hidden = true;

    const invoice = document.querySelector("#invoicemodelid").outerHTML; // Adjust the selector to target your specific table
    const tailwindCssLink =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">';
    printWindow.document.write(`
    <html>
      <head> 
        ${tailwindCssLink}  
      </head>
      <body>
        ${invoice}  
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
    document.getElementById("PrintButton").hidden = false;
  };

  return (
    <div className="w-auto relative">
      <button className="flex justify-end items-center gap-3 w-full mb-10 ">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
          width={40}
          fill="#387ADF"
          onClick={printTable}
        >
          <g>
            <g>
              <path
                d="M388.813,0.691H123.181c-4.2,0-7.604,3.405-7.604,7.604V155.49c0,4.198,3.404,7.603,7.604,7.603
			c4.2,0,7.604-3.405,7.604-7.604V15.899h250.424v139.59c0,4.199,3.404,7.604,7.604,7.604s7.604-3.405,7.604-7.604V8.295
			C396.417,4.096,393.013,0.691,388.813,0.691z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M388.068,340.335h10.337c4.2,0,7.604-3.405,7.604-7.604c0-4.199-3.404-7.604-7.604-7.604H113.588
			c-4.2,0-7.604,3.405-7.604,7.604c0,4.199,3.404,7.604,7.604,7.604h10.337L111.15,459.469c-0.447,4.176,2.574,7.923,6.749,8.371
			c4.199,0.452,7.923-2.575,8.371-6.749l12.949-120.755h233.553l16.704,155.765H122.516l1.033-9.628
			c0.448-4.175-2.573-7.923-6.749-8.371c-4.164-0.446-7.923,2.574-8.371,6.749l-1.935,18.043c-0.231,2.145,0.462,4.288,1.904,5.894
			c1.443,1.605,3.499,2.521,5.656,2.521h283.887c2.157,0,4.214-0.917,5.656-2.521c1.442-1.605,2.134-3.747,1.904-5.894
			L388.068,340.335z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M421.259,171.663H49.536C22.222,171.663,0,193.886,0,221.2v169.497c0,27.314,22.222,49.537,49.536,49.537h46.788
			c4.2,0,7.604-3.405,7.604-7.604s-3.404-7.604-7.603-7.604H49.536c-18.929,0-34.328-15.4-34.328-34.329V221.2
			c0-18.929,15.4-34.329,34.328-34.329h371.723c4.2,0,7.604-3.405,7.604-7.604S425.46,171.663,421.259,171.663z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M462.453,171.663h-15.846c-4.2,0-7.604,3.405-7.604,7.604s3.404,7.604,7.604,7.604h15.846
			c18.935,0,34.339,15.4,34.339,34.329v169.497c0,18.929-15.405,34.329-34.339,34.329h-46.788c-4.2,0-7.604,3.405-7.604,7.604
			s3.404,7.604,7.604,7.604h46.788c27.32,0,49.547-22.222,49.547-49.537V221.2C512,193.886,489.773,171.663,462.453,171.663z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M422.273,289.271H89.727c-4.2,0-7.604,3.405-7.604,7.604v81.109c0,4.199,3.404,7.604,7.604,7.604h12.458
			c4.2,0,7.604-3.405,7.604-7.604s-3.404-7.604-7.604-7.604h-4.854v-65.901h317.339v65.901h-4.854c-4.2,0-7.604,3.405-7.604,7.604
			s3.404,7.604,7.604,7.604h12.458c4.2,0,7.604-3.405,7.604-7.604v-81.109C429.877,292.675,426.474,289.271,422.273,289.271z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M65.394,203.094c-18.728,0-33.964,15.236-33.964,33.964c0,18.728,15.236,33.964,33.964,33.964
			c18.728,0,33.964-15.236,33.964-33.964C99.358,218.33,84.122,203.094,65.394,203.094z M65.394,255.814
			c-10.342,0-18.756-8.414-18.756-18.756s8.414-18.756,18.756-18.756s18.756,8.414,18.756,18.756S75.736,255.814,65.394,255.814z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M144.475,203.094c-18.728,0-33.964,15.236-33.964,33.964c0,18.728,15.236,33.964,33.964,33.964
			c18.728,0,33.964-15.236,33.964-33.964C178.44,218.33,163.203,203.094,144.475,203.094z M144.475,255.814
			c-10.342,0-18.756-8.414-18.756-18.756s8.414-18.756,18.756-18.756c10.342,0,18.756,8.414,18.756,18.756
			S154.818,255.814,144.475,255.814z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M354.848,451.489H157.146c-4.2,0-7.604,3.405-7.604,7.604s3.404,7.604,7.604,7.604h197.703c4.2,0,7.604-3.405,7.604-7.604
			S359.049,451.489,354.848,451.489z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M350.034,417.017H161.959c-4.199,0-7.604,3.405-7.604,7.604s3.404,7.604,7.604,7.604h188.074
			c4.2,0,7.604-3.405,7.604-7.604S354.234,417.017,350.034,417.017z"
              />
            </g>
          </g>
          <g>
            <g>
              <path
                d="M345.978,382.546H166.015c-4.2,0-7.604,3.405-7.604,7.604c0,4.199,3.404,7.604,7.604,7.604h179.963
			c4.2,0,7.604-3.405,7.604-7.604C353.582,385.951,350.179,382.546,345.978,382.546z"
              />
            </g>
          </g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
          <g></g>
        </svg> 
        <span className="uppercase text-xl font-semibold mr-14" onClick={printTable}>
 
          print
        </span>
      </button>
      {setFilterOpen && (
        <button
          onClick={() => setFilterOpen(!openFilter)}
          className={`${
            !openFilter
              ? "bg-[#387ADF] px-4 py-2 rounded-md text-white text-sm uppercase absolute left-0 top-1 "
              : "hidden"
          }  `}
        >
          open filter
        </button>
      )}

      <div className=" overflow-x-auto" id="printInvoiceReport">
        <div className="flex justify-evenly space-x-20 mb-10">
          {summaries?.map((summ) => {
            return (
              <div
                key={summ._id}
                className={`bg-slate-100 border flex flex-col px-5 py-5 justify-center rounded w-full`}
                id="gst"
              >
                <span className="text-sm text-left text-[#387ADF] uppercase font-bold">
                  GST-
                  <span className="text-gray-700">
                    {" "}
                    {summ._id === null ? "N/a" : summ._id + "%"}
                  </span>
                </span>
                <span className=" text-sm text-left text-[#387ADF] uppercase font-bold">
                  Procedure -{" "}
                  <span className="text-gray-700">{summ.totalCount}</span>{" "}
                </span>
                <span className="text-sm text-left text-[#387ADF] uppercase font-bold">
                  BaseAmount -{" "}
                  <span className="text-gray-700">
                    {summ.totalBaseAmount.toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-left text-[#387ADF] border-b-2 mb-2 uppercase font-bold">
                  GST Amount -{" "}
                  <span className="text-gray-700">
                    {summ.totalGstAmount.toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-left text-[#387ADF] uppercase font-bold">
                  Total Amount -{" "}
                  <span className="text-gray-700">
                    {summ.totalAmountToBePaid}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <table className="border-collapse text-left bg-white min-w-full border-8">
          <thead>
            <tr className="text-sm leading-normal text-gray-600">
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                created Date
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Branch
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Department
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Doctor
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                created
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                item
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Amount Paid
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                payment Method
              </th>
            </tr>
          </thead> 
          <tbody className="text-sm font-light">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center font-bold text-red-600 py-4"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => {
                return (
                  <tr
                    key={row.invoiceID}
                    className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.invoiceID}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {moment(row.createdAt)
                        .tz("Asia/Kolkata")
                        .format("YYYY-MM-DD")}{" "}
                      <br />
                      {moment(row.createdAt)
                        .tz("Asia/Kolkata")
                        .format("hh:mm A")}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.BranchName}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.DepartmentName}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.DoctorName}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.createdBy}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.items.map((item) => {
                        return (
                          <div
                            key={item._id}
                            className="px-6 py-1 border-gray-200 capitalize text-center"
                          >
                            <span>
                              {item.procedure} <br />
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.amountToBePaid}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.paymentMethod.paymentMethod}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Consolidate count */}

        {data.length == 0 ? (
          <div></div>
        ) : (
          <div className="w-full bg-slate-500 py-2 rounded-b uppercase">
            <div className="flex text-white justify-evenly">
              <div className="text-right font-bold text-sm lg:text-base flex text-blue-300">
                Count&nbsp;-&nbsp;
                <span className="text-white">{globelSum?.total}</span>
              </div>
              <div className="text-right font-bold text-sm lg:text-base text-blue-300">
                Total Amount&nbsp;-&nbsp;
                <span className="text-white">{globelSum?.totalAmountSum}</span>
              </div>
              <div className="text-right font-bold text-sm lg:text-base text-blue-300">
                Total Discount&nbsp;-&nbsp;
                <span className="text-white">
                  {globelSum?.totalDiscountSum}
                </span>
              </div>
              <div className="text-right font-bold text-sm lg:text-base text-blue-300">
                Total Amount To Be Paid&nbsp;-&nbsp;
                <span className="text-white">
                  {globelSum?.totalAmountToBePaidSum}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
      {showModal && (
        <div className=" selectcolumn fixed inset-0 flex h-auto  items-center justify-center z-[99]">
          <div
            className="bg-black bg-opacity-50 absolute inset-0"
            onClick={() => {
              setSelectedRow(null);
              setShowModal(false);
            }}
          ></div>
          <div
            id="invoicemodelid"
            className="relative bg-white p-4  mx-auto z-10 rounded shadow-md print:w-full print:h-full w-[75%] "
          >
            {/* Display detailed view content */}
            {selectedRow && (
              <div className="p-5 bg-white">
                {/* Header with Logo and Company Address */}
                <div className="flex justify-between items-center border-b pb-4">
                  <img src={Logo} alt="Company Logo" className="h-20" />
                  <div className="text-xs text-right uppercase">
                    <p className="font-bold text-lg ">
                    Topmost Dental and skin clinic
                      {/* Topmost 
                      {branchDetails[selectedRow?.BranchID].branchName} */}
                    </p>
                    <span>
                      {branchDetails[selectedRow?.BranchID].address},{" "}
                    </span>
                    <span>{branchDetails[selectedRow?.BranchID].city}, </span>
                    <span>{branchDetails[selectedRow?.BranchID].state}, </span>
                    <br />
                    <span>
                      Pin:{branchDetails[selectedRow?.BranchID].pincode},{" "}
                    </span>
                    <span>
                      Phone:{branchDetails[selectedRow?.BranchID].phone},{" "}
                    </span>
                    <span className="lowercase">
                      {branchDetails[selectedRow?.BranchID].email}
                    </span>
                  </div>
                </div>

                {/* Patient Details and Invoice Info */}
                <div className="flex justify-between border-b py-2">
                  <div className="text-xs">
                    <p>
                      <strong>Patient Details:</strong>
                    </p>
                    <p>{selectedRow?.patientInfo?.Name}</p>
                    <p>
                      {selectedRow?.patientInfo?.Gender +
                        ", Age:" +
                        selectedRow?.patientInfo?.age}
                    </p>
                    <p>{selectedRow?.patientInfo?.address?.address}</p>
                  </div>
                  <div className="text-xs text-left ">
                    <p>
                      <strong>Invoice ID:</strong> {selectedRow?.invoiceID}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {moment(selectedRow.createdAt)
                        .tz("Asia/Kolkata")
                        .format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>Doctor:</strong> {selectedRow?.DoctorName}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedRow?.DepartmentName}
                    </p>
                  </div>
                </div>

                {/* Invoice Title */}
                <div className="text-center my-4">
                  <p className="text-xl font-bold uppercase">Invoice</p>
                </div>

                {/* Items Table */}
                <div className="mb-4">
                  <table className="min-w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-1 text-xs">No</th>
                        <th className="p-1 text-xs">Item</th>
                        <th className="p-1 text-xs">HSNCode</th>
                        <th className="p-1 text-xs">Qty</th>
                        <th className="p-1 text-xs">Unit Rate</th>
                        <th className="p-1 text-xs">Discount</th>
                        <th className="p-1 text-xs">
                          <div className="flex">
                            <span className=" flex-1 p-2">GST</span>
                            <span className=" flex-1 p-2">CGST</span>{" "}
                            <span className=" flex-1 p-2">SGST</span>{" "}
                          </div>
                        </th>
                        <th className="p-1 text-xs"> Taxable Value</th>
                        <th className="p-1 text-xs">GST</th>
                        <th className="p-1 text-xs">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.items.map((item, index) => (
                        <tr key={index + "i"} className="border-b">
                          <td className="p-1 text-xs">{index + 1}</td>
                          <td className="p-1 text-xs">{item?.procedure}</td>
                          <td className="p-1 text-xs">{item?.HSNCode}</td>
                          <td className="p-1 text-xs">{item?.quantity}</td>
                          <td className="p-1 text-xs">{item?.unitPrice}</td>
                          <td className="p-1 text-xs">
                            {item?.discount + " " + item?.discountType}
                          </td>
                          <td className="p-1 text-xs">
                            <div className="flex">
                              <span className="border-r p-2  flex-1">
                                {item?.GST}%
                              </span>{" "}
                              <span className="border-r p-2 flex-1">
                                {item?.GST / 2}%
                              </span>
                              <span className="flex-1 p-2">
                                {item?.GST / 2}%
                              </span>
                            </div>
                          </td>
                          <td className="p-1 text-xs">{item?.baseAmount}</td>
                          <td className="p-1 text-xs">{item?.gstAmount}</td>
                          <td className="p-1 text-xs ">
                            {item?.amountToBePaid}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer with Generated By, Total Amount, etc. */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <p>
                      <strong>Generated By:</strong> {selectedRow?.createdBy}
                    </p>
                    <p>
                      <strong>Printed On:</strong> {formatDate()}
                    </p>
                  </div>
                  <div className="text-xs text-right">
                    <p>
                      <strong>Total Amount:</strong> {selectedRow?.totalAmount}
                    </p>
                    <p>
                      <strong>Total Discount:</strong>{" "}
                      {selectedRow?.totalDiscount}
                    </p>
                    <p>
                      <strong>Amount to be Paid:</strong>{" "}
                      {selectedRow?.amountToBePaid}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    onClick={invoicemodelprint}
                    id="PrintButton"
                    className="print:hidden border bg-[#652D91] rounded-lg font-semibold w-[13%] py-1 text-white"
                  >
                    <FontAwesomeIcon icon={faPrint} /> Print
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
