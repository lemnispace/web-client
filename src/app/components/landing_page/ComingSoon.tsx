import Section from "@/components/section";
import { COMING_SOON_TEXT } from "@/utils/text";

export default function ComingSoon() {
  return (
    <Section
      className="py-24 sm:py-32"
      id="coming-soon"
      aria-label={COMING_SOON_TEXT.shortDescription}
    >
      <div className="mx-auto max-w-lg text-center">
        <h2 className="font-display text-3xl tracking-tight text-gray-900 sm:text-4xl">
          {COMING_SOON_TEXT.title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {COMING_SOON_TEXT.description}
        </p>
      </div>
    </Section>
  );
}
