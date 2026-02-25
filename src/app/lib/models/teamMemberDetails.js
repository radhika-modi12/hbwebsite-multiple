import mongoose, { Schema } from "mongoose";

const teamMemberDetailsSchema = new Schema(
  {
    image:String,
    name:String
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const teamMemberDetail =
  mongoose.models.teamMemberDetails ||
  mongoose.model("teamMemberDetails", teamMemberDetailsSchema);

export default teamMemberDetail;
