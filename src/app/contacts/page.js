"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FrontLayout from "../FrontLayout";
export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const intialState = { name: "", email: "", subject: "", messsge: "" };
  const [contactData, setContactData] = useState(intialState);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const res = await axios.get(" http://localhost:3000/api/contacts");
    setContacts(res.data.list);
  };

  const handleChange = ({ target }) => {
    const name = target && target.name;
    const value = target && target.value;
    setContactData({ ...contactData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    {
      const res = await axios.post(
        "http://localhost:3000/api/userQueries",
        contactData
      );
      if (res) {
        setContactData(intialState);
      }
    }
  };
  return (
    <FrontLayout>
    <>
      <div className="my-5 px-4" style={{ display: "none" }}>
        <h2 className="fw-bold h-font text-center">CONTACT US</h2>
        <div className="h-line bg-dark"></div>
        <p className="text-center mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          incidunt odio quos <br /> dolore commodi repudiandae tenetur
          consequuntur et similique asperiores.
        </p>
      </div>

      <div className="container">
        <div className="row" style={{ marginTop: "50px" }}>
          <div className="col-lg-6 col-md-6 mb-5 px-4">
            <div className="bg-white rounded shadow p-4 mt-1">
              <iframe
                className="w-100 rounded mb-4"
                height="320px"
                src={contacts[0]?.iframe}
                loading="lazy"
              ></iframe>
              <h5>Address</h5>
              {contacts[0]?.address}
              <a
                href="#"
                target="_blank"
                className="d-inline-block text-decoration-none text-dark mb-2"
              >
                <i className="bi bi-geo-alt-fill"></i>
              </a>

              <h5 className="mt-4">Call us</h5>

              <a
                href={`tel:+${contacts[0]?.pn1}`}
                className="d-inline-block text-decoration-none text-dark mb-2"
              >
                <i className="bi bi-telephone-fill me-2"></i> +
                {contacts[0]?.pn1}
              </a>
              <br />
              <a
                href={`tel:+${contacts[0]?.pn2}`}
                className="d-inline-block text-decoration-none text-dark mb-2"
              >
                <i className="bi bi-telephone-fill me-2"></i> +
                {contacts[0]?.pn2}
              </a>
              <h5 className="mt-4">Email</h5>
              <a
                href={`mailto:${contacts[0]?.email}`}
                className="d-inline-block text-decoration-none text-dark"
              >
                <i className="bi bi-envelope-fill">{contacts[0]?.email}</i>
              </a>

              <h5 className="mt-4">Follow us</h5>
              <a
                href={`mailto:${contacts[0]?.tw}`}
                className="d-inline-block text-decoration-none text-dark"
              >
                <i className="bi bi-twitter me-1">{contacts[0]?.tw}</i>
              </a>
              <a href="#" className="d-inline-block text-dark fs-5 me-2">
                <i className="bi bi-facebook me-1"></i>
              </a>
              <a href="#" className="d-inline-block text-dark fs-5">
                <i className="bi bi-instagram me-1"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 px-4">
            <div className="bg-white rounded shadow p-4">
              <form method="POST" onSubmit={(e) => handleSubmit(e)}>
                <h5>Send a message</h5>
                <div className="mt-3">
                  <label className="form-label" style={{ fontWeight: "500" }}>
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control shadow-none"
                    value={contactData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3">
                  <label className="form-label" style={{ fontWeight: "500" }}>
                    Email
                  </label>
                  <input
                    name="email"
                    required
                    type="email"
                    className="form-control shadow-none"
                    value={contactData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3">
                  <label className="form-label" style={{ fontWeight: "500" }}>
                    Subject
                  </label>
                  <input
                    name="subject"
                    required
                    type="text"
                    className="form-control shadow-none"
                    value={contactData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3">
                  <label className="form-label" style={{ fontWeight: "500" }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    className="form-control shadow-none"
                    value={contactData.message}
                    onChange={handleChange}
                    rows="5"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  name="send"
                  className="btn text-white custom-bg mt-3"
                  style={{ background: "#2f2f6e" }}
                >
                  SEND
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
    </FrontLayout>
  );
}
