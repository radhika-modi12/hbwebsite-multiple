import connectMongoDB from "../../lib/mongodb";
import featureDetail from "../../lib/models/features";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name} = await request.json();
    await connectMongoDB();
    await featureDetail.create({ name});
    return NextResponse.json({ message: "Feature Created" }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create Feature"},
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {    
    await connectMongoDB();
    const featureData =await featureDetail.find()
    return NextResponse.json({ message: "Feature get",list:featureData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to get Feature" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {    
    const {id, name} =await request.json()
    await connectMongoDB();
    const feature_set ={ name}
    const featureData =await featureDetail.findByIdAndUpdate(id,feature_set,{new:true})
    return NextResponse.json({ message: "feature update",list:featureData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update feature" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {    
    const {id} =await request.json()
    await connectMongoDB();    
    const featureData =await featureDetail.findByIdAndDelete(id)
    return NextResponse.json({ message: "feature delete",list:featureData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete feature" },
      { status: 500 }
    );
  }
}