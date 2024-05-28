import InvoiceTable from "./InvoceTable"
import {patientInvoiceList} from "../../assets/data"
import { useState } from "react";




const PatientInvoiceList = () => {
  const [selectedFields, setSelectedFields] = useState([
    'InvoiceId',
    'CreatedAt',
    'Branch',
    'Name', 
    'TotalAmount',
  ]);

  return (

     
      <div className="topbar m-5  p-4  bg-white   ">
      <h2 className="text-xl font-Inter font-bold uppercase tracking-normal"> Patient invoicelist</h2>
      <InvoiceTable  data={patientInvoiceList} setSelectedFields={setSelectedFields} selectedFields={selectedFields}/>
      </div>
   
  )
}

export default PatientInvoiceList
