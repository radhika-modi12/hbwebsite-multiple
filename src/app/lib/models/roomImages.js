import mongoose, { Schema } from "mongoose";

const roomImagesSchema = new Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms", // 👈 Must match the model name exactly
    },
    image:String,
    thumb:String
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const roomImagesDetail =
  mongoose.models.roomImages ||
  mongoose.model("roomImages", roomImagesSchema);

export default roomImagesDetail;
