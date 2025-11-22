import { Container } from "@/components/container";
import { Heading } from "@/components/Heading";
import { COLLECTIONS_TEXT } from "@/utils/text"; // Assuming this will exist

export default function CategorySection() {
  // TODO: Fetch collections from API

  const categories = [
    {
      id: "1",
      name: "T-Shirts",
      imageSrc: "/_next/static/media/mosaic-1.f0170a7b.jpeg", // Placeholder
      imageAlt: "T-Shirts category",
      href: "#",
    },
    {
      id: "2",
      name: "Mugs",
      imageSrc: "/_next/static/media/mosaic-1.f0170a7b.jpeg", // Placeholder
      imageAlt: "Mugs category",
      href: "#",
    },
    {
      id: "3",
      name: "Posters",
      imageSrc: "/_next/static/media/mosaic-1.f0170a7b.jpeg", // Placeholder
      imageAlt: "Posters category",
      href: "#",
    },
  ];

  return (
    <div className="bg-white">
      <Container className="py-16 sm:py-24 lg:py-32">
        <Heading
          firstLine={COLLECTIONS_TEXT.title[0]}
          highlightedLine={COLLECTIONS_TEXT.title[1]}
          lastLine={COLLECTIONS_TEXT.title[2]}
          className="text-center"
        />

        <div className="mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {categories.map((category) => (
            <a key={category.id} href={category.href} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                <img
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">Shop now</p>
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}
