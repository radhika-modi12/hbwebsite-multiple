"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import AdminLayout from "../../components/AdminLayout"; // Adjust the path as needed

export default function viewBookingOrder() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOrders, setBookingOrders] = useState([]);
  const [rawData, setRawData] = useState({});
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel_id");

  useEffect(() => {
    loadBookingOrders();
  }, []);

  const loadBookingOrders = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/bookingOrders/${hotelId}`
    );
    setBookingOrders(res.data.list);
  };

  const cancelBookingModal = (raw) => {
    setIsOpen(true);
    setRawData(raw);
  };

  const cancelBooking = async (raw) => {
    const booking_detail = {
      id: raw?._id,
      booking_id: raw?.booking_id,
      hotel_id: raw?.hotel_id,
      user_id: raw?.user_id,
      check_in: raw?.check_in,
      check_out: raw?.check_out,
      arrival: raw?.arrival,
      refund: raw?.refund,
      booking_status: "cancel",
      rate_review: raw?.rate_review,
    };
    const res = await axios.put(
      `http://localhost:3000/api/bookingOrders`,
      booking_detail
    );
    if (res) {
      setIsOpen(false);
      const room_price = raw?.room?.price / 100;
      const percentage = 20;
      const result = (percentage / 100) * room_price;
      const booking_info = {
        id: raw?._id,
        booking_id: raw?.booking_id,
        hotel_name: raw?.hotel?.name,
        user_name: raw?.user?.name,
        user_email: raw?.user?.email,
        user_phone_number: raw?.user?.phonenum,
        room_name: raw?.room?.name,
        room_price: result * 100,
        check_in: raw?.check_in,
        check_out: raw?.check_out,
      };
      // console.log({ booking_info });
      sendCancelBookingEmail(booking_info);
      loadBookingOrders();
    }
  };

  const sendCancelBookingEmail = async (bookingData) => {
    const response = await fetch("/api/send-cancel-booking-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to send booking email");
    }
  };

  return (
    <AdminLayout>
      <div className="content-header mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          View Booking Orders
        </h1>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-end mb-4">
          {/* <button className="btn btn-primary" onClick={handleAddHotel}>
            Add Hotel
          </button> */}
        </div>

        <div className="table-responsive text-nowrap">
          <table id="example" className="table table-striped">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Id</th>
                <th className="p-2 border">Hotel Name</th>
                <th className="p-2 border">User Name</th>
                <th className="p-2 border">Room Name</th>
                <th className="p-2 border">Check In</th>
                <th className="p-2 border">Check Out</th>
                <th className="p-2 border">Booking Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingOrders.length > 0 ? (
                bookingOrders.map((raw, index) => (
                  <tr key={raw?._id}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{raw?.hotel?.name}</td>
                    <td className="p-2 border">{raw?.user?.name}</td>
                    <td className="p-2 border">{raw?.room?.name}</td>
                    <td className="p-2 border">{raw?.check_in}</td>
                    <td className="p-2 border">{raw?.check_out}</td>
                    <td className="p-2 border">{raw?.booking_status}</td>
                    <td>
                      <button
                        className="booking-cancel-btn"
                        onClick={() => cancelBookingModal(raw)}
                      >
                        cancel booking
                      </button>
                      {isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          <div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4">
                              Confirm Cancellation
                            </h2>
                            <p className="mb-4">
                              Are you sure you want to cancel this booking?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded mr-10"
                              >
                                Close
                              </button>
                              <button
                                onClick={() => cancelBooking(rawData)}
                                // disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                              >
                                Yes, Cancel
                                {/* {loading ? "Cancelling..." : "Yes, Cancel"} */}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-2 border">
                    No booking orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
