"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const EditLocation = (props) => {
  const router = useRouter();
  const [cities, setCities] = useState([]);

  const formik = useFormik({
    initialValues: {
      location: "",
      image: null,
    },
    validationSchema: Yup.object({
      location: Yup.string().required("location is required")
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("id", values?.id);
         formData.append("location", values?.location);
        if (values.image) {
          formData.append("file", values?.image);
        }
         await axios.put("http://localhost:3000/api/locations", formData);
        await router.push("/admin/location");
        resetForm();
      } catch (error) {
        console.error("Error editing location:", error);
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
    
    const data = localStorage.getItem("location_data");
    if (data) {
      const parsed = JSON.parse(data);
      formik.setValues({
        id: parsed._id || "",
        location: parsed.location || "",
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
    return router.push("/admin/location");
  };

  return (
    <AdminLayout>
      <div className="container mt-4 mb-4">
        <h4 className="mb-4">Edit Location</h4>
        <form
          className="max-w-4xl bg-white p-8 rounded shadow"
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
        >
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

export default EditLocation;
