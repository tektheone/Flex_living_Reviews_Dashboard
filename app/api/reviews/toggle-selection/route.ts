import { NextResponse } from "next/server";
import { toggleReviewSelection } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId } = body;
    
    if (typeof reviewId !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid review ID",
        },
        { status: 400 }
      );
    }
    
    const isSelected = await toggleReviewSelection(reviewId);
    
    return NextResponse.json({
      success: true,
      data: {
        reviewId,
        isSelected,
      },
    });
  } catch (error) {
    console.error("Error in /api/reviews/toggle-selection:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle review selection",
      },
      { status: 500 }
    );
  }
}

