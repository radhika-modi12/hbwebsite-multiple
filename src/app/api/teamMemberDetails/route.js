import connectMongoDB from "../../lib/mongodb";
import teamMemberDetails from "../../lib/models/teamMemberDetails";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const name = formData.get("name");
    await connectMongoDB();
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    let fileurl = "";
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "public",
        "images/teamImage",
        file.name
      );

      await writeFile(filePath, buffer);
      fileurl = `http://localhost:3000/images/teamImage/${file.name}`;
    }
    const team_member_data = {
      image: fileurl ,
      name,
    };
    await teamMemberDetails.create(team_member_data);
    return NextResponse.json(
      { message: "Team Member Details Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create team Member details" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const teamData = await teamMemberDetails.find();
    return NextResponse.json(
      { message: "team get", list: teamData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Failed to get team" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
  const formData = await request.formData();
    const id = formData.get("id");
    const file = formData.get("file");
    const name = formData.get("name");
  const team_member_detail = await teamMemberDetails.find({ _id: id });
    // if (!file || typeof file === "string") {
    //   return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    // }
    let fileurl = "";
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "public",
        "images/teamImage",
        file.name
      );
      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/rooms/${file.name}`;
    }
    const team_detail_set = {
      id,
      image: fileurl ? fileurl : team_member_detail[0].image,
      name,
    };
    await connectMongoDB();
    const teamDetailData = await teamMemberDetails.findByIdAndUpdate(id, team_detail_set, {
      new: true,
    });
    return NextResponse.json(
      { message: "team Detail update", list: teamDetailData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update team Detail " },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const team_data = await teamMemberDetails.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "team delete", list: team_data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
