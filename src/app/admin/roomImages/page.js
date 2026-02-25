"use client";

import React, { useEffect, useState,useMemo } from "react";
import Link from "next/link";
import axios from "axios";
// import AddHotel from "../../admin/hotel_detail";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";

// import Image from 'next/image'; // Optional if you use <Image> instead of <img>

export default function RoomImages(props) {
  const router = useRouter();
      const [search, setSearch] = useState("");
  const [roomImages, setRoomImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 5;

  // const currentRoomImages = roomImages.slice(
  //   (currentPage - 1) * PageSize,
  //   currentPage * PageSize
  // );

  useEffect(() => {
    loadRoomImages();
  }, []);

  const loadRoomImages = async () => {
    const res = await axios.get("http://localhost:3000/api/roomImages");
    setRoomImages(res.data.list);
  };

  const handleAddRoomImage = () => {
    return router.push("/admin/roomImages/add_room_image");
  };
  const getData = (raw) => {
    localStorage.setItem("edit_room_image_data", JSON.stringify(raw));
    window.location.href = "/admin/roomImages/edit_room_image";
  };

  const deleteRoomImage = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/roomImages", {
        data: { id },
      });
      loadRoomImages();
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
      name: "Room Name",
      selector: (row) => row.room_id?.name ,
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
            onClick={() => deleteRoomImage(row._id)}
          >
            Delete
          </button>
        </>
      ),
       width: "200px",
    },
  ];

    //  const filteredRoomImages = useMemo(() => {
    //     return roomImages.filter(
    //       (roomImage) =>
    //         roomImage.name?.toLowerCase().includes(search) 
    //     );
    //   }, [search, roomImages]);

  return (
    <AdminLayout>
      <div className="sidebar-mini layout-fixed" style={{ height: "auto" }}>
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0 text-dark">Room Images</h1>
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
                    Room Images
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="text-right my-2">
                      <button
                        className="hotel-btn"
                        onClick={handleAddRoomImage}
                      >
                        Add Room Image
                      </button>
                    </div>
                    {/* <div className="table-responsive text-nowrap">
                      <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Room Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRoomImages.map((raw, index) => (
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
                                {raw?.room_id?.name ? raw?.room_id?.name : "-"}
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
                                  onClick={() => deleteRoomImage(raw?._id)}
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
                        totalCount={roomImages.length}
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
                      data={roomImages}
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
