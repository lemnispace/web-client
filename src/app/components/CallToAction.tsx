import Image from "next/image";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import backgroundImage from "@/images/bg-orange.png";

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
            Begin Your Creative Journey
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Embark on a path of personal expression with LemniSpace. Unleash
            your creativity and transform your vision into bespoke art pieces
            that tell your unique story.
          </p>
          <Button href="/register" color="white" className="mt-10">
            Start Crafting Now
          </Button>
        </div>
      </Container>
    </section>
  );
}
