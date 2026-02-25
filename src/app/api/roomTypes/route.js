import connectMongoDB from "../../lib/mongodb";
import roomTypeDetail from "../../lib/models/roomTypes";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name} = await request.json();
    await connectMongoDB();
    await roomTypeDetail.create({ name});
    return NextResponse.json({ message: "Room Type Created" }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create Room Type"},
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {    
    await connectMongoDB();
    const roomTypeData =await roomTypeDetail.find()
    return NextResponse.json({ message: "Room Type get",list:roomTypeData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get Room Type" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {    
    const {id, name} =await request.json()
    await connectMongoDB();
    const room_type_set ={ name}
    const roomTypeData =await roomTypeDetail.findByIdAndUpdate(id,room_type_set,{new:true})
    return NextResponse.json({ message: "Room Type update",list:roomTypeData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update Room Type" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {    
    const {id} =await request.json()
    await connectMongoDB();    
    const roomTypeData =await roomTypeDetail.findByIdAndDelete(id)
    return NextResponse.json({ message: "room type delete",list:roomTypeData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete room type" },
      { status: 500 }
    );
  }
}