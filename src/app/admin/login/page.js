"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Login(props) {
  const router = useRouter();
  // const [hotels, setHotels] = useState([]);
  const [user, setUser] = useState({});
  // useEffect(() => {
  //   loadHotels();
  // }, []);

  // const loadHotels = async () => {
  //   const res = await axios.get("http://localhost:3000/api/hotels");
  //   setHotels(res.data.list);
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user_list = { username: user.username, password: user.password };
      const res = await axios.post(
        "http://localhost:3000/api/users/admin_login",
        user_list
      );
      if (res) {
        console.log("res1",res);
        localStorage.setItem("user_details",JSON.stringify(res.data.userDetail))
        toast.success("user login Success");
        return router.push("/admin");
      } else {
        toast.error("Server Error");
      }
    } catch (err) {
      console.log("Caught error:", err);

      if (err.response) {
        console.log("Server responded with error:", err.response.data);
        toast.error(err.response.data?.error || "Server Error");
      } else if (err.request) {
        console.log("No response received:", err.request);
        toast.error("No response from server");
      } else {
        console.log("Unexpected error:", err.message);
        toast.error("Error: " + err.message);
      }
    }
  };
  const handleChange = ({ target }) => {
    const name = target && target.name;
    const value = target && target.value;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      <div className="container login-body" style={{ marginLeft: "30%" }}>
        <div
          className="login-form text-center rounded bg-white shadow overflow-hidden"
          style={{ width: "80%" }}
        >
          <form>
            <h4 className="bg-dark text-white py-3">ADMIN LOGIN PANEL</h4>
            <div className="p-4">
              <div className="mb-3">
                <input
                  name="username"
                  required
                  type="text"
                  className="form-control shadow-none text-left"
                  onChange={handleChange}
                  placeholder="username"
                />
              </div>
              <div className="mb-4">
                <input
                  name="password"
                  required
                  type="password"
                  className="form-control shadow-none text-left"
                  onChange={handleChange}
                  placeholder="password"
                />
              </div>
              <button
                name="login"
                type="button"
                className="btn custom-bg shadow-none admin-login-btn"
                onClick={(e) => handleLogin(e)}
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
