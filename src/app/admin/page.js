"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import AdminLayout from "./components/AdminLayout";

export default function Dashboard() {
  const [hotelsCount, setHotelsCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(0);
  const [facilitiesCount, setFacilitiesCount] = useState(0);
  const [featuesCount, setFeaturesCount] = useState(0);
  const [roomImagesCount, setRoomImagesCount] = useState(0);
  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const [userCount, setuserCount] = useState(0);
  const [ratingReviewCount, setRatingReviewCount] = useState(0);
  const [userQueryCount, setuserQueryCount] = useState(0);
  const [bookingOrderCount, setBookingOrderCount] = useState(0);
  const [carousalCount, setCarousalCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const hotelsRes = await axios.get("http://localhost:3000/api/hotels");
      const roomsRes = await axios.get("http://localhost:3000/api/rooms");
      const facilitiesRes = await axios.get(
        "http://localhost:3000/api/facilities"
      );
      const featureRes = await axios.get("http://localhost:3000/api/features");
      const roomImagesRes = await axios.get(
        "http://localhost:3000/api/roomImages"
      );
      const teamMemberRes = await axios.get(
        "http://localhost:3000/api/teamMemberDetails"
      );
      const userRes = await axios.get("http://localhost:3000/api/userCred");
      const ratingReviewRes = await axios.get(
        "http://localhost:3000/api/ratingReviews"
      );
      const userQueryRes = await axios.get(
        "http://localhost:3000/api/userQueries"
      );
      const bookingOrderRes = await axios.get(
        "http://localhost:3000/api/bookingOrders"
      );
      const carousalRes = await axios.get("http://localhost:3000/api/carousal");

      setHotelsCount(hotelsRes?.data?.list?.length);
      setRoomsCount(roomsRes?.data?.list?.length);
      setFacilitiesCount(facilitiesRes?.data?.list?.length);
      setFeaturesCount(featureRes?.data?.list?.length);
      setRoomImagesCount(roomImagesRes?.data?.list?.length);
      setTeamMemberCount(teamMemberRes?.data?.list?.length);
      setuserCount(userRes?.data?.list?.length);
      setRatingReviewCount(ratingReviewRes?.data?.reviews?.length);
      setuserQueryCount(userQueryRes?.data?.list?.length);
      setBookingOrderCount(bookingOrderRes?.data?.list?.length);
      setCarousalCount(carousalRes?.data?.list?.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h3 className="mb-4">Admin Dashboard</h3>
        <div className="row">
          {/* booking orders Card */}
          <div className="col-md-4 mb-4">
            <Link
              className="dashboard-link"
              href="/admin/bookingOrders"
              passHref
            >
              <div
                className="card text-white bg-primary shadow"
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Booking orders</h5>
                  <p className="card-text display-4">{bookingOrderCount}</p>
                </div>
              </div>
            </Link>
          </div>
          {/* hotel Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/hotel" passHref>
              <div
                className="card text-white bg-primary shadow"
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Hotels</h5>
                  <p className="card-text display-4">{hotelsCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Carausal Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/carausal" passHref>
              <div
                className="card text-white bg-primary shadow"
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Carausals</h5>
                  <p className="card-text display-4">{carousalCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Rooms Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/room" passHref>
              <div className="card text-white bg-success shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Rooms</h5>
                  <p className="card-text display-4">{roomsCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Facilities Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/facility" passHref>
              <div className="card text-white bg-warning shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Facilities</h5>
                  <p className="card-text display-4">{facilitiesCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Features Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/feature" passHref>
              <div className="card text-white bg-secondary shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Features</h5>
                  <p className="card-text display-4">{featuesCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Rooms Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/roomImages" passHref>
              <div className="card text-white bg-danger shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Room Images</h5>
                  <p className="card-text display-4">{roomImagesCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Rooms Card */}
          <div className="col-md-4 mb-4">
            <Link
              className="dashboard-link"
              href="/admin/teamMemberDetails"
              passHref
            >
              <div className="card text-white bg-success shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Team Member Details</h5>
                  <p className="card-text display-4">{teamMemberCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Rooms Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/userCred" passHref>
              <div className="card text-white bg-info shadow">
                <div className="card-body">
                  <h5 className="card-title">Total users</h5>
                  <p className="card-text display-4">{userCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Rooms Card */}
          <div className="col-md-4 mb-4">
            <Link
              className="dashboard-link"
              href="/admin/ratingReview"
              passHref
            >
              <div className="card text-white bg-dark shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Rating Review</h5>
                  <p className="card-text display-4">{ratingReviewCount}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Rooms Card */}
          <div className="col-md-4 mb-4">
            <Link className="dashboard-link" href="/admin/userQueries" passHref>
              <div className="card text-white bg-secondary shadow">
                <div className="card-body">
                  <h5 className="card-title">user queries</h5>
                  <p className="card-text display-4">{userQueryCount}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
