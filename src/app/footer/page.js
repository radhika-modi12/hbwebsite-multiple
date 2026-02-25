import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
    
      <div className="container-fluid mt-5 footer-bg" style={{padding: "70px 0px 50px 100px"}}>
        <div className="row">
          <div className="col-lg-4 p-4 footer-row">
            {/* <h3 className="h-font fw-bold fs-3 mb-2 text-white">Setting</h3>
            <p className="text-white">setting_about</p> */}
            <h5 className="text-white">
              Sign up to Privates Weekly Newsletter to Get The Latest Updates.
            </h5>
            <div className="footer__widget-from mt-25">
              <input
                className="book__form-control book__form-control-2 text-white"
                type="email"
                name="email"
                placeholder="Your email..."
              />
              <Link className="rr-btn-2" href="/contacts">
                Subscribe <i className="fa-solid fa-plus"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-2 p-4">
            <h5 className="mb-3 text-white">Quick Links</h5>
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/"
            >
              Home
            </Link>
            <br />
            <Link 
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/hotels"
            >
              Hotels
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/facilities"
            >
              Facilities
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/contacts"
            >
              Contact us
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/about"
            >
              About
            </Link>
            <br />
            {/* <a href="index.php" className="d-inline-block mb-2 text-dark text-decoration-none">Home</a> <br/>
      <a href="rooms.php" className="d-inline-block mb-2 text-dark text-decoration-none">Rooms</a> <br/>
      <a href="facilities.php" className="d-inline-block mb-2 text-dark text-decoration-none">Facilities</a> <br/>
      <a href="contact.php" className="d-inline-block mb-2 text-dark text-decoration-none">Contact us</a> <br/>
      <a href="about.php" className="d-inline-block mb-2 text-dark text-decoration-none">About</a> */}
          </div>
          <div className="col-lg-2 p-4">
            <h5 className="mb-3 text-white">Services</h5>
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/"
            >
              Rooms
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/hotels"
            >
              Restaurants
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/facilities"
            >
              Spa & Salon
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/contacts"
            >
              Contact us
            </Link>
            <br />
            <Link
              className="d-inline-block mb-2 text-dark text-decoration-none text-white"
              href="/about"
            >
              About
            </Link>
            <br />
            {/* <a href="index.php" className="d-inline-block mb-2 text-dark text-decoration-none">Home</a> <br/>
      <a href="rooms.php" className="d-inline-block mb-2 text-dark text-decoration-none">Rooms</a> <br/>
      <a href="facilities.php" className="d-inline-block mb-2 text-dark text-decoration-none">Facilities</a> <br/>
      <a href="contact.php" className="d-inline-block mb-2 text-dark text-decoration-none">Contact us</a> <br/>
      <a href="about.php" className="d-inline-block mb-2 text-dark text-decoration-none">About</a> */}
          </div>
          <div className="col-lg-3 p-4">
            <h5 className="text-white">Contacts</h5>
            <h6 className="text-white">Address</h6>
            <p className="text-white">6391 Elgin St. Celina </p>
            <h6 className="text-white">Phone</h6>
            <p className="text-white">8723823567</p>
            <h6 className="text-white">Email</h6>
            <p className="text-white">test@gmail.com</p>
            {/* <h5 className="mb-3">Follow us</h5>
            <a
              href="<?php echo $contact_r['fb'] ?>"
              className="d-inline-block text-dark text-decoration-none mb-2"
            >
              <i className="bi bi-facebook me-1"></i> Facebook
            </a>
            <br />
            <a
              href="<?php echo $contact_r['insta'] ?>"
              className="d-inline-block text-dark text-decoration-none"
            >
              <i className="bi bi-instagram me-1"></i> Instagram
            </a>
            <br /> */}
          </div>
        </div>
      </div>

      <h6 className="text-center footer-bg text-white p-3 m-0">
        © Hotel Booking System 2026 | All Rights Reserved
      </h6>
    </>
  );
}
