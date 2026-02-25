import mongoose, { Schema } from "mongoose";

const userQuerySchema = new Schema(
  {
    name:String,
    email: String,   
    subject: String,
    message: String,
    seen: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const userQueryDetails = mongoose.models.UserQueries || mongoose.model("UserQueries", userQuerySchema);

export default userQueryDetails;
