import { Heading, HeadingProps } from "@/components/Heading";
import clsx from "clsx";

interface MainMessageSectionWithHighlightProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  description: string;
  headingProps?: HeadingProps
}

interface MainMessageSectionWithoutHighlightProps
  extends React.HTMLAttributes<HTMLDivElement> {
  description: string;
  title: string;
}

type MainMessageSectionProps = MainMessageSectionWithHighlightProps | MainMessageSectionWithoutHighlightProps;

export default function ProductsMainMessageSection({
  description,
  className,
  ...props
}: MainMessageSectionProps) {
  if("headingProps" in props && props.headingProps){
    const { headingProps, ...rest } = props;
    return (
      <div className={clsx("py-24 text-center", className)} {...rest}>
      <Heading
        {...headingProps}
        className={clsx(
          "text-4xl font-bold font-display tracking-tight",
          headingProps.className
        )}
      />
      <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
        {description}
      </p>
    </div>
    );
  }

  if(!("title" in props)){
    throw new Error("title is required for MainMessageSectionWithoutHighlightProps");
  }
  const {title, ...rest} = props;

  return (
    <div className={clsx("py-24 text-center", className)} {...rest}>
      <h1 className="text-4xl font-bold font-display tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
        {description}
      </p>
    </div>
  );
}
