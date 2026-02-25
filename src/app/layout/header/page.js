"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "../../components/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };
  const user_data = JSON.parse(localStorage.getItem("user-details"));

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const userData = await axios.post(
        "http://localhost:3000/api/users/login",
        values
      );
      
      localStorage.setItem("user-details", JSON.stringify(userData));
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  //register data

  const initialRegValues = {
    name: "",
    email: "",
    phonenum: "",
    address: "",
    pincode: "",
    dob: "",
    password: "",
    role: "",
    file: null,
  };

  const validationRegSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phonenum: Yup.number().required("Required"),
    address: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    pincode: Yup.number().required("Required"),
    dob: Yup.date().required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    file: Yup.mixed().required("Image is required"),
  });

  const handleRegSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    // Append text fields
    for (const key in values) {
      if (key !== "file") {
        formData.append(key, values[key]);
      }
    }

    // Append image file
    if (values.file) {
      formData.append("file", values.file);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/userCred",
        formData
      );
      alert("Registration successful!");
      resetForm();
      setPreview(null);
      setIsRegModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <>
      {/* return ( */}
      <nav className="border-b shadow-md bg-black items-detail">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center"
              style={{
                fontSize: "x-large",
              }}
            >
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-bold text-link text-white"
              >
                Hotels
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-white"
              >
                ☰
              </button>
            </div>
            <div className="hidden md:flex space-x-4" style={{ gap: "60px" }}>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 text-link text-white"
              >
                Home
              </Link>
              <Link
                href="/hotels"
                className="text-gray-700 hover:text-blue-600 text-link text-white"
              >
                Hotels
              </Link>
              <Link
                href="/facilities"
                className="text-gray-700 hover:text-blue-600 text-link text-white"
              >
                Facilities
              </Link>
              <Link
                href="/contacts"
                className="text-gray-700 hover:text-blue-600 text-link text-white"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 text-link text-white"
              >
                About
              </Link>
              {user_data ? (
                <Link
                  href="#"
                  className="text-gray-700 hover:text-blue-600 text-link login-btn text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              ) : (
                <>
                  <Link
                    href="#"
                    className="text-gray-700 hover:text-blue-600 text-link register-btn text-white"
                    onClick={() => setIsRegModalOpen(true)}
                  >
                    Register
                  </Link>

                  <Modal
                    isOpen={isRegModalOpen}
                    onClose={() => setIsRegModalOpen(false)}
                  >
                    <div>
                      {/* === Modal Header === */}
                      <div
                        className="px-6 border-b flex justify-between items-center"
                        style={{ padding: " 0 0 12px 0" }}
                      >
                        <h2
                          className="text-2xl font-bold"
                          style={{ fontSize: "22px" }}
                        >
                          User Registration
                        </h2>
                        <button
                          onClick={() => setIsRegModalOpen(false)}
                          className="text-gray-400 hover:text-gray-600 text-xl"
                          style={{
                            fontSize: "25px",
                            border: " 1px solid black",
                            padding: "0px 10px",
                          }}
                        >
                          &times;
                        </button>
                      </div>

                      {/* === Modal Body === */}
                      <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                        <Formik
                          initialValues={initialRegValues}
                          validationSchema={validationRegSchema}
                          onSubmit={handleRegSubmit}
                        >
                          {({ setFieldValue }) => (
                            <Form
                              id="reg-form"
                              className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                              {[
                                { name: "name", label: "Name" },
                                {
                                  name: "email",
                                  label: "Email",
                                  type: "email",
                                },
                                { name: "phonenum", label: "Phone Number" },
                                {
                                  name: "address",
                                  label: "Address",
                                  as: "textarea",
                                },
                                { name: "pincode", label: "Pincode" },
                                {
                                  name: "dob",
                                  label: "Date of Birth",
                                  type: "date",
                                },
                                {
                                  name: "password",
                                  label: "Password",
                                  type: "password",
                                },
                              ].map(({ name, label, type = "text", as }) => (
                                <div key={name}>
                                  <label
                                    htmlFor={name}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                  >
                                    {label}
                                  </label>
                                  <Field
                                    id={name}
                                    name={name}
                                    type={type}
                                    as={as}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <ErrorMessage
                                    name={name}
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                  />
                                </div>
                              ))}

                              {/* Image Upload */}
                              <div className="md:grid md:grid-cols-2 gap-6 md:col-span-2">
                              <div >
                                <label
                                  htmlFor="file"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Profile Image
                                </label>
                                <input
                                  id="file"
                                  name="file"
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue("file", file);
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setPreview(reader.result);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <ErrorMessage
                                  name="file"
                                  component="div"
                                  className="text-red-600 text-sm mt-1"
                                />

                                {preview && (
                                  <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">
                                      Preview:
                                    </p>
                                    <Image
                                      src={preview}
                                      alt="Preview"
                                      width={120}
                                      height={120}
                                      className="rounded border"
                                    />
                                  </div>
                                )}
                              </div>
                              <div >
                                <label
                                  htmlFor="role"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Role
                                </label>
                                <Field
                                  as="select"
                                  name="role"
                                  id="role"
                                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select a role</option>
                                  <option value="admin">Admin</option>
                                  <option value="user">User</option>
                                  <option value="manager">Manager</option>
                                </Field>
                                <ErrorMessage
                                  name="role"
                                  component="div"
                                  className="text-red-600 text-sm mt-1"
                                />
                              </div>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>

                      {/* === Modal Footer === */}
                      <div className="px-6 py-4 border-t flex justify-end space-x-3">
                        <button
                          onClick={() => setIsRegModalOpen(false)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded reg-cancel-btn"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          form="reg-form"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </Modal>

                  <Link
                    // href="/login"
                    href="#"
                    onClick={() => setIsModalOpen(true)}
                    className="text-gray-700 hover:text-blue-600 text-link login-btn text-white"
                  >
                    Login
                  </Link>
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  >
                    <div>
                      {/* === Modal Header === */}
                      <div
                        className="px-6 border-b flex justify-between items-center"
                        style={{ padding: " 0 0 12px 0" }}
                      >
                        <h2
                          className="text-2xl font-bold"
                          style={{ fontSize: "22px" }}
                        >
                          User Login
                        </h2>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-gray-600 text-xl"
                          style={{
                            fontSize: "25px",
                            border: " 1px solid black",
                            padding: "0px 10px",
                          }}
                        >
                          &times;
                        </button>
                      </div>

                      {/* === Modal Body === */}
                      <div>
                        <Formik
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                        >
                          <Form className="p-8" id="login-form">
                            {[
                              { name: "email", label: "Email", type: "email" },
                              {
                                name: "password",
                                label: "Password",
                                type: "password",
                              },
                            ].map(({ name, label, type }) => (
                              <div key={name} className="mb-4">
                                <label
                                  htmlFor={name}
                                  className="block mb-1 font-medium text-gray-700"
                                >
                                  {label}
                                </label>
                                <Field
                                  id={name}
                                  name={name}
                                  type={type}
                                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage
                                  name={name}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            ))}
                          </Form>
                        </Formik>
                      </div>

                      {/* === Modal Footer === */}
                      <div className="px-6 py-4 border-t flex justify-end space-x-3">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded reg-cancel-btn"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          form="login-form"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </Modal>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-2 space-y-2" style={{ gap: "20px" }}>
              <Link
                href="/"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                Home
              </Link>
              <Link
                href="/hotels"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                Hotels
              </Link>
              <Link
                href="/rooms"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                Rooms
              </Link>
              <Link
                href="/facilities"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                Facilities
              </Link>
              <Link
                href="/contacts"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                About
              </Link>
              <Link
                href="/register"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-blue-600 text-mb-link text-white
                "
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* ); */}
      {/* ) */}
      {/* <nav className="flex-container">
            <Link href="/">Home</Link>
            <Link href="/rooms">Rooms</Link>
            <Link href="/facilities">Facilities</Link>
            <Link href="/contacts">Contact</Link>
             <Link href="/about">About</Link>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
        </nav> */}
      {/* <div
        id="nav-bar"
        className="navbar navbar-expand-lg navbar-light bg-white px-lg-3 py-lg-2 shadow-sm sticky-top"
      > 
        <Link className="navbar-brand me-5 fw-bold fs-3 h-font" href="/"></Link>
        <button
          className="navbar-toggler shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">          
            <button className="nav-link me-2" onClick={goHome}>Home</button>
          </li>
          <li className="nav-item">           
            <button className="nav-link me-2" onClick={goRooms}>Rooms</button>
          </li>
          <li className="nav-item">
            <button className="nav-link me-2" onClick={goFacilities}>Facilities</button>            
          </li>
          <li className="nav-item">            
            <button className="nav-link me-2" onClick={goContact}>Contact</button>
          </li>
          <li className="nav-item">
            <button className="nav-link me-2" onClick={goAbout}>About</button>
          </li>
             <li className="nav-item">
            <button className="nav-link me-2" onClick={goRegister}>Register</button>
          </li>
             <li className="nav-item">
            <button className="nav-link me-2" onClick={goLogin}>Login</button>
          </li>
        </ul>
      </div> */}
    </>
  );
}
