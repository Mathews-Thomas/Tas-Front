/* eslint-disable react/prop-types */
import { Route, Routes } from "react-router-dom";

// Branch
import InitialLogin from "./Pages/Branch/InitialLogin";

// User
import UserLogin from "./Pages/User/userLogin";

// Reception panel
import ReceptionWraper from "./components/ReceptionPanel/receptionWraper";
import AddPatient from "./Pages/ReceptionPanel/addPatient";
import AddInvoice from "./Pages/ReceptionPanel/addInvoice";

//Review Panel
import Add_Patient from "./Pages/ReviewPanel/addPatient";
import Patient_List from "./Pages/ReviewPanel/PatientList";
import Add_Patient_Invoice from "./Pages/ReviewPanel/add_Patient_Invoice";
import Patient_Invoice_List from "./Pages/ReviewPanel/PatientInvoiceList";
import Patient_invoice_report from "./Pages/ReviewPanel/Patient_invoice_Report";
import AddOptions from "./Pages/ReviewPanel/Add-on";
import ListofOptions from "./Pages/ReviewPanel/Add-on-list";
import PatientInvoiceList from "./Pages/ReceptionPanel/PatientInvoiceList";
import ReceptionHome from "./Pages/ReceptionPanel/Home";
import AddDoc from "./Pages/ReviewPanel/Add-Doc";
import DoctorsList from "./Pages/ReviewPanel/Doctors-List";

//Add Medicine Review panel
import Addmedicine from "./Pages/ReviewPanel/Addmedicine";
import MedicineInvoice from "./components/ReviewPanel/medicine/MedicineInvoice";
import MedicineDirectory from "./components/ReviewPanel/medicine/MedicineDirectory";

//Add Medicine Reception panel
import Add_medicine from "./Pages/ReceptionPanel/Addmedicine";

// Review panel
import ReviewPannelWraper from "./components/ReviewPanel/ReviewPanelWraper";
import ReviewHome from "./Pages/ReviewPanel/Home";

// Review Additional
import Settings from "./components/ReviewPanel/Additional/settings";
import Profile from "./components/ReviewPanel/Additional/profile";

// Reception Additional
import USERSettings from "./components/ReceptionPanel/Additional/settings";
import USERProfile from "./components/ReceptionPanel/Additional/profile";
import Consolidate_Report from "./components/common/report/Consolidate_report"



//Route Helper
import PublicRoute from "./RouteHelpers/PublicRoute";
import UserAuthRoute from "./RouteHelpers/UserAuthRoute";
import RoleBasedRoute from "./RouteHelpers/RolebasedProtectedRoute";
import Patient_Master_List from "./Pages/ReceptionPanel/PatientList";
import PatientProfile from "./components/ReviewPanel/Patients/PatientProfile";
function App() {
  return (
    <>
      <Routes>
        {/* Branch */}
        <Route path="/login"element={<PublicRoute><InitialLogin/></PublicRoute>}/>
        {/* User */}
        <Route path="/user-login" element={ <UserAuthRoute> <UserLogin /> </UserAuthRoute> } />
        
        {/* Reception panel */}
        <Route path="/" element={ <RoleBasedRoute requiredRole={import.meta.env.VITE_ROLE_USER}> <ReceptionWraper /> </RoleBasedRoute> } >
          <Route index element={<ReceptionHome />} />
          <Route path="Add-Patient/" element={<AddPatient />} />
          <Route path="Patient-master-list/" element={<Patient_Master_List />} />
          <Route path="patient-invoice/" element={<AddInvoice />} />
          <Route path="Patient-Invoice-list/" element={<PatientInvoiceList />} />
          <Route path="add-Doc/" element={<AddDoc />} />
          <Route path="add-on/" element={<AddOptions />} />
          <Route path="add-medicine/" element={<Add_medicine/>} />
          <Route path="medicine-invoice/" element={<MedicineInvoice/>} />
          <Route path="medicine-directory/" element={<MedicineDirectory/>} />
          <Route path="add-on-list/" element={<ListofOptions />} />
          <Route path="Doctors-list/" element={<DoctorsList />} />
          <Route path="Patient-invoice-report/" element={<Patient_invoice_report />} />  
          <Route path="consolidate-report/" element={<Consolidate_Report />} /> 
          <Route path="settings/" element={<USERSettings />} />
          <Route path="profile/" element={<USERProfile />} />
          <Route path="help" element={<Wraper value={"Help"} />} />
        </Route>

        {/* Review panel */}
        <Route path="review-panel/" element={ <RoleBasedRoute requiredRole={import.meta.env.VITE_ROLE_ADMIN}> <ReviewPannelWraper /> </RoleBasedRoute> } >
          <Route index element={<ReviewHome />} />
          <Route path="add-Doc/" element={<AddDoc />} />
          <Route path="add-on/" element={<AddOptions />} />
          <Route path="add-on-list/" element={<ListofOptions />} />
          <Route path="Doctors-list/" element={<DoctorsList />} />
          <Route path="Add-Patient/" element={<Add_Patient />} />
          <Route path="Patient-master-list/" element={<Patient_List />} />
          <Route path="Patient-Profile/" element={<PatientProfile />} />
          <Route path="add-medicine/" element={<Addmedicine/>} />
          <Route path="medicine-invoice/" element={<MedicineInvoice/>} />
          <Route path="medicine-directory/" element={<MedicineDirectory/>} />
          <Route path="patient-invoice/" element={<Add_Patient_Invoice />} />
          <Route path="Patient-Invoice-list/" element={<Patient_Invoice_List />} />
          <Route path="Patient-invoice-report/" element={<Patient_invoice_report />} />
          <Route path="consolidate-report/" element={<Consolidate_Report />} /> 
          <Route path="settings/" element={<Settings />} />
          <Route path="profile/" element={<Profile />} />
          <Route path="help" element={<Wraper value={"Help"} />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;

const Wraper = ({ value }) => {
  return (
    <div className="text-2xl uppercase text-center p-10 font-Poppins font-bold">
      {value}
    </div>
  );
};
