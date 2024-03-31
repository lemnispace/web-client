import clsx from "clsx";

interface ProductDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  descriptionHtml?: string;
  description?: string;
}

interface ProductDescriptionHtmlProps extends ProductDescriptionProps {
  /** if true, a shortened description will be shown for the html version (only the first paragraph) */
  short?: boolean;
}

const shortenHtmlDescription = (html: string) => {
  const match = html.match(/<p>.*?<\/p>/);
  return match ? match[0] : html;
};

export function ProductDescriptionHtml({
  description,
  descriptionHtml,
  short,
  ...props
}: ProductDescriptionHtmlProps) {
  if (descriptionHtml) {
    return (
      <div
        {...props}
        dangerouslySetInnerHTML={{
          __html: short
            ? shortenHtmlDescription(descriptionHtml)
            : descriptionHtml,
        }}
      />
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
