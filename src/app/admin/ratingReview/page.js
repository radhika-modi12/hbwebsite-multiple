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

export default function RatingReview(props) {
  const router = useRouter();
  const [ratingReviews, setRatingReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 5;

  const currentRatingReviews = ratingReviews.slice(
    (currentPage - 1) * PageSize,
    currentPage * PageSize,
  );

  useEffect(() => {
    loadRatingReviews();
  }, []);

  const loadRatingReviews = async () => {
    const res = await axios.get("http://localhost:3000/api/ratingReviews");
    setRatingReviews(res.data.reviews);
  };

  const getData = (raw) => {
    localStorage.setItem("edit_rating_review", JSON.stringify(raw));
    window.location.href = "/admin/ratingReview/edit_rating_review";
  };

  const deleteRatingReview = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/ratingReviews", {
        data: { id },
      });
      loadRatingReviews();
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
    name: "Hotel Name",
    selector: (row) => row?.hotel_id?.name || "-",
    sortable: true,
    wrap: true,
    width:"130px"
  },
  {
    name: "User Name",
    selector: (row) => row?.user?.name || "-",
    sortable: true,
    wrap: true,
     width:"130px"
  },
  {
    name: "Rating",
    selector: (row) => row?.rating,
    sortable: true,
    width: "100px",
  },
  {
    name: "Review",
    selector: (row) => row?.review,
    wrap: true,
     width: "550px",
  },
  {
    name: "Seen",
    selector: (row) => row?.seen,
  },
  {
    name: "Action",
    cell: (row) => (
      <button
        onClick={() => deleteRatingReview(row._id)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
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
                    <h1 className="m-0 text-dark">Rating Reviews</h1>
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
                    {/* Rating Reviews */}
                  </h3>
                  <div className="card-tools"></div>
                  <div className="card-body">
                    <div className="table-responsive text-nowrap">
                      {/* <table id="example" className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Hotel Name</th>
                            <th>User Name</th>
                            <th>Rating</th>
                            <th>Review</th>
                            <th>Seen</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRatingReviews &&
                            currentRatingReviews.map((raw, index) => (
                              <tr key={raw?._id}>
                                <td> {index + 1}</td>
                                <td>
                                  {raw?.hotel_id?.name
                                    ? raw?.hotel_id?.name
                                    : "-"}
                                </td>
                                <td style={{ whiteSpace: "pre-wrap" }}>
                                  {raw?.user?.name ? raw?.user?.name : "-"}
                                </td>
                                <td style={{ whiteSpace: "pre-wrap" }}>
                                  {raw?.rating}
                                </td>
                                <td style={{ whiteSpace: "pre-wrap" }}>
                                  {raw?.review}
                                </td>
                                <td style={{ whiteSpace: "pre-wrap" }}>
                                  {raw?.seen}
                                </td>
                                <td>                                 
                                  <button
                                    type="button"
                                    onClick={() => deleteRatingReview(raw._id)}
                                    className="btn btn-danger btn-sm ml-2"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table> */}
                      <DataTable
                        columns={columns}
                        data={currentRatingReviews}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalCount={ratingReviews.length}
                        pageSize={PageSize}
                        onPageChange={setCurrentPage}
                      />
                    </div>
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
