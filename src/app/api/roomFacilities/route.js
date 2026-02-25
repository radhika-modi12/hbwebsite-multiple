import connectMongoDB from "../../lib/mongodb";
import roomFacilities from "../../lib/models/roomfacilities";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { facilities_id, room_id } = await request.json();
    await connectMongoDB();
    await roomFacilities.create({
      facilities_id,
      room_id,
    });
    return NextResponse.json(
      { message: "Room Facilities Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create room facilities" },
      { status: 500 }
    );
  }
}

// export async function GET(req) {
//   try {
//     await connectMongoDB();

//     const groupedFacilities = await roomFacilities.aggregate([
//       {
//         $lookup: {
//           from: "rooms", // collection name in MongoDB (must match the actual collection)
//           localField: "room_id",
//           foreignField: "_id",
//           as: "room",
//         },
//       },
//       { $unwind: "$room" },
//       {
//         $lookup: {
//           from: "facilities", // collection name for facilities
//           localField: "facilities_id",
//           foreignField: "_id",
//           as: "facility",
//         },
//       },
//       {
//         $group: {
//           _id: "$room_id",
//           room: { $first: "$room" },
//           facilities: {
//             $push: {
//               _id: { $arrayElemAt: ["$facility._id", 0] },
//               icon: { $arrayElemAt: ["$facility.icon", 0] },
//               name: { $arrayElemAt: ["$facility.name", 0] },
//               description: { $arrayElemAt: ["$facility.description", 0] },
//             },
//           },
//         },
//       },
//     ]);

//     return NextResponse.json({ groupedFacilities }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching grouped facilities:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch grouped facilities" },
//       { status: 500 }
//     );
//   }
// }
 export async function GET(req) {
  try {
    await connectMongoDB();

   const groupedFacilities = await roomFacilities.aggregate([
  {
    $lookup: {
      from: "rooms", // join with rooms
      localField: "room_id",
      foreignField: "_id",
      as: "room",
    },
  },
  { $unwind: "$room" },

  // Join rooms with roomTypes
  {
    $lookup: {
      from: "roomtypes",
      localField: "room.room_type_id",
      foreignField: "_id",
      as: "room_type",
    },
  },
  { $unwind: "$room_type" }, // room_type now has the full object

  // Join rooms with hotels
  {
    $lookup: {
      from: "hotels",
      localField: "room.hotel_id",
      foreignField: "_id",
      as: "hotel",
    },
  },
  { $unwind: "$hotel" },

  // Join with facilities
  {
    $lookup: {
      from: "facilities",
      localField: "facilities_id",
      foreignField: "_id",
      as: "facility",
    },
  },

  // Group facilities by room
  {
    $group: {
      _id: "$room_id",
      room: { $first: "$room" },
      room_type: { $first: "$room_type" }, // add room_type here
      hotel: { $first: "$hotel" },
      facilities: {
        $push: {
          _id: { $arrayElemAt: ["$facility._id", 0] },
          icon: { $arrayElemAt: ["$facility.icon", 0] },
          name: { $arrayElemAt: ["$facility.name", 0] },
          description: { $arrayElemAt: ["$facility.description", 0] },
        },
      },
    },
  },
]);

    return NextResponse.json({ groupedFacilities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching grouped facilities:", error);
    return NextResponse.json(
      { error: "Failed to fetch grouped facilities" },
      { status: 500 }
    );
  }
}

// export async function GET(req) {
//   try {
//     await connectMongoDB();

//     const groupedFacilities = await roomFacilities.aggregate([
//       {
//         $lookup: {
//           from: "rooms", // join with rooms
//           localField: "room_id",
//           foreignField: "_id",
//           as: "room",
//         },
//       },
//       { $unwind: "$room" },

//       // Join rooms with hotels
//       {
//         $lookup: {
//           from: "hotels",
//           localField: "room.hotel_id",
//           foreignField: "_id",
//           as: "hotel",
//         },
//       },
//       { $unwind: "$hotel" },

//       // Join with facilities
//       {
//         $lookup: {
//           from: "facilities",
//           localField: "facilities_id",
//           foreignField: "_id",
//           as: "facility",
//         },
//       },

//       // Group facilities by room
//       {
//         $group: {
//           _id: "$room_id",
//           room: { $first: "$room" },
//           hotel: { $first: "$hotel" },
//           facilities: {
//             $push: {
//               _id: { $arrayElemAt: ["$facility._id", 0] },
//               icon: { $arrayElemAt: ["$facility.icon", 0] },
//               name: { $arrayElemAt: ["$facility.name", 0] },
//               description: { $arrayElemAt: ["$facility.description", 0] },
//             },
//           },
//         },
//       },
//     ]);

//     return NextResponse.json({ groupedFacilities }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching grouped facilities:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch grouped facilities" },
//       { status: 500 }
//     );
//   }
// }


export async function PUT(request) {
  try {
    const { id, facilities_id, room_id } = await request.json();
    await connectMongoDB();
    const room_facilities_set = {
      facilities_id,
      room_id,
    };
    const roomFacility = await roomFacilities.findByIdAndUpdate(
      id,
      room_facilities_set,
      { new: true }
    );
    return NextResponse.json(
      { message: "room facilities update", list: roomFacility },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update room facilities" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const room_facility_data = await roomFacilities.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "room facility delete", list: room_facility_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete room facility" },
      { status: 500 }
    );
  }
}
