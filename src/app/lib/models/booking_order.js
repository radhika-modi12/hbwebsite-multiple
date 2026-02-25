import mongoose, { Schema } from "mongoose";

const bookingOrderSchema = new Schema(
  {
    booking_id: String,
     hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels", // 👈 Must match the model name exactly
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCreds", // 👈 Must match the model name exactly
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms", // 👈 Must match the model name exactly
    },
    check_in: String,
    check_out: String,
    arrival: String,
    refund: String,
    booking_status: String,
    order_id: String,
    rate_review: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const bookingorders =
  mongoose.models.BookingOrders ||
  mongoose.model("BookingOrders", bookingOrderSchema);

export default bookingorders;
