import { Container } from "@/components/container";
import clsx from "clsx";

interface CollectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClassName?: string;
}

export default function CollectionSection({
  className,
  containerClassName,
  children,
  ...props
}: CollectionProps) {
  return (
    <section className={clsx("bg-gray-100", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
