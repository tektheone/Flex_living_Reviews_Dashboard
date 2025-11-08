import { PropertyStats } from "@/types/review";
import StarRating from "./StarRating";
import Link from "next/link";

interface PropertyCardProps {
  stats: PropertyStats;
}

export default function PropertyCard({ stats }: PropertyCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <Link href={`/property/${stats.propertyId}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {stats.propertyName}
            </h3>
            <div className="flex items-center gap-2">
              <StarRating rating={stats.averageRating} size="sm" />
              <span className={`text-lg font-bold ${getRatingColor(stats.averageRating)}`}>
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
            <p className="text-xs text-gray-500">Total Reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-600">{stats.selectedReviews}</p>
            <p className="text-xs text-gray-500">Selected</p>
          </div>
        </div>
        
        {Object.keys(stats.categoryAverages).length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Category Averages</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(stats.categoryAverages).slice(0, 4).map(([category, rating]) => (
                <div key={category} className="flex justify-between">
                  <span className="text-gray-600 capitalize truncate">
                    {category.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

