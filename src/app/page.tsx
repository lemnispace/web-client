import { CallToAction } from "./components/CallToAction";
import ComingSoon from "./components/ComingSoon";
import { Hero } from "./components/Hero";
import { MosaicCollection } from "./components/mosaic";

export default function Home() {
  return (
    <main>
      <Hero />
      <MosaicCollection />
      <CallToAction />
      <ComingSoon />
    </main>
  );
}
