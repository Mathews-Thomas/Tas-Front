/* eslint-disable react/prop-types */
import { useState } from "react";
import Table from "./Table" 


const ListofOptions = ({tableData,refresh,setRefresh,page =1,limit=10,loader,className}) => { 
  const [selectedTable, setSelectedTable] = useState(tableData[0]?.name); 

  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
  };
  
  return (
    <div className={`m-auto w-auto ${className} `}>
       <div className={` ${(tableData.length > 1) ? "  topbar m-5 p-4 bg-white flex flex-wrap justify-center cursor-pointer  ": "hidden " }`} >
        {tableData.map((item, i) => (
          <button
            key={i + item.name}
            onClick={() => handleTableClick(item.name)}
            className={`${selectedTable == item.name ? ' bg-gray-200':''} uppercase shadow-sm  m-2 px-4 py-2 text-sm font-semibold text-gray-700   border border-gray-300 rounded-md`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mx-5 px-4   bg-white w-auto">
        
      {selectedTable && (
          <Table 
          columns={tableData.find((item) => item.name === selectedTable).columns} 
          Head={tableData.find((item) => item.name === selectedTable).Head}
          endpoints={tableData.find((item) => item.name === selectedTable).endpoints}
          Data={tableData.find((item) => item.name === selectedTable).data}
          selectedTable={selectedTable}
          refresh={refresh } setRefresh={setRefresh}
          page={page}
          limit={limit}
          loader={loader} 
          />
        )}
      </div>
    </div>
  )
}

export default ListofOptions
