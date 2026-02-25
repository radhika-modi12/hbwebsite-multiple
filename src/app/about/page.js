"use client";
import React, { useEffect, useState } from "react";
import "../../../public/css/common.css";
import "../../app/components/slider.css";
import axios from "axios";
import FrontLayout from "../FrontLayout";

export default function About() {
  const [teamMember, setTeamMember] = useState([]);
  useEffect(() => {
    loadTeamMember();
  }, []);

  const loadTeamMember = async () => {
     try {
    const res = await axios.get("/api/teamMemberDetails");
    setTeamMember(res.data.list);
  } catch (error) {
    console.error(error);
  }
  };
  return (
    <FrontLayout>
      <>
        <div className="my-5 px-4">
          <h2 className="fw-bold h-font text-center">ABOUT US</h2>
          <div className="h-line bg-dark"></div>
          <p className="text-center mt-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            incidunt odio quos <br /> dolore commodi repudiandae tenetur
            consequuntur et similique asperiores.
          </p>
        </div>

        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6 col-md-5 mb-4 order-lg-1 order-md-1 order-2">
              <h3 className="mb-3">Lorem ipsum dolor sit</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                minima sapiente aliquam sed officia nostrum fuga? Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Omnis minima
                sapiente aliquam sed officia nostrum fuga?
              </p>
            </div>
            <div className="col-lg-5 col-md-5 mb-4 order-lg-2 order-md-2 order-1">
              <img src="images/about/about.jpg" className="w-100" />
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4 px-4">
              <div className="bg-white rounded shadow p-4 border-top border-4 text-center box">
                <img src="images/about/hotel.svg" width="70px" />
                <h4 className="mt-3">100+ ROOMS</h4>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4 px-4">
              <div className="bg-white rounded shadow p-4 border-top border-4 text-center box">
                <img src="images/about/customers.svg" width="70px" />
                <h4 className="mt-3">200+ CUSTOMERS</h4>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4 px-4">
              <div className="bg-white rounded shadow p-4 border-top border-4 text-center box">
                <img src="images/about/rating.svg" width="70px" />
                <h4 className="mt-3">150+ REVIEWS</h4>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4 px-4">
              <div className="bg-white rounded shadow p-4 border-top border-4 text-center box">
                <img src="images/about/staff.svg" width="70px" />
                <h4 className="mt-3">200+ STAFFS</h4>
              </div>
            </div>
          </div>
        </div>

        <h3 className="my-5 fw-bold h-font text-center">MANAGEMENT TEAM</h3>

        <div className="container px-4">
          <div className="row">
            {teamMember.map((member, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <img
                  src={member.image}
                  className="w-100"
                  alt={member.name}
                  style={{ width: "500px", height: "300px" }}
                />
                <h5 className="mt-2 text-center">{member.name}</h5>
              </div>
            ))}
          </div>
        </div>
      </>
    </FrontLayout>
  );
}
