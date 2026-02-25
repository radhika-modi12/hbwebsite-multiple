import connectMongoDB from "../../lib/mongodb";
import facilityDetail from "../../lib/models/facilities";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file"); // 👈 name must match append('file', ...)
  const name = formData.get("name");
  const description = formData.get("description");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(
    process.cwd(),
    "public",
    "images/facilities",
    file.name
  );

  await writeFile(filePath, buffer);
  const fileurl = ` http://localhost:3000/images/facilities/${file.name}`;
  const facilityData = {
    name,
    icon: fileurl,
    description,
  };
  await connectMongoDB();
  const facility_detail = await facilityDetail.create(facilityData);
  return NextResponse.json({
    message: "facility create successfully",
    path: facility_detail,
  });
}

export async function GET(request) {
  try {
    await connectMongoDB();
    const facilityData = await facilityDetail.find();
    return NextResponse.json(
      { message: "facility get", list: facilityData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get facility" },
      { status: 500 }
    );
  }
}

// export async function PUT(request) {
//   try {
//     const {id, icon,name,description} =await request.json()
//     await connectMongoDB();
//     const facility_set ={ icon,name,description}
//     const facilityData =await facilityDetail.findByIdAndUpdate(id,facility_set,{new:true})
//     return NextResponse.json({ message: "facility update",list:facilityData }, { status: 201 });
//   } catch (error) {
//     console.log({ error });
//     return NextResponse.json(
//       { error: "Failed to update facility" },
//       { status: 500 }
//     );
//   }
// }
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const file = formData.get("file");
    const name = formData.get("name");
    const description = formData.get("description");
    const facility_info = await facilityDetail.find({ _id: id });
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
        "images/facilities",
        file.name
      );

      await writeFile(filePath, buffer);
      fileurl = ` http://localhost:3000/images/facilities/${file.name}`;
    }
    const facility_set = {
      id,
      icon: fileurl ? fileurl : facility_info[0].icon,
      name,
      description,
    };
    await connectMongoDB();

    const facility_data = await facilityDetail.findByIdAndUpdate(
      id,
      facility_set,
      {
        new: true,
      }
    );
    return NextResponse.json(
      { message: "facility update", list: facility_data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update facility" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const facility_data = await facilityDetail.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "facility delete", list: facility_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete facility" },
      { status: 500 }
    );
  }
}
