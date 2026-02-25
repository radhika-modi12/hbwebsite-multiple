import connectMongoDB from "../../lib/mongodb";
import ratingReviews from "../../lib/models/ratingReview";
import { NextResponse } from "next/server";
import userCredDetail from "../../lib/models/usercred";

export async function POST(request) {
  try {
    const { hotel_id, user_id, rating, review, seen } = await request.json();
    await connectMongoDB();
    await ratingReviews.create({
      hotel_id,
      user_id,
      rating,
      review,
      seen,
    });
    return NextResponse.json(
      { message: "Rating Review Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create rating review" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const reviews = await ratingReviews.find().populate({
        path: 'hotel_id',
        select: 'name area price _id' // Include name and email, exclude _id
      });;
    // Step 2: For each review, get user details based on user_id
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await userCredDetail.findOne({ _id: review.user_id });
        return {
          ...review._doc, // spread review data
          user: user
            ? {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phonenum: user.phonenum,
                profile: user.profile,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ reviews: reviewsWithUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, hotel_id, user_id, rating, review, seen } =
      await request.json();
    await connectMongoDB();
    const rating_review_set = {
      hotel_id,
      user_id,
      rating,
      review,
      seen,
    };
    const ratingData = await ratingReviews.findByIdAndUpdate(
      id,
      rating_review_set,
      { new: true }
    );
    return NextResponse.json(
      { message: "rating review update", list: ratingData },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update rating room" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectMongoDB();
    const rating_data = await ratingReviews.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "rating review delete", list: rating_data },
      { status: 201 }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete rating room" },
      { status: 500 }
    );
  }
}
