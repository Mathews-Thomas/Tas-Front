import { useEffect, useState } from "react";
import Axios from "../../../config/axios";

import man from "../../../../src/assets/Account Icon/man.png";
import woman from "../../../../src/assets/Account Icon/woman.png";

import React from "react";

const initialvalue = {
  firstName: "",
  lastName: "",
  age: "",
  Gender: "",
  address: "",
  email: " ",
  phone: " ",
  designation: " ",
  role: {
    name: "",
  },
  createdAtIST: "",
};

const Profile = () => {
  const [user, setUser] = useState(initialvalue);
  useEffect(() => {
    Axios.get("admin/get-user")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // {`${user?.firstName}`}

  return (
    <>
      {/* main container for the profile page */}
      <div className="relative w-full h-full bg-[#E7E7E7] flex flex-row items-center justify-center gap-9">
        <h1 className="absolute top-0 left-1/2 transform -translate-x-1/2 text-3xl mt-5 uppercase font-semibold ">
          account information
        </h1>
        {/* container for avatar */}
        <div className="flex flex-col h-[20rem] gap-7  bg-white w-[15rem] items-center justify-center ml-4 rounded-lg">
          <img
            src={user?.Gender.toLocaleLowerCase() === "Male".toLocaleLowerCase() ? man : woman}
            alt="icon"
            className="w-[10rem] h-[10rem]"
          />
          <h1 className="font-bold text-2xl">{`${user?.firstName}`}</h1>
          <h1 className="font-semibold">{`${user?.designation}`}</h1>
        </div>
        {/* container for details */}
        <div className="flex flex-col items-start justify-center w-[30rem] h-[30rem] bg-white gap-3 space-y-4 rounded-lg ml-10">
          <div className="flex flex-row gap-4  ml-4">
            <h1 className="capitalize text-lg">Full Name :</h1>
            <h1 className="text-gray-500">
              {`${user?.firstName}`} {`${user?.lastName}`}{" "}
            </h1>
          </div>
          <hr className="border-t-1 border-gray-300 w-4/5 ml-4" />
          <div className="flex flex-row gap-4  ml-4">
            <h1 className="capitalize text-lg">Phone :</h1>
            <h1 className="text-gray-500">{`${user?.phone}`}</h1>
          </div>
          <hr className="border-t-1 border-gray-300 w-4/5 ml-4" />
          <div className="flex flex-row gap-4  ml-4">
            <h1 className="capitalize text-lg">Email :</h1>
            <h1 className="text-gray-500">{`${user?.email}`}</h1>
          </div>
          <hr className="border-t-1 border-gray-300 w-4/5 ml-4" />
          <div className="flex flex-row gap-4  ml-4">
            <h1 className="capitalize text-lg">Gender :</h1>
            <h1 className="text-gray-500">{`${user?.Gender}`}</h1>
          </div>

          <hr className="border-t-1 border-gray-300 w-4/5 ml-4" />
          <div className="flex flex-row gap-4  ml-4">
            <h1 className="capitalize text-lg">Address :</h1>
            <h1 className="text-gray-500">{`${user?.address}`}</h1>
          </div>
          <hr className="border-t-1 border-gray-300 w-4/5 ml-4" />
          <div className="flex flex-row gap-4  ml-4">
            <h1 className="capitalize text-lg">Created At :</h1>
            <h1 className="text-gray-500">{`${user?.createdAtIST}`}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
