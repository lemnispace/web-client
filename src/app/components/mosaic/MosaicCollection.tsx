import Section from "@/components/section";
import mosaicImg from "@/images/mosaic/mosaic-2.jpg";
import { BUTTON_TEXT, COLLECTION_TEXT } from "@/utils/text";
import SingleCollection from "../collection/SingleCollection";

export default function MosaicCollection() {
  return (
    <Section
      id="Mosaic"
      aria-label="Mosaic product collections"
      className="bg-gray-100"
      containerClassName="max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl"
    >
      <SingleCollection
        desc={COLLECTION_TEXT.textMosaic.description}
        title={COLLECTION_TEXT.textMosaic.title}
        href="/shop/mosaics"
        imgSrc={mosaicImg.src}
        imgAlt="Text mosaic portrait of a loving couple"
        cta={BUTTON_TEXT.collectionCta}
        imgContainerClassName="-mr-10 sm:mr-0 md:-mr-4 md:-mt-8 lg:-mt-24"
      />
    </Section>
  );
}
