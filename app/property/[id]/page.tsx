"use client";

import { useEffect, useState } from "react";
import { Property, NormalizedReview } from "@/types/review";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);
  
  const fetchPropertyData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/property/${propertyId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch property");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProperty(data.data.property);
        setReviews(data.data.reviews);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      setError("Failed to load property. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Property not found"}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const calculateCategoryAverages = () => {
    if (reviews.length === 0) return {};
    
    const categoryTotals: { [key: string]: { sum: number; count: number } } = {};
    
    reviews.forEach(review => {
      review.categories.forEach(cat => {
        if (!categoryTotals[cat.category]) {
          categoryTotals[cat.category] = { sum: 0, count: 0 };
        }
        categoryTotals[cat.category].sum += cat.rating;
        categoryTotals[cat.category].count++;
      });
    });
    
    return Object.fromEntries(
      Object.entries(categoryTotals).map(([key, value]) => [
        key,
        value.sum / value.count,
      ])
    );
  };
  
  const categoryAverages = calculateCategoryAverages();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Flex Living
            </Link>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.name}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <StarRating rating={property.averageRating} size="sm" />
              <span className="font-semibold text-gray-900">
                {property.averageRating.toFixed(1)}
              </span>
              <span>({property.totalReviews} reviews)</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {property.location}
            </span>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden">
            <div className="col-span-4 md:col-span-2 row-span-2">
              <img
                src={property.images[selectedImage]}
                alt={property.name}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                style={{ maxHeight: "500px" }}
              />
            </div>
            {property.images.slice(1, 5).map((image, idx) => (
              <div key={idx} className="col-span-2 md:col-span-1">
                <img
                  src={image}
                  alt={`${property.name} ${idx + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ maxHeight: "245px" }}
                  onClick={() => setSelectedImage(idx + 1)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-center gap-6 text-gray-900 mb-4">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {property.bedrooms} bedrooms
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {property.bathrooms} bathrooms
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Up to {property.maxGuests} guests
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
            
            {/* Amenities */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={property.averageRating} size="md" />
                  <span className="text-lg font-semibold text-gray-900">
                    {property.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>
              
              {/* Category Ratings */}
              {Object.keys(categoryAverages).length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                  {Object.entries(categoryAverages).map(([category, rating]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {category.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(rating / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Individual Reviews */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No reviews available yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div
                      key={review.id}
                      className="pb-6 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {review.guestFirstName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {review.guestName}
                            </h3>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <p className="text-sm text-gray-500">{review.dateFormatted}</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {review.channel}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.reviewText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    £{property.pricePerNight}
                  </span>
                  <span className="text-gray-600">/ night</span>
                </div>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-3">
                Check Availability
              </button>
              
              <p className="text-center text-sm text-gray-500 mb-4">
                You won&apos;t be charged yet
              </p>
              
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    £{property.pricePerNight} × 5 nights
                  </span>
                  <span className="font-medium text-gray-900">
                    £{property.pricePerNight * 5}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="font-medium text-gray-900">£50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium text-gray-900">£75</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>£{property.pricePerNight * 5 + 125}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 Flex Living. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

