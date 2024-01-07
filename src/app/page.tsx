import { NAVIGATION_TEXT } from "@/utils/text";
import { CallToAction } from "./components/CallToAction";
import ComingSoon from "./components/ComingSoon";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NavLinkProps } from "./components/NavLink";
import { MosaicCollection } from "./components/mosaic";

export default function Home() {
  const navLinks: NavLinkProps[] = [
    { href: "#Mosaic", children: NAVIGATION_TEXT.mosaics },
    { href: "#coming-soon", children: NAVIGATION_TEXT.comingSoon },
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
