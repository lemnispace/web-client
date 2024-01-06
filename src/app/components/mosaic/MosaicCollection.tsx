import CollectionSection from "../collection/CollectionSection";
import SingleCollection from "../collection/SingleCollection";

const item = {
  title: "Mosaic",
  desc: "Create a personalized text mosaic portrait with your own words and messages. Each mosaic is carefully crafted to capture the essence of your unique story. Perfect as a gift or a stunning piece of art for your home or office.",
  imgSrc:
    "https://tailwindui.com/img/ecommerce-images/category-page-01-featured-collection.jpg",
  imgAlt: "Text mosaic portrait",
  href: "#",
};

export default function MosaicCollection() {
  return (
    <CollectionSection
      id="Mosaic"
      aria-label="Mosaic product collections"
      containerClassName="max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl"
    >
      <SingleCollection {...item} cta="Create your own" />
    </CollectionSection>
  );
}
