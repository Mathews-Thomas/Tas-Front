/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../config/axios";
import moment from "moment-timezone";

const History = ({ showModal, setShowModal, Data }) => {
  const [history, setHistory] = useState([]);
  const closeModal = (e) => {
    if (e.target.id === "modal-backdrop-2") {
      setShowModal(false);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

//   useEffect(() => {
//     if (Data?._id) {
//       Axios.get(`/admin/history-logs/${Data?._id}`).then((resp) => {
//         setHistory(resp?.data);
//       });
//     }
//   }, [Data?._id]);

  const formatValue = (value) => {
    if (Array?.isArray(value)) {
      return value?.map((item) => (
        <span key={item?._id}>
          <span>
            {item?.procedure} (Qty: {item?.quantity}, Price: {item?.unitPrice})
          </span>
          <br />
        </span>
      ));
    } else if (typeof value === "object") {
      return Object.entries(value)
        ?.filter(([key]) => key === "paymentMethod")
        .map(([key, val]) => (
          <span key={key}>
            <span>{`${val}`}</span> <br />
          </span>
        ));
    } else {
      return <span>{value}</span>;
    }
  };

 

  return (
    <div>
      {showModal ?  (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
            onClick={closeModal}
            id="modal-backdrop-2"
          >
            <div
              className="relative mx-auto max-w-4xl h-auto"
              onClick={stopPropagation}
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="p-1">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                  <div className="text-2xl text-center py-2 font-bold">
                    {Data?.invoiceID}
                  </div>
                  <hr />
                </div>
                <div
                  className="px-10 py-6 flex-auto w-full bg-white rounded-xl overflow-y-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  {!(history?.length<1) ? <div className="flex flex-col gap-8">
                    <div className="flex gap-10">
                      <div className="w-full">
                       <div className="flex justify-between items-center  uppercase px-4 font-bold text-blue-700">
                          <div>Old </div>
                          <div>New </div>
                        </div>
                        {history?.map((his, index) => {
                          return (
                            <div
                              className="border rounded-xl shadow-lg w-full py-4 my-2 px-4"
                              key={index}
                            >
                              <span className="text-blue-400">
                                {moment(his?.timestamp)
                                  .tz("Asia/Kolkata")
                                  .format("YYYY-MM-DD hh:mm")}
                              </span>
                              <p className="text-2xl text-blue-800 text-center font-bold pb-2">
                                {his?.changedBy}
                              </p>
                              {his?.changes.map((change, i) => (
                                <div key={change?._id}>
                                  {i !== 0 && <hr />}
                                  <p className="uppercase text-center">
                                    {change?.field}
                                  </p>
                                  <div className="flex justify-between items-center gap-5">
                                    {change?.oldValue && (
                                      <span className="text-red-700">
                                        {formatValue(change?.oldValue)}
                                      </span>
                                    )}
                                    <span className="text-green-700">
                                      {formatValue(change?.newValue)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  : <div className="w-full h-auto"> No History Found</div> }
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default History;