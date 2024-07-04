import React, { useCallback, useEffect, useState } from "react";
import ProgressBar from "../../common/ProgressBar/ProgressBar";
import Medicine_Invoive_Edit_Modal from "./EditmodalMedicine";
import logo from "../../../assets/NavBar/logo 1.png";
import Axios from "../../../config/axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faMessage, faPrint } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../commonFn/Datefn";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AWS from "aws-sdk";

// AWS S3 Credentials
const s3 = new AWS.S3({
  accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  region:import.meta.env.VITE_S3_REGION,
});

function MedicineTable({ data, loader, fetchData }) {
  const [branchDetails, setBranchDetails] = useState({});
  const [invoice, setInvoice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadLocation, setUploadLocation] = useState(null);
  const [customPhoneNumber, setCustomPhoneNumber] = useState("");
  const [isCustomNumber, setIsCustomNumber] = useState(false);

  const fetchBranchDetails = useCallback(
    async (BranchID) => {
      if (branchDetails[BranchID]) return branchDetails[BranchID];
      try {
        const { data } = await Axios.get(`/get-branch/${BranchID}`);
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

  const handleEditClick = (invoice) => {
    setInvoice(invoice);
    setShowEditModal(true);
  };

  const handleRowClick = useCallback(
    async (row) => {
      await fetchBranchDetails(row.BranchID);
      setSelectedRow(row);
      setShowModal(true);
    },
    [fetchBranchDetails]
  );

  const invoicemodelprint = () => {
    const printWindow = window.open(" ", "_blank");
    const printButtons = document.querySelectorAll(
      "#PrintButton, #CustomButton, #PatientButton, #DownloadButton"
    );

    printButtons.forEach((button) => button.style.display = "none");

    const invoice = document.querySelector("#invoicemodelid").outerHTML;
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
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);

    printButtons.forEach((button) => button.style.display = "inline-block");
  };

  const downloadPDF = async () => {
    const printButtons = document.querySelectorAll(
      "#PrintButton, #DownloadButton, #PatientButton, #CustomButton"
    );

    printButtons.forEach((button) => button.classList.add("hidden"));

    const element = document.querySelector("#invoicemodelid");

    const canvas = await html2canvas(element, { scale: 1 });

    const imgData = canvas.toDataURL("image/png", 0.8);
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
    setShowModal(false);
  };

  const generatePDFBlob = async () => {
    const element = document.querySelector("#invoicemodelid");
    const canvas = await html2canvas(element, { scale: 2, logging: false });
    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    return pdf.output("blob");
  };

  const uploadToS3 = async (pdfBlob, key) => {
    const params = {
      Bucket: "medicine-invoice",
      Key: key,
      Body: pdfBlob,
      ContentType: "application/pdf",
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading to S3:", err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  };

  const sendWhatsapp = (uploadLocation, phoneNumber) => {
    const message = `Here is Your invoice: ${uploadLocation}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleSendWhatsapp = async (phoneNumber) => {
    try {
      const printButtons = document.querySelectorAll(
        "#PrintButton, #CustomButton, #PatientButton, #DownloadButton"
      );
      printButtons.forEach((button) => button.classList.add("hidden"));

      const pdfBlob = await generatePDFBlob();
      const patientName = selectedRow?.patientID?.Name;
      const key = `${patientName}.pdf`;

      setShowModal(false);
      const toastContainer = document.createElement("div");

      toastContainer.innerHTML = `
      <div class="toast-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white p-6 rounded-lg shadow-2xl border-gray-500 z-50 text-center">
        <div class="text-2xl font-bold mb-4 text-gray-800">Send Invoice</div>
        <div class="text-lg font-semibold mb-4 text-gray-600">Do you want to send the invoice to the patient's WhatsApp?</div>
        <div class="flex justify-center gap-4">
          <button id="sendInvoiceBtn" class="toast-button bg-green-500 text-white rounded px-6 py-2 font-medium transition duration-300 ease-in-out hover:bg-green-600 shadow-md">Send</button>
          <button id="closeToastBtn" class="toast-button bg-red-500 text-white rounded px-6 py-2 font-medium transition duration-300 ease-in-out hover:bg-red-600 shadow-md">Close</button>
        </div>
      </div>
    `;

      // Insert the style tag separately
      const style = document.createElement("style");
      style.innerHTML = `
      .toast-container {
        animation: slide-in 0.5s ease-out;
      }
      @keyframes slide-in {
        from {
          transform: translate(-50%, -100%);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%);
          opacity: 1;
        }
      }
    `;

      document.head.appendChild(style);
      document.body.appendChild(toastContainer);

      const sendInvoiceBtn = toastContainer.querySelector("#sendInvoiceBtn");
      const closeToastBtn = toastContainer.querySelector("#closeToastBtn");

      sendInvoiceBtn.addEventListener("click", async () => {
        const location = await uploadToS3(pdfBlob, key);
        setUploadLocation(location);
        sendWhatsapp(location, phoneNumber);
        document.body.removeChild(toastContainer);
      });

      closeToastBtn.addEventListener("click", () => {
        document.body.removeChild(toastContainer);
      });
    } catch (error) {
      console.error("Error in handleSendWhatsapp function:", error);
    }
  };

  const handleCustomSendWhatsapp = async () => {
    try {
      const printButtons = document.querySelectorAll(
        "#PrintButton, #CustomButton, #CloseButton, #PatientButton, #DownloadButton"
      );
      printButtons.forEach((button) => button.classList.add("hidden"));

      const pdfBlob = await generatePDFBlob();
      const patientName = selectedRow?.patientID?.Name;
      const key = `${patientName}.pdf`;

      const showCustomWhatsAppForm = () => {
        setShowModal(false);
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
          <div class="toast-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] bg-white p-6 rounded-lg shadow-2xl border-gray-500 z-50">
              <button id="closeFormBtn" class="absolute top-0 right-0 mr-4 mt-2 text-2xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer">&times;</button>
              <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Send WhatsApp Message</h2>
              <label for="whatsappNumber" class="block text-gray-700 text-sm font-semibold mb-2">Enter Custom WhatsApp number:</label>
              <input type="text" id="whatsappNumber" name="whatsappNumber" class="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter WhatsApp number">
              <button id="sendWhatsAppBtn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Send WhatsApp Message</button>
          </div>
      `;
        // Insert the style tag separately
        const style = document.createElement("style");
        style.innerHTML = `
        .toast-container {
          animation: slide-in 0.5s ease-out;
        }
        @keyframes slide-in {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
      `;

        const sendWhatsAppBtn = formContainer.querySelector("#sendWhatsAppBtn");
        const closeFormBtn = formContainer.querySelector("#closeFormBtn");

        sendWhatsAppBtn.addEventListener("click", async () => {
          const phoneNumber =
            formContainer.querySelector("#whatsappNumber").value;
          if (phoneNumber) {
            await sendWhatsAppMessage(phoneNumber, pdfBlob, key);

            document.body.removeChild(formContainer);
            printButtons.forEach((button) => button.classList.remove("hidden"));
          }
        });

        closeFormBtn.addEventListener("click", () => {
          document.body.removeChild(formContainer);
          printButtons.forEach((button) => button.classList.remove("hidden"));
        });

        document.body.appendChild(formContainer);
      };

      showCustomWhatsAppForm();
    } catch (error) {
      console.error("Error in handleSendWhatsapp function:", error);
    }
  };

  const sendWhatsAppMessage = async (phoneNumber, pdfBlob, key) => {
    try {
      const location = await uploadToS3(pdfBlob, key);
      setUploadLocation(location);
      const message = `Here is Your invoice : ${location}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappURL, "_blank");
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };

  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="border-collapse text-left bg-white min-w-full border-8">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              ID
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Date
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Patient Name
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Consuambles
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Doctor
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Total Discount
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Amount Paid
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-sm font-light">
          {loader ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                <ProgressBar />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                No data available
              </td>
            </tr>
          ) : (
            data?.map((invoice, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                onClick={() => handleRowClick(invoice)}
              >
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.invoiceID}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {moment(invoice?.createdAt).format("YYYY-MM-DD")}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.patientID?.Name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.items?.map((item, i) => (
                    <span key={i}>
                      {item?.MedicineID?.medicineName}
                      <br />
                    </span>
                  ))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.doctorID?.name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.totalDiscount}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.totalAmount}
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-6 py-3  border-gray-200 capitalize flex gap-3 justify-center items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    viewBox="0 0 24 24"
                    width={20}
                    fill="#387ADF"
                    onClick={() => {
                      handleEditClick(invoice);
                    }}
                    className="cursor-pointer hover:scale-125 duration-300"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  <svg
                    onClick={() => {
                      index === 0
                        ? handleDeleteClick(invoice)
                        : Swal.fire({
                            title: "Error!",
                            text: "You are not allowed to delete this invoice.",
                            icon: "error",
                            confirmButtonText: "OK",
                          });
                    }}
                    className="cursor-pointer hover:scale-125 duration-300"
                    id="Layer_1"
                    enableBackground="new 0 0 512 512"
                    height="20"
                    viewBox="0 0 512 512"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={` ${index === 0 ? "#387ADF" : "#FF0000"} `}
                  >
                    <path d="m320.99 435.003 20.021-273.71c.362-4.958 4.688-8.692 9.632-8.319 4.958.362 8.683 4.675 8.319 9.632l-20.021 273.71c-.346 4.734-4.294 8.344-8.966 8.344-.221 0-.442-.008-.666-.024-4.957-.364-8.682-4.676-8.319-9.633zm-155.463 1.312c.346 4.734 4.294 8.344 8.966 8.344.221 0 .443-.008.666-.024 4.958-.362 8.683-4.675 8.319-9.632l-20.021-273.71c-.362-4.957-4.693-8.688-9.632-8.319-4.958.362-8.683 4.675-8.319 9.632zm85.078 8.344c4.971 0 9-4.029 9-9v-275.883c0-4.971-4.029-9-9-9s-9 4.029-9 9v275.883c0 4.971 4.03 9 9 9zm222.237-331.5c-.945 4.924-5.755 8.065-10.536 7.142l-21.601-4.147-36.156 320.514c-2.292 20.321-10.735 39.03-23.773 52.68-13.954 14.607-32.602 22.652-52.511 22.652h-152.061c-19.909 0-38.558-8.045-52.511-22.652-13.038-13.65-21.481-32.358-23.773-52.68l-36.929-327.364c-.287-2.546.524-5.095 2.232-7.006 1.707-1.91 4.148-3.003 6.711-3.003h280.959l-306.593-58.862c-4.881-.938-8.078-5.654-7.142-10.536.937-4.881 5.651-8.076 10.536-7.142l143.697 27.588 4.626-24.094c1.624-8.46 6.466-15.795 13.634-20.653 7.168-4.859 15.777-6.637 24.234-5.016l65.072 12.493c8.46 1.624 15.795 6.466 20.654 13.634 4.858 7.167 6.64 15.773 5.016 24.233l-4.626 24.094 143.699 27.589c4.881.938 8.078 5.654 7.142 10.536zm-50.38 4.136h-340.455l35.8 317.355c3.941 34.944 27.955 59.35 58.397 59.35h152.061c30.442 0 54.456-24.405 58.397-59.35zm-211.393-63.558 93.255 17.904 4.626-24.094c.718-3.738-.077-7.553-2.237-10.74-2.161-3.188-5.41-5.338-9.148-6.056l-65.073-12.493c-3.736-.719-7.553.076-10.74 2.237-3.188 2.16-5.338 5.409-6.056 9.147z" />
                  </svg>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showModal && (
        <div className=" selectcolumn fixed inset-0 flex h-auto  items-center justify-center z-[99]">
          <div
            className="bg-black bg-opacity-80 absolute inset-0"
            onClick={() => {
              setSelectedRow(null);
              setShowModal(false);
            }}
          ></div>
          <div
            id="invoicemodelid"
            className="relative bg-white p-4  mx-auto z-10 rounded shadow-md print:w-full print:h-full w-[75%]"
          >
            {selectedRow && (
              <div className="p-5 bg-white">
                <div className="flex justify-between items-center border-b pb-4">
                  <img src={logo} alt="Company Logo" className="h-20" />
                  <div className="text-xs text-right uppercase">
                    <p className="font-bold text-lg ">
                      Topmost Dental and skin clinic
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
                <div className="flex justify-between border-b py-2">
                  <div className="text-xs">
                    <p>
                      <strong>Patient Details:</strong>
                    </p>
                    <p className="capitalize">{selectedRow?.patientID?.Name}</p>
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
                      <strong>Date:</strong>{" "}
                      {moment(selectedRow.createdAt)
                        .tz("Asia/Kolkata")
                        .format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>Doctor:</strong> {selectedRow?.doctorID?.name}
                    </p>
                    <p className="capitalize">
                      <strong>Department:</strong>{" "}
                      {selectedRow?.MainDepartmentID?.Name}
                    </p>
                  </div>
                </div>
                <div className="text-center my-4">
                  <p className="text-xl font-bold uppercase">Invoice</p>
                </div>
                <div className="mb-4">
                  <table className="min-w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-1 text-xs">No</th>
                        <th className="p-1 text-xs">Medicine</th>
                        <th className="p-1 text-xs">HSNCode</th>
                        <th className="p-1 text-xs">Qty</th>
                        <th className="p-1 text-xs">Unit Rate</th>
                        <th className="p-1 text-xs">Batch Number</th>
                        <th className="p-1 text-xs">Expiry Date</th>
                        <th className="p-1 text-xs"> Taxable Value</th>
                        <th className="p-1 text-xs">GST</th>
                        <th className="p-1 text-xs">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.items.map((item, index) => (
                        <tr key={index + "i"} className="border-b">
                          <td className="p-1 text-xs">{index + 1}</td>
                          <td className="p-1 text-xs">
                            {item?.MedicineID?.medicineName}
                          </td>
                          <td className="p-1 text-xs">
                            {item?.MedicineID?.HSNCode}
                          </td>
                          <td className="p-1 text-xs">{item?.quantity}</td>
                          <td className="p-1 text-xs">{item?.unitPrice}</td>
                          <td className="p-1 text-xs">
                            {item?.MedicineID?.batchNumber}
                          </td>
                          <td className="p-1 text-xs">
                            {item?.MedicineID?.expirationDate
                              ? moment(item.MedicineID.expirationDate).format(
                                  "YYYY-MM-DD"
                                )
                              : "N/A"}
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
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <p>
                      <strong>Generated By:</strong>{" "}
                      {selectedRow?.items?.[0]?.MedicineID?.createdBy}
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
                {isCustomNumber && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={customPhoneNumber}
                      onChange={(e) => setCustomPhoneNumber(e.target.value)}
                      placeholder="Enter custom phone number"
                      className="border p-2 w-full rounded"
                    />
                    <button
                      onClick={handleCustomSend}
                      className="border bg-[#652D91] rounded-lg font-semibold w-1/2 items-center py-2 mt-2 text-white"
                    >
                      Send to Custom Whatsapp
                    </button>
                  </div>
                )}
                <div className="flex justify-end mt-5 gap-4">
                  {!isCustomNumber && (
                    <>
                      <button
                        onClick={() => handleSendWhatsapp(selectedRow?.patientID?.phone)}
                        id="PatientButton"
                        className="print:hidden border bg-[#652D91] rounded-lg font-semibold w-[13%] py-1 text-white"
                      >
                        <FontAwesomeIcon icon={faMessage} /> Send to Patient
                        Whatsapp
                      </button>
                      <button
                        onClick={handleCustomSendWhatsapp}
                        id="CustomButton"
                        className="print:hidden border bg-[#652D91] rounded-lg font-semibold w-[13%] py-1 text-white"
                      >
                        <FontAwesomeIcon icon={faMessage} /> Send to Custom
                        Whatsapp
                      </button>
                    </>
                  )}
                  <button
                    onClick={invoicemodelprint}
                    id="PrintButton"
                    className="print:hidden border bg-[#652D91] rounded-lg font-semibold w-[13%] py-1 text-white"
                  >
                    <FontAwesomeIcon icon={faPrint} /> Print
                  </button>
                  <button
                    onClick={downloadPDF}
                    id="DownloadButton"
                    className="print:hidden border bg-[#652D91] rounded-lg font-semibold w-[13%] py-1 text-white"
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Medicine_Invoive_Edit_Modal
        fetchData={fetchData}
        invoice={invoice}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
    </div>
  );
}

export default MedicineTable;
