"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const AddUserQuery = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      email: Yup.string().required("email is required"),
      subject: Yup.string().required("subject is required"),
      message: Yup.string().required("message is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const user_queries_data = {
          name: values?.name,
          email: values?.email,
          subject: values?.subject,
          message: values?.message,
        };
        await axios.post(
          "http://localhost:3000/api/userQueries",
          user_queries_data
        );
        resetForm();
        return router.push("/admin/userQueries");
      } catch (error) {
        console.error("Error adding userQueries:", error);
      }
    },
  });

  const handleClose = () => {
    return router.push("/admin/userQueries");
  };

  return (
    <AdminLayout>
      <div className="container">
        <h4
          className="mt-2"
          style={{ marginTop: "37px !important", marginBottom: "-28px" }}
        >
          Create User Query
        </h4>
        <form
          className="max-w-xl bg-white p-8 rounded shadow"
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
          style={{ marginTop: "60px" }}
        >
          <div className="form-group">
            <label>Name</label>
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
            <label>Email</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.email}</div>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.subject && formik.errors.subject
                  ? "is-invalid"
                  : ""
              }`}
              name="subject"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subject}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.subject}</div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.message && formik.errors.message
                  ? "is-invalid"
                  : ""
              }`}
              name="message"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.message}</div>
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
              Save User QUeries
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddUserQuery;
