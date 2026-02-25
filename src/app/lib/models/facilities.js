import mongoose, { Schema } from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    icon: String,
    name: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const facilityDetail = mongoose.models.Facilities || mongoose.model('Facilities', facilitySchema);

export default facilityDetail;

// models/Facilities.js
// import mongoose from 'mongoose';

// const FacilitiesSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   // other fields
// });

// export default mongoose.models.Facilities || mongoose.model('Facilities', FacilitiesSchema);

