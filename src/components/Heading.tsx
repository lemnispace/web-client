import clsx from "clsx";
import { HighlightedSpan, HighlightedSpanProps } from "./HighlightedSpan";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  firstLine?: string;
  highlightedLine: string;
  lastLine?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  highlightedProps?: Omit<HighlightedSpanProps, "children">;
}

export function Heading({
  className,
  firstLine,
  highlightedLine,
  lastLine,
  as: Comp = "h1",
  highlightedProps,
  ...props
}: HeadingProps) {
  return (
    <Comp
      {...props}
      className={clsx(
        "font-display font-medium tracking-tight text-gray-900",
        className
      )}
    >
      {firstLine ? `${firstLine} ` : null}
      <HighlightedSpan {...highlightedProps}>{highlightedLine}</HighlightedSpan>
      {lastLine ? ` ${lastLine}` : null}
    </Comp>
  );
}
