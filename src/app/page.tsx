import { CallToAction } from "./components/CallToAction";
import ComingSoon from "./components/ComingSoon";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NavLinkProps } from "./components/NavLink";
import { MosaicCollection } from "./components/mosaic";

export default function Home() {
  const navLinks: NavLinkProps[] = [
    { href: "#Mosaic", children: "Mosaics" },
    { href: "#coming-soon", children: "More Coming Soon" },
  ];
  return (
    <>
      <Header navLinks={navLinks} />
      <main>
        <Hero />
        <MosaicCollection />
        <CallToAction />
        <ComingSoon />
      </main>
      <Footer navLinks={navLinks} />
    </>
  );
}
