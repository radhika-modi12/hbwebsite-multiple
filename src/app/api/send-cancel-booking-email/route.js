import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const {
      user_name,
      user_email,
      user_phone_number,
      hotel_name,
      room_price,
      check_in,
      check_out,
      booking_id,
    } = await req.json();
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
      to: user_email,
      subject: `Booking Cancellation - ${hotel_name}`,
      html: `
        <h2>Thank you for your booking, ${user_name}!</h2>
        <p>I would like to cancel my hotel reservation scheduled from ${check_in} to ${check_out}, under the  ${user_name} / <strong>Booking ID:</strong>${booking_id}.
        <p>Your reservation at <strong>${hotel_name}</strong> has been cancelled and return room refund as ₹${room_price}</p>
        <p>Thank you for your assistance.</p>
        <p>Best regards,</p>
        <p><strong>User Name:</strong>${user_name}</p></br>
        [<strong>phone Number:</strong>${user_phone_number} /<strong>Email:</strong> ${user_email}]
         
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Booking Cancellation email sent" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create Booking Cancellation" },
      { status: 500 }
    );
  }
}
