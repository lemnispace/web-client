import { Button } from "@/components/button";
import { Container } from "@/components/container";
import backgroundImage from "@/images/bg-orange.png";
import { BUTTON_TEXT, CTA_TEXT } from "@/utils/text";
import Image from "next/image";

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-primary-500 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {CTA_TEXT.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            {CTA_TEXT.description}
          </p>
          <Button href="/register" color="white" className="mt-10">
            {BUTTON_TEXT.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
