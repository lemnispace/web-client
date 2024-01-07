import { Button } from "@/components/button";
import clsx from "clsx";
import Image from "next/image";

interface SingleCollectionProps extends React.HTMLAttributes<HTMLElement> {
  imgSrc: string;
  imgAlt: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  blurrDataUrl?: string;
  imgContainerClassName?: string;
}

export default function SingleCollection({
  cta,
  title,
  desc,
  imgAlt,
  imgSrc,
  className,
  href,
  blurrDataUrl,
  imgContainerClassName,
  ...props
}: SingleCollectionProps) {
  return (
    <div
      className={clsx("relative overflow-hidden rounded-lg md:h-96", className)}
      {...props}
    >
      <div className={clsx("absolute inset-0", imgContainerClassName)}>
        <Image
          src={imgSrc}
          alt={imgAlt}
          style={{
            maxWidth: "100%",
          }}
          fill
          className="object-cover object-right-top h-full"
          priority
          {...(blurrDataUrl && {
            placeholder: "blur",
            blurDataURL: blurrDataUrl,
          })}
        />
      </div>
      <div aria-hidden="true" className="relative h-96 w-full md:hidden" />
      <div aria-hidden="true" className="relative h-32 w-full md:hidden" />
      <div className="dark absolute inset-x-0 bottom-0 rounded-bl-lg rounded-br-lg bg-black bg-opacity-75 p-6 backdrop-blur backdrop-filter sm:flex sm:items-center sm:justify-between md:inset-x-auto md:inset-y-0 md:w-96 md:flex-col md:items-start md:rounded-br-none md:rounded-tl-lg">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-300">{desc}</p>
        </div>
        <Button
          href={href}
          outline
          className="mt-6 flex flex-shrink-0 items-center justify-center sm:ml-8 sm:mt-0 md:ml-0 md:w-full"
        >
          {cta}
        </Button>
      </div>
    </div>
  );
}
