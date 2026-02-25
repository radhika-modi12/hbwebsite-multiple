"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
// import { useRouter } from "next/router";

const AddTeamMember = (props) => {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [teamMember, setTeamMember] = useState([]);

  useEffect(() => {
    loadTeamMember();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      image: Yup.string().required("image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
         formData.append("id", values.id);
        formData.append("name", values.name);
        formData.append("file", values.image);
        await axios.post(
          "http://localhost:3000/api/teamMemberDetails",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        resetForm();
        window.location.href = "/admin/teamMemberDetails";
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
  });
  const handleClose = () => {
    window.location.href = "/admin/teamMemberDetails";
  };

  const loadTeamMember = async () => {
    const res = await axios.get("http://localhost:3000/api/teamMemberDetails");
    setTeamMember(res.data.list);
  };

  return (
    <AdminLayout>
      <div className="container">
        <h4
          className="mt-2"
          style={{ marginTop: "37px !important", marginBottom: "-28px" }}
        >
          Create Team Member
        </h4>
        <form
          className="max-w-4xl bg-white p-8 rounded shadow"
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
          style={{ marginTop: "60px" }}
        >
          <div className="form-group col-md-8 mb-20">
            <label>Image</label>
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

          <div className="form-group col-md-8">
            <label>Member Name</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.name && formik.errors.name
                  ? "is-invalid"
                  : ""
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
              Save Team Member
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddTeamMember;
