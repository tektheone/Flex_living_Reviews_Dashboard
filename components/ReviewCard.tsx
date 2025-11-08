import { NormalizedReview } from "@/types/review";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: NormalizedReview;
  showProperty?: boolean;
  showActions?: boolean;
  onToggleSelection?: (reviewId: number) => void;
  isUpdating?: boolean;
}

export default function ReviewCard({
  review,
  showProperty = false,
  showActions = false,
  onToggleSelection,
  isUpdating = false,
}: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "from-emerald-500 to-green-500";
    if (rating >= 8) return "from-green-500 to-lime-500";
    if (rating >= 7) return "from-yellow-500 to-amber-500";
    if (rating >= 6) return "from-orange-500 to-amber-500";
    return "from-red-500 to-pink-500";
  };
  
  const getRatingBadge = (rating: number) => {
    if (rating >= 9) return "Exceptional";
    if (rating >= 8) return "Excellent";
    if (rating >= 7) return "Very Good";
    if (rating >= 6) return "Good";
    return "Fair";
  };
  
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex gap-5 mb-4">
        {/* Property Thumbnail */}
        {showProperty && (
          <div className="flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={review.propertyImage}
                alt={review.propertyName}
                className="w-28 h-28 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        )}
        
        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {/* Guest Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {review.guestFirstName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{review.guestName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{review.dateFormatted}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">{review.channel}</span>
                  </div>
                </div>
              </div>
              {showProperty && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2 ml-13">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="font-medium text-gray-700 line-clamp-1">
                    {review.propertyName}
                  </span>
                </div>
              )}
            </div>
            
            {/* Rating Badge */}
            <div className="flex flex-col items-end gap-2">
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRatingColor(review.rating)} text-white font-bold text-lg shadow-lg`}>
                {review.rating.toFixed(1)}
              </div>
              <span className="text-xs font-medium text-gray-500">{getRatingBadge(review.rating)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Text */}
      <p className="text-gray-700 mb-5 leading-relaxed text-base line-clamp-3">{review.reviewText}</p>
      
      {/* Rating Categories & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <StarRating rating={review.rating} showNumber={false} />
          {review.categories.length > 0 && (
            <div className="flex gap-2">
              {review.categories.slice(0, 3).map((cat, idx) => (
                <div key={idx} className="group/cat relative">
                  <div className="px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 rounded-lg text-xs font-medium text-gray-600 hover:text-indigo-600 transition-colors cursor-help">
                    <span className="capitalize">{cat.category.split(' ')[0]}</span>: <span className="font-semibold">{cat.rating}</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/cat:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {cat.category}: {cat.rating}/10
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showActions && onToggleSelection && (
          <button
            onClick={() => !isUpdating && onToggleSelection(review.id)}
            disabled={isUpdating}
            className={`group/btn px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isUpdating 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : review.isSelected
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60"
                : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 border border-gray-200"
            }`}
          >
            <span className="flex items-center gap-2">
              {isUpdating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : review.isSelected ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Visible
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                  Hidden
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

