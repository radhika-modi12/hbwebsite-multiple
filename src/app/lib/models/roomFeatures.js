import mongoose, { Schema } from "mongoose";

const roomFeaturesSchema = new Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms", // 👈 Must match the model name exactly
    },
    feature_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Features", // 👈 Must match the model name exactly
    },
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const roomFeaturesDetail =
  mongoose.models.roomFeatures ||
  mongoose.model("roomFeatures", roomFeaturesSchema);

export default roomFeaturesDetail;
