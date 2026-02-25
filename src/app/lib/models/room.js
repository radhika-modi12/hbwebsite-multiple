import mongoose, { Schema } from "mongoose";
import Hotels from "../models/hotels";
import RoomTypes from "../models/roomTypes";

const roomSchema = new Schema(
  {
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Hotels, // 👈 Must match the model name exactly
    },
    name: String,
    room_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RoomTypes, // 👈 Must match the model name exactly
    },
    area: String,
    price: String,
    quantity: String,
    adult: String,
    children: String,
    description: String,
    status: String,
    removed: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const roomDetail = mongoose.models.Rooms || mongoose.model("Rooms", roomSchema);

export default roomDetail;
