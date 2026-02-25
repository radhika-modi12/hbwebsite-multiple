"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";
// import Image from 'next/image'; // Optional if you use <Image> instead of <img>

export default function carausals(props) {
  const router = useRouter();
  const [carousals, setCarousal] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const PageSize = 5;

  // const currentCarousals = carousals.slice(
  //   (currentPage - 1) * PageSize,
  //   currentPage * PageSize,
  // );

  useEffect(() => {
    loadCarousals();
  }, []);

  const loadCarousals = async () => {
    const res = await axios.get("http://localhost:3000/api/carousal");
    setCarousal(res.data.list);
  };

  const getData = (raw) => {
    localStorage.setItem("carousal_data", JSON.stringify(raw));
    return router.push(`/admin/carausal/edit_carausal`);
  };

  const handleAddCarausal = () => {
    return router.push("/admin/carausal/add_carausal");
  };

  const deleteCarausal = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/carousal", {
        data: { id },
      });
      loadCarousals();
    } catch (error) {
      console.log({ error });
    }
  };

   const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={row?.image}
          alt="hotel"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      ),
       width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => {
              getData(row);
            }}
          >
            Edit
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteCarausal(row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="sidebar-mini layout-fixed" style={{ height: "auto" }}>
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0 text-dark">Carausals</h1>
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
                    Carausals
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button className="hotel-btn" onClick={handleAddCarausal}>
                        Add Carausal
                      </button>
                    </div>
                    <DataTable
                      columns={columns}
                      data={carousals}
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
      </div>
    </AdminLayout>
  );
}
