import connectMongoDB from "../../lib/mongodb";
import hotelDetails from "../../lib/models/hotels";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { location } = body;
    await connectMongoDB();
    const hotelData = await hotelDetails.find({ location });
    return NextResponse.json(
      { message: "hotel get", list: hotelData },
      { status: 201 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get hotel" }, { status: 500 });
  }
}
