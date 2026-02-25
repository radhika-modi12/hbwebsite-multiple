"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";

const EditRoomImage = (props) => {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRoomImages(), loadRooms();
  }, []);
  const formik = useFormik({
    initialValues: {
      room_id: "",
      image: null,
      thumb: "",
    },
    validationSchema: Yup.object({
      room_id: Yup.string().required("room_id is required"),
      thumb: Yup.string().required("thumb is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("id", values.id);
        formData.append("room_id", values.room_id);
        formData.append("thumb", values.thumb);
        if (values?.image) {
          formData.append("file", values?.image);
        }
        await axios.put("http://localhost:3000/api/roomImages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resetForm();
        window.location.href = "/admin/roomImages";
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
  });
  const handleClose = () => {
    window.location.href = "/admin/roomImages";
  };

  const loadRoomImages = async () => {
    const res = await axios.get("http://localhost:3000/api/roomImages");
    setRoomImages(res.data.list);
  };

  const loadRooms = async () => {
    const res = await axios.get("http://localhost:3000/api/rooms");
    setRooms(res.data.list);
  };
  useEffect(() => {
    const data = localStorage.getItem("edit_room_image_data");
    if (data) {
      const parsed = JSON.parse(data);
      formik.setValues({
        id: parsed._id || "",
        room_id: parsed?.room_id?._id || "",
        thumb: parsed.thumb || "",
        image: null,
      });
    }
  }, []);

  return (
    <AdminLayout>
      <div className="container">
        <h4
          className="mt-2"
          style={{ marginTop: "37px !important", marginBottom: "-28px" }}
        >
          Edit Room Image
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

          <div className="form-group  col-md-8 mb-20">
            <label>Room Name</label>
            <select
              className={`form-control ${
                formik.touched.room_id && formik.errors.room_id
                  ? "is-invalid"
                  : ""
              }`}
              name="room_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.room_id}
              style={{ marginBottom: "10px" }}
            >
              {/* <option value="">Select Room Name</option> */}
              {rooms.map((element) => {
                return (
                  <>
                    <option key={element._id} value={element._id}>
                      {element.name}
                    </option>
                  </>
                );
              })}
              ;
            </select>
            <div className="invalid-feedback">{formik.errors.room_id}</div>
          </div>

          <div className="form-group col-md-8">
            <label>Thumb</label>
            <input
              type="text"
              className={`form-control  ${
                formik.touched.thumb && formik.errors.thumb ? "is-invalid" : ""
              }`}
              name="thumb"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.thumb}
              style={{ marginBottom: "10px" }}
            />
            <div className="invalid-feedback">{formik.errors.thumb}</div>
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
              Save Room Images
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditRoomImage;
