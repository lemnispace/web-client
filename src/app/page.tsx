import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MosaicCollection } from "./components/mosaic";

const callouts = [
  {
    name: "Desk and Office",
    description: "Work from home accessories",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "#",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MosaicCollection />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
