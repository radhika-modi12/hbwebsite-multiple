"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import DataTable from "react-data-table-component";

export default function feature(props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [features, setFeature] = useState([]);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    const res = await axios.get("http://localhost:3000/api/features");
    setFeature(res.data.list);
  };

  const getData = (raw) => {
    localStorage.setItem("feature_data", JSON.stringify(raw));
    return router.push(`/admin/feature/edit_feature`);
  };
  const handleAddFeature = () => {
    return router.push("/admin/feature/add_feature");
  };

  const deleteFeature = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/features", {
        data: { id },
      });
      loadFeatures();
    } catch (error) {
      console.log({ error });
    }
  };
  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => getData(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteFeature(row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const filteredFeatures = useMemo(() => {
    return features.filter((feature) =>
      feature.name?.toLowerCase().includes(search),
    );
  }, [search, features]);

  return (
    <AdminLayout>
      <div className="sidebar-mini layout-fixed" style={{ height: "auto" }}>
        {/* <Sidebar/> */}
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0 text-dark">Features</h1>
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
                    Features
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button className="hotel-btn" onClick={handleAddFeature}>
                        Add Feature
                      </button>
                    </div>
                    {/* <div className="table-responsive text-nowrap">
                      <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFeatures.map((raw, index) => (
                            <tr key={raw.id}>
                              <td> {index + 1}</td>
                              <td>{raw.name}</td>
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
                                  onClick={() => deleteFeature(raw._id)}
                                  className="btn btn-danger btn-sm ml-2"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <Pagination
                        currentPage={currentPage}
                        totalCount={features.length}
                        pageSize={PageSize}
                        onPageChange={setCurrentPage}
                      />
                    </div> */}
                    <div className="col-md-3 mb-3">
                      <input
                        type="text"
                        placeholder="Search by name"
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <DataTable
                      columns={columns}
                      data={filteredFeatures}
                      pagination
                      highlightOnHover
                      striped
                      responsive
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* <AddHotel
            show={addHotelModal}
            handleClose={() => setAddHotelModal(false)}
            loadData={loadHotels}
          /> */}
      </div>
    </AdminLayout>
  );
}
