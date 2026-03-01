"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

const AddUser = (props) => {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      phonenum: "",
      pincode: "",
      dob: "",
      role: "user",
      profile: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      email: Yup.string().required("email is required"),
      password: Yup.string().required("password is required"),
      address: Yup.string().required("address is required"),
      phonenum: Yup.string().required("phonenum is required"),
      pincode: Yup.string().required("pincode is required"),
      dob: Yup.string().required("dob is required"),
       role: Yup.string().required("role is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("password", values.password);
        formData.append("email", values.email);
        formData.append("address", values.address);
        formData.append("phonenum", values.phonenum);
        formData.append("pincode", values.pincode);
        formData.append("dob", values.dob);
        formData.append("role", values.role);
        formData.append("file", values.profile);
        await axios.post("http://localhost:3000/api/userCred", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resetForm();
         window.location.href = "/admin/user";
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
  });
  const handleClose = () => {
    window.location.href = "/admin/user";
  };

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue("profile", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result); // show preview of selected image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        Create User
      </h4>
      <form
        className="max-w-4xl bg-white p-8 rounded shadow"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        style={{ marginTop: "60px" }}
      >
        <div className="form-group">
          <label> Name</label>
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
          <label>Address</label>
          <textarea
            className={`form-control  ${
              formik.touched.address && formik.errors.address
                ? "is-invalid"
                : ""
            }`}
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            style={{ marginBottom: "10px" }}
            rows="2"
          />
          <div className="invalid-feedback">{formik.errors.address}</div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
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

          <div className="form-group col-md-4">
            <label>Password</label>
            <input
              type="password"
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

          <div className="form-group col-md-4">
            <label>Phonenum</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.phonenum && formik.errors.phonenum
                  ? "is-invalid"
                  : ""
              }`}
              name="phonenum"
              maxLength={10}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phonenum}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.phonenum}</div>
          </div>

          <div className="form-group col-md-4">
            <label>Pincode</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.pincode && formik.errors.pincode
                  ? "is-invalid"
                  : ""
              }`}
              name="pincode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pincode}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.pincode}</div>
          </div>
        </div>

        <div className="form-group">
          <label>dob</label>
          <input
            type="text"
            className={`form-control  ${
              formik.touched.dob && formik.errors.dob ? "is-invalid" : ""
            }`}
            name="dob"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dob}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.dob}</div>
        </div>

        <div className="form-group mb-3">
          <label>Profile</label>
          <input
            type="file"
            className="form-control "
            name="profile"
            accept="image/*"
            onChange={handleFileChange}
          />
          {profilePreview && (
            <div className="mt-3">
              <img
                src={profilePreview}
                alt="Profile Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}
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
            <option key="manager" value="manager">
              manager
            </option>
              <option key="user" value="user">
              user
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
            Save User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
