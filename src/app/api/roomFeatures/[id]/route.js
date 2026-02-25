import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import roomFeatures from "../../../lib/models/roomFeatures";
import mongoose from "mongoose";
export async function GET(req, { params }) {
  try {
    const { id } = await params; // Await the params here
  const roomId = id;
    await connectMongoDB();
    const groupedFeatures = await roomFeatures.aggregate([
      {
        $match: { room_id: new mongoose.Types.ObjectId(roomId) },
      },
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
          from: "features",
          localField: "feature_id",
          foreignField: "_id",
          as: "feature",
        },
      },
      {
        $group: {
          _id: "$room_id",
          room: { $first: "$room" },
          features: {
            $push: {
              _id: { $arrayElemAt: ["$feature._id", 0] },
              name: { $arrayElemAt: ["$feature.name", 0] },
            },
          },
        },
      },
    ]);

    return NextResponse.json({ groupedFeatures }, { status: 200 });
  } catch (error) {
    console.error("Error fetching features by room_id:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const room_id = params.id;
    const { feature_ids } = await req.json(); // array of facility ObjectIds
    await connectMongoDB();
    // Step 1: Delete existing entries for this room
    await roomFeatures.deleteMany({ room_id });

    // Step 2: Insert new ones
    const newfeatureDocs = feature_ids.map(feature_id => ({
      room_id,
      feature_id,
    }));
    await roomFeatures.insertMany(newfeatureDocs);

    return NextResponse.json(
      { message: "Features updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /roomFeatures error:", error);
    return NextResponse.json(
      { error: "Failed to update Features" },
      { status: 500 }
    );
  }
}
