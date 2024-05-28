/* eslint-disable react/prop-types */
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { formatDate } from "../../../../commonFn/Datefn";
const InvoiceTable = ({ data, companyInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
 

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };
  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Date</th>
            <th className="py-3 px-6 text-center">Patient Name</th>
            <th className="py-3 px-6 text-center">Procedure/Services</th>
            <th className="py-3 px-6 text-center">Doctor</th>
            <th className="py-3 px-6 text-center">Total Discount</th>
            <th className="py-3 px-6 text-center">Amount to be Paid</th>
          </tr>
        </thead>
        <tbody className="text-black capitalize text-sm font-bold ">
          {data?.map((invoice, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
              onClick={() => handleRowClick(invoice)}
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {invoice?.invoiceID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {invoice?.createdAtIST}
              </td>
              <td className="py-3 px-6 text-left">
                {invoice?.patientID?.Name}
              </td>
              <td className="py-3 px-6 text-center">
                {invoice?.items?.map((item, i) => (
                  <span key={i}>
                    {item.procedure}
                    <br />
                  </span>
                ))}
              </td>
              <td className="py-3 px-6 text-center">
                {invoice?.doctorID?.name}
              </td>
              <td className="py-3 px-6 text-center">
                {invoice?.totalDiscount}
              </td>
              <td className="py-3 px-6 text-center">
                {invoice?.amountToBePaid} 
              </td>
            </tr>
          ))}
        </tbody>

      </table>
        {showModal && (
          <div className=" selectcolumn fixed inset-0 flex  items-center justify-center z-[99]">
            <div
              className="bg-black bg-opacity-50 absolute inset-0"
              onClick={() => {
                setSelectedRow(null);
                setShowModal(false);
              }}
            ></div>
            <div className="relative bg-white p-4  mx-auto z-10 rounded shadow-md print:w-full print:h-full h-[90%] w-[75%] ">
              {/* Display detailed view content */}
              <button
                onClick={() => window.print()}
                className="print:hidden   text-black  absolute right-8 border px-3 bg-slate-400 py-1 bottom-5 font-Inter rounded-lg font-semibold"
              >
                <FontAwesomeIcon icon={faPrint} /> Print
              </button>
              {selectedRow && (
                <div className="p-5 bg-white">
                  {/* Header with Logo and Company Address */}
                  <div className="flex justify-between items-center border-b pb-4">
                    <img
                      src={companyInfo?.Logo}
                      alt="Company Logo"
                      className="h-20"
                    />
                    <div className="text-xs text-right">
                      <p className="font-bold text-lg">
                        {companyInfo?.companyName}
                      </p>
                      <p>{companyInfo?.companyAddress}</p>
                    </div>
                  </div>

                  {/* Patient Details and Invoice Info */}
                  <div className="flex justify-between border-b py-2">
                    <div className="text-xs">
                      <p>
                        <strong>Patient Details:</strong>
                      </p>
                      <p>{selectedRow?.patientID?.Name}</p>
                      <p>
                        {selectedRow?.patientID?.Gender +
                          ", Age:" +
                          selectedRow?.patientID?.age}
                      </p>
                      <p>{selectedRow?.patientID?.address?.address}</p>
                    </div>
                    <div className="text-xs text-left ">
                      <p>
                        <strong>Invoice ID:</strong> {selectedRow?.invoiceID}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedRow?.createdAtIST}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {selectedRow?.doctorID?.name}
                      </p>
                      <p>
                        <strong>Department:</strong>{" "}
                        {selectedRow?.DepartmentID?.Name}
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
                          <tr key={index} className="border-b">
                            <td className="p-1 text-xs">{index + 1}</td>
                            <td className="p-1 text-xs">{item?.procedure}</td> 
                            <td className="p-1 text-xs">{item?.ProcedureID.HSNCode}</td>
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
                            <td className="p-1 text-xs">
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
                        <strong>Total Amount:</strong>{" "}
                        {selectedRow?.totalAmount}
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
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default InvoiceTable;
