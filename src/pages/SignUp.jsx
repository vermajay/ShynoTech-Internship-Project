import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setSignUpData } from "../redux/slices/authSlice";
import UploadImage from "../components/UploadImage";
import uploadToCloudinary from "../services/operations/uploadToCloudinary";
import { signUp } from "../services/operations/authApi"
import { ACCOUNT_TYPE } from '../utils/constants'

import {motion} from 'framer-motion'
import { fadeIn, textVariant } from "../utils/motion";
import MotionWrapper from "../hoc/MotionWrapper";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // user or admin
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.USER)

  const authLoading = useSelector((state) => state.auth.loading);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    imageFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function changeHandler(event) {   //to handle form updation
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    console.log("Inside signup printing formdata-> ", formData);

    //upload profilePic to cloudinary and get the url
    setLoading(true);
    const imgData = new FormData();
    imgData.append("imageFile", formData?.imageFile)
    const img = await uploadToCloudinary(imgData);
    setLoading(false);
    console.log("Inside signup printing url-> ", img?.secure_url);

    const newData = new FormData();
    newData.append("name", formData?.name);
    newData.append("email", formData.email);
    newData.append("password", formData.password);
    newData.append("confirmPassword", formData.confirmPassword);
    newData.append("image", img?.secure_url ? img?.secure_url : "");
    newData.append("accountType", accountType);

    let data = Object.fromEntries(newData.entries())

    console.log("Data-> ", data);

    // Setting signup data to state
    dispatch(setSignUpData(data))

    dispatch(signUp(data.name, data.email, data.password, data.confirmPassword, data.image, data.accountType, navigate))

    //RESET
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      imageFile: null,
    });
  }

  if(authLoading) return <div className="flex justify-center items-center w-full h-screen"><div className="spinner"></div></div>

  return (
    <div className="flex justify-center items-center h-screen overflow-auto">

      <div className="w-full max-w-4xl flex items-center justify-center gap-16 h-screen">

        <motion.p variants={textVariant()}
        className="leading-[5rem] max-w-[19rem] font-extrabold text-7xl bg-gradient-to-tr from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text hidden md:block">
          Join the millions enjyoing this website!
        </motion.p>

        <motion.div variants={fadeIn("left", "spring", 0.3, 0.75)} className="px-4 pb-14 sm:px-0 sm:pb-0">

          {/* user or admin */}
          <div className='flex bg-blue-950 rounded-full max-w-max mx-auto mb-4 p-1 drop-shadow-[0_2px_rgba(255,255,255,0.25)]  font-semibold text-lg'>
            <button onClick={()=>setAccountType(ACCOUNT_TYPE.USER)} 
            className={`${accountType === ACCOUNT_TYPE.USER ? "bg-blue-500 text-white" : "text-gray-200"} px-5 py-2 rounded-full transition-all duration-200`}>
            User</button>
            <button onClick={()=>setAccountType(ACCOUNT_TYPE.ADMIN)}
            className={`${accountType === ACCOUNT_TYPE.ADMIN ? "bg-blue-500 text-white" : "text-gray-200"} px-5 py-2 rounded-full transition-all duration-200`}>
            Admin</button>
          </div>

          {/* add profile picture */}
          <UploadImage setFormData={setFormData}/>

          <form
            onSubmit={submitHandler}
            className="flex flex-col w-full gap-y-4 mt-6"
          >
            <label className="w-full">
              <p className="text-[1rem] mb-1 leading-[1.375rem]">
                Name
                <sup className="text-red-700 font-bold text-[17px]">*</sup>
              </p>
              <input
                className="w-full bg-gray-200 rounded-[0.5rem]  p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)]"
                required
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={changeHandler}
              />
            </label>

            <label>
              <p className="text-[1rem] mb-1 leading-[1.375rem]">
                Email Address
                <sup className="text-red-700 font-bold text-[17px]">*</sup>
              </p>
              <input
                className="w-full bg-gray-200 rounded-[0.5rem] p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)]"
                required
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter email address"
                onChange={changeHandler}
              />
            </label>

            <div className="flex flex-wrap sm:flex-nowrap w-full gap-4">
              <label className="relative w-full">
                <p className="text-[1rem]  mb-1 leading-[1.375rem]">
                  Create Password
                  <sup className="text-red-700 font-bold text-[17px]">*</sup>
                </p>
                <input
                  className="w-full bg-gray-200 rounded-[0.5rem] p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)]"
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Enter Password"
                  onChange={changeHandler}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} />
                  ) : (
                    <AiOutlineEye fontSize={24} />
                  )}
                </span>
              </label>
              <label className="relative w-full">
                <p className="text-[1rem]  mb-1 leading-[1.375rem]">
                  Confirm Password
                  <sup className="text-red-700 font-bold text-[17px]">*</sup>
                </p>
                <input
                  className="w-full bg-gray-200 rounded-[0.5rem] p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)]"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={changeHandler}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} />
                  ) : (
                    <AiOutlineEye fontSize={24} />
                  )}
                </span>
              </label>
            </div>

            <button className="bg-blue-500 rounded-[8px] font-medium text-white px-[12px] py-[8px] sm:mt-2 hover:scale-[0.98] transition-all duration-150" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="text-center w-full mt-1 text-gray-800">
            Already have an account?{" "}
            <Link to={"/login"}>
              <span className="text-blue-600">Login</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MotionWrapper(SignUp);
