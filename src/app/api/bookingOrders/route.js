import connectMongoDB from "../../lib/mongodb";
import { NextResponse } from "next/server";
import bookingOrders from "../../lib/models/booking_order";

export async function POST(request) {
  try {
    const lastBooking = await bookingOrders.findOne().sort({ _id: -1 }).exec();
    const {
      hotel_id,
      user_id,
      room_id,
      check_in,
      check_out,
      arrival,
      refund,
      booking_status,
      order_id,
      rate_review,
    } = await request.json();
    await connectMongoDB();
    await bookingOrders.create({
      booking_id:lastBooking ? Number(lastBooking.booking_id) + 1 : 1,
      hotel_id,
      user_id,
      room_id,
      check_in,
      check_out,
      arrival,
      refund,
      booking_status,
      order_id,
      rate_review,
    });
    return NextResponse.json(
      { message: "Booking Order Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create booking order" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const bookingOrderData = await bookingOrders.aggregate([
      {
        $lookup: {
          from: "hotels",
          localField: "hotel_id",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: "$hotel"
      },
      {
        $lookup: {
          from: "rooms",
          localField: "room_id",
          foreignField: "_id",
          as: "room"
        }
      },
      {
        $unwind: "$room"
      },
      {
        $lookup: {
          from: "usercreds",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]);

    return NextResponse.json(
      { message: "Booking orders retrieved", list: bookingOrderData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving booking orders", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const {
      id,
      booking_id,
      user_id,
      room_id,
       hotel_id,
      check_in,
      check_out,
      arrival,
      refund,
      booking_status,
      order_id,
      rate_review,
    } = await request.json();
    await connectMongoDB();
    const booking_order_set = {
      booking_id,
      user_id,
      room_id,
      hotel_id,
      check_in,
      check_out,
      arrival,
      refund,
      booking_status,
      order_id,
      rate_review,
    };
    const bookingOrderData = await bookingOrders.findByIdAndUpdate(
      id,
      booking_order_set,
      { new: true }
    );
    return NextResponse.json(
      { message: "booking order update", list: bookingOrderData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update booking order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const booking_order_data = await bookingOrders.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "booking order delete", list: booking_order_data },
      { status: 201 }
    );
  } catch (error) {
    // console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete booking order" },
      { status: 500 }
    );
  }
}
