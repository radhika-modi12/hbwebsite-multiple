import mongoose from "mongoose";
var Schema = mongoose.Schema;

const ratingReviewSchema = new Schema(
  {
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels", // 👈 Must match the model name exactly
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCreds", // 👈 Must match the model name exactly
    },
    rating: String,
    review: String,
    seen: String,
    datentime: Date,
  },
  {
    timestamps: true,
  }
);
const ratingReviewDetails =
  mongoose.models.ratingReviews ||
  mongoose.model("ratingReviews", ratingReviewSchema);

export default ratingReviewDetails;

// Ensure the model is only created once
