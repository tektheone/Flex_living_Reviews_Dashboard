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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 mx-auto mb-4"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center bg-white rounded-2xl p-8 shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reviews Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Manage and curate property reviews
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Stats Cards with Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Reviews Card */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">
                    {stats.totalReviews}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  Active
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">Across {properties.length} properties</span>
              </div>
            </div>
          </div>
          
          {/* Average Rating Card */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(stats.averageRating / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Selected Reviews Card */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Selected for Website</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
                    {stats.selectedReviews}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{((stats.selectedReviews / stats.totalReviews) * 100).toFixed(0)}% of total</span>
                <span className="text-gray-500">•</span>
                <span className="text-amber-600 font-medium">Public</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Properties Overview</h2>
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.propertyStats.map(propStats => (
              <PropertyCard key={propStats.propertyId} stats={propStats} />
            ))}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Reviews</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{filteredReviews.length} results</span>
              <button
                onClick={fetchData}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <FilterBar
            properties={properties.map(p => ({ id: p.id, name: p.name }))}
            onFilterChange={handleFilterChange}
          />
          
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No reviews match your filters</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
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
