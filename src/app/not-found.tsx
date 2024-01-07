import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { BUTTON_TEXT, ERROR_TEXTS } from "@/utils/text";
import { Logo } from "./components/Logo";
import { SlimLayout } from "./components/SlimLayout";

export default function NotFound() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">
        {ERROR_TEXTS.notFound.code}
      </p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        {ERROR_TEXTS.notFound.title}
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        {ERROR_TEXTS.notFound.description}
      </p>
      <Button href="/" className="mt-10">
        {BUTTON_TEXT.goBackHome}
      </Button>
    </SlimLayout>
  );
}
