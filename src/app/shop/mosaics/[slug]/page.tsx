import ImageGallery from "@/app/components/product/ImageGallery";
import ProductDescription from "@/app/components/product/ProductDescription";
import ProductDetails from "@/app/components/product/ProductDetails";
import ProductRating from "@/app/components/product/ProductRating";
import ProductSelectionForm from "@/app/components/product/ProductSelectionForm";
import ProductTitle, {
  ProductSectionTitle,
} from "@/app/components/product/ProductTitle";
import mosaicImg2 from "@/images/mosaic/mosaic-2.jpg";
import mosaicImgCloseup from "@/images/mosaic/mosaic-closeup-1.jpg";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

export default function Mosaic(props: MosaicProps) {
  const product = {
    id: 1,
    name: "Text Mosaic",
    href: "/shop/mosaics/text-mosaic",
    price: "$13",
    description:
      "Gift your loved ones a custom text mosaic with their favorite quote or poem. Share your favorite memories with your friends and family. The possibilities are endless",
    colors: [
      {
        name: "Black",
        bgColor: "bg-gray-900",
        selectedColor: "ring-gray-900",
      },
      {
        name: "White",
        bgColor: "bg-gray-100",
        selectedColor: "ring-gray-400",
      },
    ],
    images: [
      {
        id: 1,
        name: "Beautiful Text Mosaic Closeup",
        src: mosaicImgCloseup.src,
        alt: "closeup of a text mosaic",
      },
      {
        id: 2,
        name: "Stylish Wall Mounted Text Mosaic",
        src: mosaicImg2.src,
        alt: "wall mounted text mosaic",
      },
    ],
    details: [
      {
        name: "Features",
        items: [
          "Multiple strap configurations",
          "Spacious interior with top zip closure",
          "Interior dividers to keep you organized",
          "Interior padded sleeve fits up to a 13” laptop",
          "Exterior zip pocket",
          "Full grain leather zipper pulls",
          "Water-resistant, leather-reinforced bottom",
        ],
      },
      {
        name: "Materials",
        items: [
          "1000d CORDURA® nylon outer with coated pack cloth liner",
          "Natural leather lash tabs",
          "Natural leather zip pulls",
        ],
      },
      {
        name: "Care",
        items: [
          "Spot clean",
          "Do not machine wash",
          "Do not dry clean",
          "Do not tumble dry",
          "Do not bleach",
        ],
      },
      {
        name: "Origin",
        items: ["Made in Vietnam"],
      },
    ],
  };
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <ImageGallery product={product} />
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <ProductTitle name={product.name} price={product.price} />
            <ProductRating rating={4} outOf={4} className="mt-3" />

            <div className="mt-6">
              <ProductDescription description={product.description} />
            </div>

            <ProductSelectionForm colors={product.colors} className="mt-6" />

            <section aria-labelledby="details-heading" className="mt-12">
              <ProductSectionTitle id="details-heading">
                Additional details
              </ProductSectionTitle>
              <ProductDetails details={product.details} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
