import connectMongoDB from "../../lib/mongodb";
import roomFeatures from "../../lib/models/roomFeatures";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { feature_id, room_id } = await request.json();
    await connectMongoDB();
    await roomFeatures.create({
      feature_id,
      room_id,
    });
    return NextResponse.json(
      { message: "Room Features Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create room Features" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {    
    await connectMongoDB();
    const featureData =await roomFeatures.find().populate("room_id").populate("feature_id")
    return NextResponse.json({ message: "Feature get",list:featureData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get Feature" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, features_id, room_id } = await request.json();
    await connectMongoDB();
    const room_features_set = {
      features_id,
      room_id,
    };
    const roomFeature = await roomFeatures.findByIdAndUpdate(
      id,
      room_features_set,
      { new: true }
    );
    return NextResponse.json(
      { message: "room features update", list: roomFeature },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update room features" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const room_fearure_data = await roomFeatures.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "room feature delete", list: room_fearure_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete room facility" },
      { status: 500 }
    );
  }
}
