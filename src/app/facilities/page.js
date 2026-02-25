"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FrontLayout from "../FrontLayout";
export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    const res = await axios.get("http://localhost:3000/api/facilities");
    setFacilities(res.data.list);
  };
  return (
    <FrontLayout>
    <>
      {/* // <p>Facilities page</p> */}
      <div className="my-5 px-4">
        <h2 className="fw-bold h-font text-center">OUR FACILITIES</h2>
        <div className="h-line bg-dark"></div>
        <p className="text-center mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          incidunt odio quos <br /> dolore commodi repudiandae tenetur
          consequuntur et similique asperiores.
        </p>
      </div>

      <div className="container">
        <div className="row">
          {/* <?php 
        $res = selectAll('facilities');
        $path = FACILITIES_IMG_PATH;

        while($row = mysqli_fetch_assoc($res)){
          echo<<<data */}
          {facilities &&
            facilities.map((facility, i) => {
              return (
                <div className="col-lg-4 col-md-6 mb-5 px-4">
                  <div className="bg-white rounded shadow p-4 border-top border-4 border-dark pop">
                    <div className="d-flex align-items-center mb-2">
                      <img src={facility.icon} width="40px" />
                      <h5 className="m-0 ms-3">{facility.name}</h5>
                    </div>
                    <p>{facility.description}</p>
                  </div>
                </div>
              );
            })}
          {/* data;
        }
      ?> */}
        </div>
      </div>
    </>
    </FrontLayout>
  );
}
