import { HostawayReview, NormalizedReview } from "@/types/review";
import { fetchHostawayReviews } from "./hostaway";
import { getSelectedReviewIds } from "./storage";
import mockReviews from "@/data/mock-reviews.json";

export function extractPropertyId(listingName: string): string {
  // Extract a simple ID from the listing name
  // "2B N1 A - 29 Shoreditch Heights" -> "1"
  // "Studio E2 - Canary Wharf Tower" -> "2"
  // "1B SW1 - Westminster Gardens" -> "3"
  // "3B W1 - Mayfair Residence" -> "4"
  
  if (listingName.includes("Shoreditch Heights")) return "1";
  if (listingName.includes("Canary Wharf Tower")) return "2";
  if (listingName.includes("Westminster Gardens")) return "3";
  if (listingName.includes("Mayfair Residence")) return "4";
  
  // Default fallback
  return "1";
}

export function formatGuestName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return fullName;
  
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0);
  return `${firstName} ${lastInitial}.`;
}

export function calculateAverageRating(categories: { rating: number }[]): number {
  if (!categories || categories.length === 0) return 0;
  
  const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
  return Math.round((sum / categories.length) * 10) / 10;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export async function normalizeReview(
  review: HostawayReview,
  selectedIds: number[]
): Promise<NormalizedReview> {
  const propertyId = extractPropertyId(review.listingName);
  const rating = review.rating || calculateAverageRating(review.reviewCategory);
  
  return {
    id: review.id,
    propertyId,
    propertyName: review.listingName,
    guestName: formatGuestName(review.guestName),
    guestFirstName: review.guestName.split(" ")[0],
    rating,
    reviewText: review.publicReview,
    categories: review.reviewCategory.map(cat => ({
      category: cat.category.replace(/_/g, " "),
      rating: cat.rating,
    })),
    date: review.submittedAt,
    dateFormatted: formatDate(review.submittedAt),
    channel: (review as any).channel || "Airbnb",
    type: review.type,
    status: review.status,
    isSelected: selectedIds.includes(review.id),
  };
}

export async function getAllReviews(): Promise<NormalizedReview[]> {
  // Fetch from Hostaway API
  const hostawayReviews = await fetchHostawayReviews();
  
  // Merge with mock data (since sandbox is empty)
  const allReviews: HostawayReview[] = [
    ...hostawayReviews,
    ...(mockReviews as HostawayReview[]),
  ];
  
  // Get selected review IDs
  const selectedIds = await getSelectedReviewIds();
  
  // Normalize all reviews
  const normalized = await Promise.all(
    allReviews.map(review => normalizeReview(review, selectedIds))
  );
  
  // Sort by date (most recent first)
  return normalized.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getReviewsByProperty(propertyId: string): Promise<NormalizedReview[]> {
  const allReviews = await getAllReviews();
  return allReviews.filter(review => review.propertyId === propertyId);
}

export async function getSelectedReviewsByProperty(propertyId: string): Promise<NormalizedReview[]> {
  const reviews = await getReviewsByProperty(propertyId);
  return reviews.filter(review => review.isSelected);
}

