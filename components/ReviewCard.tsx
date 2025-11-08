import { NormalizedReview } from "@/types/review";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: NormalizedReview;
  showProperty?: boolean;
  showActions?: boolean;
  onToggleSelection?: (reviewId: number) => void;
}

export default function ReviewCard({
  review,
  showProperty = false,
  showActions = false,
  onToggleSelection,
}: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-100 text-green-800 border-green-200";
    if (rating >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4 mb-4">
        {/* Property Thumbnail */}
        {showProperty && (
          <div className="flex-shrink-0">
            <img
              src={review.propertyImage}
              alt={review.propertyName}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}
        
        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(
                    review.rating
                  )}`}
                >
                  {review.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{review.dateFormatted}</span>
                <span>•</span>
                <span>{review.channel}</span>
                {showProperty && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-gray-700">
                      {review.propertyName}
                    </span>
                  </>
                )}
              </div>
            </div>
            {showActions && onToggleSelection && (
              <button
                onClick={() => onToggleSelection(review.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  review.isSelected
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {review.isSelected ? "Hide on Website" : "Show on Website"}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>
      
      <div className="flex items-center gap-4">
        <StarRating rating={review.rating} showNumber={false} />
        {review.categories.length > 0 && (
          <div className="flex gap-3 text-xs text-gray-600">
            {review.categories.slice(0, 3).map((cat, idx) => (
              <span key={idx} className="capitalize">
                {cat.category}: {cat.rating}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

