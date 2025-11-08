interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export default function StarRating({ 
  rating, 
  maxRating = 10, 
  size = "md",
  showNumber = false 
}: StarRatingProps) {
  // Convert rating to 5-star scale
  const stars = (rating / maxRating) * 5;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <svg
                key={index}
                className={`${sizeClasses[size]} text-yellow-400 fill-current`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <svg
                key={index}
                className={`${sizeClasses[size]} text-yellow-400`}
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#e5e7eb" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half)"
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
            );
          } else {
            return (
              <svg
                key={index}
                className={`${sizeClasses[size]} text-gray-300`}
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
            );
          }
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

