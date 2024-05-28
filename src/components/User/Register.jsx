import { useState } from "react";
import { useFormik } from "formik";
import TextInput from "../common/TextInput";
import PasswordInput from "../common/PasswordInput";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = "User Name is required";
      } else if (values.name.length < 3) {
        errors.name = "User Name must be at least 3 characters";
      }

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
          values.password
        )
      ) {
        errors.password =
          "Password must be at least 6 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords must match";
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <div className="w-full md:w-[75%] lg:w-[50%] bg-white md:h-full h-[98%] m-2 ms:m-10 md:m-0 rounded-[50px] md:rounded-[0px] md:rounded-s-[50px] flex justify-center items-center">
      <div className="w-[80%] mx-auto">
        <div className="bg-white rounded-lg">
          <h1 className="font-Inter font-extrabold text-[30px] text-center py-10">
            Register Here
          </h1>
          <form onSubmit={formik.handleSubmit}>
            <TextInput
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="User Name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-[#ff4b4b] text-right">
                {formik.errors.name}
              </div>
            )}

            <TextInput
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email Address"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-[#ff4b4b] text-right">
                {formik.errors.email}
              </div>
            )}

            <PasswordInput
              label="Password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              className="pb-4"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-[#ff4b4b] text-right">
                {formik.errors.password}
              </div>
            )}

            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              placeholder="Confirm Password"
              className="mb-4"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-[#ff4b4b] text-right ">
                  {formik.errors.confirmPassword}
                </div>
              )}

            <div className="mt-6">
              <button
                type="submit"
                className="bg-[#ee7203] text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Register
              </button>
              <p className="text-center py-4">
                Already have an account?{" "}
                <Link to={"/user-login"}>
                  <span className="text-[#ee7203]">Login here</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
