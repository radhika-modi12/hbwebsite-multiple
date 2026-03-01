"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
// import AddHotel from "../../admin/hotel_detail";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";

// import Image from 'next/image'; // Optional if you use <Image> instead of <img>

export default function RoomDetails(props) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(
      (room) =>
     room.name?.toLowerCase().includes(search) ||
    room.area?.toLowerCase().includes(search) ||
     room.room_type_id?.name?.toLowerCase().includes(search) ||
    room.hotel_id?.name?.toLowerCase().includes(search) ||
    room.price?.toString().includes(search)
    );
  }, [search, rooms]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await axios.get("http://localhost:3000/api/rooms");
    setRooms(res.data.list);
  };

  const handleAddRoom = () => {
      if (typeof window !== "undefined") {
     router.push("/admin/room/add_room");
      }
  };
 const getData = (raw) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("edit_room_data", JSON.stringify(raw));
    router.push("/admin/room/edit_room");
  }
};

  const deleteRoom = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/rooms", {
        data: { id },
      });
      loadRooms();
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
      name: "Hotel Name",
      selector: (row) => row.hotel_id?.name || "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
     {
      name: "Room Type",
      selector: (row) => row.room_type_id?.name || "-",
      sortable: true,
      width: "150px",
    },
    {
      name: "Area",
      selector: (row) => row.area,
      sortable: true,
      width: "110px",
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      width: "110px",
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      width: "100px",
    },
    {
      name: "Adult",
      selector: (row) => row.adult,
      sortable: true,
      width: "100px",
    },
    {
      name: "Children",
      selector: (row) => row.children,
      sortable: true,
      width: "100px",
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
            onClick={() => deleteRoom(row._id)}
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
                    <h1 className="m-0 text-dark">Rooms</h1>
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
                    Rooms
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button className="hotel-btn" onClick={handleAddRoom}>
                        Add Room
                      </button>
                    </div>
                    {/* <div className="table-responsive text-nowrap">
                      <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Hotel Name</th>
                            <th>Name</th>
                            <th>Area</th>
                            <th>Price</th>
                            <th>quantity</th>
                            <th>Adult</th>
                            <th>Children</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRooms.map((raw, index) => (
                            <tr key={raw?._id}>
                              <td> {index + 1}</td>
                              <td>
                                <img
                                  src={raw?.image}
                                  style={{ width: "30px", height: "30px" }}
                                  alt="logo"
                                />
                              </td>
                              <td>
                                {raw?.hotel_id?.name
                                  ? raw?.hotel_id?.name
                                  : "-"}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.name}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.area}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.price}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.quantity}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.adult}
                              </td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                {raw?.children}
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
                                  onClick={() => deleteRoom(raw._id)}
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
                        totalCount={rooms.length}
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
                      data={filteredRooms}
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
