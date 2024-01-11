import { Container } from "@/components/container";
import clsx from "clsx";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClassName?: string;
}

export default function Section({
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={clsx("bg-white", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
