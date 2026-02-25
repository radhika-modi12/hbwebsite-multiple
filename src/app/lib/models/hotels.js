import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema(
  {
    name: String,
    address: String,
    location: String,
    latitude: String,
    longitute: String,
    image: String,
    room: String,
    hotel_type: String,
    adults: String,
    children: String,
    price: String,
    purpose_of_day: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const hotelDetails =
  mongoose.models.Hotels || mongoose.model("Hotels", hotelSchema);

export default hotelDetails;
