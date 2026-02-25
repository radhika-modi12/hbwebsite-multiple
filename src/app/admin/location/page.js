"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout"; // Adjust the path as needed
import Pagination from "../components/pagination";
import DataTable from "react-data-table-component";

export default function location() {
     const router = useRouter();
      const [locations, setLocations] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const PageSize = 5;
      const currentLocations = locations.slice(
    (currentPage - 1) * PageSize,
    currentPage * PageSize
  );

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const res = await axios.get("http://localhost:3000/api/locations");
    setLocations(res.data.list);
  };
   const handleAddLocation = () => {
    router.push("/admin/location/add_location");
  };
   const getData = (raw) => {
    localStorage.setItem("location_data", JSON.stringify(raw));
    router.push(`/admin/location/edit_location`);
  };

  const deleteLocation = async (id) => {
      try {
        await axios.delete("http://localhost:3000/api/locations", {
          data: { id },
        });
        loadLocations();
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
        alt="location"
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          borderRadius: "5px",
        }}
      />
    ),
      width: "120px",
  },
  {
    name: "Location",
    selector: (row) => row?.location,
    sortable: true,
    wrap: true,
     width: "120px",
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
          onClick={() => deleteLocation(row?._id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </>
    ),
     width: "150px",
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

    return(
        // <p>location page</p>
          <AdminLayout>
      <div className="content-header mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Location</h1>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-end mb-4">
          <button className="btn btn-primary" onClick={handleAddLocation}>
            Add Location
          </button>
        </div>

       <DataTable
  columns={columns}
  data={locations}
  pagination
  highlightOnHover
  striped
  responsive
/>
      </div>
    </AdminLayout>
    )
}