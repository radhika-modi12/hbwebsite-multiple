import mongoose, { Schema } from "mongoose";

const carousalSchema = new Schema(
  {
    image:String
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const carousalDetails = mongoose.models.carousal || mongoose.model("carousal", carousalSchema);

export default carousalDetails;
