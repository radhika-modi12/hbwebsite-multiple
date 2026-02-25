"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const AddFeature = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required")
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
       const feature_detail = {name:values?.name}
        await axios.post("http://localhost:3000/api/features", feature_detail);
        resetForm();
        return router.push("/admin/feature");
      } catch (error) {
        console.error("Error adding feature:", error);
      }
    },
  });

  const handleClose = () =>{
    return router.push("/admin/feature");
  }

  return (
    <AdminLayout>
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        Create Feature
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
            Save Feature
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
};

export default AddFeature;
