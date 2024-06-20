import React from 'react'
import MedicineList from './MedicineList';
const MedicineDirectory = () => {
  return (
<div>
<MedicineList refresh={false} setRefresh={()=>{}} list={10}/>
</div>
    
  )
}

export default MedicineDirectory;