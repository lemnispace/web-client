import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils";

export interface ShoppingCartProps extends React.HTMLAttributes<SVGSVGElement> {
  className?: string;
  numItems?: number;
  description: string;
}

function ShoppingCart({
  className,
  numItems = 0,
  description,
  ...props
}: ShoppingCartProps) {
  return (
    <div className="flex">
      <ShoppingBagIcon
        className={classNames(
          "h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500",
          className
        )}
        aria-hidden="true"
        {...props}
      />
      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        {numItems}
      </span>
      <span className="sr-only">{description}</span>
    </div>
  );
}

export default ShoppingCart;
