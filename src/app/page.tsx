import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NavLinkProps } from "./components/NavLink";
import { MosaicCollection } from "./components/mosaic";

export default function Home() {
  const navLinks: NavLinkProps[] = [{ href: "#Mosaic", children: "Mosaics" }];
  return (
    <>
      <Header navLinks={navLinks} />
      <main>
        <Hero />
        <MosaicCollection />
        <CallToAction />
      </main>
      <Footer navLinks={navLinks} />
    </>
  );
}
