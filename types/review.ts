// Hostaway API Response Types
export interface HostawayReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

// Normalized Review Types
export interface NormalizedReviewCategory {
  category: string;
  rating: number;
}

export interface NormalizedReview {
  id: number;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  guestName: string;
  guestFirstName: string;
  rating: number;
  reviewText: string;
  categories: NormalizedReviewCategory[];
  date: string;
  dateFormatted: string;
  channel: string;
  type: string;
  status: string;
  isSelected: boolean;
}

// Property Types
export interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  averageRating: number;
  totalReviews: number;
}

// API Response Types
export interface ReviewsApiResponse {
  success: boolean;
  data?: NormalizedReview[];
  error?: string;
}

export interface PropertiesApiResponse {
  success: boolean;
  data?: Property[];
  error?: string;
}

export interface PropertyDetailsApiResponse {
  success: boolean;
  data?: {
    property: Property;
    reviews: NormalizedReview[];
  };
  error?: string;
}

// Filter Types
export interface ReviewFilters {
  propertyId?: string;
  minRating?: number;
  maxRating?: number;
  channel?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

// Stats Types
export interface PropertyStats {
  propertyId: string;
  propertyName: string;
  averageRating: number;
  totalReviews: number;
  selectedReviews: number;
  categoryAverages: {
    [key: string]: number;
  };
}

