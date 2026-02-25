"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FrontLayout from "../FrontLayout";
import { toast } from "react-hot-toast";

export default function Room() {
  const searchParams = useSearchParams();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayFormatted = today.toISOString().split("T")[0];
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
  const hotel_id = searchParams.get("hotelId");
  const hotel_name = searchParams.get("hotel_name");
  const checkIn = searchParams.get("check-in")
    ? searchParams.get("check-in")
    : todayFormatted;
  const checkOut = searchParams.get("check-out")
    ? searchParams.get("check-out")
    : tomorrowFormatted;
  const adultdata = searchParams.get("adult");
  const childrendata = searchParams.get("children");
  const isFlag = searchParams.get("isFlag");
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [checkedIn, setCheckedIn] = useState(checkIn);
  const [checkedOut, setCheckedOut] = useState(checkOut);
  const [adult, setAdults] = useState(adultdata ? adultdata : 1);
  const [childrens, setChildren] = useState(childrendata ? childrendata : 1);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [bookingOrders, setBookingOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const getPaginatedData = (data) => {
    const filtered = data.filter((room) => room?.hotel?._id === hotel_id);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const displayData =
    isFiltered && filteredResults?.length > 1
      ? getPaginatedData(filteredResults)
      : !isFiltered
        ? getPaginatedData(roomFacilities)
        : [];

        console.log("dis_dat",displayData);

  const totalData =
    isFiltered && filteredResults?.length > 1
      ? filteredResults.filter((room) => room?.hotel?._id === hotel_id)
      : !isFiltered
        ? roomFacilities.filter((room) => room?.hotel?._id === hotel_id)
        : [];

  const totalPages = Math.ceil(totalData.length / itemsPerPage);
  const user_data = JSON.parse(localStorage.getItem("user-details"));

  const loadRooms = async () => {
    const res = await axios.get(`http://localhost:3000/api/rooms/${hotel_id}`);
    setRooms(res.data.list);
  };

  const loadBookingOrders = async () => {
    const res = await axios.get(`http://localhost:3000/api/bookingOrders`);
    setBookingOrders(res.data.list);
  };
  
  useEffect(() => {
    loadRooms();
    loadFacilities();
    loadFeatures();
    loadRoomFacilities();
    loadBookingOrders();
    loadRoomTypes();
  }, []);

  useEffect(() => {
    if (
      (checkedIn && checkedOut) ||
      (adult && childrens) ||
      selectedFacilities ||
      hotel_id
    ) {
      loadFilteredRoom();
    }
  }, [checkedIn, checkedOut, adult, childrens, selectedFacilities]);

  const normalizeDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const loadFilteredRoom = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/roomFacilities");
      const rooms = res.data.groupedFacilities;

      const featureRes = await axios.get(
        "http://localhost:3000/api/roomFeatures",
      );
      const features = featureRes.data.list;

      // Merge room features into each room
      const mergedRooms = rooms.map((room) => {
        const matchingFeatures = features.filter(
          (feature) =>
            String(feature.room_id?._id || feature.room_id) ===
            String(room._id),
        );
        return {
          ...room,
          room_features: matchingFeatures,
        };
        // }
      });

      // Only run filter if any filter is applied
      if (
        selectedFacilities.length > 0 ||
        (checkedIn && checkedOut) ||
        adult ||
        childrens ||
        hotel_id
      ) {
        const booking_Order_data = await axios.get(
          `http://localhost:3000/api/bookingOrders`,
        );
        const filtered = mergedRooms.filter((room) => {
          // Get only bookings for this room AND this hotel
          const booking_data = booking_Order_data.data.list.filter(
            (booking_order) =>
              String(booking_order.room_id?._id || booking_order.room_id) ===
                String(room.room._id) &&
              String(booking_order.hotel_id?._id || booking_order.hotel_id) ===
                String(hotel_id),
          );

          const checkInDate = checkedIn
            ? new Date(normalizeDate(checkedIn))
            : null;
          const checkOutDate = checkedOut
            ? new Date(normalizeDate(checkedOut))
            : null;

          // Check if the room is available for selected dates
          const isAvailable =
            !checkInDate || !checkOutDate
              ? true
              : booking_data.every((booking) => {
                  const bookedFrom = new Date(normalizeDate(booking.check_in));
                  const bookedTo = new Date(normalizeDate(booking.check_out));

                  // No overlap condition:
                  // return checkOutDate <= bookedFrom || checkInDate >= bookedTo;
                  return (
                    (checkOutDate <= bookedFrom || checkInDate >= bookedTo) &&
                    room.room.quantity > 0
                  );
                });

          // Additional filters
          const facilitiesMatch =
            selectedFacilities.length === 0 ||
            selectedFacilities.every((facility) =>
              room.facilities.some((f) => f.name === facility),
            );

          const adultMatch =
            !adult || parseInt(room.room.adult) >= parseInt(adult);

          const childrenMatch =
            !childrens || parseInt(room.room.children) >= parseInt(childrens);

          // Final filter return
          return (
            booking_data &&
            facilitiesMatch &&
            isAvailable &&
            adultMatch &&
            childrenMatch
          );
        });
        setFilteredResults(filtered);
        setIsFiltered(true);
      } else {
        // No filters applied
        setFilteredResults([]);
        setIsFiltered(false);
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const loadRoomTypes = async () => {
    const res = await axios.get("http://localhost:3000/api/roomTypes");
    setRoomTypes(res.data.list);
  };

  const loadFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/facilities");
    setFacilities(res.data.list);
  };

  const loadFeatures = async () => {
    const res = await axios.get(" http://localhost:3000/api/features");
    setFeatures(res.data.list);
  };


  const loadRoomFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/roomFacilities");
    const detail = res.data.groupedFacilities;

    const feature_list = await axios.get(
      "http://localhost:3000/api/roomFeatures",
    );
    const feature_detail = feature_list.data.list;
    const merged = detail.map((facilityItem) => {
      const matchingFeatures = feature_detail.filter(
        (feature) =>
          String(feature.room_id?._id || feature.room_id) ===
          String(facilityItem._id),
      );
      return {
        ...facilityItem,
        room_features: matchingFeatures, // Attach matched features
      };
      // }
    });
    setRoomFacilities(merged);
  };
  const goRoomDetails = (roomId) => {
    return router.push(`room-details?roomId=${roomId}`);
  };
  const handleBook = (room_data, hotel_data) => {
    if (user_data == null) {
      toast.success("user booking after login");
    } else {
      const room_detail = {
        room_id: room_data._id,
        hotel_id: hotel_data?.hotel?._id,
        hotel_name: hotel_data?.hotel?.name,
        price: room_data.price * 100,
        image: room_data?.image,
        name: room_data?.name,
        quantity: room_data?.quantity,
        checkin: checkedIn,
        checkout: checkedOut,
      };
      localStorage.setItem("room_detail", JSON.stringify(room_detail));
      return router.push("confirm-booking");
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFacilities([...selectedFacilities, value]);
    } else {
      setSelectedFacilities(
        selectedFacilities.filter((item) => item !== value),
      );
    }
  };

  return (
    <FrontLayout>
      <>
        <div className="my-5 px-4">
          <h2 className="fw-bold h-font text-center">
            {hotel_name} Room Details
          </h2>
          <div className="h-line bg-dark"></div>
        </div>

        <div className="container-fluid">
          <div className="row" style={{ display: "flex" }}>
            {/* <div className="col-lg-3 col-md-12 mb-lg-0 mb-4 ps-4"> */}
            <div className="col-lg-3 col-md-12 mb-lg-0 mb-4  px-4 ps-4">
              {/* px-4 mb-4 */}
              <nav className="navbar navbar-expand-lg navbar-light bg-white rounded shadow">
                <div
                  className="container-fluid flex-lg-column align-items-stretch"
                  style={{ display: "block" }}
                >
                  <button
                    className="navbar-toggler shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filterDropdown"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => setToggle(!toggle)}
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  {/* <div className="collapse navbar-collapse flex-column align-items-stretch mt-2" id="filterDropdown"> */}
                  {/* <!-- Check availablity --> */}
                  {toggle && (
                    <>
                      <div className="border bg-light p-3 rounded mb-3">
                        <h5
                          className="d-flex align-items-center justify-content-between mb-3"
                          style={{ fontSize: "18px" }}
                        >
                          <span>CHECK AVAILABILITY</span>
                          {/* onClick="chk_avail_clear()" */}
                          <button
                            id="chk_avail_btn"
                            className="btn shadow-none btn-sm text-secondary d-none"
                          >
                            Reset
                          </button>
                        </h5>
                        <label
                          className="form-label"
                          style={{ display: "flex" }}
                        >
                          Check-in
                        </label>
                        <input
                          type="date"
                          className="form-control shadow-none mb-3"
                          id="checkin"
                          value={checkedIn}
                          onChange={(e) => setCheckedIn(e.target.value)}
                        />
                        <label
                          className="form-label"
                          style={{ display: "flex" }}
                        >
                          Check-out
                        </label>
                        <input
                          type="date"
                          className="form-control shadow-none"
                          id="checkout"
                          value={checkedOut}
                          onChange={(e) => setCheckedOut(e.target.value)}
                        />
                      </div>

                      <div className="mb-3" style={{ padding: "9px" }}>
                        <h5 style={{ fontSize: "18px" }}>FACILITIES</h5>

                        <div className="d-flex flex-wrap">
                          {facilities.map((facility, index) => (
                            <div className="form-check me-3 mb-2" key={index}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`facility-${index}`}
                                value={facility.name}
                                onChange={handleCheckboxChange}
                                checked={selectedFacilities.includes(
                                  facility.name,
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`facility-${index}`}
                              >
                                {facility.name}
                              </label>
                              <br />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <!-- Guests --> */}
                      <div className="border bg-light p-3 rounded mb-3">
                        <h5
                          className="d-flex align-items-center justify-content-between mb-3"
                          style={{ fontSize: "18px" }}
                        >
                          <span>GUESTS</span>
                          {/* onClick="guests_clear()" */}
                          <button
                            id="guests_btn"
                            className="btn shadow-none btn-sm text-secondary d-none"
                          >
                            Reset
                          </button>
                        </h5>
                        <div className="d-flex">
                          <div className="me-3">
                            <label className="form-label">Adults</label>
                            <input
                              type="number"
                              min="1"
                              id="adults"
                              className="form-control shadow-none"
                              value={adult}
                              onChange={(e) => setAdults(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label">Children</label>
                            <input
                              type="number"
                              min="1"
                              id="children"
                              className="form-control shadow-none"
                              value={childrens}
                              onChange={(e) => setChildren(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      {/* </div> */}
                    </>
                  )}
                </div>
              </nav>
            </div>

            <div
              className="col-lg-9 col-md-12 px-4"
              id="rooms-data"
              style={{ marginBottom: "-45px" }}
            >
              <div className="mb-4 border-0 shadow" style={{ padding: "20px" }}>
                {displayData?.length > 0 ? (
                  displayData.map((roomItem) => {
                    const room = roomItem?.room;

                    return (
                      <div className="row mb-4" key={room?._id}>
                        {/* Room Image */}
                        <div className="col-md-5 mb-4">
                          <img
                            src={room?.image}
                            alt={room?.name || "Room Image"}
                            className="img-fluid rounded"
                            style={{
                              width: "400px",
                              height: "270px",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* Room Details */}
                        <div className="col-md-3">
                          <h5 className="mb-3 fw-bold text-primary">
                            {room?.name}
                          </h5>

                          {/* Features */}
                          {/* <div className="mb-3"> */}
                          <h6 className="text-muted mb-2">Features </h6>
                          {roomItem?.room_features?.length > 0 ? (
                            roomItem.room_features.map((feature) => (
                              <span
                                key={feature?._id}
                                className="badge bg-light text-dark rounded-pill me-2 mb-2"
                                style={{ marginLeft: "-6px" }}
                              >
                                {feature?.feature_id?.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">
                              No features listed
                            </span>
                          )}
                          {/* </div> */}

                          {/* Facilities */}
                          {/* <div className="mb-3"> */}
                          <h6 className="text-muted mb-2">Facilities </h6>
                          {roomItem?.facilities?.length > 0 ? (
                            roomItem.facilities.map((facility) => (
                              <span
                                key={facility?._id}
                                className="badge bg-light text-dark rounded-pill me-2 mb-2"
                                style={{ marginLeft: "-6px" }}
                              >
                                {facility?.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">
                              No facilities available
                            </span>
                          )}
                          {/* </div> */}

                          {/* Quantity */}
                          <div className="mb-2">
                            <p className="mb-1">
                          Room Type: {roomItem?.room_type?.name}
                            </p>
                          </div>

                          {/* Guests */}
                          <div>
                            <h6 className="text-muted mb-2">Guests</h6>
                            <span className="badge bg-info text-white rounded-pill me-2">
                              {room?.adult} Adults
                            </span>
                            <span className="badge bg-info text-white rounded-pill">
                              {room?.children} Children
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Actions */}
                        <div className="col-md-4 d-flex flex-column justify-content-center">
                          <h6 className="mb-4">₹{room?.price}/day</h6>

                          <button
                            className="book_room_btn mb-2"
                            onClick={() => handleBook(room, roomItem)}
                          >
                            Book Now
                          </button>

                          <button
                            onClick={() => goRoomDetails(room?._id)}
                            className="btn btn-sm w-100 btn-outline-dark shadow-none"
                          >
                            More Details
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-record-found text-center w-100">
                    No record found
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="pagination d-flex justify-content-end mt-4 pt-4">
                    <button
                      className="btn btn-outline-primary me-2 navigate-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      &laquo; {/* or use << if you prefer plain text */}
                    </button>

                    <span className="align-self-center px-3 text-black">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      className="btn btn-outline-primary ms-2 navigate-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      &raquo; {/* or >> */}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* </main> */}
      </>
    </FrontLayout>
  );
}
