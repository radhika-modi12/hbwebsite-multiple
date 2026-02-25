"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
// import AddHotel from "../../admin/hotel_detail";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";
// import Image from 'next/image'; // Optional if you use <Image> instead of <img>

export default function TeamMembers(props) {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 5;

  const currentTeamMembers = teamMembers.slice(
    (currentPage - 1) * PageSize,
    currentPage * PageSize
  );

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    const res = await axios.get("http://localhost:3000/api/teamMemberDetails");
    setTeamMembers(res.data.list);
  };

  const handleAddTeamMembers = () => {
    return router.push("/admin/teamMemberDetails/add_team_member");
  };
  const getData = (raw) => {
    localStorage.setItem("edit_team_member", JSON.stringify(raw));
    window.location.href = "/admin/teamMemberDetails/edit_team_member";
  };

  const deleteTeamMember = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/teamMemberDetails", {
        data: { id },
      });
      loadTeamMembers();
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
      name: "Image",
      cell: (row) => (
        <img
          src={row?.image}
          alt="room"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      ),
        width: "120px",
    },
    {
      name: "Member Name",
      selector: (row) => row.name ,
      sortable: true,
      wrap: true,
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
            onClick={() => deleteTeamMember(row._id)}
          >
            Delete
          </button>
        </>
      ),
       width: "200px",
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
                    <h1 className="m-0 text-dark">Team Members</h1>
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
                    Team Members
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button
                        className="hotel-btn"
                        onClick={handleAddTeamMembers}
                      >
                        Add Team Memnbers
                      </button>
                    </div>
                    {/* <div className="table-responsive text-nowrap">
                      <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Member Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTeamMembers.map((raw, index) => (
                            <tr key={raw?._id}>
                              <td> {index + 1}</td>
                              <td>
                                <img
                                  src={raw?.image}
                                  style={{ width: "30px", height: "30px" }}
                                  alt="logo"
                                />
                              </td>
                              <td>{raw?.name ? raw?.name : "-"}</td>
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
                                  onClick={() => deleteTeamMember(raw?._id)}
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
                        totalCount={teamMembers.length}
                        pageSize={PageSize}
                        onPageChange={setCurrentPage}
                      />
                    </div> */}
                     <DataTable
                      columns={columns}
                      data={teamMembers}
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
