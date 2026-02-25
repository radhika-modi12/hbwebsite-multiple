import connectMongoDB from "../../lib/mongodb";
import contactDetails from "../../lib/models/contact";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {address,gmap,pn1,pn2,email,fb,insta,tw,iframe} = await request.json();
    await connectMongoDB();
    await contactDetails.create({address,gmap,pn1,pn2,email,fb,insta,tw,iframe});
    return NextResponse.json({ message: "contact Created" }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {    
    await connectMongoDB();
    const contactData =await contactDetails.find()
    return NextResponse.json({ message: "contact get",list:contactData }, { status: 201 });
  } catch (error) {    
    return NextResponse.json(
      { error: "Failed to get contact" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {    
    const {id, address,gmap,pn1,pn2,email,fb,insta,tw,iframe} =await request.json()
    await connectMongoDB();
    const contact_set ={ address,gmap,pn1,pn2,email,fb,insta,tw,iframe}
    const contactData =await contactDetails.findByIdAndUpdate(id,contact_set,{new:true})
    return NextResponse.json({ message: "contact update",list:contactData }, { status: 201 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {    
    const {id} =await request.json()
    await connectMongoDB();    
    const contact_data =await contactDetails.findByIdAndDelete(id)
    return NextResponse.json({ message: "contact delete",list:contact_data }, { status: 201 });
  } catch (error) {
    // console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}