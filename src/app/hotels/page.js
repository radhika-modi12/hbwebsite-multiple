"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import FrontLayout from "../FrontLayout";
import RatingStars from "../../app/components/RatingStars";

export default function Hotels({ searchParams }) {
  // const searchParams = useSearchParams();
  const checkIn = searchParams.get("check-in");
  const checkOut = searchParams.get("check-out");
  const room_count = searchParams.get("room");
  const price = searchParams.get("price");
  const location = searchParams.get("location");
  const adultdata = searchParams.get("adult");
  const childrendata = searchParams.get("children");
  const hotelTypedata = searchParams.get("hotel_type")? searchParams.get("hotel_type"):"";
  const purposeOfDay = searchParams.get("purpose_of_day")?searchParams.get("purpose_of_day"):"";
  const isFlag = searchParams.get("isFlag");
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [checkedIn, setCheckedIn] = useState(checkIn);
  const [checkedOut, setCheckedOut] = useState(checkOut);
  const [adult, setAdults] = useState(adultdata);
  const [childrens, setChildren] = useState(childrendata);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [purpose_Of_day, setPurposeOfDay] = useState(purposeOfDay);
  const [bookingOrders, setBookingOrders] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [hotel_type, setHotelType] = useState(hotelTypedata);
  const [locationData, setLocation] = useState(location?.toLowerCase());
  const [room_countData, setRoomCount] = useState(
    room_count ? room_count : null
  );
  const [priceData, setPrice] = useState(price ? price : 0);
  const [checkDates, setCheckDates] = useState({});
  const [cities, setCities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(""); // "low_to_high" | "high_to_low"
  const [paginatedHotels, setPaginatedHotels] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  

  let itemsPerPage = 0;
 
  
  useEffect(() => {
    let sourceHotels =
      filteredResults.length > 0 && isFiltered
        ? filteredResults
        : !isFiltered
        ? hotels
        : [];

    let hotelsWithRooms = sourceHotels.filter((h) => h.rooms.length > 0);

    // Apply sort before pagination
    if (sortOrder === "low_to_high") {
      hotelsWithRooms.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "high_to_low") {
      hotelsWithRooms.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
     itemsPerPage = 2;
    const total = Math.ceil(hotelsWithRooms.length / itemsPerPage);
      setTotalPages(total);

    

    const paginated = hotelsWithRooms.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );  
    setPaginatedHotels(paginated);
  }, [hotels, filteredResults, currentPage, sortOrder]);  

  const loadHotels = async () => {
    const res = await axios.get("http://localhost:3000/api/hotels");
    const hotels = res.data.list;
    // Fetch rooms for each hotel in parallel
    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const roomRes = await axios.get(
          `http://localhost:3000/api/rooms/${hotel._id}`
        );
        return {
          ...hotel,
          rooms: roomRes.data.list, // Adjust based on your backend response
        };
      })
    );
    setHotels(hotelsWithRooms);
  };
  const loadBookingOrders = async () => {
    const res = await axios.get(`http://localhost:3000/api/bookingOrders`);
    setBookingOrders(res.data.list);
  };
  const loadCities = async () => {
    const res = await fetch("/cities.json");
    if (!res.ok) throw new Error("Failed to load cities");
    const data = await res.json();
    setCities(data);
  };

  useEffect(() => {
    loadHotels();
    loadFacilities();
    loadFeatures();
    loadRoomFacilities();
    loadBookingOrders();
    loadCities();
  }, []);

  useEffect(() => {
    if (location || locationData || priceData || hotel_type || purpose_Of_day) {
      loadFilteredRoom();
    }
  }, [location, locationData, priceData, hotel_type, purpose_Of_day]);

  const loadFilteredRoom = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/hotels");
      const hotels = res.data.list;
      // Fetch rooms for each hotel in parallel
      const hotelsWithRooms = await Promise.all(
        hotels.map(async (hotel) => {
          const roomRes = await axios.get(
            `http://localhost:3000/api/rooms/${hotel._id}`
          );
          return {
            ...hotel,
            rooms: roomRes.data.list, // Adjust based on your backend response
          };
        })
      );
    
      // Only run filter if any filter is applied
      if (location || locationData || priceData || hotel_type || purpose_Of_day) {
        const filtered = hotelsWithRooms.filter((hotel) => {
          let matches = true;
          if (locationData) {
            matches = matches && hotel.location == locationData;
          }else if(location){
            matches = matches && hotel.location == location;
          }
          if (priceData) {
            matches = matches && hotel.price === priceData;
          }
          if (hotel_type) {
            matches = matches && hotel.hotel_type === hotel_type;
          }
          if (purpose_Of_day) {
            matches = matches && hotel.purpose_of_day === purpose_Of_day;
          }
          return matches;
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
      "http://localhost:3000/api/roomFeatures"
    );
    const feature_detail = feature_list.data.list;
    const merged = detail.map((facilityItem) => {
      const matchingFeatures = feature_detail.filter(
        (feature) =>
          String(feature.room_id?._id || feature.room_id) ===
          String(facilityItem._id)
      );
      return {
        ...facilityItem,
        room_features: matchingFeatures, // Attach matched features
      };
    });
    setRoomFacilities(merged);
  };

  const handleBook = (hotel, checkin, checkout) => {
    return router.push(
      `rooms?hotelId=${hotel._id}&hotel_name=${hotel.name}&check-in=${checkin}&check-out=${checkout}`
    );
  };

  const handleDateChange = (index, type, value) => {
    setCheckDates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value,
      },
    }));
  };
   const today = new Date().toISOString().split("T")[0];

  return (
    <FrontLayout>
      <>
        <div className="my-5 px-4">
          <h2 className="fw-bold h-font text-center">Our Hotels</h2>
          <div className="h-line bg-dark"></div>
        </div>

        <div className="container-fluid">
          <div className="row" style={{ display: "flex" }}>
            <div className="col-lg-3 col-md-12 mb-lg-0 mb-4 ps-4">
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

                  {toggle && (
                    <>
                      <div className="border bg-light p-3 rounded mb-3">
                        <h5
                          className="d-flex align-items-center justify-content-between mb-3"
                          style={{ fontSize: "18px" }}
                        >
                          <button
                            id="chk_avail_btn"
                            className="btn shadow-none btn-sm text-secondary d-none"
                          >
                            Reset
                          </button>
                        </h5>

                        <label className="form-label fw-bold">Location</label>
                        <select
                          className="form-select shadow-none mb-20"
                          name="location"
                          value={locationData}
                          onChange={(e) => setLocation(e.target.value)}
                        >
                          <option>select location</option>
                          {cities.length > 0 &&
                            cities.map((city, idx) => (
                              <option
                                key={idx}
                                value={city.name.toLowerCase()}
                                style={{ width: "20%" }}
                              >
                                {city.name.length > 20
                                  ? city.name &&
                                    city.name.substr(0, 15) + " ..."
                                  : city.name.toLowerCase()}
                              </option>
                            ))}
                        </select>
                        <label className="form-label fw-bold">Price</label>
                        <select
                          className="form-select shadow-none mb-20"
                          name="price"
                          value={priceData}
                          onChange={(e) => setPrice(e.target.value)}
                        >
                          <option>select Hotel Price</option>
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                          <option value="2000">2000</option>
                          <option value="3000">3000</option>
                          <option value="4000">4000</option>
                          <option value="5000">5000</option>
                        </select>

                        <label className="form-label fw-bold">Hotel Type</label>
                        <select
                          className="form-select shadow-none mb-20"
                          name="hotel_type"
                          value={hotel_type}
                          onChange={(e) => setHotelType(e?.target?.value)}
                        >
                          <option>select Hotel Type</option>
                          <option value="airport">airport</option>
                          <option value="business">business</option>
                        </select>

                        <label className="form-label fw-bold">
                          Purpose of day
                        </label>
                        <select
                          className="form-select shadow-none"
                          name="purpose_Of_day"
                          value={purpose_Of_day}
                          onChange={(e) => setPurposeOfDay(e.target.value)}
                        >
                          <option>select Purpose of day</option>
                          <option value="holiday">holiday</option>
                          <option value="religious">religious</option>
                          <option value="work">work</option>
                          <option value="other">other</option>
                        </select><br/>
                        <hr/>

                        <p><strong>Sort By:</strong></p>
                        <select
                          className="form-select mb-3"
                          onChange={(e) => setSortOrder(e.target.value)}
                          value={sortOrder}
                        >
                          <option value="">Sort by</option>
                          <option value="low_to_high">
                            Price: Low to High
                          </option>
                          <option value="high_to_low">
                            Price: High to Low
                          </option>
                        </select>
                      </div>
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
              <div className="mb-4 border-0 shadow" style={{padding:"20px"}}>

                {paginatedHotels.length > 0 ? (
                  paginatedHotels.map((hotel, index) => (
                    <div
                      className="row mb-5"
                      key={index}
                    >
                      
                      <div className="col-md-5">
                        <img src={hotel?.image} className="img-fluid rounded" style={{width:"400px",height:"270px"}} />
                      </div>
                      <div className="col-md-3 mt-2">
                          <div className="mb-2">
                          <p className="mb-0 text-success fw-semibold">
                            ₹{hotel?.price ? hotel?.price : 0}/day
                          </p>
                        </div>
                        <h5 className="fw-bold">
                          {hotel?.name}
                        </h5>

                        <div className="mb-2">
                          {/* <h6 className="text-muted mb-1">Location</h6> */}
                          <p className="mb-2">{hotel?.location}</p>
                        </div>

                      

                        <div className="mb-2">
                          <p className="mb-2">Type: {hotel?.hotel_type}</p>
                        </div>
                         <div className="mb-2">
                          <p className="mb-2">Total Room: {hotel?.room}</p>
                        </div>

                        <div className="mb-2">
                          {/* <h6 className="text-muted mb-1">purpose of day</h6> */}
                          <p className="mb-2">Purpose:{hotel?.purpose_of_day}</p>
                        </div>
                         <div className="mb-2">
                          <h6 className="text-muted mb-1">Rating</h6>
                          <p className="mb-2"> <RatingStars rating={hotel?.rating} /></p>
                        </div>
                      </div>
                      <div className="price-actions d-flex flex-column justify-content-between align-items-start col-md-4">
                        {/* <h6 className="mb-4">₹{hotel.price} per night</h6> */}
                        <label
                          className="form-label"
                          style={{ display: "flex" }}
                        >
                          Check-in
                        </label>
                        <input
                          type="date"
                          className="form-control shadow-none mb-3"
                          value={checkDates[index]?.checkin || ""}
                           min={today}
                          onChange={(e) =>
                            handleDateChange(index, "checkin", e.target.value)
                          }
                        />

                        <label
                          className="form-label"
                          style={{ display: "flex" }}
                        >
                          Check-out
                        </label>
                        <input
                          type="date"
                          className="form-control shadow-none mb-20"
                           min={checkIn || today}
                          value={checkDates[index]?.checkout || ""}
                          disabled={checkIn}
                          onChange={(e) =>
                            handleDateChange(index, "checkout", e.target.value)
                          }
                        />
                        <button
                          className="book_room_btn mb-2"
                          onClick={() =>
                            handleBook(
                              hotel,
                              checkDates[index]?.checkin,
                              checkDates[index]?.checkout
                            )
                          }
                        >
                          Check Room Availability
                        </button>
                        {/* <button
                            onClick={() => goRoomDetails(facility._id)}
                            className="btn btn-sm w-100 btn-outline-dark shadow-none"
                          >
                            More details
                          </button> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">No hotels available.</p>
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
