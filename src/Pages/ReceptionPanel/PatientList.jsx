import PatientList from "../../components/ReceptionPanel/Patients/PatientList"

const Patient_Master_List = () => {
  return (
    <div>
     <PatientList refresh={false} setRefresh={()=>{}} list={12} />
    </div>
  )
}

export default Patient_Master_List
