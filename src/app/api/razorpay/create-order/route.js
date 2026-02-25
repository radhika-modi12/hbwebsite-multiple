// import { razorpay } from "@/core/configs/razorpay";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
export async function POST(req) {
  try {
     const body = await req.json();
    const razorpay = new Razorpay({
      key_id: "rzp_live_HjOxVq1GThuok4",
      key_secret: "jK70GReeoYsPZYeWKbJEOEU6",
    });
  
    const bookingDetails = {
      name: body.name,
      phonenum:  body.phonenum,
      address: body.address,
      checkIn: body.check_in,
      checkOut:  body.check_out,
      userEmail: body.user_email,
    };
    const order = await razorpay.orders.create({
      amount: body.amount * body.days,
      currency: "INR",
      receipt: "some_unique_id",
      notes: bookingDetails,
    });
    return NextResponse.json(
      { message: "Order Created", order: order },
      { status: 201 }
    );
  } catch (error) {
    console.log({error})
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
