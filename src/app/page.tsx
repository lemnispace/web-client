import { CallToAction } from "./components/landing_page/CallToAction";
import ComingSoon from "./components/landing_page/ComingSoon";
import { Hero } from "./components/landing_page/Hero";
import { MosaicCollection } from "./components/mosaic";

export default function Home() {
  return (
    <main>
      <Hero />
      <MosaicCollection />
      {/* <CallToAction /> */}
      <ComingSoon />
    </main>
  );
}
