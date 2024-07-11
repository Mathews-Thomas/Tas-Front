import Medicine_consolidated_report from "../../components/ReviewPanel/MedicineConsolidated/Medicine_consolidated_report"

const Medicine_consolidated =()=>{
    return(<>
    <div className="m-auto">
        <div className="topbar bg-white flex flex-wrap justify-center items-center overflow-x-scroll py-10">
            <div className="flex flex-col justify-center items-center w-full ">
                <h2 className="text-xl font-Inter font-bold uppercase tracking-normal mb-5 text-center">
                    Consolidated Report MEDICINE
                </h2>
              <Medicine_consolidated_report />
            </div>
        </div>
    </div>
    </>)
}

export default Medicine_consolidated;