import clsx from "clsx";

interface ProductTitleProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  price: string;
}

export interface ProductSectionTitleProps
  extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}
export function ProductSectionTitle({
  children,
  className,
  ...props
}: ProductSectionTitleProps) {
  return (
    <h2 className={clsx("sr-only", className)} {...props}>
      {children}
    </h2>
  );
}
export default function ProductTitle({
  name,
  price,
  className,
  ...props
}: ProductTitleProps) {
  return (
    <>
      <h1
        className={clsx(
          "text-3xl font-bold tracking-tight text-gray-900",
          className
        )}
        {...props}
      >
        {name}
      </h1>

      <div className="mt-3">
        <ProductSectionTitle>Product information</ProductSectionTitle>
        <p className="text-3xl tracking-tight text-gray-900">{price}</p>
      </div>
    </>
  );
}
