import connectMongoDB from "../../lib/mongodb";
import userQueries from "../../lib/models/userQueries";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, subject, message, seen } = await request.json();
    await connectMongoDB();
    await userQueries.create({
      name,
      email,
      subject,
      message,
      seen,
    });
    return NextResponse.json(
      { message: "user queries Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create user queries" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const user_query_data = await userQueries.find();
    return NextResponse.json(
      { message: "user query get", list: user_query_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get user query" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, name, email, subject, message, seen } = await request.json();
    await connectMongoDB();
    const user_query_set = {
      name,
      email,
      subject,
      message,
      seen,
    };
    const userQuery = await userQueries.findByIdAndUpdate(id, user_query_set, {
      new: true,
    });
    return NextResponse.json(
      { message: "user queries update", list: userQuery },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update user queries" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const user_queries_data = await userQueries.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "user query delete", list: user_queries_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete user query" },
      { status: 500 }
    );
  }
}
