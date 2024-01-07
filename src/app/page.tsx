import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MosaicCollection } from "./components/mosaic";

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
