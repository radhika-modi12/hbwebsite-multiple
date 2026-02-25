"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const Register = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      password: Yup.string().required("password is required"),
      role: Yup.string().required("role is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("password", values.password);
        formData.append("role", values.role);
        await axios.post("http://localhost:3000/api/userCred", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resetForm();
        router.push("/admin/login");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
  });
  const handleClose = () => {
    window.location.href = "/admin/user";
  };

  return (
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        User Registration
      </h4>
      <form
        className="max-w-4xl bg-white p-8 rounded shadow"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        style={{ marginTop: "60px",width:"55%" }}
      >
        <div className="form-group">
          <label> username</label>
          <input
            type="text"
            className={`form-control  ${
              formik.touched.name && formik.errors.name ? "is-invalid" : ""
            }`}
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.name}</div>
        </div>

        <div className="form-group">
          <label>password</label>
          <input
            type="text"
            className={`form-control  ${
              formik.touched.password && formik.errors.password
                ? "is-invalid"
                : ""
            }`}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.password}</div>
        </div>

        <div className="form-group col-md-12 mb-20">
          <label>User Role</label>
          <select
            className={`form-control ${
              formik.touched.role && formik.errors.role ? "is-invalid" : ""
            }`}
            name="role"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
            style={{ marginBottom: "10px" }}
          >
            <option value="">Select Role</option>
            <option key="admin" value="admin">
              admin
            </option>
            <option key="manager" value="manager">
              manager
            </option>
          </select>
          <div className="invalid-feedback">{formik.errors.role}</div>
        </div>

        <div
          className="modal-footer d-flex justify-content-end"
          style={{ marginTop: "20px", gap: "15px" }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary ml-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
