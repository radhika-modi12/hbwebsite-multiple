"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout"; // Adjust the path as needed
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";

export default function HotelDetails() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [hotels, setHotels] = useState([]);

  const getData = (raw) => {
     if (typeof window !== "undefined") {
    localStorage.setItem("hotel_data", JSON.stringify(raw));
    router.push(`/admin/hotel/edit_hotel`);
     }
  };

  const filteredHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(search.toLowerCase()) ||
        hotel.location.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, hotels]);

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
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Total Room",
      selector: (row) => row.room,
      sortable: true,
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
            onClick={() => deleteHotel(row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    const res = await axios.get("http://localhost:3000/api/hotels");
    setHotels(res.data.list);
  };

  const handleAddHotel = () => {
    router.push("/admin/hotel/add_hotel");
  };

  const deleteHotel = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/hotels", {
        data: { id },
      });
      loadHotels();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <AdminLayout>
      <div className="content-header mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Hotels</h1>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-end mb-4">
          <button className="btn btn-primary" onClick={handleAddHotel}>
            Add Hotel
          </button>
        </div>
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
          data={filteredHotels}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </AdminLayout>
  );
}
