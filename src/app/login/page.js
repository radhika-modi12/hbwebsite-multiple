"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

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
      alert("Login successful!");
      localStorage.setItem("user-details", JSON.stringify(userData));
      resetForm();
      return router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          {[
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
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

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Login
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
