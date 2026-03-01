"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

const EditUser = (props) => {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState(null);
  const [editUser, setEditUser] = useState({});

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
      phonenum: "",
      pincode: "",
      dob: "",
      profile: null,
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      email: Yup.string().required("email is required"),
      address: Yup.string().required("address is required"),
      phonenum: Yup.string().required("phonenum is required"),
      pincode: Yup.string().required("pincode is required"),
      dob: Yup.string().required("dob is required"),
      role: Yup.string().required("role is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = localStorage.getItem("user_data");
        if (data) {
          // const parsed = JSON.parse(data);
          const formData = new FormData();
          formData.append("id", values.id ? values.id : editUser.id);
          formData.append(
            "email",
            values.email ? values.email : editUser.email,
          );
          formData.append("name", values.name ? values.name : editUser.name);
          formData.append(
            "address",
            values.address ? values.address : editUser.address,
          );
          formData.append(
            "phonenum",
            values.phonenum ? values.phonenum : editUser.phonenum,
          );
          formData.append(
            "pincode",
            values.pincode ? values.pincode : editUser.pincode,
          );
          formData.append("dob", values.dob ? values.dob : editUser.dob); // fixed typo
          formData.append("role", values.role ? values.role : editUser.role);
          if (values.profile) {
            formData.append("file", values.profile);
          } else {
            formData.append("file", editUser.profile);
          }

          await axios.put("http://localhost:3000/api/userCred", formData);
          // return router.push("/admin/user");
          window.location.href = "/admin/user";
        }
      } catch (error) {
        console.error("Error editing hotel:", error);
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
  
  useEffect(() => {
    const data = localStorage.getItem("user_data");
    if (data) {
      const parsed = JSON.parse(data);
      setEditUser(parsed);

      // ✅ Only set profilePreview and formik value if profile exists and is a valid string
      const hasProfile = parsed.profile && typeof parsed.profile === "string";

      if (hasProfile) {
        setProfilePreview(parsed.profile);
      }

      formik.setValues({
        id: parsed._id || "",
        name: parsed.name || "",
        address: parsed.address || "",
        email: parsed.email || "",
        phonenum: parsed.phonenum || "",
        pincode: parsed.pincode || "",
        dob: parsed.dob || "",
        role: parsed.role || "",
        profile: hasProfile ? parsed.profile : "", // ✅ Conditional set
      });
    }
  }, [data]);

  return (
    <div className="container mt-4 mb-4">
      <h4 className="mb-4">Edit User</h4>
      <form
        className="max-w-4xl bg-white p-8 rounded shadow"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${
              formik.touched.name && formik.errors.name ? "is-invalid" : ""
            }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.name}</div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            rows="2"
            className={`form-control ${
              formik.touched.address && formik.errors.address
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.address}</div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label>Email</label>
            <input
              type="text"
              name="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.email}</div>
          </div>
        </div>

        <div className="form-group">
          <label>Phonenum</label>
          <input
            type="text"
            name="phonenum"
            maxLength={10}
            className={`form-control ${
              formik.touched.phonenum && formik.errors.phonenum
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.phonenum}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.phonenum}</div>
        </div>

        <div className="form-group">
          <label>pincode</label>
          <input
            type="text"
            name="pincode"
            className={`form-control ${
              formik.touched.pincode && formik.errors.pincode
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ marginBottom: "10px" }}
          />
          <div className="invalid-feedback">{formik.errors.pincode}</div>
        </div>

        <div className="form-group">
          <label>dob</label>
          <input
            type="text"
            name="dob"
            className={`form-control ${
              formik.touched.dob && formik.errors.dob ? "is-invalid" : ""
            }`}
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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

        <div className="form-group text-right mt-4">
          <button
            type="button"
            className="btn btn-secondary mr-2"
            style={{ marginRight: "15px" }}
            onClick={() => {
              formik.resetForm();
              if (handleClose) handleClose();
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
