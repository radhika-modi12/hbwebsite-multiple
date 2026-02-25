import connectMongoDB from "../../lib/mongodb";
import userCreds from "../../lib/models/usercred";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      formData.get("password"),
      saltRounds
    );

    const file = formData.get("file");
    const name = formData.get("name");
    const email = formData.get("email") || null; // 👈 email nullable
    const address = formData.get("address");
    const role = formData.get("role");
    const phonenum = formData.get("phonenum");
    const pincode = formData.get("pincode");
    const dob = formData.get("dob");
    const password = hashedPassword;
    const is_verified = formData.get("is_verified");
    const token = formData.get("token");
    const t_expire = formData.get("t_expire");
    const status = formData.get("status");

    await connectMongoDB();

    let fileurl = null; // 👈 default null

    // ✅ Only process file if it exists
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "public",
        "images/users",
        file.name
      );

      await writeFile(filePath, buffer);
      fileurl = `http://localhost:3000/images/users/${file.name}`;
    }

    const user_cred_data = {
      name,
      profile: fileurl, // 👈 will be null if no file
      email,
      address,
      role,
      phonenum,
      pincode,
      dob,
      password,
      is_verified,
      token,
      t_expire,
      status,
    };

    await userCreds.create(user_cred_data);

    return NextResponse.json(
      { message: "User Cred Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create User Cred" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const userCredData = await userCreds.find();
    return NextResponse.json(
      { message: "user get", list: userCredData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get user Cred" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const file = formData.get("file"); // 👈 name must match append('file', ...)
    const name = formData.get("name");
    const email = formData.get("email");
    const address = formData.get("address");
    const role = formData.get("role");
    const phonenum = formData.get("phonenum");
    const pincode = formData.get("pincode");
    const dob = formData.get("dob");
    const password = formData.get("password");
    const is_verified = formData.get("is_verified");
    const token = formData.get("token");
    const t_expire = formData.get("t_expire");
    const status = formData.get("status");
    await connectMongoDB();
    const userCredData = await userCreds.find({ _id: id });
    //  console.log({userCredData});
    // if (!file || typeof file === "string") {
    //   return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    // }

    let fileurl = "";
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(
        process.cwd(),
        "public",
        "images/users",
        file.name
      );
      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/users/${file.name}`;
    }
    const user_cred_data = {
      id,
      name,
      profile: fileurl ? fileurl : userCredData[0]?.profile,
      email,
      address,
      role,
      phonenum,
      pincode,
      dob,
      password,
      is_verified,
      token,
      t_expire,
      status,
    };
    const user_cred_detail = await userCreds.findByIdAndUpdate(
      id,
      user_cred_data,
      {
        new: true,
      }
    );
    return NextResponse.json(
      { message: "user cred update", list: user_cred_detail },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update user cred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const user_cred_data = await userCreds.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "user cred delete", list: user_cred_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete user cred" },
      { status: 500 }
    );
  }
}
