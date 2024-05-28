import PatientInvoiceList from "../../Pages/PatientInvoiceList";
import InvoiceForm from "./invoiceForm/PatientInvoiceForm";

const PatientInvoice = () => {
  return (
    <div className="m-auto   ">
      <div className="topbar m-5 p-4  bg-white  flex  flex-wrap justify-center">
        <h2 className="text-xl font-Inter font-bold uppercase tracking-normal">Patient Invoice</h2>
        <InvoiceForm />
      </div>
      <PatientInvoiceList/>
    </div>
  );
};

export default PatientInvoice;
