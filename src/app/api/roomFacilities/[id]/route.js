import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import roomFacilities from "../../../lib/models/roomfacilities";
import mongoose from "mongoose";
export async function GET(req, { params }) {
  try {
    const roomId =params.id
    await connectMongoDB();
    const groupedFacilities = await roomFacilities.aggregate([
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
          from: "facilities",
          localField: "facilities_id",
          foreignField: "_id",
          as: "facility",
        },
      },
      {
        $group: {
          _id: "$room_id",
          room: { $first: "$room" },
          facilities: {
            $push: {
              _id: { $arrayElemAt: ["$facility._id", 0] },
              icon: { $arrayElemAt: ["$facility.icon", 0] },
              name: { $arrayElemAt: ["$facility.name", 0] },
              description: { $arrayElemAt: ["$facility.description", 0] },
            },
          },
        },
      },
    ]);

    return NextResponse.json({ groupedFacilities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching facilities by room_id:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const room_id = params.id;
    const { facilities_id } = await req.json(); // array of facility ObjectIds

    await connectMongoDB();

    // Step 1: Delete existing entries for this room
    await roomFacilities.deleteMany({ room_id });

    // Step 2: Insert new ones
    const newFacilityDocs = facilities_id.map(facility_id => ({
      room_id,
      facilities_id: facility_id,
    }));

    await roomFacilities.insertMany(newFacilityDocs);

    return NextResponse.json(
      { message: "Facilities updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /roomFacilities error:", error);
    return NextResponse.json(
      { error: "Failed to update facilities" },
      { status: 500 }
    );
  }
}
