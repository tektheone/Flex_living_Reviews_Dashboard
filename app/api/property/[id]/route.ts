import { NextResponse } from "next/server";
import { getPropertyById } from "@/lib/properties";
import { getSelectedReviewsByProperty } from "@/lib/reviews";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await getPropertyById(params.id);
    
    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found",
        },
        { status: 404 }
      );
    }
    
    const reviews = await getSelectedReviewsByProperty(params.id);
    
    return NextResponse.json({
      success: true,
      data: {
        property,
        reviews,
      },
    });
  } catch (error) {
    console.error("Error in /api/property/[id]:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch property details",
      },
      { status: 500 }
    );
  }
}

