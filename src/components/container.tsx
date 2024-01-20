import clsx from "clsx";

interface ContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  overrideMaxWidth?: boolean;
}

export function Container({
  className,
  overrideMaxWidth,
  ...props
}: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto px-4 sm:px-6 lg:px-8",
        !overrideMaxWidth && "max-w-7xl",
        className
      )}
      {...props}
    />
  );
}
