import clsx from "clsx";

interface MainMessageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export default function ProductsMainMessageSection({
  title,
  description,
  className,
  ...props
}: MainMessageSectionProps) {
  return (
    <div className={clsx("py-24 text-center", className)} {...props}>
      <h1 className="text-4xl font-bold font-display tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
        {description}
      </p>
    </div>
  );
}
