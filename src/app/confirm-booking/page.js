"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FrontLayout from "../FrontLayout";
import SuccessPayment from "../components/Modals/SuccessPayment";
import ErrorPayment from "../components/Modals/ErrorPayment";
import { QRCodeCanvas } from "qrcode.react";

export default function ConfirmBooking() {
  const [days, setDays] = useState(0);
  const user_data = JSON.parse(localStorage.getItem("user-details"));
  const room_detail = JSON.parse(localStorage.getItem("room_detail"));
  const [booking, setBooking] = useState(room_detail);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    const { checkin, checkout } = room_detail;
    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      const timeDiff = checkoutDate - checkinDate;
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      setDays(diffDays > 0 ? diffDays : 0); // Avoid negative values
    } else {
      setDays(0);
    }
  }, []);

  const user_info = user_data?.data?.userDetail;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const sendBookingEmail = async (bookingData) => {
    const response = await fetch("/api/send-booking-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to send booking email");
    }
  };
  // Payment button handler
  const handlePayment = async (e) => {
    e.preventDefault();
    const room_price = room_detail?.price / 100;
    const percentage = 20;
    const result = (percentage / 100) * room_price;
    const booking_data = {
      bookingId: booking?._id ? booking?._id : 0,
      name: booking?.name ? booking?.name : user_info?.name,
      email: booking?.email ? booking?.email : user_info?.email,
      phonenum: booking?.phonenum ? booking?.phonenum : user_info?.phonenum,
      address: booking?.address ? booking?.address : user_info?.address,
      checkin: booking?.checkin,
      checkout: booking.checkout,
      amount: result * 100,
      room_id: room_detail?.room_id,
      hotel_id: room_detail?.hotel_id,
      hotel_name: room_detail?.hotel_name,
      days: days,
    };
    localStorage.setItem("booking_detail", JSON.stringify(booking_data));

    try {
//    await axios.get("http://localhost:3000/api/hotels");
   
//   const formData = new FormData();
//   formData.append("id", room_detail?.hotel_id);
//   formData.append("room", Number(room_detail.room) - 1);

//  await axios.put(
//   "http://localhost:3000/api/hotels",
//   formData
// );

      const booking_info = {
        user_id: user_info?._id,
        room_id: room_detail?.room_id,
        hotel_id: room_detail?.hotel_id,
        quantity: room_detail?.quantity,
        check_in: booking?.checkin,
        check_out: booking?.checkout,
        arrival: 1,
        refund: 1,
        booking_status: "complete",
        order_id: 11,
        rate_review: 1,
      };
      await axios.post(
        "http://localhost:3000/api/bookingOrders",
        booking_info,
      );
    } catch (error) {
      // res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  };

  //   const handlePayment = async (e) => {
  //   e.preventDefault();
  //   const room_price = room_detail?.price / 100;
  //   const percentage = 20;
  //   const result = (percentage / 100) * room_price;
  //   const booking_data = {
  //     bookingId: booking?._id ? booking?._id : 0,
  //     name: booking?.name ? booking?.name : user_info?.name,
  //     email: booking?.email ? booking?.email : user_info?.email,
  //     phonenum: booking?.phonenum ? booking?.phonenum : user_info?.phonenum,
  //     address: booking?.address ? booking?.address : user_info?.address,
  //     checkin: booking?.checkin,
  //     checkout: booking.checkout,
  //     amount: result * 100,
  //     room_id: room_detail?.room_id,
  //     hotel_id: room_detail?.hotel_id,
  //     hotel_name: room_detail?.hotel_name,
  //     days: days,
  //   };
  //   localStorage.setItem("booking_detail", JSON.stringify(booking_data));

  //   const res = await loadRazorpayScript();
  //   if (!res) {
  //     alert("Failed to load Razorpay SDK. Check internet.");
  //     return;
  //   }
  //   try {
  //     const response = await axios.post(
  //       "/api/razorpay/create-order",
  //       booking_data,
  //     );

  //     const order = response.data.order;

  //     const options = {
  //       key: "rzp_live_HjOxVq1GThuok4", // Replace with your key_id
  //       amount: room_detail?.price,
  //       currency: "INR",
  //       name: "Hotel Booking",
  //       description: "Test Transaction",
  //       order_id: order.id,
  //       handler: async function (response) {
  //         alert("Payment Successful!");
  //         const paymentInfo = {
  //           paymentId: response.razorpay_payment_id,
  //           orderId: response.razorpay_order_id,
  //           amount: order?.order?.amount,
  //           status: response.razorpay_signature,
  //         };
  //         setPaymentDetails(paymentInfo);
  //         const booking_info = {
  //           user_id: user_info?._id,
  //           room_id: room_detail?.room_id,
  //           hotel_id: room_detail?.hotel_id,
  //           check_in: booking?.checkin,
  //           check_out: booking?.checkout,
  //           arrival: 1,
  //           refund: 1,
  //           booking_status: "complete",
  //           order_id: order._id,
  //           rate_review: 1,
  //         };
  //         await axios.post(
  //           "http://localhost:3000/api/bookingOrders",
  //           booking_info,
  //         );
  //         sendBookingEmail(booking_data);

  //         setModalOpen(true);
  //       },
  //       prefill: {
  //         name: "test",
  //         email: "test@example.com",
  //         contact: "9999999999",
  //       },
  //       notes: {
  //         address: "Corporate Office",
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     const booking_info = {
  //       user_id: user_info?._id,
  //       room_id: room_detail?.room_id,
  //       hotel_id: room_detail?.hotel_id,
  //       check_in: booking?.checkin,
  //       check_out: booking?.checkout,
  //       arrival: 1,
  //       refund: 1,
  //       booking_status: "complete",
  //       order_id: order._id,
  //       rate_review: 1,
  //     };
  //     localStorage.setItem("booking_info", JSON.stringify(booking_info));

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (error) {
  //     res.status(500).json({ message: "Internal Server Error!" });
  //     console.log(error);
  //   }
  // };

  const handleChange = ({ target }) => {
    const name = target && target.name;
    const value = target && target.value;
    const updatedBooking = { ...booking, [name]: value };
    setBooking(updatedBooking);
    // Calculate the number of days if both dates are selected

    const { checkin, checkout } = updatedBooking;
    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      const timeDiff = checkoutDate - checkinDate;
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      setDays(diffDays > 0 ? diffDays : 0); // Avoid negative values
    } else {
      setDays(0);
    }
  };

  const totalPay = (room_detail?.price / 100) * days;
  return (
    <FrontLayout>
      <>
        <div className="container">
          <div className="row">
            <div className="col-12 my-5 mb-4 px-4">
              <h2 className="fw-bold">CONFIRM BOOKING</h2>
              {/* <div style={{ fontSize: "14px" }}>
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
              <a href="#" className="text-secondary text-decoration-none">
                CONFIRM
              </a>
            </div> */}
            </div>
            <div className="col-lg-6 col-md-12 px-4">
              <div className="card p-3 shadow-sm rounded">
                <img
                  src={room_detail?.image}
                  className="img-fluid rounded mb-3"
                  style={{ height: "482px", width: "unset!important" }}
                />
                <h5>{room_detail?.name}</h5>
                <h6>₹{room_detail?.price / 100} per night</h6>
              </div>
            </div>
            <div className="col-lg-5 col-md-12 px-4">
              <div
                className="card mb-4 border-0 shadow-sm rounded-3"
                style={{ marginTop: "20px" }}
              >
                <div className="card-body">
                  <form
                    method="POST"
                    id="booking_form"
                    onSubmit={() => handlePayment()}
                  >
                    <h6 className="mb-3">BOOKING DETAILS</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                          name="name"
                          type="text"
                          className="form-control shadow-none"
                          required
                          value={user_info?.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          name="phonenum"
                          type="number"
                          className="form-control shadow-none"
                          maxLength={10}
                          value={user_info?.phonenum}
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                          name="address"
                          className="form-control shadow-none"
                          rows="1"
                          required
                          value={user_info?.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Check-in</label>
                        <input
                          name="checkin"
                          type="date"
                          className="form-control shadow-none"
                          value={booking?.checkin}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label className="form-label">Check-out</label>
                        <input
                          name="checkout"
                          type="date"
                          className="form-control shadow-none"
                          required
                          value={booking?.checkout}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <div
                          className="spinner-border text-info mb-3 d-none"
                          id="info_loader"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        {days} per night
                        <br />
                        Total amount of pay: ₹{totalPay}
                        <br />
                        booking time pay room amount is ₹{0.2 * totalPay}
                        <br />
                        {/* <QRCodeCanvas value={upiUrl} size={220} /> */}
                        <button
                          name="pay_now"
                          className="pay-btn btn custom-bg shadow-none mb-1"
                          onClick={(e) => handlePayment(e)}
                        >
                          Pay Now
                        </button>
                        {/* <a href={`upi://pay?pa=9106914402@axisbank&pn=MyApp&am=${totalPay}&cu=INR`}>
                          Pay Now
                        </a> */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <SuccessPayment
        isOpen={isModalOpen}
        onClose={() => setModalOpen(!isModalOpen)}
        paymentDetails={paymentDetails}
      />
      {/* <ErrorPayment
        isOpen={isErrorModalOpen}
        onClose={() => setErrorModalOpen(!isErrorModalOpen)}
        errorDetails={errorDetails}
      /> */}
    </FrontLayout>
  );
}
