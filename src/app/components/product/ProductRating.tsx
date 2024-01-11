import { StarIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface ProductRatingProps extends React.HTMLAttributes<HTMLElement> {
  rating: number;
}

const BASE_RATINGS = [1, 2, 3, 4];

export default function ProductRating({
  rating,
  ...props
}: ProductRatingProps) {
  return (
    <div {...props}>
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        <div className="flex items-center">
          {BASE_RATINGS.map((r) => (
            <StarIcon
              key={r}
              className={clsx(
                rating >= r ? "text-primary-500" : "text-gray-300",
                "h-5 w-5 flex-shrink-0"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="sr-only">{rating} out of 5 stars</p>
      </div>
    </div>
  );
}
