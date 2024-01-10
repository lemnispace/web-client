import { Container } from "@/components/container";
import { classNames } from "@/utils";

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
    <section className={classNames("bg-white", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
