"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";

export default function facilities(props) {
  const router = useRouter();
  const [facilities, setFacility] = useState([]);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/facilities");
    setFacility(res.data.list);
  };

  const getData = (raw) => {
    localStorage.setItem("facility_data", JSON.stringify(raw));
    return router.push(`/admin/facility/edit_facility`);
  };
  const handleAddFacility = () => {
    return router.push("/admin/facility/add_facility");
  };

  const deleteFacility = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/facilities", {
        data: { id },
      });
      loadFacilities();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <AdminLayout>
    <div className="sidebar-mini layout-fixed" style={{ height: "auto" }}>
      <div className="wrapper">
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0 text-dark">Facilities</h1>
                </div>
              </div>
            </div>
          </div>

          <section className="content max-w-7xl mx-auto bg-white p-8 rounded shadow">
            <div className="container-fluid">
              <div className="card-header">
                <h3
                  style={{ color: "black" }}
                  className="card-title card-content"
                >
                  Facilities
                </h3>
                <div className="card-tools"></div>
                <div className="card-body">
                  <div className="text-right my-2">
                    <button className="hotel-btn" onClick={handleAddFacility}>
                      Add Facility
                    </button>
                  </div>
                  <div className="table-responsive text-nowrap">
                    <table id="example" className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Icon</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facilities.map((raw, index) => (
                          <tr key={raw?.id}>
                            <td> {index + 1}</td>
                            <td>
                              <img
                                src={raw?.icon}
                                style={{ width: "30px", height: "30px" }}
                                alt="logo"
                              />
                            </td>
                            <td>{raw?.name}</td>
                            <td style={{ whiteSpace: "pre-wrap" }}>
                              {raw?.description}
                            </td>
                            <td>
                              <button
                                type="button"
                                data-toggle="modal"
                                data-target="#edit"
                                onClick={() => {
                                  getData(raw);
                                }}
                                className="btn btn-success btn-sm ml-2"
                                style={{ marginRight: "12px" }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteFacility(raw?._id)}
                                className="btn btn-danger btn-sm ml-2"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>                   
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
