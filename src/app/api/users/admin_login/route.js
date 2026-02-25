import connectMongoDB from "../../../lib/mongodb";
import userDetails from "../../../lib/models/usercred";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

export async function POST(req) {
  const { username, password } = await req.json();

  await connectMongoDB();

  const userData = await userDetails.findOne({name: username });  
  // console.log("user_data",userData);
  // if(!userData || !userData.role || userData.role == "user"){
  //   return NextResponse.json({ error: "login permission access only admin and manager" }, { status: 404 });
  // }

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(password, userData.password); // 👈 compare bcrypt

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const payload = {
    id: userData._id,
    username: userData.username,
  };

  // Sign the token
  const token = jwt.sign(payload, "1234", {
    expiresIn: "3600d", // expires in 1 hour
  });
 
  return NextResponse.json({
    message: "Login successful",
    userDetail: userData,
    token: token,
  });
}
