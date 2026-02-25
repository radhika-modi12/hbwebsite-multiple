import connectMongoDB from "../../lib/mongodb";
import roomDetail from "../../lib/models/room";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const hotel_id = formData.get("hotel_id");
    const file = formData.get("file");
    const name = formData.get("name");
    const room_type_id = formData.get("room_type_id");
    const area = formData.get("area");
    const price = formData.get("price");
    const quantity = formData.get("quantity");
    const adult = formData.get("adult");
    const children = formData.get("children");
    const description = formData.get("description");
    const status = formData.get("status");
    const removed = formData.get("removed");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      process.cwd(),
      "public",
      "images/rooms",
      file.name,
    );

    await writeFile(filePath, buffer);
    const fileurl = ` http://localhost:3000/images/rooms/${file.name}`;
    const roomData = {
      hotel_id,
      image: fileurl,
      name,
      room_type_id,
      area,
      price,
      quantity,
      adult,
      children,
      description,
      status,
      removed,
    };
    await connectMongoDB();
    const result = await roomDetail.create(roomData);
    return NextResponse.json(
      { message: "room Created", rooms: result },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const roomData = await roomDetail
      .find()
      .populate({ path: "hotel_id", select: "name price" })
      .populate({ path: "room_type_id", select: "name" });
    return NextResponse.json(
      { message: "room get", list: roomData },
      { status: 201 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get room" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log("req".request);
    const formData = await request.formData();
    const id = formData.get("id");
    const hotel_id = formData.get("hotel_id");
    const file = formData.get("file");
    const name = formData.get("name");
    const room_type_id = formData.get("room_type_id");
    const area = formData.get("area");
    const price = formData.get("price");
    const quantity = formData.get("quantity");
    const adult = formData.get("adult");
    const children = formData.get("children");
    const description = formData.get("description");
    const status = formData.get("status");
    const removed = formData.get("removed");

    const room_info = await roomDetail.find({ _id: id });

    let fileurl = "";
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "public",
        "images/rooms",
        file.name,
      );
      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/rooms/${file.name}`;
    }
    const room_set = {
      id,
      image: fileurl ? fileurl : room_info[0]?.image,
      hotel_id,
      name,
      room_type_id,
      area,
      price,
      quantity,
      adult,
      children,
      description,
      status,
      removed,
    };
    await connectMongoDB();
    console.log("room_set",room_set);

    const roomData = await roomDetail.findByIdAndUpdate(id, room_set, {
      new: true,
    });
    return NextResponse.json(
      { message: "room update", list: roomData },
      { status: 201 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const roomData = await roomDetail.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "room delete", list: roomData },
      { status: 201 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
}
