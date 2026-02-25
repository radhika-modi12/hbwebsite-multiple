"use client";
import React, { useState,useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";


const EditFacility = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      description:"",
      icon: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      description: Yup.string().required("Description is required")
    }),
    onSubmit: async (values, { resetForm }) => {
      try {        
        const formData = new FormData();
        formData.append("id", values?.id);
        formData.append("name", values?.name);
        formData.append("description", values?.description);
        if(values?.icon){
        formData.append("file", values?.icon);
        }
        await axios.put("http://localhost:3000/api/facilities", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resetForm();        
        window.location.href = "/admin/facility"
      } catch (error) {
        console.error("Error adding facility:", error);
      }
    },
  });

    useEffect(() => {
    const data = localStorage.getItem("facility_data");
    if (data) {
      const parsed = JSON.parse(data);
      formik.setValues({
        id: parsed?._id || "",
        name: parsed?.name || "",
        description: parsed?.description || "",
        icon: null, // Do not preload image file; user can re-upload
      });
    }
  }, []);

   const handleClose = () =>{
     return router.push("/admin/facility");
  }

  return (
    <AdminLayout>
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        Edit Facility
      </h4>
      <form
      className="max-w-4xl bg-white p-8 rounded shadow"
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
          <label>Description</label>
          <textarea
            className={`form-control  ${
              formik.touched.description && formik.errors.description
                ? "is-invalid"
                : ""
            }`}
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            style={{ marginBottom: "10px" }}
            rows="2"
          />
          <div className="invalid-feedback">{formik.errors.description}</div>
        </div>
       
        <div className="form-group">
          <label>Facility Icon</label>
          <input
            type="file"
            className="form-control "
            name="image"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue("image", e.currentTarget.files[0])
            }
          />
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
            Save Facility
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
};
// const mapDispatchToProps = {
//     addBlogData: Actions.addBlogData
// }

export default EditFacility;
