import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectMongoDB from "../../../lib/mongodb";
import mongoose from "mongoose";
import bookingorders from "../../../lib/models/booking_order"; // Adjust this import to your setup

export async function GET(req, { params }) {
  const hotelId = params?.id;
  await connectMongoDB();
  if (!hotelId) {
    return NextResponse.json(
      { message: "hotel_id is required" },
      { status: 400 }
    );
  }
  try {
    const booking_order_data = await bookingorders.aggregate([
      {
        $match: {
          hotel_id: new mongoose.Types.ObjectId(hotelId),
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotel_id",
          foreignField: "_id",
          as: "hotel",
        },
      },
      { $unwind: "$hotel" },
      {
        $lookup: {
          from: "rooms",
          localField: "room_id",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $lookup: {
          from: "usercreds",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    return NextResponse.json(
      {
        message: "Booking orders for hotel retrieved",
        list: booking_order_data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving booking orders", error: error.message },
      { status: 500 }
    );
  }
}


