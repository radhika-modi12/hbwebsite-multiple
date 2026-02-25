import React from "react";
import { Dialog } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function SuccessPayment({ isOpen, onClose, paymentDetails }) {
  const router = useRouter();
 
  const handleCloseAndRedirect = async() => {
    onClose();    
    router.push('/');
  };
  return (
    <Dialog open={isOpen} handler={() => {}} style={{ fontFamily: "inherit" }}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-green-600">
          Payment Successful
        </h2>
        <p className="text-center text-gray-700 mb-4">
          Thank you for your payment!
        </p>
        <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Payment ID:</strong> {paymentDetails.paymentId}
          </li>
          <li>
            <strong>Order ID:</strong> {paymentDetails.orderId}
          </li>
          <li>
            <strong>Amount:</strong> ₹{(paymentDetails.amount / 100).toFixed(2)}
          </li>
        </ul>
        <div className="flex justify-center">
          <button
            onClick={handleCloseAndRedirect}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
