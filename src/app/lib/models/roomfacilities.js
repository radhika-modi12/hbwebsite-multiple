import mongoose, { Schema } from "mongoose";

const roomFacilitiesSchema = new Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms", // 👈 Must match the model name exactly
    },
    facilities_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facilities", // 👈 Must match the model name exactly
    },
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const roomFacilitiesDetail =
  mongoose.models.RoomFacilities ||
  mongoose.model("RoomFacilities", roomFacilitiesSchema);

export default roomFacilitiesDetail;
