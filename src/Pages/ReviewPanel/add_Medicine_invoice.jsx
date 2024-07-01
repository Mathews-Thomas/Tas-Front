import React from "react";
import { useState } from "react";
import MedicineInvoiceList from "../../components/ReviewPanel/MedicineInvoice/MedicineInvoiceList";
import AddMedicineInvoice from "../../components/ReviewPanel/MedicineInvoice/AddMedicineInvoice";

const MedicineInvoice = () => {
  const [refreshList, setRefreshList] = useState(false);
  return (
    <div className="m-auto">
      <h2 className="text-xl font-Inter font-bold uppercase mb-4 text-center py-10">
        Medicine Invoice
      </h2>
      <div className="w-full px-10 py-10 bg-white  flex  flex-wrap justify-center">
        <AddMedicineInvoice setRefreshList={setRefreshList} />
      </div>
      <MedicineInvoiceList  refresh={refreshList} setRefresh={setRefreshList} list={10}/>
    </div>
  );
};

export default MedicineInvoice;
