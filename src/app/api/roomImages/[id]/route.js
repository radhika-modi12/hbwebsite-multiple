import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import roomImages from "../../../lib/models/roomImages";
import mongoose from "mongoose";// adjust as per your file structure

export async function GET(req, { params }) {
  try {
    const roomId = params.id;

    await connectMongoDB();

    const groupedImages = await roomImages.aggregate([
      {
        $match: { room_id: new mongoose.Types.ObjectId(roomId) },
      },
      {
        $lookup: {
          from: "rooms", // Name of the MongoDB collection (not the model)
          localField: "room_id",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      
    ]);

    return NextResponse.json({ groupedImages }, { status: 200 });

  } catch (error) {
    console.error("Error fetching images by room_id:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

