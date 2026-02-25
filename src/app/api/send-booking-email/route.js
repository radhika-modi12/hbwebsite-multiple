import connectMongoDB from "../../lib/mongodb";
import teamMemberDetails from "../../lib/models/teamMemberDetails";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
     const { name, email, hotel_name, checkin, checkout, bookingId } = await req.json();
     const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmation - ${hotel_name}`,
      html: `
        <h2>Thank you for your booking, ${name}!</h2>
        <p>Your reservation at <strong>${hotel_name}</strong> has been confirmed.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Check-in:</strong> ${checkin}</p>
        <p><strong>Check-out:</strong> ${checkout}</p>
        <hr/>
        <p>We look forward to hosting you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    // res.status(200).json({ message: 'Booking confirmation email sent.' });
    return NextResponse.json(
      { message: "Booking confirmation email sent" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create Booking confirmation" },
      { status: 500 }
    );
  }
}