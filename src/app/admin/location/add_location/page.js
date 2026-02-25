"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, redirect } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const AddLocation = (props) => {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  useEffect(() => {
    loadCities();
  }, []);

  const formik = useFormik({
    initialValues: {
      location: "",
      image: null,
    },
    validationSchema: Yup.object({
      location: Yup.string().required("Location is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("location", values.location);

        if (values.image) {
          formData.append("file", values.image);
        }

        await axios.post("http://localhost:3000/api/locations", formData);

        await router.push("/admin/location");

        resetForm();
      } catch (error) {
        console.error("Error adding location:", error);
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
        <h4
          className="mt-2"
          style={{ marginTop: "37px !important", marginBottom: "-28px" }}
        >
          Create Location
        </h4>
        <form
          className="max-w-4xl bg-white p-8 rounded shadow"
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
          style={{ marginTop: "60px" }}
        >
          {/* <div className="form-group">
            <label>Hotel Name</label>
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
          </div> */}

          {/* <div className="form-group">
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
          </div> */}

          <div className="form-group mb-4">
            <label className="mb-2">Location</label>
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

          {/* <div className="form-group">
            <label>room</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.room && formik.errors.room ? "is-invalid" : ""
              }`}
              name="room"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.room}
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
              value={formik.values.hotel_type}
              style={{ marginBottom: "10px" }}
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
            <div className="invalid-feedback">{formik.errors.hotel_type}</div>
          </div>

          <div className="form-group">
            <label>latitude</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.latitude && formik.errors.latitude
                  ? "is-invalid"
                  : ""
              }`}
              name="latitude"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.latitude}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.latitude}</div>
          </div>
          <div className="form-group">
            <label>longitute</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.longitute && formik.errors.longitute
                  ? "is-invalid"
                  : ""
              }`}
              name="longitute"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.longitute}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.longitute}</div>
          </div>

          <div className="form-group">
            <label>Adults</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.adults && formik.errors.adults
                  ? "is-invalid"
                  : ""
              }`}
              name="adults"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.adults}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.adults}</div>
          </div>

          <div className="form-group">
            <label>children</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.children && formik.errors.children
                  ? "is-invalid"
                  : ""
              }`}
              name="children"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.children}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.children}</div>
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.price && formik.errors.price ? "is-invalid" : ""
              }`}
              name="price"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.price}</div>
          </div>

           <div className="form-group">
            <label htmlFor="purpose_of_day">Purpose of day</label>
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
              value={formik.values.purpose_of_day}
              style={{ marginBottom: "10px" }}
            >
              <option value="">Select Purpose of day</option>
              <option value="Luxury">Business</option>
              <option value="Resort">Holiday</option>
              <option value="Boutique">Transit</option>
              <option value="Business">Medical</option>
              <option value="Budget">Event</option>
              <option value="Hostel">Other</option>
            </select>
            <div className="invalid-feedback">{formik.errors.purpose_of_day}</div>
          </div> */}

          <div className="form-group">
            <label className="mb-2">Hotel Image</label>
            <input
              type="file"
              className="form-control"
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
              Save Location
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

export default AddLocation;
