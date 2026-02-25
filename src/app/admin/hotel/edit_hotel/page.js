"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const EditHotel = (props) => {
  const router = useRouter();
  const [cities, setCities] = useState([]);

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
      location: Yup.string().required("location is required"),
      latitude: Yup.string().required("latitude is required"),
      longitute: Yup.string().required("longitute is required"),
      room: Yup.string().required("room is required"),
      hotel_type: Yup.string().required("hotel_type is required"),
      adults: Yup.string().required("adults is required"),
      children: Yup.string().required("children is required"),
      price: Yup.string().required("price is required"),
      purpose_of_day: Yup.string().required("purpose_of_day is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("id", values?.id);
        formData.append("name", values?.name);
        formData.append("address", values?.address);
        formData.append("location", values?.location);
        formData.append("latitude", values?.latitude);
        formData.append("longitute", values?.longitute); // fixed typo
        formData.append("room", values?.room);
        formData.append("hotel_type", values?.hotel_type);
        formData.append("adults", values?.adults);
        formData.append("children", values?.children); // fixed typo
        formData.append("price", values?.price);
        formData.append("purpose_of_day", values?.purpose_of_day);
        if (values.image) {
          formData.append("file", values?.image);
        }
        await axios.put("http://localhost:3000/api/hotels", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        router.push("/admin/hotel");
        // window.location.href = "/admin/hotel";
        // resetForm();
      } catch (error) {
        console.error("Error editing hotel:", error);
      }
    },
  });

  const hotelTypes = [
    { label: "Luxury ", value: "Luxury" },
    { label: "Resort ", value: "Resort" },
    { label: "Boutique ", value: "Boutique" },
    { label: "Business ", value: "Business" },
    { label: "Budget ", value: "Budget" },
    { label: "Hostel", value: "Hostel" },
    { label: "Motel", value: "Motel" },
  ];
  const purposeOfDays = [
    { label: "business ", value: "business" },
    { label: "holiday ", value: "holiday" },
    { label: "transit ", value: "transit" },
    { label: "medical ", value: "medical" },
    { label: "event ", value: "event" },
    { label: "Other", value: "Other" },
  ];

  useEffect(() => {
    loadCities();
    
    const data = localStorage.getItem("hotel_data");
    if (data) {
      const parsed = JSON.parse(data);
      formik.setValues({
        id: parsed._id || "",
        name: parsed.name || "",
        address: parsed.address || "",
        location: parsed.location || "",
        latitude: parsed.latitude || "",
        longitute: parsed.longitute || "",
        room: parsed.room || "",
        hotel_type: parsed.hotel_type || "",
        adults: parsed.adults || "",
        children: parsed.children || "",
        price: parsed.price || "",
        purpose_of_day: parsed.purpose_of_day || "",
        image: null, // Do not preload image file; user can re-upload
      });
    }
  }, []);

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
      <div className="container mt-4 mb-4">
        <h4 className="mb-4">Edit Hotel</h4>
        <form
          className="max-w-4xl bg-white p-8 rounded shadow"
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label>Hotel Name</label>
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
          <div className="form-group">
            <label>Location</label>
            <select
              className={`form-control ${
                formik.touched.location && formik.errors.location
                  ? "is-invalid"
                  : ""
              }`}
              name="location"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
              style={{ marginBottom: "10px" }}
            >
              <option>select location</option>
              {cities.length > 0 &&
                cities.map((city, idx) => (
                  <option
                    key={idx}
                    value={city.name.toLowerCase()}
                    style={{ width: "20%" }}
                  >
                    {city.name.length > 20
                      ? city.name && city.name.substr(0, 15) + " ..."
                      : city.name.toLowerCase()}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Room</label>
            <input
              type="text"
              name="room"
              className={`form-control ${
                formik.touched.room && formik.errors.room ? "is-invalid" : ""
              }`}
              value={formik.values.room}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.room}</div>
          </div>
          <div className="form-group">
            <label htmlFor="hotel_type">Hotel Type</label>
            <select
              className={`form-control ${
                formik.touched.hotel_type && formik.errors.hotel_type
                  ? "is-invalid"
                  : ""
              }`}
              name="hotel_type"
              id="hotel_type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik?.values?.hotel_type}
              style={{ marginBottom: "10px" }}
            >
              <option>select hotel type</option>
              {hotelTypes.length > 0 &&
                hotelTypes.map((hotel_type_data, idx) => (
                  <option key={idx} style={{ width: "20%" }}>
                    {hotel_type_data.value.toLowerCase()}
                  </option>
                ))}
            </select>
            {formik.touched.hotel_type && formik.errors.hotel_type && (
              <div className="invalid-feedback">{formik.errors.hotel_type}</div>
            )}
          </div>

          <div className="form-group">
            <label>Adults</label>
            <input
              type="text"
              name="adults"
              className={`form-control ${
                formik.touched.adults && formik.errors.adults
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.adults}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.adults}</div>
          </div>

          <div className="form-group">
            <label>Children</label>
            <input
              type="text"
              name="children"
              className={`form-control ${
                formik.touched.children && formik.errors.children
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.children}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.children}</div>
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              className={`form-control ${
                formik.touched.price && formik.errors.price ? "is-invalid" : ""
              }`}
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.price}</div>
          </div>
          <div className="form-group">
            <label htmlFor="hotel_type">Purpose of day</label>
            <select
              className={`form-control ${
                formik.touched.purpose_of_day && formik.errors.purpose_of_day
                  ? "is-invalid"
                  : ""
              }`}
              name="purpose_of_day"
              id="purpose_of_day"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik?.values?.purpose_of_day}
              style={{ marginBottom: "10px" }}
            >
              <option>select Purpose of day</option>
              {purposeOfDays.length > 0 &&
                purposeOfDays.map((purpose_data, idx) => (
                  <option key={idx} style={{ width: "20%" }}>
                    {purpose_data.value.toLowerCase()}
                  </option>
                ))}
            </select>
            {formik.touched.purpose_of_day && formik.errors.purpose_of_day && (
              <div className="invalid-feedback">
                {formik.errors.purpose_of_day}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Hotel Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                formik.setFieldValue("image", e.currentTarget.files[0])
              }
            />
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
    </AdminLayout>
  );
};

export default EditHotel;
