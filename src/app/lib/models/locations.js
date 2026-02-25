import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    location: String,
    image: String
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const locationDetails =
  mongoose.models.Locations || mongoose.model("Locations", locationSchema);

export default locationDetails;
