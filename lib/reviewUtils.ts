import mockProperties from "@/data/mock-properties.json";
import { Property } from "@/types/review";

const properties = mockProperties as Property[];

export function extractPropertyId(listingName: string): string {
  if (listingName.includes("Shoreditch Heights")) return "1";
  if (listingName.includes("Canary Wharf Tower")) return "2";
  if (listingName.includes("Westminster Gardens")) return "3";
  if (listingName.includes("Mayfair Residence")) return "4";

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
    const normalized = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T");
    const date = new Date(normalized);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getPropertyImage(propertyId: string): string {
  const property = properties.find((p) => p.id === propertyId);
  return property?.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";
}

