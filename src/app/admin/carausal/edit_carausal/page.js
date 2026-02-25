"use client";
import React, { useState,useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";


const EditCarausal = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: Yup.object({
    //   image: Yup.string().required("image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {        
        const formData = new FormData();
        formData.append("id", values?.id);
        if(values?.image){
        formData.append("file", values?.image);
        }
        await axios.put("http://localhost:3000/api/carousal", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resetForm();        
        window.location.href = "/admin/carausal"
      } catch (error) {
        console.error("Error adding carousal:", error);
      }
    },
  });

    useEffect(() => {
    const data = localStorage.getItem("carousal_data");
    if (data) {
      const parsed = JSON.parse(data);
      formik.setValues({
        id: parsed?._id || "",
        image: null, // Do not preload image file; user can re-upload
      });
    }
  }, []);

   const handleClose = () =>{
     return router.push("/admin/carausal");
  }

  return (
    <AdminLayout>
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        Edit Carausal
      </h4>
      <form
      className="max-w-4xl bg-white p-8 rounded shadow"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        style={{ marginTop: "60px" }}
      >
       
        <div className="form-group">
          <label>Carausal image</label>
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
            Save Carausal
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

export default EditCarausal;
