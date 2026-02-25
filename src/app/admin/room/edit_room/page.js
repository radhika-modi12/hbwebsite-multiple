"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

const EditRoom = (props) => {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    loadHotels();
    loadFacilities();
    loadFeatures();
    loadRoomFacilities();
    loadRoomTypes();
  }, []);
  const loadHotels = async () => {
    const res = await axios.get("http://localhost:3000/api/hotels");
    setHotels(res?.data?.list);
  };

  const loadRoomTypes = async () => {
    const res = await axios.get("http://localhost:3000/api/roomTypes");
    setRoomTypes(res?.data?.list);
  };
  const loadFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/facilities");
    setFacilities(res?.data?.list);
  };

  const loadRoomFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/roomFacilities");
    setRoomFacilities(res?.data?.list);
  };

  const loadFeatures = async () => {
    const res = await axios.get("http://localhost:3000/api/features");
    setFeatures(res?.data?.list);
  };

  const formik = useFormik({
    initialValues: {
      hotel_id: "",
      name: "",
      area: "",
      room_type_id: "",
      price: "",
      quantity: "",
      adult: "",
      children: "",
      description: "",
      image: null,
      facilities: "",
    },
    validationSchema: Yup.object({
      hotel_id: Yup.string().required("Hotel id is required"),
      name: Yup.string().required("name is required"),
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
        formData.append("id", values?.id);
        formData.append("hotel_id", values?.hotel_id);
        formData.append("name", values?.name);
        formData.append("area", values?.area);
        formData.append("room_type_id", values?.room_type_id);
        formData.append("price", values?.price);
        formData.append("quantity", values?.quantity); // fixed typo
        formData.append("adult", values?.adult);
        formData.append("children", values?.children);
        formData.append("description", values?.description);
        if (values?.image) {
          formData.append("file", values?.image);
        }
        if (values?.features) {
          const roomId = values?.id;
          const feature_ids = values?.features;
          const room_features_detail = { roomId, feature_ids };
          await axios.put(
            `http://localhost:3000/api/roomFeatures/${roomId}`,
            room_features_detail,
          );
        }
        if (values?.facilities) {
          const roomId = values?.id;
          const facilities_id = values?.facilities;
          const room_facility_detail = { roomId, facilities_id };

          await axios.put(
            `http://localhost:3000/api/roomFacilities/${roomId}`,
            room_facility_detail,
          );
        }

        await axios.put("http://localhost:3000/api/rooms", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        resetForm();
        window.location.href = "/admin/room";
      } catch (error) {
        console.error("Error editing hotel:", error);
      }
    },
  });

  const handleClose = () => {
    return router.push("/admin/room");
  };

  useEffect(async () => {
    const data = localStorage.getItem("edit_room_data");
    if (data) {
      const parsed = JSON.parse(data);
      const res = await axios.get(
        `http://localhost:3000/api/roomFacilities/${parsed?._id}`,
      );
      const room_facility = res?.data?.groupedFacilities;

      const res_feature = await axios.get(
        `http://localhost:3000/api/roomFeatures/${parsed?._id}`,
      );
      const room_feature = res_feature?.data?.groupedFeatures;
      let selectedFeatureIds;
      if (room_feature) {
        selectedFeatureIds = room_feature
          .flatMap((group) => group?.features)
          .map((f) => f._id);
      }
      let selectedFacilityIds;
      if (room_facility) {
        selectedFacilityIds = room_facility
          .flatMap((group) => group?.facilities)
          .map((f) => f._id);
      }
      formik.setValues({
        id: parsed._id || "",
        name: parsed.name || "",
        hotel_id: parsed.hotel_id._id || "",
        room_type_id: parsed.room_type_id._id || "",
        name: parsed.name || "",
        area: parsed.area || "",
        price: parsed.price || "",
        quantity: parsed.quantity || "",
        adult: parsed.adult || "",
        children: parsed.children || "",
        description: parsed.description || "",
        image: null, // Do not preload image file; user can re-upload
        facilities: selectedFacilityIds && selectedFacilityIds,
        features: selectedFeatureIds && selectedFeatureIds,
      });
    }
  }, []);

  return (
    <div className="container">
      <h4
        className="mt-2"
        style={{ marginTop: "37px !important", marginBottom: "-28px" }}
      >
        Edit Room
      </h4>
      <form
        className="max-w-4xl bg-white p-8 rounded shadow"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        style={{ marginTop: "60px" }}
      >
        <div className="form-group mb-20">
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
                  <option value={element._id}>{element.name}</option>
                </>
              );
            })}
            ;
          </select>
          <div className="invalid-feedback">{formik.errors.hotel_id}</div>
        </div>

        <div className="form-group mb-20">
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

        <div className="form-group mb-20">
          <label>Room Types</label>
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
            <option value="">Select Room Types</option>
            {roomTypes.map((element) => {
              return (
                <>
                  <option value={element._id}>{element.name}</option>
                </>
              );
            })}
            ;
          </select>
          <div className="invalid-feedback">{formik.errors.room_type_id}</div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4 mb-20">
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

          <div className="form-group col-md-4 mb-20">
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

          <div className="form-group col-md-4 mb-20">
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

        <div className="form-group mb-20">
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

        <div className="form-group mb-20">
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
        <div className="form-group col-md-8 mb-20">
          <label>Facilities</label>
          <div
            role="group"
            aria-labelledby="checkbox-group"
            className="d-flex flex-wrap gap-3"
          >
            {facilities.map((facility) => (
              <div className="form-check" key={facility._id}>
                <input
                  type="checkbox"
                  name="facilities"
                  value={facility._id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={
                    formik?.values?.facilities &&
                    formik?.values?.facilities.includes(facility._id)
                  }
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
          <div
            role="group"
            aria-labelledby="checkbox-group"
            className="d-flex flex-wrap gap-3"
          >
            {features.map((feature) => (
              <div className="form-check" key={feature._id}>
                <input
                  type="checkbox"
                  name="features"
                  value={feature._id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={
                    formik?.values?.features &&
                    formik?.values?.features.includes(feature._id)
                  }
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
        <div className="form-group mb-20">
          <label>Description</label>
          <input
            type="text"
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
          />
          <div className="invalid-feedback">{formik.errors.description}</div>
        </div>

        <div className="form-group mb-20">
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
  );
};

export default EditRoom;
