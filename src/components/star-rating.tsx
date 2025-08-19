import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}

const MAX_RATING = 5;
const MIN_RATING = 0;

export const StarRating = ({
  rating,
  className,
  iconClassName,
  text,
}: Props) => {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));
  
  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index} // ✅ MAIN FIX: Added unique key
          className={cn(
            "size-4",
            index < safeRating ? "fill-black" : "",
            iconClassName
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
};