import { Dialog } from "@material-tailwind/react";
import React from "react";

export default function ErrorPayment({ isOpen, onClose, errorDetails }) {
  return (
    <Dialog open={isOpen} handler={() => {}} style={{ fontFamily: "inherit" }}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-red-600">
          Payment Failed
        </h2>
        <p className="text-center text-gray-700 mb-4">
          Your payment could not be processed.
        </p>
        <h3 className="text-lg font-semibold mb-2">Error Details</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Payment ID:</strong> {errorDetails.paymentId}
          </li>
          <li>
            <strong>Order ID:</strong> {errorDetails.orderId}
          </li>
          <li>
            <strong>Error Message:</strong> {errorDetails.message}
          </li>
        </ul>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
