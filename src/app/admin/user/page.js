"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
// import AddHotel from "../../admin/hotel_detail";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import DataTable from "react-data-table-component";

export default function userDetails(props) {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/userCred");
    setUsers(res.data.list);
  };

  const handleAddUser = () => {
    return router.push("/admin/user/add_user");
  };
  const getData = (raw) => {
    localStorage.setItem("user_data", JSON.stringify(raw));
    return router.push(`/admin/user/edit_user`);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/userCred", {
        data: { id },
      });
      loadUsers();
    } catch (error) {
      console.log({ error });
    }
  };

  const columns = [
  { name: '#', selector: (row, index) => index + 1, width: "60px" },
  { 
    name: 'Profile',
    cell: row => (
      <img 
        src={row?.profile}
        alt="profile" 
        style={{ width: "30px", height: "30px" }}
      />
    )
  },
  { name: 'Name', selector: row => row.name, wrap: true },
  { name: 'Email', selector: row => row.email, wrap: true ,width:"180px"},
  // { name: 'Address', selector: row => row.address, wrap: true },
  { name: 'Phone', selector: row => row.phonenum },
  // { name: 'Pincode', selector: row => row.pincode },
  { name: 'Role', selector: row => row.role },
  {
    name: 'Action',
    cell: row => (
      <>
        <button
          onClick={() => getData(row)}
          className="btn btn-success btn-sm"
        >
          Edit
        </button>&nbsp;&nbsp;
        <button
          onClick={() => deleteUser(row._id)}
          className="btn btn-danger btn-sm ml-2"
        >
          Delete
        </button>
      </>
    ),
    width:"200px"
  }
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
                    <h1 className="m-0 text-dark">Users</h1>
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
                    Users
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button className="hotel-btn" onClick={handleAddUser}>
                        Add User
                      </button>
                    </div>
                    {/* <div className="table-responsive text-nowrap">
                      <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Phonenum</th>
                            <th>pincode</th>
                            <th>dob</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((raw, index) => (
                            <tr key={raw?._id}>
                              <td> {index + 1}</td>
                              <td>
                                <img
                                  src={raw?.profile}
                                  style={{ width: "30px", height: "30px" }}
                                  alt="logo"
                                />
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.name}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.email}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.address}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.phonenum}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.pincode}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.dob}
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
                                  onClick={() => deleteUser(raw?._id)}
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
                        totalCount={users.length}
                        pageSize={PageSize}
                        onPageChange={setCurrentPage}
                      />
                    </div> */}
                    <DataTable
                      columns={columns}
                      data={users}
                      pagination
                      highlightOnHover
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
