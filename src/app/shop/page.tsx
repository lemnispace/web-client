import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";

const products = [
  {
    id: 1,
    name: "Focus Paper Refill",
    href: "#",
    price: "$13",
    description: "3 sizes available",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 2,
    name: "Focus Card Holder",
    href: "#",
    price: "$64",
    description: "Walnut",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-02.jpg",
    imageAlt: "Paper card sitting upright in walnut card holder on desk.",
  },
  {
    id: 3,
    name: "Focus Carry Pouch",
    href: "#",
    price: "$32",
    description: "Heather Gray",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-03.jpg",
    imageAlt:
      "Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.",
  },
  // More products...
];

function ProductsMainMessageSection() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.title}
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
        {PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.description}
      </p>
    </div>
  );
}

export default function Shop() {
  return (
    <div className="bg-gray-50">
      <main>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <ProductsMainMessageSection />
          <ProductGridSection products={products} />
        </div>
      </main>
    </div>
  );
}
