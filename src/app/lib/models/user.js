import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: false,
      default: null,
    },
    phone: {
      type: String,
      required: false,
      default: null,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    pincode: {
      type: String,
      required: false,
      default: null,
    },
    dob: {
      type: String,
      required: false,
      default: null,
    },
    password: String,
    role: String,
  },
  {
    timestamps: true,
  },
);

// Ensure the model is only created once
const userDetails = mongoose.models.User || mongoose.model("User", userSchema);

export default userDetails;
