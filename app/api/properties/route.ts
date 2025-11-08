import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties";

export async function GET() {
  try {
    const properties = await getAllProperties();
    
    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Error in /api/properties:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}

