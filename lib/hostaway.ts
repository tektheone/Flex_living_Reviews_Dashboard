import { HostawayApiResponse, HostawayReview } from "@/types/review";

const HOSTAWAY_API_BASE = "https://api.hostaway.com/v1";
const ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID;
const API_KEY = process.env.HOSTAWAY_API_KEY;

export async function fetchHostawayReviews(): Promise<HostawayReview[]> {
  if (!ACCOUNT_ID || !API_KEY) {
    console.warn("Hostaway credentials not configured");
    return [];
  }

  try {
    const response = await fetch(`${HOSTAWAY_API_BASE}/reviews`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Hostaway API error:", response.status, response.statusText);
      return [];
    }

    const data: HostawayApiResponse = await response.json();
    
    if (data.status === "success" && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error);
    return [];
  }
}

export function getChannelFromListingName(listingName: string): string {
  // In a real scenario, this might come from the API
  // For now, we'll randomize between common channels
  const channels = ["Airbnb", "Booking.com", "Direct"];
  return channels[Math.floor(Math.random() * channels.length)];
}

