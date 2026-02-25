"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    phonenum: "",
    address: "",
    pincode: "",
    dob: "",
    password: "",
    file: null,
     role: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phonenum: Yup.number().required("Required"),
    address: Yup.string().required("Required"),
    pincode: Yup.number().required("Required"),
    dob: Yup.date().required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    file: Yup.mixed().required("Image is required"),
      role: Yup.string().required('Please select a role'), // Add this
  });

  const handleSubmit = async (values, { resetForm }) => {
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
      return router.push("/login");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  const inputClass =
    "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <Head>
        <title>User Registration</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-3xl font-bold mb-6 text-center">
          User Registration
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Name" },
                { name: "email", label: "Email", type: "email" },
                { name: "phonenum", label: "phonenum" },
                { name: "address", label: "Address", as: "textarea" },
                { name: "pincode", label: "Pincode" },
                { name: "dob", label: "Date of Birth", type: "date" },
                { name: "password", label: "Password", type: "password" },
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
              <div className="md:col-span-2">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Image12
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

                {/* Preview */}
                {preview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
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

              <div>
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

              {/* Submit */}
              <div className="md:col-span-2 text-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
