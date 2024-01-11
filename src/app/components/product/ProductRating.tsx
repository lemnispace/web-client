import { PRODUCT_RATING_TEXT } from "@/utils/text";
import { StarIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface ProductRatingProps extends React.HTMLAttributes<HTMLElement> {
  rating: number;
  outOf?: number;
}

function validateRating(rating: number, outOf: number) {
  if (outOf <= 0) {
    throw new Error(`outOf must be greater than 0. Received ${outOf}`);
  }
  if (rating > outOf || rating < 0) {
    throw new Error(
      `Rating must be between 0 and ${outOf}. Received ${rating}`
    );
  }
}

export default function ProductRating({
  rating,
  outOf = 5,
  ...props
}: ProductRatingProps) {
  validateRating(rating, outOf);
  const baseRatings = Array(outOf).fill(0);
  const description = PRODUCT_RATING_TEXT.getShortDescription(rating, outOf);
  return (
    <div {...props}>
      <h3 className="sr-only">{PRODUCT_RATING_TEXT.title}</h3>
      <div className="flex items-center">
        <div className="flex items-center" aria-label="product rating">
          {baseRatings.map((_, r) => (
            <StarIcon
              key={r}
              className={clsx(
                rating > r ? "text-primary-500" : "text-gray-300",
                "h-5 w-5 flex-shrink-0"
              )}
              aria-hidden="true"
              data-testid={rating > r ? "star-icon" : "gray-star-icon"}
            />
          ))}
        </div>
        <p className="sr-only">{description}</p>
      </div>
    </div>
  );
}
