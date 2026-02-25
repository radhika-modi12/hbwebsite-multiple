import connectMongoDB from "../../lib/mongodb";
import bookingDetails from "../../lib/models/booking_details";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      booking_id,
      room_name,
      price,
      total_pay,
      room_no,
      user_name,
      phonenum,
      address,
    } = await request.json();
    await connectMongoDB();
    await bookingDetails.create({
      booking_id,
      room_name,
      price,
      total_pay,
      room_no,
      user_name,
      phonenum,
      address,
    });
    return NextResponse.json({ message: "booking Created" }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const bookingData = await bookingDetails.find();
    return NextResponse.json(
      { message: "Booking get", list: bookingData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get Booking" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const {
      id,
      booking_id,
      room_name,
      price,
      total_pay,
      room_no,
      user_name,
      phonenum,
      address,
    } = await request.json();
    await connectMongoDB();
    const booking_set = {
      booking_id,
      room_name,
      price,
      total_pay,
      room_no,
      user_name,
      phonenum,
      address,
    };
    const bookingData = await bookingDetails.findByIdAndUpdate(
      id,
      booking_set,
      {
        new: true,
      }
    );
    return NextResponse.json(
      { message: "booking update", list: bookingData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const bookingData = await bookingDetails.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "booking delete", list: bookingData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
