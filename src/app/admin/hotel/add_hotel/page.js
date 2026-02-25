"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, redirect } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const AddHotel = (props) => {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    loadCities();
  }, []);
  const router = useRouter();


  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      location: "",
      latitude: "",
      longitute: "",
      room: "",
      hotel_type: "",
      adults: "",
      children: "",
      price: "",
      purpose_of_day: "",
      image: null,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Hotel name is required"),
      address: Yup.string().required("Address is required"),
      location: Yup.string().required("Location is required"),
      latitude: Yup.number().required("Latitude is required"),
      longitute: Yup.number().required("Longitude is required"),
      room: Yup.number().required("Room is required"),
      hotel_type: Yup.string().required("Hotel type is required"),
      adults: Yup.number().required("Adults is required"),
      children: Yup.number().required("Children is required"),
      price: Yup.number().required("Price is required"),
      purpose_of_day: Yup.string().required("Purpose of day is required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          if (key === "image" && values.image) {
            formData.append("file", values.image);
          } else {
            formData.append(key, values[key]);
          }
        });

        await axios.post("/api/hotels", formData);

        // resetForm();
        router.push("/admin/hotel"); // ✅ No page reload
        // window.location.href="/admin/hotel";
      } catch (error) {
        console.error("Error adding hotel:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  const loadCities = async () => {
    const res = await fetch("/cities.json");
    if (!res.ok) throw new Error("Failed to load cities");
    const data = await res.json();
    setCities(data);
  };

  const handleClose = () => {
    return router.push("/admin/hotel");
  };

  return (
    <AdminLayout>
    <div className="container">
      <h4 className="mt-4 mb-3">Create Hotel</h4>

      <form
        className="max-w-4xl bg-white p-4 rounded shadow"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        {/* Hotel Name */}
        <div className="form-group mb-3">
          <label>Hotel Name</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.name && formik.errors.name ? "is-invalid" : ""
            }`}
            name="name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">
              {formik.errors.name}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="form-group mb-3">
          <label>Address</label>
          <textarea
            rows="2"
            className={`form-control ${
              formik.touched.address && formik.errors.address
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("address")}
          />
          {formik.touched.address && formik.errors.address && (
            <div className="invalid-feedback">
              {formik.errors.address}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="form-group mb-3">
          <label>Location</label>
          <select
            className={`form-control ${
              formik.touched.location && formik.errors.location
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("location")}
          >
            <option value="">Select Location</option>
            {cities?.map((city, idx) => (
              <option key={idx} value={city.name.toLowerCase()}>
                {city.name}
              </option>
            ))}
          </select>

          {formik.touched.location && formik.errors.location && (
            <div className="invalid-feedback">
              {formik.errors.location}
            </div>
          )}
        </div>

        {/* Room */}
        <div className="form-group mb-3">
          <label>Room</label>
          <input
            type="number"
            className={`form-control ${
              formik.touched.room && formik.errors.room ? "is-invalid" : ""
            }`}
            {...formik.getFieldProps("room")}
          />
          {formik.touched.room && formik.errors.room && (
            <div className="invalid-feedback">
              {formik.errors.room}
            </div>
          )}
        </div>

        {/* Hotel Type */}
        <div className="form-group mb-3">
          <label>Hotel Type</label>
          <select
            className={`form-control ${
              formik.touched.hotel_type && formik.errors.hotel_type
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("hotel_type")}
          >
            <option value="">Select hotel type</option>
            <option value="Luxury">Luxury</option>
            <option value="Resort">Resort</option>
            <option value="Boutique">Boutique</option>
            <option value="Business">Business</option>
            <option value="Budget">Budget</option>
            <option value="Hostel">Hostel</option>
            <option value="Motel">Motel</option>
            <option value="Eco-Hotel">Eco-Hotel</option>
          </select>

          {formik.touched.hotel_type && formik.errors.hotel_type && (
            <div className="invalid-feedback">
              {formik.errors.hotel_type}
            </div>
          )}
        </div>

        {/* Latitude */}
        <div className="form-group mb-3">
          <label>Latitude</label>
          <input
            type="number"
            step="any"
            className={`form-control ${
              formik.touched.latitude && formik.errors.latitude
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("latitude")}
          />
          {formik.touched.latitude && formik.errors.latitude && (
            <div className="invalid-feedback">
              {formik.errors.latitude}
            </div>
          )}
        </div>

        {/* Longitude */}
        <div className="form-group mb-3">
          <label>Longitude</label>
          <input
            type="number"
            step="any"
            className={`form-control ${
              formik.touched.longitute && formik.errors.longitute
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("longitute")}
          />
          {formik.touched.longitute && formik.errors.longitute && (
            <div className="invalid-feedback">
              {formik.errors.longitute}
            </div>
          )}
        </div>

        {/* Adults */}
        <div className="form-group mb-3">
          <label>Adults</label>
          <input
            type="number"
            className={`form-control ${
              formik.touched.adults && formik.errors.adults
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("adults")}
          />
          {formik.touched.adults && formik.errors.adults && (
            <div className="invalid-feedback">
              {formik.errors.adults}
            </div>
          )}
        </div>

        {/* Children */}
        <div className="form-group mb-3">
          <label>Children</label>
          <input
            type="number"
            className={`form-control ${
              formik.touched.children && formik.errors.children
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("children")}
          />
          {formik.touched.children && formik.errors.children && (
            <div className="invalid-feedback">
              {formik.errors.children}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="form-group mb-3">
          <label>Price</label>
          <input
            type="number"
            className={`form-control ${
              formik.touched.price && formik.errors.price
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("price")}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="invalid-feedback">
              {formik.errors.price}
            </div>
          )}
        </div>

        {/* Purpose */}
        <div className="form-group mb-3">
          <label>Purpose of Day</label>
          <select
            className={`form-control ${
              formik.touched.purpose_of_day &&
              formik.errors.purpose_of_day
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("purpose_of_day")}
          >
            <option value="">Select Purpose</option>
            <option value="Business">Business</option>
            <option value="Holiday">Holiday</option>
            <option value="Transit">Transit</option>
            <option value="Medical">Medical</option>
            <option value="Event">Event</option>
            <option value="Other">Other</option>
          </select>

          {formik.touched.purpose_of_day &&
            formik.errors.purpose_of_day && (
              <div className="invalid-feedback">
                {formik.errors.purpose_of_day}
              </div>
            )}
        </div>

        {/* Image */}
        <div className="form-group mb-4">
          <label>Hotel Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue("image", e.currentTarget.files[0])
            }
          />
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={formik.resetForm}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            // disabled={formik.isSubmitting}
          >
           Save Hotel
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

export default AddHotel;
