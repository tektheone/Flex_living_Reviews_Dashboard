"use client";

import { useEffect, useState } from "react";
import { NormalizedReview, Property, PropertyStats } from "@/types/review";
import ReviewCard from "@/components/ReviewCard";
import PropertyCard from "@/components/PropertyCard";
import FilterBar, { Filters } from "@/components/FilterBar";
import Link from "next/link";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [reviewsRes, propertiesRes] = await Promise.all([
        fetch("/api/reviews/hostaway"),
        fetch("/api/properties"),
      ]);
      
      if (!reviewsRes.ok || !propertiesRes.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const reviewsData = await reviewsRes.json();
      const propertiesData = await propertiesRes.json();
      
      if (reviewsData.success && propertiesData.success) {
        setReviews(reviewsData.data);
        setFilteredReviews(reviewsData.data);
        setProperties(propertiesData.data);
      } else {
        throw new Error("API returned error");
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleSelection = async (reviewId: number) => {
    try {
      const response = await fetch("/api/reviews/toggle-selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to toggle selection");
      }
      
      const data = await response.json();
      
      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, isSelected: data.data.isSelected }
            : review
        )
      );
      
      setFilteredReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, isSelected: data.data.isSelected }
            : review
        )
      );
    } catch (err) {
      console.error("Error toggling selection:", err);
      alert("Failed to update review selection. Please try again.");
    }
  };
  
  const handleFilterChange = (filters: Filters) => {
    let filtered = [...reviews];
    
    // Filter by property
    if (filters.propertyId !== "all") {
      filtered = filtered.filter(r => r.propertyId === filters.propertyId);
    }
    
    // Filter by min rating
    const minRating = parseFloat(filters.minRating);
    if (minRating > 0) {
      filtered = filtered.filter(r => r.rating >= minRating);
    }
    
    // Filter by channel
    if (filters.channel !== "all") {
      filtered = filtered.filter(r => r.channel === filters.channel);
    }
    
    // Search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.guestName.toLowerCase().includes(query) ||
          r.reviewText.toLowerCase().includes(query)
      );
    }
    
    // Sort
    switch (filters.sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }
    
    setFilteredReviews(filtered);
  };
  
  const calculateStats = (): {
    totalReviews: number;
    averageRating: number;
    selectedReviews: number;
    propertyStats: PropertyStats[];
  } => {
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews || 0;
    const selectedReviews = reviews.filter(r => r.isSelected).length;
    
    const propertyStatsMap = new Map<string, PropertyStats>();
    
    reviews.forEach(review => {
      if (!propertyStatsMap.has(review.propertyId)) {
        propertyStatsMap.set(review.propertyId, {
          propertyId: review.propertyId,
          propertyName: review.propertyName,
          averageRating: 0,
          totalReviews: 0,
          selectedReviews: 0,
          categoryAverages: {},
        });
      }
      
      const stats = propertyStatsMap.get(review.propertyId)!;
      stats.totalReviews++;
      stats.averageRating += review.rating;
      if (review.isSelected) stats.selectedReviews++;
      
      review.categories.forEach(cat => {
        if (!stats.categoryAverages[cat.category]) {
          stats.categoryAverages[cat.category] = 0;
        }
        stats.categoryAverages[cat.category] += cat.rating;
      });
    });
    
    const propertyStats = Array.from(propertyStatsMap.values()).map(stats => ({
      ...stats,
      averageRating: stats.averageRating / stats.totalReviews,
      categoryAverages: Object.fromEntries(
        Object.entries(stats.categoryAverages).map(([key, value]) => [
          key,
          value / stats.totalReviews,
        ])
      ),
    }));
    
    return { totalReviews, averageRating, selectedReviews, propertyStats };
  };
  
  const stats = calculateStats();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reviews Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and curate property reviews
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalReviews}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selected for Website</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.selectedReviews}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Properties Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.propertyStats.map(propStats => (
              <PropertyCard key={propStats.propertyId} stats={propStats} />
            ))}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Reviews</h2>
          
          <FilterBar
            properties={properties.map(p => ({ id: p.id, name: p.name }))}
            onFilterChange={handleFilterChange}
          />
          
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No reviews match your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showProperty={true}
                  showActions={true}
                  onToggleSelection={handleToggleSelection}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

