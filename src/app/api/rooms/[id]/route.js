import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import roomDetail from "../../../lib/models/room";

export async function GET(req, { params }) {
  try {
    const hotelId = await params['id']
    console.log("id12",hotelId);
    await connectMongoDB();
    const roomData = await roomDetail.find({hotel_id:hotelId}).populate({
        path: 'hotel_id',
        select: 'name area price _id'
      });
    return NextResponse.json(
      { message: "room get", list: roomData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get room" }, { status: 500 });
  }
}
