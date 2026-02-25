import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    address:String,
    gmap: String,   
    pn1: String,
    pn2: String,
    email: String,
    fb: String,
    insta: String,
    tw: String,
    iframe: String,
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const contactDetails = mongoose.models.contact || mongoose.model("contact", contactSchema);

export default contactDetails;
