import React from 'react'
import MedicineInvoiceList from './MedicineInvoiceList';
const MedicineInvoice = () => {
  return (
<div className="m-auto">
      <h2 className="text-xl font-Inter font-bold uppercase mb-4 text-center py-10">
      Medicine Invoice
      </h2>
      <div className="w-full px-10 py-10 bg-white  flex  flex-wrap justify-center">
      </div>
      <MedicineInvoiceList />
    </div>
  )
}

export default MedicineInvoice;