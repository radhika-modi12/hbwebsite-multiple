import mongoose, { Schema } from "mongoose";

const useCredSchema = new Schema(
  {
    name: String,
    email: String,
    address: String,
    phonenum: String,
    pincode: String,
    dob: String,
    profile: String,
    password: String,
     role: {
      type: String,
      required: false,
      default: "user",
    },
    is_verified: String,
    token: String,
    t_expire: String,
    status: String,
    datentime: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const userCredDetail = mongoose.models.userCreds || mongoose.model("userCreds", useCredSchema);

export default userCredDetail;
