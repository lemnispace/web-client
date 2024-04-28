import { Button } from "@/components/button";
import { BUTTON_TEXT, ERROR_TEXTS } from "@/utils/text";
import { SlimLayout } from "./components/SlimLayout";

export default function NotFound() {
  return (
    <SlimLayout>
      <p className="mt-20 text-sm font-medium text-gray-700">
        {ERROR_TEXTS.page[404].code}
      </p>
      <h1 className="mt-3 text-lg font-semibold font-display text-gray-900">
        {ERROR_TEXTS.page[404].title}
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        {ERROR_TEXTS.page[404].description}
      </p>
      <Button href="/" className="mt-10">
        {BUTTON_TEXT.goBackHome}
      </Button>
    </SlimLayout>
  );
}
