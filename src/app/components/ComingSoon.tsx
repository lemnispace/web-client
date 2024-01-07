import Section from "@/components/section";

export default function ComingSoon() {
  return (
    <Section
      className="py-24 sm:py-32"
      id="coming-soon"
      aria-label="More products coming soon"
    >
      <div className="mx-auto max-w-lg text-center">
        <h2 className="font-display text-3xl tracking-tight text-gray-900 sm:text-4xl">
          More Great Products Coming Soon
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          We are working hard to bring you more great products. Please check
          back soon.
        </p>
      </div>
    </Section>
  );
}
