import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/reviews";

export async function GET() {
  try {
    const reviews = await getAllReviews();
    
    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error in /api/reviews/hostaway:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

