"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import DataTable from "react-data-table-component";
// import Image from 'next/image'; // Optional if you use <Image> instead of <img>

export default function facilities(props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
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

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Icon",
      cell: (row) => (
        <img
          src={row?.icon}
          alt="facility"
          style={{ width: "30px", height: "30px", objectFit: "cover" }}
        />
      ),
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
      width: "500px",
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
            onClick={() => deleteFacility(row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];
  const filteredFacilities = useMemo(() => {
    return facilities.filter(
      (facility) =>
        facility.name?.toLowerCase().includes(search) ||
        facility.description?.toLowerCase().includes(search),
    );
  }, [search, facilities]);

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
                    {/* <div className="table-responsive text-nowrap">
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
                          {currentFacilities.map((raw, index) => (
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
                      <Pagination
                        currentPage={currentPage}
                        totalCount={facilities.length}
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
                      data={filteredFacilities}
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
