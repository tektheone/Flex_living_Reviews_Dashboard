import { NormalizedReview, Property } from "@/types/review";
import mockProperties from "@/data/mock-properties.json";
import { getSelectedReviewIds } from "@/lib/storage";
import { formatDate, getPropertyImage } from "@/lib/reviewUtils";

interface GoogleReview {
  author_name: string;
  author_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url?: string;
}

interface GooglePlaceDetailsResponse {
  status: string;
  result?: {
    name?: string;
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
    url?: string;
  };
  error_message?: string;
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_DETAILS_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/details/json";

const properties = mockProperties as Property[];

function normalizeGoogleReviewId(propertyId: string, index: number, review: GoogleReview) {
  const timestamp = review.time || Date.now() / 1000;
  return Number(
    `${propertyId}${index}${Math.floor(timestamp % 1000)}`
  );
}

function normalizeGoogleReviewerName(authorName: string): { full: string; first: string } {
  if (!authorName) {
    return {
      full: "Google Reviewer",
      first: "Guest",
    };
  }

  const parts = authorName.trim().split(/\s+/);
  if (parts.length === 1) {
    return {
      full: authorName,
      first: authorName,
    };
  }

  const first = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return {
    full: `${first} ${lastInitial}.`,
    first,
  };
}

export async function fetchGoogleReviews(): Promise<NormalizedReview[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("Google Places API key is not configured. Skipping Google reviews.");
    return [];
  }

  const selectedIds = await getSelectedReviewIds();
  const reviews: NormalizedReview[] = [];

  for (const property of properties) {
    if (!property.googlePlaceId) continue;

    try {
      const url = new URL(GOOGLE_PLACES_DETAILS_ENDPOINT);
      url.searchParams.set("place_id", property.googlePlaceId);
      url.searchParams.set(
        "fields",
        "name,rating,user_ratings_total,reviews,formatted_address,url"
      );
      url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

      const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Google Places API request failed:", response.status, response.statusText);
        continue;
      }

      const data: GooglePlaceDetailsResponse = await response.json();

      if (data.status !== "OK" || !data.result?.reviews?.length) {
        continue;
      }

      data.result.reviews.forEach((review, index) => {
        const reviewId = normalizeGoogleReviewId(property.id, index, review);
        const reviewer = normalizeGoogleReviewerName(review.author_name);
        const dateIso = new Date((review.time || Date.now() / 1000) * 1000).toISOString();

        reviews.push({
          id: reviewId,
          propertyId: property.id,
          propertyName: property.name,
          propertyImage: getPropertyImage(property.id),
          guestName: reviewer.full,
          guestFirstName: reviewer.first,
          rating: review.rating,
          reviewText: review.text,
          categories: [],
          date: dateIso,
          dateFormatted: formatDate(dateIso),
          channel: "Google",
          type: "guest-to-host",
          status: "published",
          isSelected: selectedIds.includes(reviewId),
        });
      });
    } catch (error) {
      console.error(
        `Error fetching Google reviews for property ${property.id}:`,
        error
      );
    }
  }

  return reviews;
}

