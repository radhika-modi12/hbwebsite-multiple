import connectMongoDB from "../../lib/mongodb";
import roomImages from "../../lib/models/roomImages";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    const room_id = formData.get("room_id");
    const thumb = formData.get("thumb");
    await connectMongoDB();
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      process.cwd(),
      "public",
      "images/rooms",
      file.name
    );

    await writeFile(filePath, buffer);
    const fileurl = ` http://localhost:3000/images/rooms/${file.name}`;
    const room_data = {
      room_id,
      image: fileurl,
      thumb,
    };
    await roomImages.create(room_data);
    return NextResponse.json(
      { message: "Room Images Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create room Images" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const roomImageData = await roomImages.find().populate({
      path: "room_id",
      select: "name price",
    });
    return NextResponse.json(
      { message: "room get", list: roomImageData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get room" }, { status: 500 });
  }
}
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    const room_id = formData.get("room_id");
    const thumb = formData.get("thumb");
    await connectMongoDB();
    const room_image_info = await roomImages.find({ _id: id });
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
        "images/rooms",
        file.name
      );

      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/rooms/${file.name}`;
    }
    const room_data = {
      room_id,
      image: fileurl ? fileurl : room_image_info[0].image,
      thumb,
    };
    await roomImages.findByIdAndUpdate(id, room_data, {
      new: true,
    });
    return NextResponse.json(
      { message: "Room Images updated" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update room Images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const room_image_data = await roomImages.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "room Image delete", list: room_image_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete room Image" },
      { status: 500 }
    );
  }
}
