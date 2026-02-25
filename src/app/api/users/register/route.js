import connectMongoDB from "../../../lib/mongodb";
import userDetails from "../../../lib/models/user";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file"); // 👈 name must match append('file', ...)
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const address = formData.get("address");
  const pincode = formData.get("pincode");
  const dob = formData.get("dob");
  const password = formData.get("password");

  const user_detail = await userDetails.findOne({ email });
   if (user_detail) {
    return NextResponse.json({ error: "Email already exist" }, { status: 404 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(process.cwd(), "public", "images", file.name);

  await writeFile(filePath, buffer);
  const fileurl = ` http://localhost:3000/images/${file.name}`;
  const userData = {
    name,
    email,
    phone,
    image: fileurl,
    address,
    pincode,
    dob,
    password,
  };
  await connectMongoDB();
  const userDetail = await userDetails.create(userData);
  return NextResponse.json({
    message: "user create successfully",
    path: userDetail,
  });
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const userData = await userDetails.find();
    return NextResponse.json(
      { message: "user get", list: userData },
      { status: 201 }
    );
  } catch (error) {
    // console.log({ error });
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, email, phone, image, address, pincode, dob, password } =
      await request.json();
    await connectMongoDB();
    const user_set = {
      name,
      email,
      phone,
      image,
      address,
      pincode,
      dob,
      password,
    };
    const userData = await userDetails.findByIdAndUpdate(id, user_set, {
      new: true,
    });
    return NextResponse.json(
      { message: "user update", list: userData },
      { status: 201 }
    );
  } catch (error) {
    // console.log({ error });
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const user_data = await userDetails.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "user delete", list: user_data },
      { status: 201 }
    );
  } catch (error) {
    // console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
