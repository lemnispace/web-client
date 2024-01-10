import backgroundImage from "@/images/bg-orange.png";
import { classNames } from "@/utils";
import Image from "next/image";

interface SlimLayoutProps {
  children: React.ReactNode;
  contentContainerClassName?: string;
  mainContentClassName?: string;
}
export function SlimLayout({
  children,
  contentContainerClassName,
  mainContentClassName,
}: SlimLayoutProps) {
  return (
    <div className="relative flex min-h-full justify-center md:px-12 lg:px-0">
      <div
        className={classNames(
          "relative z-10 flex flex-1 flex-col bg-white px-4 py-10 sm:justify-center md:flex-none md:px-28",
          contentContainerClassName
        )}
      >
        <main
          className={classNames(
            "mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0",
            mainContentClassName
          )}
        >
          {children}
        </main>
      </div>
      <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt=""
          unoptimized
        />
      </div>
    </div>
  );
}
