import { HostawayReview, NormalizedReview } from "@/types/review";
import { fetchHostawayReviews } from "./hostaway";
import { getSelectedReviewIds } from "./storage";
import mockReviews from "@/data/mock-reviews.json";
import { fetchGoogleReviews } from "./googleReviews";
import {
  extractPropertyId,
  formatGuestName,
  calculateAverageRating,
  formatDate,
  getPropertyImage,
} from "./reviewUtils";

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
    propertyImage: getPropertyImage(propertyId),
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
  // Fetch from Hostaway API (only returns normalized Hostaway reviews)
  const hostawayReviews = await fetchHostawayReviews();

  // Merge with mock data (since sandbox is empty)
  const allReviews: HostawayReview[] = [
    ...hostawayReviews,
    ...(mockReviews as HostawayReview[]),
  ];

  // Get selected review IDs
  const selectedIds = await getSelectedReviewIds();

  // Normalize Hostaway + mock reviews
  const normalizedHostaway = await Promise.all(
    allReviews.map(review => normalizeReview(review, selectedIds))
  );

  // Fetch Google reviews (already normalized)
  const googleReviews = await fetchGoogleReviews();

  const combinedReviews = [...normalizedHostaway, ...googleReviews];

  return combinedReviews.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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

