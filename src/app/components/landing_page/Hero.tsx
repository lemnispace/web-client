import { Heading } from "@/components/Heading";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { NAVIGATION_LINKS } from "@/utils/links";
import { BUTTON_TEXT, HERO_TEXT } from "@/utils/text";

export function Hero() {
  return (
    <Container className="pb-16 pt-20 text-center lg:pt-32">
      <Heading
        firstLine={HERO_TEXT.title[0]}
        highlightedLine={HERO_TEXT.title[1]}
        lastLine={HERO_TEXT.title[2]}
        aria-label={HERO_TEXT.title.join(" ")}
        className="mx-auto max-w-4xl text-5xl sm:text-7xl"
      />
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700">
        {HERO_TEXT.description}
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <Button href={NAVIGATION_LINKS.shop}>
          {BUTTON_TEXT.landing.heroCta}
        </Button>
      </div>
    </Container>
  );
}
