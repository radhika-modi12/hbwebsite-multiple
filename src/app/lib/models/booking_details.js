import mongoose, { Schema } from "mongoose";

const bookingDetailSchema = new Schema(
  {
    booking_id:String,
    room_name: String,   
    price: String,
    total_pay: String,
    room_no: String,
    user_name: String,
    phonenum: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const bookingDetailS = mongoose.models.BookingDetails || mongoose.model("BookingDetails", bookingDetailSchema);

export default bookingDetailS;
