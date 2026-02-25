"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const AddRoom = (props) => {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  
  useEffect(() => {
    loadHotels();
    loadRoomTypes();
    loadFacilities();
    loadFeatures();
  }, []);
  const loadHotels = async () => {
    const res = await axios.get("http://localhost:3000/api/hotels");
    setHotels(res.data.list);
  };
    const loadRoomTypes = async () => {
    const res = await axios.get("http://localhost:3000/api/roomTypes");
    setRoomTypes(res.data.list);
  };
    const loadFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/facilities");
    setFacilities(res.data.list);
  };

  const loadFeatures = async () => {
    const res = await axios.get("http://localhost:3000/api/features");
    setFeatures(res.data.list);
  };
  const formik = useFormik({
    initialValues: {
      hotel_id: "",
      name: "",
      room_type_id: "",
      area: "",
      price: "",
      quantity: "",
      adult: "",
      children: "",
      description: "",
      status: 1,
      removed: 0,
        image:null
    },
    validationSchema: Yup.object({
      hotel_id: Yup.string().required("hotel id is required"),
      name: Yup.string().required("Name is required"),
       room_type_id: Yup.string().required("Room Type Id is required"),
      area: Yup.string().required("area is required"),
      price: Yup.string().required("price is required"),
      quantity: Yup.string().required("quantity is required"),
      adult: Yup.string().required("adult is required"),
      children: Yup.string().required("children is required"),
      description: Yup.string().required("description is required"),

    }),
    onSubmit: async (values, { resetForm }) => {
      try {        
        const formData = new FormData();
        formData.append("hotel_id", values.hotel_id);
        formData.append("name", values.name);
        formData.append("room_type_id", values.room_type_id);
        formData.append("area", values.area);
        formData.append("price", values.price);
        formData.append("quantity", values.quantity);
        formData.append("adult", values.adult);
        formData.append("children", values.children);
        formData.append("description", values.description);
        formData.append("file", values.image);

      const result =  await axios.post("http://localhost:3000/api/rooms", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const room_id = result?.data?.rooms?._id
        {values?.facilities?.map(async element => {
          const room_facility_detail = {
            room_id,facilities_id:element
          }
         await axios.post("http://localhost:3000/api/roomFacilities", room_facility_detail);
        })};
        {values?.features?.map(async element => {
          const room_feature_detail = {
            room_id,feature_id:element
          }          
          await axios.post("http://localhost:3000/api/roomFeatures", room_feature_detail);
        })};
        resetForm();
        window.location.href = "/admin/room";
      } catch (error) {
        console.error("Error adding room:", error);
      }
    },
  });

   const handleClose = () =>{
    return router.push("/admin/room");
  }

  return (
    <AdminLayout>
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        Create Room
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

        <div className="form-group col-md-8 mb-20">
          <label>Hotel Name</label>
          <select
            className={`form-control ${
              formik.touched.hotel_id && formik.errors.hotel_id
                ? "is-invalid"
                : ""
            }`}
            name="hotel_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.hotel_id}
            style={{ marginBottom: "10px" }}
          >
            <option value="">Select Hotel Name</option>
            {hotels.map((element) => {
              return (
                <>
                  <option key={element._id} value={element._id}>{element.name}</option>
                </>
              );
            })}
            ;
          </select>
          <div className="invalid-feedback">{formik.errors.hotel_id}</div>
        </div>
        <div className="row">
          <div className="form-group col-md-6 mb-20">
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

          <div className="form-group col-md-6 mb-20">
            <label>Area</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.area && formik.errors.area ? "is-invalid" : ""
              }`}
              name="area"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.area}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.area}</div>
          </div>
        </div>
         <div className="form-group col-md-8 mb-20">
          <label>Room Type</label>
          <select
            className={`form-control ${
              formik.touched.room_type_id && formik.errors.room_type_id
                ? "is-invalid"
                : ""
            }`}
            name="room_type_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.room_type_id}
            style={{ marginBottom: "10px" }}
          >
            <option value="">Select Room Type</option>
            {roomTypes.map((element) => {
              return (
                <>
                  <option key={element._id} value={element._id}>{element.name}</option>
                </>
              );
            })}
            ;
          </select>
          <div className="invalid-feedback">{formik.errors.room_type_id}</div>
        </div>
        <div className="row">
          <div className="form-group col-md-6 mb-20">
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

          <div className="form-group col-md-6 mb-20">
            <label>quantity</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.quantity && formik.errors.quantity
                  ? "is-invalid"
                  : ""
              }`}
              name="quantity"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.quantity}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.quantity}</div>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6 mb-20">
            <label>Adult</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.adult && formik.errors.adult ? "is-invalid" : ""
              }`}
              name="adult"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.adult}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.adult}</div>
          </div>

          <div className="form-group col-md-6 mb-20">
            <label>Children</label>
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
        </div>
        <div className="form-group col-md-8 mb-20">
          <label>Facilities</label>
          <div role="group" aria-labelledby="checkbox-group" className="d-flex flex-wrap gap-3">
            {facilities.map((facility) => (
              <div className="form-check" key={facility._id}>
                <input
                  type="checkbox"
                  name="facilities"
                  value={facility._id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik?.values?.facilities && formik?.values?.facilities.includes(facility._id)}
                  className={`form-check-input ${
                    formik.touched.facilities && formik.errors.facilities
                      ? "is-invalid"
                      : ""
                  }`}
                  id={`facility-${facility._id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`facility-${facility._id}`}
                >
                  {facility.name}
                </label>
              </div>
            ))}
            <div className="invalid-feedback d-block">
              {formik.touched.facilities && formik.errors.facilities}
            </div>
          </div>
        </div>
         <div className="form-group col-md-8 mb-20">
          <label>features</label>
          <div role="group" aria-labelledby="checkbox-group" className="d-flex flex-wrap gap-3">
            {features.map((feature) => (
              <div className="form-check" key={feature._id}>
                <input
                  type="checkbox"
                  name="features"
                  value={feature._id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik?.values?.features && formik?.values?.features.includes(feature._id)}
                  className={`form-check-input ${
                    formik.touched.features && formik.errors.features
                      ? "is-invalid"
                      : ""
                  }`}
                  id={`feature-${feature._id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`feature-${feature._id}`}
                >
                  {feature.name}
                </label>
              </div>
            ))}
            <div className="invalid-feedback d-block">
              {formik.touched.facilities && formik.errors.facilities}
            </div>
          </div>
        </div>
        <div className="form-group col-md-8  mb-20">
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
            Save Room
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

export default AddRoom;
