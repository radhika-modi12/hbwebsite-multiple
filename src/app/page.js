"use client";
import { useEffect, useState } from "react";
import "../../public/css/common.css";
import SliderContent from "../app/components/SliderContent";
import Dots from "../app/components/Dots";
import Arrows from "../app/components/Arrows";
import sliderImage from "../app/components/sliderImage";
import RatingStars from "../app/components/RatingStars";
import "../app/components/slider.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import FrontLayout from "../../src/app/FrontLayout";
import "swiper/css"; // Required Swiper styles

// Optional modules
import "swiper/css/navigation";
import "swiper/css/pagination";

import Contacts from "./contacts/page";
// import Header from "./layout/header/page";

export default function Home() {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [checkIn, setCheckIn] = useState(0);
  const [children, setChildren] = useState(1);
  const [ratingReviews, setRatingReviews] = useState({});
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [location, setLocation] = useState("");
  const [locationDetails, setLocationDetails] = useState([]);
  const [price, setPrice] = useState("");
  const [room_count, setRoomCount] = useState("");
  const [hotelImages, setHotelImages] = useState([]);
  const [HotelCarousal, setHotelCarousals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [hotel_type, setHotelType] = useState("");
  const [purpose_of_day, setPurposeOfDay] = useState("");

  // const location = "VJTI, Matunga, Mumbai, Maharashtra"; // You can change this to any location
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    "VJTI, Matunga, Mumbai, Maharashtra",
  )}&output=embed`;

  const len = sliderImage.length - 1;
  const goHotels = () => {
    return router.push("hotels");
  };
  const goFacilities = () => {
    return router.push("facilities");
  };
  useEffect(() => {
    loadRooms();
    loadFacilities();
    loadFeatures();
    loadRatingReviews();
    loadRoomFacilities();
    loadHotels();
    loadCarousals();
    loadContacts();
    loadCities();
    loadLocations();
  }, []);

  const loadContacts = async () => {
    const res = await axios.get(" http://localhost:3000/api/contacts");
    setContacts(res.data.list);
  };

  const loadCities = async () => {
    const res = await fetch("/cities.json");
    if (!res.ok) throw new Error("Failed to load cities");
    const data = await res.json();
    setCities(data);
  };

  const loadHotels = async () => {
    const res = await axios.get("http://localhost:3000/api/hotels");
    const hotel_list = res.data.list;

    const rating_review_data = await axios.get(
      "http://localhost:3000/api/ratingReviews",
    );

    const hotelsWithReviews = await Promise.all(
      hotel_list.map(async (hotel) => {
        const hotelReviews = rating_review_data.data.reviews.filter(
          (review) => review.hotel_id === hotel._id, // or use .toString() if needed
        );
        const roomRes = await axios.get(
          `http://localhost:3000/api/rooms/${hotel._id}`,
        );

        return {
          ...hotel,
          hotel_reviews: hotelReviews,
          rooms: roomRes?.data?.list,
        };
      }),
    );
    const hotelsWithRooms = await hotelsWithReviews.filter(
      (h) => h.rooms.length > 0,
    );
    setHotels(hotelsWithRooms);
  };

  const loadLocations = async () => {
    const res = await axios.get("http://localhost:3000/api/locations");
    setLocationDetails(res.data.list);
  };
  const loadCarousals = async () => {
    const res = await axios.get("http://localhost:3000/api/carousal");
    let carousal_arr = [];
    {
      res.data.list.map((element) => {
        carousal_arr.push({ title: "", description: "", urls: element.image });
      });
    }
    setHotelCarousals(carousal_arr);
  };

  const loadRooms = async () => {
    const res = await axios.get("http://localhost:3000/api/rooms");
    setRooms(res.data.list);
  };

  const loadRoomFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/roomFacilities");
    const rooms = res.data.groupedFacilities;
    const feature_list = await axios.get(
      "http://localhost:3000/api/roomFeatures",
    );
    const feature_detail = feature_list.data.list;
    const merged = rooms.map((facilityItem) => {
      const matchingFeatures = feature_detail.filter(
        (feature) =>
          String(feature.room_id?._id || feature.room_id) ===
          String(facilityItem._id),
      );
      return {
        ...facilityItem,
        room_features: matchingFeatures, // Attach matched features
      };
    });
    setRoomFacilities(merged);
  };

  const loadFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/facilities");
    setFacilities(res.data.list);
  };

  const loadFeatures = async () => {
    const res = await axios.get("http://localhost:3000/api/features");
    setFeatures(res.list);
  };

  const loadRatingReviews = async () => {
    const res = await axios.get("http://localhost:3000/api/ratingReviews");
    setRatingReviews(res.data.reviews);
    const rating_arr = [];
    res.data.reviews.map((element) => {
      rating_arr.push({
        name: element?.user?.name,
        profile: element?.user?.profile,
        review: element?.review,
        rating: element?.rating,
      });
    });
    setTestimonials(rating_arr);
  };

  const handleHotelDetails = (hotel) => {
    return router.push(
      `/rooms?hotelId=${hotel._id}&hotel_name=${hotel.name}&hotel_type=${hotel.hotel_type}&purpose_of_day=${hotel.purpose_of_day}`,
    );
  };

  const handleLocation = (location) =>{
    return router.push(
      `/hotels?location=${location}`,
    );

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    return router.push(
      `hotels?location=${location}&price=${price}&hotel_type=${hotel_type}&purpose_of_day=${purpose_of_day}`,
    );
  };

  return (
    <FrontLayout>
      <>
        <div className="container-fluid px-lg-4 mt-4">
          <div className="swiper swiper-container">
            <div className="swiper-wrapper">
              <div className="slider-container">
                <SliderContent
                  activeIndex={activeIndex}
                  sliderImage={HotelCarousal}
                />
                <Arrows
                  prevSlide={() =>
                    setActiveIndex(activeIndex < 1 ? len : activeIndex - 1)
                  }
                  nextSlide={() =>
                    setActiveIndex(activeIndex === len ? 0 : activeIndex + 1)
                  }
                />
                <Dots
                  activeIndex={activeIndex}
                  sliderImage={sliderImage}
                  onclick={(index) => setActiveIndex(index)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Availability Form Section */}
        <div
          className="container availability-form"
          style={{ position: "relative", marginTop: "-40px" }}
        >
          <div className="row">
            <div
              className="col-lg-12 bg-white shadow p-4 rounded"
              style={{ marginTop: "100px" }}
            >
              <h5 className="mb-4">Check Hotels</h5>
              <form onSubmit={handleSubmit}>
                <div className="row align-items-end">
                  <div className="col-lg-3 mb-3 ">
                    <label className="form-label fw-bold">Location</label>
                    <select
                      className="form-select shadow-none"
                      name="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option>select hotel location</option>
                      {cities.map((city, idx) => (
                        <option
                          key={idx}
                          value={city.name}
                          style={{ width: "20%" }}
                        >
                          {city.name.length > 20
                            ? city.name && city.name.substr(0, 15) + " ..."
                            : city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-3 mb-3">
                    <label className="form-label fw-bold">Price</label>
                    <select
                      className="form-select shadow-none"
                      name="price"
                      value={price}
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
                  </div>

                  <div className="col-lg-3 mb-3">
                    <label className="form-label fw-bold">Hotel Type</label>
                    <select
                      className="form-select shadow-none"
                      name="hotel_type"
                      value={hotel_type}
                      onChange={(e) => setHotelType(e.target.value)}
                    >
                      <option>select Hotel Type</option>
                      <option value="airport">airport</option>
                      <option value="business">business</option>
                    </select>
                  </div>

                  <div className="col-lg-3 mb-3">
                    <label className="form-label fw-bold">Purpose of day</label>
                    <select
                      className="form-select shadow-none"
                      name="purpose_of_day"
                      value={purpose_of_day}
                      onChange={(e) => setPurposeOfDay(e.target.value)}
                    >
                      <option>select Purpose of day</option>
                      <option value="holiday">holiday</option>
                      <option value="Religious">Religious</option>
                      <option value="work">work</option>
                      <option value="other">other</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <div className="col-lg-1 mb-lg-3 mt-2">
                    <button
                      type="submit"
                      className="btn text-white shadow-none custom-bg"
                      style={{ background: "#4646be" }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <!-- Our Rooms --> */}

        <h2 className="mt-5 pt-4 mb-4 text-center fw-bold h-font">
          OUR HOTELS
        </h2>

        <div className="container">
          <div className="row">
            {hotels &&
              hotels.slice(0, 3).map((hotel, i) => {
                return (
                  <div className="col-lg-4 col-md-6 my-3" key={i}>
                    <div
                      className="card border-0 shadow h-100 thumb-img"
                      style={{ margin: "auto" }}
                    >
                      <img
                        src={hotel.image || "/no-image.jpg"}
                        className="card-img-top"
                        alt={hotel.name}
                        style={{
                          height: "320px",
                          width: "410px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        className="card-body d-flex flex-column"
                        style={{ padding: "50px" }}
                      >
                        <p className="mb-2" style={{ fontSize: "25px" }}>
                          ₹{hotel.price ?? 0} <small>/ day</small>
                        </p>
                        <h5 style={{ fontSize: "24px", lineHeight: "25px" }}>
                          {hotel.name}
                        </h5>
                        <p className="mb-1">{hotel.location || "-"}</p>
                        <p style={{ fontSize: "16px", color: "#595959" }}>
                          This hotel offers a perfect blend of comfort,
                          convenience, and modern amenities, ensuring a pleasant
                          stay for both business and leisure travelers.
                        </p>
                        <div className="d-flex justify-content-evenly mb-2">
                          <button
                            className="btn btn-sm btn-outline-dark shadow-none"
                            onClick={() => handleHotelDetails(hotel)}
                          >
                            More details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="col-lg-12 text-center mt-5">
              <button
                onClick={goHotels}
                className="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none"
                style={{ width: "35%" }}
              >
                More Hotels &gt;&gt;&gt;
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Our Facilities --> */}

        <h2 className="mt-5 pt-4 mb-4 text-center fw-bold h-font">
          OUR FACILITIES
        </h2>

        <div className="container">
          <div className="row justify-content-evenly px-lg-0 px-md-0 px-5">
            {facilities &&
              facilities.slice(0, 5).map((facility, i) => {
                return (
                  <div
                    className="col-lg-2 col-md-2 text-center bg-white rounded shadow py-4 my-3"
                    key={i}
                  >
                    <img
                      src={facility.icon}
                      width="130px"
                      style={{ paddingLeft: "4rem" }}
                    />
                    <h5 className="mt-3">{facility.name}</h5>
                  </div>
                );
              })}

            <div className="col-lg-12 text-center mt-5">
              <button
                onClick={goFacilities}
                className="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none"
                style={{ width: "35%" }}
              >
                More Facilities &gt;&gt;&gt;
              </button>
            </div>
          </div>
        </div>
        <section
          className="counter__area section-space-bottom counter__bg p-relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/counter-img.png')",
            marginTop: "50px",
            padding: "150px 0px 50px 0px",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="counter__wrapper">
                <div className="counter__box">
                  <div className="counter__icon">
                    <svg
                      width="66"
                      height="66"
                      viewBox="0 0 66 66"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M54.2188 29.3381C54.6198 29.0151 54.8764 28.5464 54.9324 28.0345C54.9885 27.5226 54.8393 27.0095 54.5176 26.6074L53.6461 25.5215C52.8475 14.7606 43.8312 6.36975 33.0002 6.36975C27.8329 6.36962 22.8524 8.30173 19.037 11.7865C15.2216 15.2713 12.8472 20.0568 12.3802 25.203L11.3189 26.525C10.997 26.927 10.8477 27.4402 10.9037 27.9521C10.9597 28.4641 11.2164 28.9329 11.6176 29.2558L12.4956 29.9606C13.095 34.2086 14.9983 38.1658 17.9427 41.2859C20.8871 44.4061 24.7274 46.5353 28.9336 47.3797C29.0403 47.401 29.1502 47.401 29.2569 47.3798C29.3636 47.3586 29.4651 47.3166 29.5556 47.2562C29.6461 47.1958 29.7237 47.1181 29.7842 47.0276C29.8447 46.9372 29.8867 46.8357 29.908 46.729C29.9293 46.6223 29.9293 46.5125 29.9081 46.4057C29.8869 46.299 29.8449 46.1975 29.7845 46.107C29.724 46.0166 29.6464 45.9389 29.5559 45.8784C29.4655 45.8179 29.364 45.7759 29.2573 45.7546C25.6455 45.0402 22.3195 43.2909 19.6843 40.7197C17.0491 38.1485 15.2185 34.8664 14.4155 31.2733C14.8342 31.3776 15.2757 31.3392 15.6701 31.164C16.3774 31.7225 17.3733 32.0782 18.6887 32.2418C18.8843 32.3693 19.0805 32.4963 19.277 32.6225C19.6691 32.8751 19.6691 32.8751 19.773 32.9843C19.8504 33.0651 19.9702 33.1905 20.1805 33.3944L19.7722 34.1016C19.4862 34.5984 19.4088 35.1885 19.5572 35.7422C19.7056 36.296 20.0677 36.7683 20.5638 37.0555L20.7082 37.1388C21.0225 37.3211 21.378 37.4206 21.7413 37.4279C21.7964 37.7378 21.9186 38.0319 22.0993 38.2896C22.2801 38.5473 22.515 38.7624 22.7876 38.9197L22.932 39.003C23.3607 39.2511 23.8619 39.3437 24.351 39.2652C24.5269 39.7282 24.8576 40.116 25.2871 40.3627L25.4315 40.4461C26.0116 40.7813 26.7107 40.75 27.323 40.4983C27.5106 40.8038 27.7715 41.0576 28.0822 41.2364L28.2266 41.3198C28.554 41.5094 28.9257 41.6092 29.3041 41.6091C29.6778 41.6089 30.0452 41.5126 30.371 41.3295L31.4 42.081C32.3486 42.7739 33.196 43.1216 33.9321 43.1216C34.2424 43.1241 34.5492 43.0565 34.8298 42.9238C35.3521 42.6747 35.752 42.1871 35.9857 41.5474C36.2229 41.6137 36.4679 41.648 36.7143 41.6492C37.1015 41.6506 37.4835 41.5597 37.8285 41.3839C38.1724 41.2017 38.4716 40.9456 38.7047 40.634C38.9378 40.3224 39.099 39.963 39.1766 39.5817C39.7393 39.5817 40.2912 39.4269 40.7717 39.1341C41.1087 38.9298 41.3949 38.6515 41.6084 38.3202C41.822 37.989 41.9574 37.6135 42.0044 37.2222C42.018 37.2222 42.0315 37.2237 42.045 37.2237C42.442 37.2247 42.8345 37.1395 43.1953 36.9741C43.5562 36.8087 43.8768 36.5669 44.1351 36.2655C44.3935 35.9641 44.5833 35.6102 44.6916 35.2283C44.7999 34.8464 44.824 34.4455 44.7623 34.0534C44.7366 33.8926 44.6968 33.7343 44.6435 33.5804C44.914 33.4821 45.1749 33.3592 45.423 33.2133C45.9691 32.8878 46.4435 32.4356 46.899 31.9851L49.7126 30.9667C49.9681 31.1786 50.2735 31.3215 50.5999 31.3817C50.9262 31.4419 51.2626 31.4175 51.5768 31.3107C50.7687 34.9042 48.9316 38.1846 46.2899 40.7513C43.6482 43.318 40.3163 45.0598 36.701 45.7641C36.4992 45.804 36.3194 45.9175 36.1967 46.0826C36.0739 46.2476 36.0169 46.4524 36.0368 46.6572C36.0566 46.8619 36.1519 47.0519 36.3041 47.1903C36.4563 47.3287 36.6545 47.4055 36.8602 47.4059C36.9142 47.4058 36.9681 47.4006 37.0212 47.3902C41.2466 46.5516 45.1055 44.417 48.0612 41.2832C51.0169 38.1494 52.9224 34.1722 53.5125 29.9051L54.2188 29.3381ZM33.0002 8.02684C37.3396 8.03206 41.5475 9.5163 44.9299 12.2347C48.3122 14.9531 50.6669 18.7433 51.6054 22.98L46.0172 16.019C45.694 15.6182 45.2253 15.3618 44.7135 15.3058C44.2017 15.2498 43.6885 15.3989 43.2864 15.7204L41.2336 17.3683C40.8944 17.641 40.6567 18.0198 40.5585 18.4438C40.4604 18.8678 40.5074 19.3125 40.6922 19.7065C38.6714 20.4124 37.346 20.6834 34.3224 20.2537C33.3203 20.1119 31.8795 20.495 29.8278 21.4526C28.7088 21.5041 27.7734 21.1188 26.1299 20.4376C25.7367 20.2739 25.3426 20.1125 24.9476 19.9533C25.2455 19.5501 25.376 19.0474 25.3117 18.5503C25.2474 18.0531 24.9933 17.6001 24.6026 17.2861L22.5499 15.6381C22.1478 15.3166 21.6346 15.1676 21.1229 15.2236C20.6111 15.2795 20.1423 15.536 19.8192 15.9368L14.4912 22.5739C16.533 14.211 24.1454 8.02684 33.0002 8.02684ZM14.7084 29.6117L13.787 28.873L13.7814 28.8687L12.6551 27.9644C12.5969 27.9164 12.5598 27.8476 12.5516 27.7727C12.5435 27.6978 12.5648 27.6226 12.6112 27.5632L21.1116 16.9744C21.1351 16.9454 21.1642 16.9214 21.1971 16.9037C21.2299 16.886 21.266 16.875 21.3031 16.8712C21.3138 16.8701 21.3245 16.8695 21.3352 16.8696C21.3997 16.869 21.4623 16.8908 21.5126 16.931L23.5654 18.579C23.6237 18.6268 23.6609 18.6956 23.6691 18.7706C23.6773 18.8455 23.6558 18.9207 23.6093 18.98L22.9507 19.8005L22.9459 19.8064L15.1084 29.5689C15.0603 29.6266 14.9917 29.6633 14.9171 29.6712C14.8424 29.6792 14.7676 29.6579 14.7084 29.6117ZM22.3466 35.3599C22.3007 35.4079 22.2607 35.4613 22.2275 35.5188C22.1598 35.6341 22.0494 35.7181 21.9203 35.7527C21.7912 35.7872 21.6536 35.7696 21.5373 35.7037L21.393 35.6204C21.2783 35.5522 21.1947 35.4418 21.1602 35.3129C21.1257 35.184 21.1429 35.0467 21.2081 34.9302L22.5919 32.5332C22.6251 32.4759 22.6694 32.4257 22.7221 32.3855C22.7748 32.3454 22.835 32.3161 22.8991 32.2994C22.9427 32.2876 22.9877 32.2817 23.0329 32.2816C23.1205 32.2816 23.2065 32.3046 23.2824 32.3485L23.4266 32.4316C23.5413 32.4999 23.6247 32.6103 23.6592 32.7392C23.6937 32.8681 23.6765 33.0054 23.6113 33.1218C23.5689 33.1952 23.538 33.2746 23.5197 33.3573C23.4692 33.425 23.4228 33.4957 23.3806 33.5688L22.3466 35.3599ZM25.7356 35.2623L24.6408 37.1586C24.5648 37.2215 24.5007 37.2974 24.4515 37.3829C24.3832 37.4976 24.2729 37.5811 24.144 37.6156C24.015 37.6502 23.8777 37.633 23.7612 37.5678L23.6169 37.4845C23.5021 37.4163 23.4186 37.306 23.384 37.177C23.3495 37.0481 23.3666 36.9108 23.4319 36.7943L24.8147 34.3975C24.8602 34.3207 24.9249 34.2572 25.0026 34.2133C25.0802 34.1693 25.168 34.1464 25.2572 34.1469C25.3441 34.1466 25.4296 34.1693 25.505 34.2126L25.6493 34.2959C25.7646 34.3636 25.8485 34.4739 25.8831 34.603C25.9177 34.7321 25.9002 34.8696 25.8343 34.9859C25.7849 35.0713 25.7512 35.1649 25.7349 35.2623H25.7356ZM28.3347 36.429C28.3019 36.4859 28.276 36.5465 28.2574 36.6095L27.2907 38.2832C27.2211 38.4036 27.1632 38.5305 27.118 38.6621C26.906 38.9391 26.4128 39.1003 26.26 39.0115L26.1156 38.9282C26.0003 38.8605 25.9163 38.7502 25.8818 38.621C25.8472 38.4919 25.8648 38.3543 25.9309 38.2381L27.3145 35.8411C27.36 35.7643 27.4248 35.7008 27.5025 35.6569C27.5801 35.6129 27.6679 35.59 27.7571 35.5905C27.8439 35.5902 27.9294 35.6129 28.0047 35.6561L28.1492 35.7395C28.2645 35.8072 28.3485 35.9176 28.3831 36.0467C28.4176 36.1758 28.4 36.3134 28.3341 36.4297L28.3347 36.429ZM29.0559 39.8849L28.9116 39.8015C28.7969 39.7332 28.7133 39.6229 28.6788 39.494C28.6442 39.3651 28.6614 39.2278 28.7266 39.1113L30.1105 36.7144C30.156 36.6376 30.2207 36.5741 30.2984 36.5301C30.376 36.4861 30.4638 36.4632 30.5531 36.4637C30.6399 36.4634 30.7252 36.4861 30.8006 36.5293L30.9451 36.6128C31.0603 36.6806 31.1443 36.7909 31.1789 36.92C31.2135 37.0492 31.1959 37.1867 31.1299 37.303L29.7462 39.6999C29.6779 39.8146 29.5675 39.8982 29.4386 39.9327C29.3096 39.9673 29.1722 39.9501 29.0557 39.8849H29.0559ZM42.9306 35.1193C42.7597 35.353 42.503 35.5093 42.2169 35.5539C41.9309 35.5984 41.6388 35.5276 41.4049 35.357L38.1693 32.994C38.0815 32.9289 37.9817 32.8817 37.8756 32.8553C37.7695 32.8289 37.6592 32.8238 37.5511 32.8402C37.443 32.8566 37.3392 32.8942 37.2457 32.951C37.1522 33.0077 37.0709 33.0823 37.0064 33.1706C36.9419 33.2589 36.8955 33.3591 36.8699 33.4654C36.8443 33.5717 36.84 33.6821 36.8572 33.7901C36.8745 33.898 36.9129 34.0015 36.9703 34.0946C37.0278 34.1876 37.1031 34.2684 37.1919 34.3322L40.3673 36.6515C40.4103 37.1426 40.2532 37.5043 39.8966 37.7262C39.4753 37.9877 38.8509 37.9951 38.5044 37.7419L35.7374 35.7209C35.5599 35.5933 35.339 35.541 35.1231 35.5755C34.9072 35.61 34.7136 35.7284 34.5847 35.905C34.4557 36.0816 34.4017 36.302 34.4346 36.5182C34.4674 36.7343 34.5843 36.9288 34.7599 37.0591L37.5269 39.0801C37.5436 39.093 37.5618 39.1028 37.5784 39.1147C37.5148 39.4859 37.337 39.773 37.0733 39.9079C36.7443 40.0762 36.3065 39.9911 35.8728 39.6742L33.9814 38.2929C33.8039 38.1652 33.5831 38.113 33.3672 38.1475C33.1512 38.1819 32.9577 38.3004 32.8287 38.4769C32.6997 38.6535 32.6458 38.8739 32.6786 39.0901C32.7114 39.3063 32.8284 39.5007 33.0039 39.631L34.5011 40.7244C34.4248 41.076 34.2819 41.3483 34.1155 41.4276C33.8813 41.5394 33.3012 41.4182 32.3767 40.743L31.4477 40.0644L32.5635 38.1317C32.8492 37.6348 32.9263 37.045 32.778 36.4913C32.6297 35.9376 32.2681 35.4653 31.7722 35.1777L31.6276 35.0943C31.3368 34.9264 31.0109 34.8287 30.6757 34.8087C30.3405 34.7888 30.0053 34.8472 29.6966 34.9795C29.5125 34.7014 29.2662 34.4701 28.977 34.304L28.8324 34.2205C28.4037 33.9724 27.9026 33.8798 27.4135 33.9583C27.2377 33.4953 26.9069 33.1075 26.4776 32.8608L26.3332 32.7775C26.0187 32.5955 25.6632 32.4962 25.3 32.4887C25.2449 32.1787 25.1227 31.8845 24.9419 31.6268C24.7611 31.369 24.5261 31.1539 24.2534 30.9965L24.1092 30.9134C23.6123 30.6275 23.0224 30.5503 22.4687 30.6986C21.9151 30.847 21.4428 31.2088 21.1554 31.7047L21.0372 31.9093C21.0132 31.8844 20.9914 31.8616 20.9727 31.8418C20.7323 31.5891 20.6686 31.5481 20.1735 31.2293C19.9254 31.0699 19.678 30.9094 19.4311 30.748C19.3215 30.6762 19.1963 30.6315 19.066 30.6175C18.1249 30.5166 17.3884 30.304 16.8905 29.9949L23.8657 21.3066C24.475 21.5459 25.0103 21.7676 25.495 21.9684C26.2602 22.3051 27.0434 22.599 27.8411 22.8489C27.698 23.0211 27.5597 23.2003 27.4196 23.3834L27.3481 23.4772C27.0022 23.9283 26.3555 24.7594 25.9073 25.2522C25.824 25.3437 25.7485 25.4225 25.6803 25.4938C25.3781 25.8095 25.0926 26.1077 24.9713 26.6481C24.8305 27.2773 24.9298 28.1902 25.4683 28.8116C25.9293 29.3428 26.7293 29.6595 27.6097 29.6595H27.617C28.3775 29.658 28.973 29.3968 29.6878 28.9757C29.8189 28.8979 29.9494 28.8192 30.0793 28.7394C30.6639 28.3824 31.3915 27.9382 32.089 27.7461C34.5717 27.0629 38.3599 30.13 40.8663 32.1598C41.5271 32.6949 42.1511 33.2003 42.691 33.5946C42.9235 33.7663 43.0789 34.0228 43.1234 34.3083C43.1678 34.5939 43.0978 34.8855 42.9284 35.1197L42.9306 35.1193ZM44.5751 31.7894C44.2605 31.9646 43.9241 32.0976 43.5748 32.1849C43.088 31.824 42.5159 31.3612 41.9119 30.8716C38.9764 28.4943 34.9567 25.2384 31.6517 26.1481C30.7295 26.4019 29.8916 26.9135 29.2184 27.3246C29.0887 27.4039 28.9653 27.4793 28.8496 27.5475C28.1986 27.9309 27.9234 28.0014 27.6163 28.002H27.6119C27.2353 28.002 26.8614 27.886 26.7225 27.7254C26.5896 27.5721 26.5432 27.221 26.5905 27.0093C26.6072 26.9343 26.6321 26.8972 26.8788 26.6394C26.9562 26.559 27.0407 26.47 27.1347 26.3669C27.6238 25.8289 28.3035 24.9565 28.6652 24.4848L28.7379 24.3897C29.1352 23.8698 29.4223 23.4942 29.7925 23.3097C32.4059 22.0066 33.5728 21.8212 34.09 21.8944C37.7366 22.4123 39.3081 21.9688 41.735 21.0952L48.5753 29.6159L46.1639 30.4891C46.0505 30.5297 45.9475 30.5947 45.862 30.6794C45.4174 31.1204 44.9978 31.5369 44.5744 31.7894H44.5751ZM50.7283 29.6496L42.2278 19.0607C42.1814 19.0014 42.16 18.9262 42.1681 18.8513C42.1763 18.7764 42.2135 18.7076 42.2717 18.6597L44.3245 17.0117C44.3838 16.9652 44.459 16.9437 44.5339 16.9519C44.6089 16.9601 44.6776 16.9974 44.7254 17.0557L53.2256 27.6448C53.2722 27.7041 53.2937 27.7793 53.2855 27.8543C53.2774 27.9292 53.2402 27.998 53.1819 28.0459L51.1291 29.6938C51.0697 29.7403 50.9944 29.7617 50.9194 29.7536C50.8444 29.7454 50.7756 29.7082 50.7277 29.65L50.7283 29.6496ZM34.3251 46.9247C34.3304 47.1444 34.2482 47.3572 34.0966 47.5163C33.945 47.6754 33.7364 47.7678 33.5167 47.7732C33.3449 47.7773 33.1727 47.7794 33.0002 47.7795C32.7804 47.7795 32.5697 47.6922 32.4143 47.5368C32.2589 47.3814 32.1716 47.1706 32.1716 46.9509C32.1716 46.7311 32.2589 46.5203 32.4143 46.3649C32.5697 46.2096 32.7804 46.1223 33.0002 46.1223C33.1595 46.1223 33.3185 46.1203 33.4772 46.1164C33.5859 46.1138 33.6942 46.1325 33.7957 46.1717C33.8972 46.2109 33.9899 46.2697 34.0687 46.3448C34.1475 46.4198 34.2106 46.5097 34.2546 46.6092C34.2986 46.7087 34.3226 46.8159 34.3251 46.9247ZM51.6489 44.0171C55.8732 39.3861 58.2126 33.3427 58.2074 27.0745C58.2074 13.1752 46.8995 1.86719 33.0002 1.86719C19.1009 1.86719 7.79298 13.1752 7.79298 27.0745C7.78794 33.3426 10.1273 39.386 14.3513 44.017L9.44233 58.4943C9.40739 58.5974 9.39309 58.7063 9.40026 58.8149C9.40742 58.9235 9.43591 59.0296 9.48409 59.1272C9.53227 59.2248 9.5992 59.3119 9.68106 59.3836C9.76292 59.4553 9.85811 59.5102 9.96118 59.5451L10.0242 59.5665C10.148 59.6085 10.28 59.6205 10.4094 59.6017C10.5388 59.5829 10.6619 59.5337 10.7686 59.4582L19.5648 53.2345L22.7617 63.5247C22.8006 63.65 22.8688 63.7643 22.9605 63.8581C23.0522 63.952 23.1649 64.0227 23.2893 64.0645L23.3522 64.0856C23.5601 64.1556 23.7874 64.1403 23.984 64.0429C24.1806 63.9455 24.3305 63.7741 24.4007 63.5662L28.3717 51.8545C31.431 52.4245 34.5692 52.4245 37.6285 51.8545L41.5995 63.5661C41.6698 63.774 41.8198 63.9455 42.0164 64.0429C42.2131 64.1402 42.4404 64.1555 42.6483 64.0853L42.7112 64.0642C42.8355 64.0224 42.9481 63.9517 43.0397 63.8579C43.1313 63.7641 43.1994 63.6499 43.2383 63.5247L46.4352 53.2345L55.2314 59.4582C55.3382 59.5338 55.4614 59.5829 55.5908 59.6017C55.7203 59.6205 55.8523 59.6084 55.9762 59.5664L56.0392 59.545C56.2473 59.4744 56.4188 59.324 56.516 59.127C56.6132 58.9299 56.6281 58.7024 56.5576 58.4943L51.6489 44.0171ZM23.621 60.7049L20.8089 51.6534C20.7701 51.5285 20.7022 51.4146 20.6109 51.3209C20.5197 51.2273 20.4075 51.1566 20.2836 51.1146C20.1598 51.0726 20.0277 51.0605 19.8983 51.0794C19.7689 51.0982 19.6458 51.1474 19.539 51.2229L11.8014 56.6976L15.6508 45.3446C18.7634 48.3074 22.582 50.425 26.7436 51.4961L23.621 60.7049ZM9.45007 27.0745C9.45007 14.0889 20.0146 3.52441 33.0002 3.52441C45.9858 3.52441 56.5503 14.0889 56.5503 27.0745C56.5503 40.0602 45.9858 50.6247 33.0002 50.6247C20.0146 50.6247 9.45007 40.0602 9.45007 27.0745ZM46.4612 51.2229C46.3545 51.1474 46.2314 51.0982 46.102 51.0794C45.9725 51.0605 45.8405 51.0726 45.7166 51.1146C45.5928 51.1566 45.4806 51.2273 45.3893 51.3209C45.298 51.4146 45.2302 51.5285 45.1914 51.6534L42.3792 60.7048L39.2567 51.4961C43.4183 50.4252 47.2368 48.3078 50.3494 45.3451L54.1988 56.6978L46.4612 51.2229Z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <div className="counter__item">
                    <h3 className="counter__item-title">
                      <span
                        className="odometer odometer-auto-theme"
                        data-count="14"
                      >
                        <div className="odometer-inside">
                          <span className="odometer-digit">14</span>
                        </div>
                      </span>
                      +
                    </h3>
                    <p className="odometer-text">Years of experience</p>
                  </div>
                </div>
                <div className="counter__box">
                  <div className="counter__icon">
                    <svg
                      width="66"
                      height="66"
                      viewBox="0 0 66 66"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.42656 26.4H10.7266V56.925C10.7266 57.1438 10.8135 57.3536 10.9682 57.5084C11.1229 57.6631 11.3328 57.75 11.5516 57.75C11.7704 57.75 11.9802 57.6631 12.1349 57.5084C12.2896 57.3536 12.3766 57.1438 12.3766 56.925V26.4H57.7516V56.925C57.7516 57.1438 57.8385 57.3536 57.9932 57.5084C58.1479 57.6631 58.3578 57.75 58.5766 57.75C58.7954 57.75 59.0052 57.6631 59.1599 57.5084C59.3146 57.3536 59.4016 57.1438 59.4016 56.925V9.075C59.4016 8.8562 59.3146 8.64635 59.1599 8.49164C59.0052 8.33692 58.7954 8.25 58.5766 8.25H18.5641C18.3453 8.25 18.1354 8.33692 17.9807 8.49164C17.826 8.64635 17.7391 8.8562 17.7391 9.075C17.7391 9.2938 17.826 9.50365 17.9807 9.65836C18.1354 9.81308 18.3453 9.9 18.5641 9.9H28.0516V15.675H7.42656C7.20776 15.675 6.99792 15.7619 6.8432 15.9166C6.68848 16.0714 6.60156 16.2812 6.60156 16.5V25.575C6.60156 25.7938 6.68848 26.0036 6.8432 26.1584C6.99792 26.3131 7.20776 26.4 7.42656 26.4ZM29.7016 9.9H57.7516V24.75H29.7016V9.9ZM23.1016 17.325H28.0516V24.75H23.1016V17.325ZM15.2641 17.325H21.4516V24.75H15.2641V17.325ZM8.25156 17.325H13.6141V24.75H8.25156V17.325Z"
                        fill="white"
                      ></path>
                      <path
                        d="M42.0773 11.5469H32.1773C31.9585 11.5469 31.7487 11.6338 31.594 11.7885C31.4393 11.9432 31.3523 12.1531 31.3523 12.3719V22.2719C31.3523 22.4907 31.4393 22.7005 31.594 22.8552C31.7487 23.01 31.9585 23.0969 32.1773 23.0969H42.0773C42.2961 23.0969 42.506 23.01 42.6607 22.8552C42.8154 22.7005 42.9023 22.4907 42.9023 22.2719V12.3719C42.9023 12.1531 42.8154 11.9432 42.6607 11.7885C42.506 11.6338 42.2961 11.5469 42.0773 11.5469ZM41.2523 21.4469H33.0023V13.1969H41.2523V21.4469ZM55.2773 11.5469H45.3773C45.1585 11.5469 44.9487 11.6338 44.794 11.7885C44.6393 11.9432 44.5523 12.1531 44.5523 12.3719V22.2719C44.5523 22.4907 44.6393 22.7005 44.794 22.8552C44.9487 23.01 45.1585 23.0969 45.3773 23.0969H55.2773C55.4961 23.0969 55.706 23.01 55.8607 22.8552C56.0154 22.7005 56.1023 22.4907 56.1023 22.2719V12.3719C56.1023 12.1531 56.0154 11.9432 55.8607 11.7885C55.706 11.6338 55.4961 11.5469 55.2773 11.5469ZM54.4523 21.4469H46.2023V13.1969H54.4523V21.4469ZM23.5148 30.5219C23.5148 30.3031 23.4279 30.0932 23.2732 29.9385C23.1185 29.7838 22.9086 29.6969 22.6898 29.6969H16.9148C16.696 29.6969 16.4862 29.7838 16.3315 29.9385C16.1768 30.0932 16.0898 30.3031 16.0898 30.5219V38.7719C16.0898 38.9907 16.1768 39.2005 16.3315 39.3552C16.4862 39.51 16.696 39.5969 16.9148 39.5969H22.6898C22.9086 39.5969 23.1185 39.51 23.2732 39.3552C23.4279 39.2005 23.5148 38.9907 23.5148 38.7719V30.5219ZM21.8648 37.9469H17.7398V31.3469H21.8648V37.9469ZM38.7773 30.5219C38.7773 30.3031 38.6904 30.0932 38.5357 29.9385C38.381 29.7838 38.1711 29.6969 37.9523 29.6969H32.1773C31.9585 29.6969 31.7487 29.7838 31.594 29.9385C31.4393 30.0932 31.3523 30.3031 31.3523 30.5219V38.7719C31.3523 38.9907 31.4393 39.2005 31.594 39.3552C31.7487 39.51 31.9585 39.5969 32.1773 39.5969H37.9523C38.1711 39.5969 38.381 39.51 38.5357 39.3552C38.6904 39.2005 38.7773 38.9907 38.7773 38.7719V30.5219ZM37.1273 37.9469H33.0023V31.3469H37.1273V37.9469ZM54.0398 30.5219C54.0398 30.3031 53.9529 30.0932 53.7982 29.9385C53.6435 29.7838 53.4336 29.6969 53.2148 29.6969H47.4398C47.221 29.6969 47.0112 29.7838 46.8565 29.9385C46.7018 30.0932 46.6148 30.3031 46.6148 30.5219V38.7719C46.6148 38.9907 46.7018 39.2005 46.8565 39.3552C47.0112 39.51 47.221 39.5969 47.4398 39.5969H53.2148C53.4336 39.5969 53.6435 39.51 53.7982 39.3552C53.9529 39.2005 54.0398 38.9907 54.0398 38.7719V30.5219ZM52.3898 37.9469H48.2648V31.3469H52.3898V37.9469ZM22.6898 43.7219H16.9148C16.696 43.7219 16.4862 43.8088 16.3315 43.9635C16.1768 44.1182 16.0898 44.3281 16.0898 44.5469V52.7969C16.0898 53.0157 16.1768 53.2255 16.3315 53.3802C16.4862 53.535 16.696 53.6219 16.9148 53.6219H22.6898C22.9086 53.6219 23.1185 53.535 23.2732 53.3802C23.4279 53.2255 23.5148 53.0157 23.5148 52.7969V44.5469C23.5148 44.3281 23.4279 44.1182 23.2732 43.9635C23.1185 43.8088 22.9086 43.7219 22.6898 43.7219ZM21.8648 51.9719H17.7398V45.3719H21.8648V51.9719ZM37.9523 43.7219H32.1773C31.9585 43.7219 31.7487 43.8088 31.594 43.9635C31.4393 44.1182 31.3523 44.3281 31.3523 44.5469V52.7969C31.3523 53.0157 31.4393 53.2255 31.594 53.3802C31.7487 53.535 31.9585 53.6219 32.1773 53.6219H37.9523C38.1711 53.6219 38.381 53.535 38.5357 53.3802C38.6904 53.2255 38.7773 53.0157 38.7773 52.7969V44.5469C38.7773 44.3281 38.6904 44.1182 38.5357 43.9635C38.381 43.8088 38.1711 43.7219 37.9523 43.7219ZM37.1273 51.9719H33.0023V45.3719H37.1273V51.9719ZM53.2148 43.7219H47.4398C47.221 43.7219 47.0112 43.8088 46.8565 43.9635C46.7018 44.1182 46.6148 44.3281 46.6148 44.5469V52.7969C46.6148 53.0157 46.7018 53.2255 46.8565 53.3802C47.0112 53.535 47.221 53.6219 47.4398 53.6219H53.2148C53.4336 53.6219 53.6435 53.535 53.7982 53.3802C53.9529 53.2255 54.0398 53.0157 54.0398 52.7969V44.5469C54.0398 44.3281 53.9529 44.1182 53.7982 43.9635C53.6435 43.8088 53.4336 43.7219 53.2148 43.7219ZM52.3898 51.9719H48.2648V45.3719H52.3898V51.9719Z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <div className="counter__item">
                    <h3 className="counter__item-title">
                      <span
                        className="odometer odometer-auto-theme"
                        data-count="800"
                      >
                        <div className="odometer-inside">
                          <span className="odometer-digit">800</span>
                        </div>
                      </span>
                      +
                    </h3>
                    <p className="odometer-text">Luxury Hotels</p>
                  </div>
                </div>
                <div className="counter__box">
                  <div className="counter__icon">
                    <svg
                      width="66"
                      height="66"
                      viewBox="0 0 66 66"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M44.2202 31.2264V20.3777C44.2202 19.8105 43.7561 19.3464 43.1889 19.3464H7.71391C7.14672 19.3464 6.68266 19.8105 6.68266 20.3777V31.2264C5.36781 32.2712 4.30568 33.5993 3.57539 35.1117C2.84511 36.624 2.4655 38.2817 2.46484 39.9611L2.49578 49.2527C2.49578 49.8198 2.95984 50.2839 3.52703 50.2839H5.76484V53.4818C5.76484 54.049 6.22891 54.5131 6.79609 54.5131H13.0145C13.5817 54.5131 14.0458 54.049 14.0458 53.4818V50.2839H36.857V53.4818C36.857 54.049 37.3211 54.5131 37.8883 54.5131H44.1057C44.6739 54.5131 45.1369 54.049 45.1369 53.4818V50.2839H47.3448C47.912 50.2839 48.3761 49.8198 48.3761 49.2527L48.438 39.9611C48.438 36.558 46.8808 33.3302 44.2202 31.2264ZM8.74412 21.4089H42.1566V29.9167C41.0016 29.3495 39.7641 28.9989 38.5163 28.8648V26.2352C38.5163 25.6669 38.0533 25.2039 37.4851 25.2039H29.2567C28.6782 25.2039 28.2255 25.6669 28.2255 26.2352V28.8019H22.6877V26.2352C22.6877 25.6669 22.2236 25.2039 21.6564 25.2039H13.4167C12.8495 25.2039 12.3855 25.6669 12.3855 26.2352V28.8752C11.1207 29.0079 9.88877 29.3604 8.74516 29.9167L8.74412 21.4089ZM36.4548 27.2664V28.8019H30.288V27.2664H36.4548ZM20.6252 27.2664V28.8019H14.448V27.2664H20.6252ZM11.9833 52.4495H7.82734V50.2839H11.9833V52.4495ZM43.0755 52.4495H38.9195V50.2839H43.0744L43.0755 52.4495ZM46.3136 48.2214H4.55828V42.6836H46.3136V48.2214ZM46.3755 40.6211H4.52734V39.9611C4.52916 38.5224 4.87109 37.1045 5.52524 35.823C6.17939 34.5416 7.12723 33.433 8.29141 32.5877C8.30172 32.5773 8.31203 32.567 8.32131 32.567C9.81663 31.4842 11.5801 30.8964 13.5188 30.8655H37.4851C39.331 30.8964 41.0841 31.4852 42.5794 32.567C43.7529 33.4103 44.7089 34.5206 45.3686 35.8063C46.0283 37.0919 46.3727 38.5161 46.3734 39.9611V40.6211H46.3755ZM62.5042 27.0705H58.6886V19.1298H61.5761C61.753 19.1293 61.9268 19.0835 62.0809 18.9967C62.235 18.9098 62.3643 18.7849 62.4564 18.6339C62.5484 18.4828 62.6002 18.3107 62.6068 18.1339C62.6134 17.9572 62.5745 17.7817 62.4939 17.6242L60.9996 12.2514C60.9415 12.033 60.8131 11.8399 60.6341 11.7019C60.4551 11.5639 60.2356 11.4889 60.0096 11.4883H54.7492C54.2852 11.4883 53.883 11.7987 53.7489 12.2514L52.202 17.8202C52.1195 18.1295 52.1804 18.4595 52.3773 18.7173C52.5743 18.9752 52.8713 19.1288 53.2023 19.1288H56.6261V27.0694H52.2433C51.6761 27.0694 51.212 27.5232 51.212 28.1007V52.036C51.212 52.6135 51.6761 53.0672 52.2433 53.0672H62.5042C63.0817 53.0672 63.5355 52.6135 63.5355 52.036V28.1017C63.5355 27.5242 63.0817 27.0705 62.5042 27.0705ZM54.5533 17.0673L55.5319 13.5508H59.2238L60.1932 17.0673H54.5533ZM61.473 51.0058H53.2745V46.2311H61.473V51.0058ZM61.473 44.1686H53.2745V34.8255H61.473V44.1686ZM61.473 32.763H53.2745V29.133H61.473V32.763Z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <div className="counter__item">
                    <h3 className="counter__item-title">
                      <span
                        className="odometer odometer-auto-theme"
                        data-count="600"
                      >
                        <div className="odometer-inside">
                          <span className="odometer-digit">600</span>
                        </div>
                      </span>
                      +
                    </h3>
                    <p className="odometer-text">Happy Clients</p>
                  </div>
                </div>
                <div className="counter__box">
                  <div className="counter__icon">
                    <svg
                      width="66"
                      height="66"
                      viewBox="0 0 66 66"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_7733_392)">
                        <path
                          d="M35.6173 26.0423L32.6164 23.5062L33.0045 19.5961C33.0262 19.3859 32.9881 19.1738 32.8948 18.9842C32.8015 18.7946 32.6567 18.6351 32.4769 18.5241C32.298 18.4116 32.091 18.3518 31.8796 18.3516C31.6683 18.3513 31.4611 18.4106 31.2819 18.5227L27.9425 20.5929L24.3439 19.0157C24.1507 18.9301 23.9373 18.9006 23.7281 18.9308C23.5189 18.9609 23.3224 19.0493 23.1612 19.186C22.9989 19.3214 22.8781 19.4998 22.8125 19.7008C22.747 19.9018 22.7394 20.1171 22.7906 20.3222L23.7276 24.1379L21.1157 27.0728C20.9746 27.2301 20.8806 27.424 20.8446 27.6323C20.8086 27.8406 20.8319 28.0548 20.9121 28.2504C20.9907 28.4466 21.123 28.6167 21.2938 28.7411C21.4647 28.8656 21.6671 28.9394 21.878 28.954L25.7966 29.242L27.781 32.6335C27.88 32.8042 28.0222 32.9458 28.1933 33.0441C28.3644 33.1424 28.5583 33.1939 28.7556 33.1935C28.981 33.1948 29.2016 33.1284 29.3888 33.0028C29.576 32.8773 29.7211 32.6984 29.8054 32.4894L31.2902 28.8515L35.1293 28.0122C35.3358 27.9677 35.5257 27.866 35.6771 27.7186C35.8285 27.5712 35.9353 27.3841 35.9853 27.1788C36.0369 26.9739 36.0297 26.7587 35.9646 26.5577C35.8996 26.3567 35.7792 26.1781 35.6173 26.0423ZM30.4719 27.0602C30.2926 27.0994 30.1256 27.1816 29.9852 27.2997C29.8448 27.4178 29.7352 27.5683 29.6658 27.7382L28.6307 30.2743L27.2469 27.9094C27.1542 27.7512 27.0244 27.6179 26.8688 27.521C26.7132 27.4241 26.5363 27.3664 26.3535 27.353L23.6217 27.1523L25.443 25.1056C25.5648 24.9686 25.6516 24.804 25.6957 24.626C25.7398 24.448 25.74 24.2619 25.6963 24.0838L25.043 21.4237L27.5511 22.5229C27.7192 22.5967 27.9028 22.6285 28.0859 22.6156C28.2691 22.6026 28.4463 22.5453 28.6024 22.4485L30.9305 21.0051L30.6601 23.7309C30.6419 23.9135 30.6684 24.0978 30.7374 24.2679C30.8063 24.438 30.9155 24.5887 31.0557 24.7072L33.1479 26.4751L30.4719 27.0602Z"
                          fill="white"
                        ></path>
                        <path
                          d="M63.414 49.8667L60.2062 47.0332C59.388 46.3107 58.1411 46.2956 57.3057 46.9981L57.1618 47.1191C57.02 46.6081 56.7609 46.1245 56.3807 45.715C55.9163 45.2148 55.3266 44.8725 54.6769 44.7186C55.0516 43.5677 54.8094 42.2522 53.9293 41.3041C53.3034 40.6298 52.4523 40.2398 51.533 40.2059C51.5053 40.2048 51.4778 40.2052 51.4502 40.2048C51.4924 39.3123 51.191 38.4043 50.5367 37.6993C49.9184 37.0332 49.0804 36.6452 48.1739 36.6029C48.2557 35.6665 47.9574 34.7005 47.2691 33.9592C46.6432 33.2849 45.7921 32.8948 44.8728 32.8609C43.9532 32.8262 43.0758 33.153 42.4018 33.7791L41.9449 34.2035C41.2813 33.7244 40.4874 33.4525 39.6442 33.4247C39.5386 33.4216 39.4328 33.4222 39.3272 33.4268L39.6696 32.2843C40.2836 30.2352 40.6657 26.5205 40.6543 26.7198C40.6874 26.7358 40.7199 26.7524 40.7538 26.7675C41.221 26.9752 41.7266 27.0824 42.2378 27.082C42.8172 27.082 43.394 26.9448 43.9093 26.6719C44.9822 26.1039 45.7437 24.9167 45.8043 23.7175C45.8619 22.5763 45.3245 21.5686 44.2911 20.8798C44.0787 20.7383 43.8188 20.687 43.5686 20.7371C43.3183 20.7871 43.0982 20.9346 42.9566 21.1469C42.8151 21.3594 42.7637 21.6193 42.8139 21.8696C42.864 22.1198 43.0114 22.3399 43.2238 22.4815C43.6834 22.7877 43.9048 23.1708 43.882 23.6203C43.8553 24.149 43.4881 24.717 43.0088 24.9707C42.5694 25.2035 42.0058 25.2183 41.5378 25.0095C41.239 24.8763 40.8517 24.5929 40.7034 23.9995C40.2619 22.2323 41.2744 20.4783 42.4465 18.4475C44.5697 14.7689 47.212 10.1911 41.6809 3.65346L39.3903 0.94591C39.1642 0.677106 38.8869 0.455906 38.5746 0.29516C38.2623 0.134414 37.9212 0.0373258 37.571 0.00953528C37.221 -0.0202277 36.8686 0.0198508 36.5342 0.127443C36.1999 0.235035 35.8902 0.407995 35.6232 0.636277C34.8961 1.25478 34.3295 2.04021 33.9721 2.92539C33.6146 3.81057 33.4769 4.76917 33.5707 5.71918L33.685 6.87573C33.7135 7.16754 33.6732 7.46196 33.5674 7.7354C33.4615 8.00883 33.2931 8.25368 33.0757 8.45032L34.3159 9.925C34.7725 9.52656 35.1273 9.02477 35.3507 8.46142C35.5742 7.89806 35.6597 7.28948 35.6003 6.68636L35.486 5.52982C35.4227 4.88926 35.5155 4.2429 35.7565 3.64605C35.9976 3.0492 36.3796 2.51961 36.8699 2.10259C36.9443 2.0388 37.0307 1.99049 37.124 1.96048C37.2173 1.93047 37.3156 1.91935 37.4132 1.92779C37.5109 1.93554 37.6061 1.96261 37.6932 2.00745C37.7803 2.05228 37.8577 2.11398 37.9207 2.18895L40.2114 4.8965C44.8683 10.4009 42.8821 13.8422 40.7794 17.4852C40.4504 18.0551 40.1188 18.6303 39.8189 19.2135C39.0237 16.4807 37.6927 13.9399 35.8524 11.752L31.4477 6.51492L31.4725 6.49416C31.6467 6.34847 31.7903 6.16966 31.895 5.96808C31.9996 5.7665 32.0633 5.54617 32.0822 5.31983C32.1023 5.0936 32.0774 4.86562 32.0089 4.64908C31.9403 4.43254 31.8295 4.23176 31.6828 4.05835L30.2754 2.38502C30.1297 2.21078 29.9509 2.06717 29.7493 1.96251C29.5478 1.85785 29.3274 1.79422 29.1011 1.77529C28.8749 1.75516 28.6469 1.78008 28.4303 1.8486C28.2138 1.91713 28.013 2.0279 27.8395 2.17452L5.59839 20.8805C4.86891 21.494 4.77455 22.5866 5.38802 23.3163L6.79541 24.9896C6.94112 25.1639 7.11996 25.3075 7.32156 25.4122C7.52316 25.5168 7.74352 25.5805 7.96988 25.5994C8.1961 25.6196 8.42409 25.5948 8.64062 25.5262C8.85715 25.4577 9.0579 25.3468 9.23123 25.2L9.2561 25.179L10.9104 27.146C10.6804 27.3237 10.4124 27.4457 10.1273 27.5023C9.84229 27.559 9.54798 27.5486 9.26758 27.4722L8.147 27.1647C7.22638 26.9121 6.25827 26.8863 5.32549 27.0894C4.39271 27.2925 3.52302 27.7186 2.79081 28.3311C2.52081 28.5558 2.29813 28.8319 2.13573 29.1434C1.97332 29.4549 1.87442 29.7955 1.84477 30.1455C1.81312 30.4953 1.8513 30.8479 1.9571 31.1829C2.0629 31.5178 2.23421 31.8283 2.46107 32.0965L4.74387 34.8106C10.2558 41.3643 15.2136 39.5315 19.1974 38.0587C20.9952 37.394 22.5926 36.8036 24.0268 37.0107C24.2935 37.0859 24.5615 37.1562 24.8308 37.2215C24.8753 37.2389 24.9196 37.2569 24.9638 37.2762C25.5237 37.5222 25.7378 37.9518 25.8189 38.2688C25.9457 38.7651 25.836 39.3181 25.5326 39.7121C25.2018 40.1418 24.5801 40.4075 24.0543 40.3452C23.6074 40.2918 23.2671 40.009 23.0426 39.5045C22.9366 39.2749 22.7444 39.0962 22.5077 39.0072C22.271 38.9181 22.0087 38.9258 21.7776 39.0286C21.5466 39.1314 21.3652 39.321 21.2728 39.5564C21.1804 39.7918 21.1844 40.0541 21.2838 40.2867C21.7885 41.4213 22.6914 42.1209 23.8259 42.2564C23.9514 42.2713 24.0777 42.2787 24.2041 42.2787C25.2846 42.2785 26.3946 41.7472 27.0573 40.8865C27.7235 40.0215 27.9576 38.8647 27.6834 37.7922C27.6771 37.7677 27.6695 37.7439 27.6626 37.7196C28.546 37.8195 29.4343 37.8697 30.3234 37.8701C31.2848 37.8701 32.2572 37.8126 33.2346 37.6959L33.3198 37.6857C32.8808 38.2087 32.5418 38.8079 32.3198 39.4536L28.5367 48.7588L8.3575 64.2751C8.19811 64.3976 8.08108 64.5669 8.02284 64.7593C7.96461 64.9517 7.9681 65.1576 8.03281 65.3479C8.09753 65.5382 8.22023 65.7035 8.38368 65.8205C8.54713 65.9375 8.74313 66.0004 8.94415 66.0004H31.8085C31.937 66.0004 32.0642 65.9746 32.1826 65.9247C32.301 65.8747 32.4082 65.8016 32.4979 65.7096L33.7714 64.4021C33.9481 64.219 34.0451 63.9733 34.0412 63.7189C34.0373 63.4644 33.9328 63.2219 33.7505 63.0443C33.5682 62.8667 33.323 62.7686 33.0685 62.7713C32.814 62.7741 32.571 62.8775 32.3926 63.059L31.4025 64.0757H11.7747L29.9172 50.1258C29.9306 50.1155 29.9426 50.1043 29.9552 50.0935C29.9639 50.0861 29.9728 50.079 29.9811 50.0713C30.0118 50.0432 30.0403 50.0136 30.0666 49.9824C30.0718 49.9762 30.0765 49.9696 30.0816 49.9632C30.1055 49.9332 30.1274 49.9022 30.1474 49.87C30.1512 49.8639 30.1553 49.8581 30.1589 49.8519C30.1816 49.8135 30.2012 49.7739 30.2182 49.7332C30.2194 49.7305 30.221 49.728 30.2221 49.7253L34.114 40.1522C34.1215 40.1338 34.1284 40.1151 34.1348 40.0963C34.3262 39.53 34.654 39.0196 35.0893 38.61L37.8534 36.0084C38.3281 35.5616 38.9401 35.327 39.5807 35.3484C40.1854 35.3684 40.7412 35.6186 41.1457 36.0531L41.2486 36.1636L41.2487 36.1637L41.2488 36.1639L44.6298 39.7953L44.63 39.7957L44.6304 39.7961L44.6306 39.7962L44.6312 39.797L44.632 39.7977L45.111 40.3122C45.3129 40.529 45.4178 40.8155 45.4068 41.1186C45.3951 41.4443 45.2538 41.7489 45.0093 41.9761L44.452 42.4939C44.0665 42.852 43.5186 42.9197 43.0932 42.7029C43.0821 42.6968 43.0705 42.6918 43.0591 42.6861C42.9582 42.6302 42.8668 42.5587 42.7882 42.4742L41.3848 40.9645C40.8833 40.425 40.198 40.1142 39.4554 40.0895C38.6944 40.0646 37.9653 40.3404 37.4051 40.8677C37.3014 40.9653 37.2206 41.0847 37.1686 41.2173C37.1166 41.3499 37.0947 41.4924 37.1045 41.6345C37.1091 41.7076 37.1124 41.7799 37.1143 41.8519C37.1153 41.8923 37.1152 41.9324 37.1155 41.9726C37.1157 42.0036 37.1162 42.0346 37.1158 42.0653C37.1153 42.1166 37.1135 42.1674 37.1116 42.2181C37.1109 42.2365 37.1104 42.2549 37.1095 42.2734C37.1067 42.3306 37.1027 42.3875 37.0981 42.4438L37.0962 42.466C37.0934 42.49 37.0915 42.5142 37.0904 42.5384C37.0006 43.4294 36.6786 44.2268 36.1159 44.9571C36.0388 45.0572 35.9821 45.1715 35.9492 45.2935C35.9162 45.4155 35.9076 45.5428 35.9239 45.6681C35.9402 45.7934 35.9809 45.9143 36.0439 46.0239C36.1069 46.1335 36.1908 46.2295 36.2909 46.3067C36.391 46.3838 36.5053 46.4404 36.6273 46.4734C36.7493 46.5063 36.8766 46.5149 37.0019 46.4987C37.1273 46.4824 37.2482 46.4417 37.3577 46.3787C37.4673 46.3157 37.5634 46.2318 37.6405 46.1317C37.9667 45.7103 38.2424 45.2522 38.462 44.7667L46.6474 55.9621L46.4521 56.1263C46.3263 56.1693 46.2108 56.238 46.113 56.328C45.4327 56.9539 44.6001 57.3757 43.7026 57.5499L37.6761 57.9831C37.4409 57.9999 37.2202 58.1026 37.0556 58.2714L35.5171 59.851C35.3423 60.0345 35.2468 60.2795 35.2515 60.5329C35.2562 60.7863 35.3606 61.0276 35.5422 61.2045C35.7237 61.3813 35.9677 61.4795 36.2211 61.4775C36.4745 61.4756 36.717 61.3737 36.8958 61.1941L38.1789 59.8766L43.8955 59.4659C43.9065 59.4651 43.9172 59.4629 43.928 59.4617C43.9523 59.8141 44.0614 60.1555 44.2458 60.4568L46.4875 64.1026C46.6546 64.3748 46.8786 64.6077 47.1441 64.7854C47.4095 64.9631 47.7102 65.0814 48.0256 65.1322C48.3409 65.1833 48.6636 65.1657 48.9715 65.0807C49.2794 64.9956 49.5653 64.8451 49.8098 64.6394L63.373 53.2322C63.6176 53.0267 63.8149 52.7708 63.9515 52.482C64.088 52.1933 64.1607 51.8784 64.1645 51.559C64.1686 51.2395 64.1036 50.923 63.9741 50.6309C63.8446 50.3388 63.6535 50.0782 63.414 49.8667ZM18.5301 36.2535C14.5844 37.7122 10.8578 39.0898 6.21714 33.5719L3.93434 30.8578C3.80621 30.7053 3.74511 30.5121 3.76251 30.3136C3.77991 30.1151 3.87363 29.9353 4.02651 29.8075C4.52022 29.3945 5.10661 29.1073 5.73554 28.9703C6.36446 28.8333 7.0172 28.8507 7.63795 29.0209L8.75853 29.3285C9.33964 29.4877 9.95025 29.5066 10.5401 29.3836C11.1299 29.2607 11.6821 28.9993 12.1512 28.6212L13.661 30.4163C15.5056 32.6097 17.787 34.3597 20.3505 35.6121C19.7403 35.8063 19.1325 36.0307 18.5301 36.2535ZM37.8256 31.7318L37.099 34.1567C36.8988 34.2911 36.7099 34.4416 36.5341 34.6067L35.6133 35.4733L33.0066 35.7848C25.9993 36.622 19.3175 34.1518 15.1338 29.1774L10.7292 23.9403L12.4487 22.4941C12.5455 22.4128 12.6252 22.3132 12.6834 22.201C12.7417 22.0889 12.7772 21.9663 12.7881 21.8404C12.799 21.7145 12.7849 21.5877 12.7468 21.4672C12.7086 21.3467 12.6471 21.2349 12.5658 21.1382C12.4845 21.0414 12.3849 20.9616 12.2727 20.9034C12.1605 20.8451 12.038 20.8095 11.9121 20.7987C11.7861 20.7878 11.6593 20.8018 11.5388 20.84C11.4183 20.8781 11.3065 20.9396 11.2098 21.021L8.75414 23.0862L8.75376 23.0865L8.75337 23.0868L8.14235 23.6008L6.9871 22.2273L28.9287 3.7736L30.084 5.14722L29.4739 5.6604L29.4726 5.6613L29.4714 5.66233L14.6809 18.1018C14.4855 18.2661 14.3634 18.5012 14.3415 18.7555C14.3195 19.0099 14.3995 19.2625 14.5638 19.4578C14.728 19.6532 14.9632 19.7753 15.2175 19.7972C15.4718 19.8192 15.7244 19.7392 15.9198 19.5749L29.9749 7.75371L34.3795 12.9908C38.5633 17.9654 39.8515 24.9715 37.8256 31.7318ZM53.9389 46.5519C54.1335 46.5586 54.3248 46.6038 54.5019 46.685C54.6789 46.7661 54.838 46.8815 54.9701 47.0246C55.1921 47.2643 55.3286 47.5706 55.3585 47.8959C55.3884 48.2212 55.31 48.5472 55.1354 48.8234L50.9422 52.3501C50.7192 52.3696 50.4947 52.3377 50.286 52.2568C50.0772 52.1759 49.8899 52.0483 49.7382 51.8836C49.1825 51.285 49.2173 50.3457 49.8156 49.7898L50.4231 49.2253C50.535 49.144 50.6421 49.0561 50.7437 48.9622L53.0905 46.782C53.3435 46.6213 53.6393 46.541 53.9389 46.5519ZM50.4852 42.4388C50.7645 42.2246 51.1099 42.1151 51.4616 42.1291C51.661 42.136 51.8572 42.1823 52.0386 42.2655C52.22 42.3486 52.3832 42.4669 52.5186 42.6136C53.0882 43.227 53.0527 44.1898 52.4393 44.7596L51.885 45.2746C51.7733 45.3555 51.6666 45.4431 51.5653 45.5368L49.2156 47.7197C48.9563 47.8865 48.6518 47.9693 48.3437 47.957C48.1442 47.9501 47.9481 47.9038 47.7667 47.8206C47.5852 47.7375 47.4221 47.6192 47.2867 47.4726C46.7544 46.8992 46.7509 46.0211 47.2534 45.4436C47.2862 45.4153 47.3189 45.3869 47.3507 45.3573L50.3564 42.565C50.4009 42.5237 50.4436 42.4817 50.4852 42.4388ZM45.3844 37.7815L43.3146 35.5583L43.7117 35.1892C44.009 34.9131 44.396 34.7719 44.8015 34.7842C45.001 34.791 45.1971 34.8374 45.3785 34.9205C45.56 35.0037 45.7231 35.122 45.8585 35.2686C46.4282 35.8821 46.3925 36.8449 45.7791 37.4148L45.3844 37.7815ZM45.762 43.9042L46.3194 43.3862C46.9408 42.809 47.2998 42.0283 47.3302 41.1885C47.3567 40.4592 47.1298 39.7624 46.6884 39.1992L46.9791 38.9292C47.1248 38.7927 47.2962 38.6867 47.4833 38.6171C47.6704 38.5476 47.8694 38.516 48.0689 38.5241C48.2683 38.531 48.4644 38.5774 48.6458 38.6605C48.8273 38.7437 48.9904 38.862 49.1258 39.0086C49.6583 39.5822 49.6615 40.4607 49.1586 41.0383C49.1259 41.0663 49.0936 41.0948 49.0618 41.1239L46.0561 43.9163C46.0117 43.9577 45.9686 44 45.9268 44.043C45.7021 44.2151 45.4331 44.3199 45.1512 44.3453C45.3716 44.2231 45.5767 44.075 45.762 43.9042ZM39.035 42.2892C39.0378 42.2167 39.0404 42.1442 39.0411 42.071C39.1528 42.0288 39.2719 42.0092 39.3913 42.0135C39.6179 42.021 39.8252 42.1142 39.9752 42.2754L41.3786 43.7851C41.5195 43.9367 41.6757 44.0734 41.8445 44.1931C41.9987 44.5558 42.2149 44.8888 42.4834 45.1774C43.1093 45.8517 43.9604 46.2418 44.8799 46.2758C44.9076 46.2767 44.935 46.277 44.9626 46.2773C44.9206 47.1696 45.222 48.0775 45.8762 48.7822C46.3451 49.2874 46.9404 49.633 47.5962 49.789C47.2131 50.9337 47.4501 52.2481 48.3275 53.1932C48.5696 53.4537 48.8514 53.6744 49.1624 53.847L48.1238 54.7204L39.035 42.2892ZM62.1341 51.7589L48.5708 63.1661C48.5383 63.1938 48.5001 63.214 48.4589 63.2254C48.4178 63.2368 48.3746 63.239 48.3325 63.232C48.2903 63.2254 48.25 63.2097 48.2146 63.1859C48.1791 63.1622 48.1492 63.1309 48.127 63.0944L45.8853 59.4485C45.8477 59.388 45.8332 59.316 45.8446 59.2457C45.8559 59.1754 45.8923 59.1115 45.9471 59.066L58.5437 48.4716L58.5442 48.4712C58.5977 48.4263 58.6654 48.4018 58.7352 48.402C58.8057 48.402 58.8761 48.4267 58.9317 48.4758L62.1395 51.3093C62.2282 51.3877 62.2404 51.4846 62.2398 51.5356C62.2396 51.5783 62.23 51.6204 62.2117 51.659C62.1935 51.6976 62.167 51.7317 62.1341 51.7589Z"
                          fill="white"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_7733_392">
                          <rect width="66" height="66" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="counter__item">
                    <h3 className="counter__item-title">
                      <span
                        className="odometer odometer-auto-theme"
                        data-count="100"
                      >
                        <div className="odometer-inside">
                          <span className="odometer-digit">100</span>
                        </div>
                      </span>
                      +
                    </h3>
                    <p className="odometer-text">Award Winning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Testimonials --> */}

        <h2 className="mt-5 pt-4 mb-4 text-center fw-bold h-font">
          TESTIMONIALS
        </h2>

        <div className="max-w-7xl p-4" style={{ marginLeft: "8%" }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            // autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="p-4 bg-white rounded-2xl shadow-md text-center">
                  <div style={{ display: "flex" }}>
                    <img
                      alt="user2"
                      className="w-16 h-16 rounded-full mb-3"
                      src=" http://localhost:3000/images/users/nature1.jfif"
                      style={{ marginRight: "17px", marginTop: "-3px" }}
                    />
                    <p style={{ marginTop: "12px" }}>{item?.name}</p>
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{
                      fontSize: "1.15rem",
                      color: "#473f3f",
                      fontWeight: "500",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {item?.review}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 align-left">
                    Rating: <RatingStars rating={item.rating} />
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* <!-- Reach us --> */}

        {/* location */}
        <h2 className="mt-5 pt-4 mb-4 text-center fw-bold h-font">
          Best Location in world
        </h2>

        <div className="container">
          <div className="row">
            {/* {locationDetails &&
              locationDetails.slice(0, 3).map((locationDetail, i) => {
                return (
                  <div className="col-lg-4 col-md-6 my-3" key={i}>
                    <div
                      className="card border-0 shadow"
                      style={{ margin: "auto" }}
                    >
                      <img
                        src={locationDetail.image || "/no-image.jpg"}
                        className="card-img-top"
                        alt={locationDetail.location}
                        style={{
                          height: "320px",
                          width: "410px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        className="card-body d-flex flex-column"
                      >
                        <h5 style={{ fontSize: "24px", lineHeight: "25px" }}>
                          {locationDetail.location}
                        </h5>
                      </div>
                    </div>
                  </div>
                );
              })} */}

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              // autoplay={{ delay: 3000 }}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {locationDetails &&
                locationDetails.map((locationDetail, i) => (
                  <SwiperSlide key={i}>
                    <div className="card border-0 shadow">
                      <img
                        src={locationDetail.image || "/no-image.jpg"}
                        className="card-img-top"
                        alt={locationDetail.location}
                        style={{
                          height: "320px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div className="card-body card-location-content">
                        <h5 style={{ fontSize: "24px", lineHeight: "25px" }}>
                          {locationDetail.location}
                        </h5>
                        <p className="card-location-desc" onClick= {() =>handleLocation(locationDetail.location)}>Show Hotels</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>

            {/* <div className="col-lg-12 text-center mt-5">
              <button
                onClick={goHotels}
                className="btn btn-sm btn-outline-dark rounded-0 fw-bold shadow-none"
                style={{ width: "35%" }}
              >
                More Locations &gt;&gt;&gt;
              </button>
            </div> */}
          </div>
        </div>

        <h2 className="mt-5 pt-4 mb-4 text-center fw-bold h-font">REACH US</h2>

        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 p-4 mb-lg-0 mb-3 bg-white rounded">
              <iframe
                className="w-100 rounded"
                height="320px"
                src={contacts[0]?.iframe}
                loading="lazy"
                allowFullScreen
                title="Google Maps"
              ></iframe>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="bg-white p-4 rounded mb-4">
                <h5>Call us</h5>
                <a
                  href="tel: +"
                  className="d-inline-block mb-2 text-decoration-none text-dark"
                >
                  <i className="bi bi-telephone-fill">{contacts[0]?.pn1}</i>
                </a>
                <br />
              </div>
              <div className="bg-white p-4 rounded mb-4">
                <h5>Follow us</h5>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-block mb-3 text-decoration-none"
                >
                  <span className="badge bg-light text-dark fs-6 p-2 d-flex align-items-center">
                    <FaFacebook
                      size={20}
                      color="#1877F2"
                      style={{ marginRight: "8px" }}
                    />
                    Facebook
                  </span>
                </a>
                <br />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-block mb-3 text-decoration-none"
                >
                  <span className="badge bg-light text-dark fs-6 p-2 d-flex align-items-center">
                    <FaInstagram
                      size={20}
                      color="#C13584"
                      style={{ marginRight: "8px" }}
                    />
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Password reset modal and code --> */}

        <div
          className="modal fade"
          id="recoveryModal"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          // tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form id="recovery-form">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <i className="bi bi-shield-lock fs-3 me-2"></i> Set up New
                    Password
                  </h5>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="pass"
                      required
                      className="form-control shadow-none"
                    />
                    <input type="hidden" name="email" />
                    <input type="hidden" name="token" />
                  </div>
                  <div className="mb-2 text-end">
                    <button
                      type="button"
                      className="btn shadow-none me-2"
                      data-bs-dismiss="modal"
                    >
                      CANCEL
                    </button>
                    <button type="submit" className="btn btn-dark shadow-none">
                      SUBMIT
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </FrontLayout>
  );
}
