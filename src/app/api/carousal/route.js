import connectMongoDB from "../../lib/mongodb";
import carousalDetail from "../../lib/models/carousal";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    await connectMongoDB();
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      process.cwd(),
      "public",
      "images/carousel",
      file.name
    );

    await writeFile(filePath, buffer);
    const fileurl = ` http://localhost:3000/images/carousel/${file.name}`;
    const room_data = {
      image: fileurl,
    };
    await carousalDetail.create(room_data);
    return NextResponse.json(
      { message: "Carousal Images Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create Carousal Images" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const carousalData = await carousalDetail.find();
    return NextResponse.json(
      { message: "carousal get", list: carousalData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get carousal" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
     const id = formData.get("id");
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    await connectMongoDB();
    const carausalData =  await carousalDetail.find({ _id: id });
    // console.log({carausalData})
    // if (!file || typeof file === "string") {
    //   return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    let fileurl
    // }
    if(file){
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      process.cwd(),
      "public",
      "images/carousel",
      file.name
    );

    await writeFile(filePath, buffer);
     fileurl = ` http://localhost:3000/images/carousel/${file.name}`;
  }
    const carousal_data = {
      image: fileurl ? fileurl :carausalData[0].image,
    };
    const carousalData = await carousalDetail.findByIdAndUpdate(id, carousal_data, {
      new: true,
    });
    return NextResponse.json(
      { message: "carousal Images update", list: carousalData },
      { status: 201 }
    );
  
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update carousal Images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const carousal_image_data = await carousalDetail.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "carousal Image delete", list: carousal_image_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete carousal Image" },
      { status: 500 }
    );
  }
}
