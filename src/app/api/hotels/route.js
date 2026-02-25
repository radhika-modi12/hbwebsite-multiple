import connectMongoDB from "../../lib/mongodb";
import hotelDetails from "../../lib/models/hotels";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file"); // 👈 name must match append('file', ...)
  const name = formData.get("name");
  const address = formData.get("address");
  const location = formData.get("location");
  const latitude = formData.get("latitude");
  const longitute = formData.get("longitute");
  const hotel_type = formData.get("hotel_type");
  const room = formData.get("room");
  const adults = formData.get("adults");
  const children = formData.get("children");
  const purpose_of_day = formData.get("purpose_of_day");
  const price = formData.get("price");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(
    process.cwd(),
    "public",
    "images/hotels",
    file.name
  );

  await writeFile(filePath, buffer);
  const fileurl = ` http://localhost:3000/images/hotels/${file.name}`;
  const hotelData = {
    name,
    address,
    location,
    latitude,
    longitute,
    hotel_type,
    image: fileurl,
    room,
    adults,
    price,
    children,
    purpose_of_day,
  };
  await connectMongoDB();
  const hotel_detail = await hotelDetails.create(hotelData);
  return NextResponse.json({
    message: "hotel create successfully",
    // path: hotel_detail,
  });
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const hotelData = await hotelDetails.find().sort({_id:-1});
    return NextResponse.json(
      { message: "Hotel get", list: hotelData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get Hotel" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    const name = formData.get("name");
    const address = formData.get("address");
    const location = formData.get("location");
    const latitude = formData.get("latitude");
    const longitute = formData.get("longitute");
    const hotel_type = formData.get("hotel_type");
    const room = formData.get("room");
    const adults = formData.get("adults");
    const children = formData.get("children");
    const purpose_of_day = formData.get("purpose_of_day");
    const price = formData.get("price");
    const hotel_info = await hotelDetails.find({ _id: id });

    // if (!file || typeof file === "string") {
    //   return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    // }
    let fileurl;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "public",
        "images/hotels",
        file.name
      );

      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/hotels/${file.name}`;
    }
    const hotel_set = {
      id,
      image: fileurl ? fileurl : hotel_info[0].image,
      name,
      address,
      location,
      latitude,
      longitute,
      hotel_type,
      price,
      room,
      adults,
      children,
      purpose_of_day,
    };
    await connectMongoDB();

    const hotel_data = await hotelDetails.findByIdAndUpdate(
      { _id: id },
      hotel_set,
      {
        new: true,
      }
    );
    return NextResponse.json(
      { message: "hotel update", list: hotel_data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update hotel", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const hotel_data = await hotelDetails.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "hotel delete", list: hotel_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
