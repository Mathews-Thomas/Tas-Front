import { useEffect, useState } from "react";
import TextInput from "../common/TextInput";
import PasswordInput from "../common/PasswordInput";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/useToast";
import axios from "../../config/axios";
import { useAuth } from "../../hooks/useAuth";
import swal from "sweetalert";
import logo from "../../assets/NavBar/Topmost Logo  1.png";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const [loader,setloader]=useState(false)
  const { isBranchLoggedIn, loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const tost = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleType = localStorage.getItem("jobRole");

    if (token && roleType) {
      if (roleType === import.meta.env.VITE_ROLE_ADMIN) {
        navigate("/review-panel");
      } else if (
        roleType === import.meta.env.VITE_ROLE_USER &&
        isBranchLoggedIn
      ) {
        navigate("/");
      }
    } else {
      navigate("/user-login");
    }
  }, [navigate, isBranchLoggedIn]);

  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
    },
    validate: (values) => {      
      const errors = {};
      // Validate loginId format
      if (!values.loginId) {
        errors.loginId = "Login ID is Required";
      } else if (values.loginId.length < 5) {
        errors.loginId = "Login ID must be at least 5 characters";
      }

      // Validate password
      if (!values.password) {
        errors.password = "Password is Required";
      } else if (values.password.length < 5) {
        errors.password = "Password must be at least 5 characters";
      }
      return errors;
    },
    onSubmit: (values) => {
      setloader(true)
      axios
        .post("/login", { ...values })
        .then(({ data }) => {
          setloader(true)
          const LoggedInUser =
          data?.Employee?.firstName + " " + data?.Employee?.lastName;
          localStorage.setItem("jobRole", data?.Employee?.role?.roleType);
          localStorage.setItem("LoggedInUser", LoggedInUser);
          if (data?.Employee?.role?.roleType === import.meta.env.VITE_ROLE_ADMIN) {
            navigate("/review-panel");            
            if (isBranchLoggedIn) {
              localStorage.removeItem('branchToken');
              localStorage.removeItem('branch');
            }

          } else if (data?.Employee?.role?.roleType === import.meta.env.VITE_ROLE_USER) {
            if (!isBranchLoggedIn) {
              showSweetAlert();
            } else {
              navigate("/");
            }
          }
          loginUser(data?.token, data?.Employee?.role?.roleType);
        })
        .catch(({ message, response }) => {
          setloader(false)          
          if (response) return tost(response.data.err, "error");
          tost(message, "error");
        });
    },
  });

  const showSweetAlert = () => {
    swal({
      title: "Branch Access Denied ",
      text: "Please Login Branch",
      icon: "warning",
      buttons: {
        confirm: true,
      },
      dangerMode: true,
    }).then(() => {
      setloader(false)
      navigate("/login");
    });
  };

 

  return (
    <div className="bg-white rounded-md border px-10 py-10 flex md:gap-10 gap-4 w-full h-screen justify-center items-center md:flex-row flex-col">
      <div className="flex flex-col md:justify-end md:items-end justify-center items-center gap-2 ">
        <img src={logo} alt="" />
        <h1 className="font-semibold uppercase">Welcome back!</h1>
        <span className="font-bold text-xl text-center  uppercase text-[#387ADF]">
          User Login
        </span>
        <p className="md:text-right text-center w-[18rem]">
          Please sign in to access your account and get connected
        </p>
      </div>
      <div className="flex items-center justify-start p-8 md:w-[40rem] w-full">
        <div className="w-full">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            <div>
              <TextInput
                label="loginId"
                type="text"
                id="loginId"
                name="loginId"
                placeholder="Login ID"
                value={formik.values.loginId}
                onChange={formik.handleChange}
              />
              {formik.touched.loginId && formik.errors.loginId && (
                <div className="text-[#ff4b4b] text-left">
                  {formik.errors.loginId}
                </div>
              )}
            </div>
            <div>
              <PasswordInput
                label="Password"
                id="password"
                name="password"
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-[#ff4b4b] text-left">
                  {formik.errors.password}
                </div>
              )}
              <p className="text-[#387ADF] text-right mt-3">
                Forgot your password?!
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#387ADF] text-white font-bold py-2 px-4 rounded focus:outline-none text-sm w-full"
            >
              
              <span className="flex justify-center items-center gap-2">Login {loader && <span className=" inline-flex justify-center items-center "><CircularProgress size={20} color="inherit"/></span>} </span> 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
