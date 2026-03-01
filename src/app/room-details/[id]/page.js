"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import SliderContent from "../../../app/components/SliderContent";
import Arrows from "../../../app/components/Arrows";

export default function roomDetail({searchParams}) {
  // const searchParams = useSearchParams();
  const { id } = searchParams.get("room_id");
  const [roomFacilities, setRoomFacilities] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
  if (id) {
    loadRoomImages();
  }
}, [id]);

  const loadRoomImages = async () => {
    const res = await axios.get(`http://localhost:3000/api/roomImages/${id}`);
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 my-5 mb-4 px-4">
            <h2 className="fw-bold">{roomFacilities.room_id.name}</h2>
            <div style={{ fontSize: "14px" }}>
              <a
                href="index.php"
                className="text-secondary text-decoration-none"
              >
                HOME
              </a>
              <a
                href="rooms.php"
                className="text-secondary text-decoration-none"
              >
                ROOMS
              </a>
            </div>
          </div>

          <div className="col-lg-7 col-md-12 px-4">
            <div className="swiper swiper-container">
          <div className="swiper-wrapper">
            <div className="slider-container">
              <SliderContent
                activeIndex={activeIndex}
                sliderImage={sliderImage}
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
            {/* <div
              id="roomCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {/* <?php 

              $room_img = ROOMS_IMG_PATH."thumbnail.jpg";
              $img_q = mysqli_query($con,"SELECT * FROM `room_images` 
                WHERE `room_id`='$room_data[id]'");

              if(mysqli_num_rows($img_q)>0)
              {
                $active_class = 'active';

                while($img_res = mysqli_fetch_assoc($img_q))
                {
                  echo"
                    <div className='carousel-item $active_class'>
                      <img src='".ROOMS_IMG_PATH.$img_res['image']."' className='d-block w-100 rounded'>
                    </div>
                  ";
                  $active_className='';
                }

              }
              else{
                echo"<div className='carousel-item active'>
                  <img src='$room_img' className='d-block w-100'>
                </div>";
              }

            ?> */}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#roomCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#roomCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div> 
          </div>

          <div className="col-lg-5 col-md-12 px-4">
            <div className="card mb-4 border-0 shadow-sm rounded-3">
              <div className="card-body">
                {/* <?php 

              echo<<<price
                <h4>₹$room_data[price] per night</h4>
              price;

              $rating_q = "SELECT AVG(rating) AS `avg_rating` FROM `rating_review`
                WHERE `room_id`='$room_data[id]' ORDER BY `sr_no` DESC LIMIT 20";
  
              $rating_res = mysqli_query($con,$rating_q);
              $rating_fetch = mysqli_fetch_assoc($rating_res);
    
              $rating_data = "";
    
              if($rating_fetch['avg_rating']!=NULL)
              {
                for($i=0; $i < $rating_fetch['avg_rating']; $i++){
                  $rating_data .="<i className='bi bi-star-fill text-warning'></i> ";
                }
              }

              echo<<<rating
                <div className="mb-3">
                  $rating_data
                </div>
              rating;

              $fea_q = mysqli_query($con,"SELECT f.name FROM `features` f 
                INNER JOIN `room_features` rfea ON f.id = rfea.features_id 
                WHERE rfea.room_id = '$room_data[id]'");

              $features_data = "";
              while($fea_row = mysqli_fetch_assoc($fea_q)){
                $features_data .="<span className='badge rounded-pill bg-light text-dark text-wrap me-1 mb-1'>
                  $fea_row[name]
                </span>";
              }

              echo<<<features
                <div className="mb-3">
                  <h6 className="mb-1">Features</h6>
                  $features_data
                </div>
              features;

              $fac_q = mysqli_query($con,"SELECT f.name FROM `facilities` f 
                INNER JOIN `room_facilities` rfac ON f.id = rfac.facilities_id 
                WHERE rfac.room_id = '$room_data[id]'");

              $facilities_data = "";
              while($fac_row = mysqli_fetch_assoc($fac_q)){
                $facilities_data .="<span className='badge rounded-pill bg-light text-dark text-wrap me-1 mb-1'>
                  $fac_row[name]
                </span>";
              }
              
              echo<<<facilities
                <div className="mb-3">
                  <h6 className="mb-1">Facilities</h6>
                  $facilities_data
                </div>
              facilities;

              echo<<<guests
                <div className="mb-3">
                  <h6 className="mb-1">Guests</h6>
                  <span className="badge rounded-pill bg-light text-dark text-wrap">
                    $room_data[adult] Adults
                  </span>
                  <span className="badge rounded-pill bg-light text-dark text-wrap">
                    $room_data[children] Children
                  </span>
                </div>
              guests;

              echo<<<area
                <div className="mb-3">
                  <h6 className="mb-1">Area</h6>
                  <span className='badge rounded-pill bg-light text-dark text-wrap me-1 mb-1'>
                    $room_data[area] sq. ft.
                  </span>
                </div>
              area;

              if(!$settings_r['shutdown']){
                $login=0;
                if(isset($_SESSION['login']) && $_SESSION['login']==true){
                  $login=1;
                }
                echo<<<book
                  <button onclick='checkLoginToBook($login,$room_data[id])' className="btn w-100 text-white custom-bg shadow-none mb-1">Book Now</button>
                book;
              }

            ?> */}
              </div>
            </div>
          </div>

          <div className="col-12 mt-4 px-4">
            <div className="mb-5">
              <h5>Description</h5>
              <p>{/* <?php echo $room_data['description'] ?> */}</p>
            </div>

            <div>
              <h5 className="mb-3">Reviews & Ratings</h5>

              {/* <?php
            $review_q = "SELECT rr.*,uc.name AS uname, uc.profile, r.name AS rname FROM `rating_review` rr
              INNER JOIN `user_cred` uc ON rr.user_id = uc.id
              INNER JOIN `rooms` r ON rr.room_id = r.id
              WHERE rr.room_id = '$room_data[id]'
              ORDER BY `sr_no` DESC LIMIT 15";

            $review_res = mysqli_query($con,$review_q);
            $img_path = USERS_IMG_PATH;

            if(mysqli_num_rows($review_res)==0){
              echo 'No reviews yet!';
            }
            else
            {
              while($row = mysqli_fetch_assoc($review_res))
              {
                $stars = "<i className='bi bi-star-fill text-warning'></i> ";
                for($i=1; $i<$row['rating']; $i++){
                  $stars .= " <i className='bi bi-star-fill text-warning'></i>";
                }

                echo<<<reviews
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <img src="$img_path$row[profile]" className="rounded-circle" loading="lazy" width="30px">
                      <h6 className="m-0 ms-2">$row[uname]</h6>
                    </div>
                    <p className="mb-1">
                      $row[review]
                    </p>
                    <div>
                      $stars
                    </div>
                  </div>
                reviews;
              }
            }
          ?> */}
            </div>
            </div>
    </>
  );
}
