"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import "../../../public/css/common.css";
import SliderContent from "../../app/components/SliderContent";
import "../../app/components/slider.css";
import Arrows from "../../app/components/Arrows";
import Dots from "../../app/components/Dots";
import { useRouter } from "next/navigation";
import FrontLayout from "../FrontLayout";
import { toast } from "react-hot-toast";

export default function roomDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const room_id = searchParams.get("roomId");
  const [roomFacilities, setRoomFacilities] = useState({});
  const [roomImages, setRoomImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const len = roomImages.length - 1;
  const user_data = JSON.parse(localStorage.getItem("user-details"));
  const hasImages = roomImages.length > 0;
  useEffect(() => {
    loadRoomFacilities();
  }, []);
  useEffect(() => {
    if (room_id) {
      loadRoomImages();
    }
  }, [room_id]);

  const loadRoomFacilities = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/roomFacilities/${room_id}`
    );
    const facility_detail = res.data.groupedFacilities[0];
    const feature_list = await axios.get(
      "http://localhost:3000/api/roomFeatures"
    );
    const feature_detail = feature_list.data.list;
    const data = feature_detail.filter(
      (element) => element?.room_id?._id == room_id
    );
    const room_details = {
      ...facility_detail,
      room_features: data, // Attach matched features
    };
    setRoomFacilities(room_details);
  };
  const loadRoomImages = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/roomImages/${room_id}`
    );
    const image_arr = [];
    res.data.groupedImages.map((element) => {
      image_arr.push({ title: "", description: "", urls: element.image });
    });
    setRoomImages(image_arr);
  };

  const goRoomBook = (price) => {
    if (user_data == null) {
      toast.success("user booking after login");
    } else {
      localStorage.setItem("room_price", price);
      return router.push("confirm-booking");
    }
  };

  return (
    <FrontLayout>
      <>
        <div className="container">
          {hasImages ? (
            <div className="row">
              <div className="col-12 my-5 mb-4 px-4">
                <h2 className="fw-bold">{roomFacilities?.room?.name}</h2>
              </div>

              <div className="col-lg-7 col-md-12 px-4">
                <div className="swiper swiper-container">
                  <div className="swiper-wrapper">
                    <div className="slider-container">
                      <SliderContent
                        activeIndex={activeIndex}
                        sliderImage={roomImages}
                      />
                      <Arrows
                        prevSlide={() =>
                          setActiveIndex(
                            activeIndex < 1 ? len : activeIndex - 1
                          )
                        }
                        nextSlide={() =>
                          setActiveIndex(
                            activeIndex === len ? 0 : activeIndex + 1
                          )
                        }
                      />
                      <Dots
                        activeIndex={activeIndex}
                        sliderImage={roomImages}
                        onclick={(index) => setActiveIndex(index)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-md-12 px-4">
                <div className="card mb-4 border-0 shadow-sm rounded-3">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">
                      ₹{roomFacilities?.room?.price}{" "}
                      <small className="text-muted">per night</small>
                    </h4>

                    <p className="fw-semibold">Features</p>
                    <div className="mb-3">
                      {roomFacilities?.room_features?.map((element, i) => (
                        <span
                          key={i}
                          className="badge rounded-pill bg-light text-dark text-wrap me-1 mb-1"
                        >
                          {element.feature_id.name}
                        </span>
                      ))}
                    </div>

                    <p className="fw-semibold">Facilities</p>
                    <div className="mb-3">
                      {roomFacilities?.facilities?.map((element, i) => (
                        <span
                          key={i}
                          className="badge rounded-pill bg-light text-dark text-wrap me-1 mb-1"
                        >
                          {element.name}
                        </span>
                      ))}
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-1 fw-semibold">Guests</h6>
                      <span className="badge rounded-pill bg-light text-dark text-wrap me-2">
                        {roomFacilities?.room?.adult} Adults
                      </span>
                      <span className="badge rounded-pill bg-light text-dark text-wrap">
                        {roomFacilities?.room?.children} Children
                      </span>
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-1 fw-semibold">Area</h6>
                      <span className="badge rounded-pill bg-light text-dark text-wrap">
                        {roomFacilities?.room?.area} sq.ft
                      </span>
                    </div>

                    <button
                      className="btn w-100 text-white bg-primary shadow-sm mb-1"
                      onClick={() =>
                        goRoomBook(roomFacilities?.room?.price * 100)
                      }
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-12 mt-4 px-4">
                <div className="mb-5">
                  <h5>Description</h5>
                  <p>{roomFacilities?.room?.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="room-not-found">
              <p>Room Images not found</p>
            </div>
          )}
        </div>
      </>
    </FrontLayout>
  );
}
