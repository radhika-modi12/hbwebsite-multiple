"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../layout/sidebar/page";
import AdminLayout from "../components/AdminLayout";
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";
// import Image from 'next/image'; // Optional if you use <Image> instead of <img>

export default function userQueries(props) {
  const router = useRouter();
  const [userQueries, setUserQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 5;

  const currentUserQueries = userQueries.slice(
    (currentPage - 1) * PageSize,
    currentPage * PageSize,
  );

  useEffect(() => {
    loadUserQueries();
  }, []);

  const loadUserQueries = async () => {
    const res = await axios.get("http://localhost:3000/api/userQueries");
    setUserQueries(res.data.list);
  };

  const getData = (raw) => {
    localStorage.setItem("user_query_data", JSON.stringify(raw));
    return router.push(`/admin/userQueries/edit_user_query`);
  };
  const handleAddUserQueries = () => {
    return router.push("/admin/userQueries/add_user_query");
  };

  const deleteUserQueries = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/userQueries", {
        data: { id },
      });
      loadUserQueries();
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
    wrap: true,
     width: "120px",
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    wrap: true,
  },
  {
    name: "Subject",
    selector: (row) => row.subject,
    wrap: true,
  },
  {
    name: "Message",
    selector: (row) => row.message,
    wrap: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <>
        <button
          onClick={() => getData(row)}
          className="btn btn-success btn-sm"
          style={{ marginRight: "12px" }}
        >
          Edit
        </button>

        <button
          onClick={() => deleteUserQueries(row._id)}
          className="btn btn-danger btn-sm"
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
        {/* <Sidebar/> */}
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0 text-dark">User Queries</h1>
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
                    User Queries
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button
                        className="hotel-btn"
                        onClick={handleAddUserQueries}
                      >
                        Add User Queries
                      </button>
                    </div>
                    <DataTable
                      columns={columns}
                      data={userQueries}
                      highlightOnHover
                      striped
                      responsive
                    />
                    {/* <div className="table-responsive text-nowrap">
                      <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUserQueries.map((raw, index) => (
                            <tr key={raw.id}>
                              <td> {index + 1}</td>
                              <td>{raw.name}</td>
                              <td>{raw.email}</td>
                              <td>{raw.subject}</td>
                              <td>{raw.message}</td>
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
                                  onClick={() => deleteUserQueries(raw._id)}
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
                        totalCount={userQueries.length}
                        pageSize={PageSize}
                        onPageChange={setCurrentPage}
                      />
                    </div> */}
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
