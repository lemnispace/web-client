import Section from "@/components/section";
import mosaicImg from "@/images/mosaic/mosaic-2.jpg";
import SingleCollection from "../collection/SingleCollection";

const item = {
  title: "Text Mosaic",
  desc: "Create a personalized text mosaic portrait with your own words and messages. Perfect as a gift or a stunning piece of art for your home or office.",
  imgSrc: mosaicImg.src,
  imgAlt: "Text mosaic portrait of a loving couple",
  href: "#",
  blurrDataUrl: mosaicImg.blurDataURL,
};

export default function MosaicCollection() {
  return (
    <Section
      id="Mosaic"
      aria-label="Mosaic product collections"
      className="bg-gray-100"
      containerClassName="max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl"
    >
      <SingleCollection
        {...item}
        cta="Craft Your Own"
        imgContainerClassName="-mr-10 sm:mr-0 md:-mr-4 md:-mt-8 lg:-mt-24"
      />
    </Section>
  );
}
