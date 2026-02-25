import connectMongoDB from "../../lib/mongodb";
import locationDetails from "../../lib/models/locations";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const location = formData.get("location");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(
    process.cwd(),
    "public",
    "images/locations",
    file.name,
  );
  await writeFile(filePath, buffer);
  const fileurl = `http://localhost:3000/images/locations/${file.name}`;
  const locationData = {
    image: fileurl,
    location,
  };
  await connectMongoDB();
  const location_detail = await locationDetails.create(locationData);
  console.log("location_details",location_detail);
  return NextResponse.json({
    message: "location create successfully",
    path: location_detail,
  });
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const locationData = await locationDetails.find().sort({ _id: -1 });
    return NextResponse.json(
      { message: "Location get", list: locationData },
      { status: 201 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get Location" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    const location = formData.get("location");
    const location_info = await locationDetails.find({ _id: id });

    let fileurl;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "public",
        "images/locations",
        file.name,
      );

      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/locations/${file.name}`;
    }
    const location_set = {
      id,
      image: fileurl ? fileurl : location_info[0].image,
      location,
    };
    await connectMongoDB();

    const location_data = await locationDetails.findByIdAndUpdate(
      { _id: id },
      location_set,
      {
        new: true,
      },
    );
    return NextResponse.json(
      { message: "location update", list: location_data },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update location", error },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const location_data = await locationDetails.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "location delete", list: location_data },
      { status: 201 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 },
    );
  }
}
