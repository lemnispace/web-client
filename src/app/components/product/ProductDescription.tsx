import clsx from "clsx";

interface ProductDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  description: string;
}

export default function ProductDescription({
  description,
  className,
  ...props
}: ProductDescriptionProps) {
  return (
    <>
      <h3 className="sr-only">Description</h3>
      <div
        className={clsx("space-y-6 text-base text-gray-700", className)}
        {...props}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </>
  );
}
