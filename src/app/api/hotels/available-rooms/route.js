import connectMongoDB from "../../../lib/mongodb";
import Room from "../../../lib/models/room";
import { NextResponse } from "next/server";
import bookingOrders from "../../../lib/models/booking_order";

export async function POST(req, res) {
  try {
    await connectMongoDB();
    const { checkIn, checkOut, hotelId } = await req.json();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    // 1. Get all rooms for this hotel
   const hotelRooms = await Room.find({ hotel_id: hotelId });

  const roomIds = hotelRooms.map(room => room._id);
  // 2. Get all bookings that overlap with the selected dates
  const bookings = await bookingOrders.find({
    room_id: { $in: roomIds },
    $or: [
      { from: { $lte: checkOutDate }, to: { $gte: checkInDate } },
    ],
  }).select('room_id');

  const bookedRoomIds = bookings.map(b => b.room_id.toString());

  // 3. Filter available rooms
  const availableRooms = hotelRooms.filter(
    room => !bookedRoomIds.includes(room._id.toString())
  );

    return NextResponse.json(
      { message: "hotel get", rooms: availableRooms },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
  //   res.json(availableRooms);
}
