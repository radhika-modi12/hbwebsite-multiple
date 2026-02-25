import mongoose, { Schema } from "mongoose";

const roomTypeSchema = new Schema(
  {    
    name: String,   
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const roomTypeDetails = mongoose.models.RoomTypes || mongoose.model("RoomTypes", roomTypeSchema);

export default roomTypeDetails;
