import mongoose, { Schema } from "mongoose";

const featureSchema = new Schema(
  {    
    name: String,   
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const featureDetails = mongoose.models.Features || mongoose.model("Features", featureSchema);

export default featureDetails;
