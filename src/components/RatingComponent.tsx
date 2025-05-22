import { addRating, fetchInfo } from "@/utils/DataServices";
import { IRatingInterface } from "@/utils/Interfaces";
import { Star, StarHalf } from "lucide-react";
import React, { useState } from "react";

interface RatingComponentProps {
  usernameToRate: string;
}

const RatingComponent = ({ usernameToRate }: RatingComponentProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const totalStars = 5;
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const starWidth = rect.width;
    const mousePosition = e.clientX - rect.left;
    
    if (mousePosition < starWidth / 2) {
      setHoveredRating(starIndex + 0.5);
    } else {
      setHoveredRating(starIndex + 1);
    }
  };
  
  const handleClick = () => {
    setRating(hoveredRating);
  };

  const renderStars = (currentValue: number, interactive = true) => {
    const displayValue = interactive ? (hoveredRating || rating) : currentValue;
    const stars = [];
    const starSize = interactive ? 28 : 20;
    
    for (let i = 1; i <= totalStars; i++) {
      const starWrapper = (
        <div 
          key={i}
          className={`${interactive ? 'cursor-pointer relative' : ''}`}
          onMouseMove={interactive ? (e) => handleMouseMove(e, i-1) : undefined}
          onClick={interactive ? handleClick : undefined}
        >
          {displayValue >= i ? (
            <Star
              size={starSize}
              className="transition-transform duration-200 hover:scale-110"
              fill="#FFD700"
              stroke="#FFD700"
            />
          ) : displayValue >= i - 0.5 ? (
            <StarHalf
              size={starSize}
              className="transition-transform duration-200 hover:scale-110"
              fill="#FFD700"
              stroke="#FFD700"
            />
          ) : (
            <Star
              size={starSize}
              className="transition-transform duration-200 hover:scale-110"
              fill="white"
              stroke="#FFD700"
            />
          )}
        </div>
      );
      stars.push(starWrapper);
    }
    
    return stars;
  };

  const submitRating = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    try {
      const ratingData: IRatingInterface = {
        rating: Math.ceil(rating * 2) / 2,
        username: fetchInfo().username,
        userToRate: usernameToRate
      };
      
      await addRating(ratingData);
      setIsSubmitting(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting rating:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 md:p-8 bg-white rounded-xl shadow-sm">
      <h2 className="font-[NeueMontreal-Medium] text-center text-xl sm:text-2xl mb-6 sm:mb-8">
        How would you rate <span className="font-[NeueMontreal-Bold]">{usernameToRate}</span>?
      </h2>
      
      <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 mb-8 sm:mb-10" 
        onMouseLeave={() => setHoveredRating(0)}>
        {renderStars(rating)}
      </div>
      
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 mb-2">
          {rating === 0 
            ? "Select a rating" 
            : `Your rating: ${rating} star${rating === 1 ? '' : 's'}`}
        </div>
      </div>
      
      <button
        className={`w-full font-[NeueMontreal-Medium] py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all duration-200 ${
          rating === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800 active:bg-black"
        }`}
        onClick={submitRating}
        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default RatingComponent;
