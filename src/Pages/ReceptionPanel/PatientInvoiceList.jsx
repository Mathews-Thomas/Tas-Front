import InvoiceList from "../../components/ReceptionPanel/Invoice/patientInvoice/listInvoce"

const PatientInvoiceList = () => {
  return (
    <div>
      <InvoiceList setRefresh={()=>{}} refresh={false}  list={20}/>
    </div>
  )
}

export default PatientInvoiceList
