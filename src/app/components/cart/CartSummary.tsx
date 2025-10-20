import { Button } from "@/components/button";
import { formatPrice } from "@/utils/formatters";
import { isDefined } from "@/utils/validators";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

interface CartSummaryProps {
  subtotal?: number;
  tax?: number;
  total?: number;
  checkoutUrl?: string;
}

export function CartSummary({
  subtotal = 0,
  tax,
  total = 0,
  checkoutUrl,
}: CartSummaryProps) {
  // Convert from cents to dollars for display
  const subtotalDollars = subtotal / 100;
  const taxDollars = isDefined(tax) ? tax / 100 : undefined;
  const totalDollars = total / 100;

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatPrice(subtotalDollars)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Tax estimate</span>
            <a
              href="#"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how tax is calculated
              </span>
              <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {isDefined(taxDollars) ? formatPrice(taxDollars) : "--"}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            {formatPrice(totalDollars)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          href={checkoutUrl || "/checkout"}
          className="w-full"
          type="button"
        >
          Checkout
        </Button>
      </div>
    </section>
  );
}
