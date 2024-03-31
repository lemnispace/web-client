import clsx from "clsx";

interface ProductDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  descriptionHtml?: string;
  description?: string;
}

export function ProductDescriptionHtml({
  description,
  descriptionHtml,
  ...props
}: ProductDescriptionProps) {
  if (descriptionHtml) {
    return (
      <div {...props} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
    );
  }
  return <p {...props}>{description}</p>;
}

export default function ProductDescription({
  className,
  ...props
}: ProductDescriptionProps) {
  return (
    <>
      <h3 className="sr-only">Description</h3>
      <ProductDescriptionHtml
        className={clsx("space-y-6 text-base text-gray-700", className)}
        {...props}
      />
    </>
  );
}
