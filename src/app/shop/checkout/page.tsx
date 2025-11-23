"use client";

import { useCart } from "@/app/hooks/useCart";
import { Container } from "@/components/container";
import { formatPrice } from "@/utils/formatters";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order placement delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to success page (to be implemented) or back to shop
    alert("Order placed successfully! (Mocked)");
    router.push("/shop");
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <main className="bg-[#F6F9FC] min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading checkout...</p>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="bg-[#F6F9FC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            href="/shop"
            className="text-primary font-medium hover:underline"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F6F9FC] min-h-screen font-display">
      <div className="relative flex w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5 sm:py-10 px-4 sm:px-6 md:px-8">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-4 sm:px-6 md:px-10 py-4 mb-6">
                <div className="flex items-center gap-3 text-[#333333]">
                  <div className="size-6 text-primary">
                    <svg
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        clipRule="evenodd"
                        d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-[#333333] text-xl font-bold leading-tight tracking-[-0.015em]">
                    LemniSpace
                  </h2>
                </div>
                <div className="flex flex-1 justify-end">
                  <div className="flex items-center gap-1">
                    <Link
                      className="text-primary text-sm font-medium leading-normal hover:underline"
                      href="/shop/cart"
                    >
                      Back to Cart
                    </Link>
                  </div>
                </div>
              </header>
              <main className="flex flex-col gap-8">
                <div className="flex flex-wrap justify-between gap-3 px-4 sm:px-6 md:px-10">
                  <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-[#333333] text-4xl font-extrabold leading-tight tracking-[-0.033em]">
                      Checkout
                    </p>
                    <p className="text-gray-500 text-base font-normal leading-normal">
                      Please review your order and complete your purchase.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder}>
                  <div className="px-4 sm:px-6 md:px-10 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      {/* Section 1: Shipping Information */}
                      <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 py-5 border-b border-gray-200">
                        1. Shipping Information
                      </h2>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <label className="flex flex-col col-span-2">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            Full Name
                          </p>
                          <input
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="John Doe"
                          />
                        </label>
                        <label className="flex flex-col col-span-2">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            Street Address
                          </p>
                          <input
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="123 Innovation Drive"
                          />
                        </label>
                        <label className="flex flex-col col-span-2">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            Apartment, suite, etc.{" "}
                            <span className="text-gray-400">(Optional)</span>
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="Apt 4B"
                          />
                        </label>
                        <label className="flex flex-col">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            City
                          </p>
                          <input
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="Techville"
                          />
                        </label>
                        <label className="flex flex-col">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            State / Province
                          </p>
                          <input
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="California"
                          />
                        </label>
                        <label className="flex flex-col">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            ZIP / Postal Code
                          </p>
                          <input
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="90210"
                          />
                        </label>
                        <label className="flex flex-col">
                          <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                            Country
                          </p>
                          <input
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                            placeholder="United States"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 md:px-10 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      {/* Section 2: Payment Method */}
                      <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 py-5 border-b border-gray-200">
                        2. Payment Method
                      </h2>
                      <div className="p-6">
                        <fieldset>
                          <legend className="sr-only">Payment method</legend>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="relative">
                              <input
                                defaultChecked
                                className="peer sr-only"
                                id="credit-card"
                                name="payment-method"
                                type="radio"
                                value="credit-card"
                              />
                              <label
                                className="flex items-center justify-center p-4 h-full border border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/50"
                                htmlFor="credit-card"
                              >
                                <span>Credit / Debit Card</span>
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                className="peer sr-only"
                                id="paypal"
                                name="payment-method"
                                type="radio"
                                value="paypal"
                              />
                              <label
                                className="flex items-center justify-center p-4 h-full border border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/50"
                                htmlFor="paypal"
                              >
                                <span>PayPal</span>
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                className="peer sr-only"
                                id="google-pay"
                                name="payment-method"
                                type="radio"
                                value="google-pay"
                              />
                              <label
                                className="flex items-center justify-center p-4 h-full border border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/50"
                                htmlFor="google-pay"
                              >
                                <span>Google Pay</span>
                              </label>
                            </div>
                          </div>
                        </fieldset>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <label className="flex flex-col col-span-2">
                            <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                              Card Number
                            </p>
                            <input
                              required
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                              placeholder="•••• •••• •••• ••••"
                            />
                          </label>
                          <label className="flex flex-col">
                            <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                              Expiration Date (MM/YY)
                            </p>
                            <input
                              required
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                              placeholder="MM / YY"
                            />
                          </label>
                          <label className="flex flex-col">
                            <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                              CVV
                            </p>
                            <input
                              required
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                              placeholder="•••"
                            />
                          </label>
                          <label className="flex flex-col col-span-2">
                            <p className="text-[#333333] text-sm font-medium leading-normal pb-2">
                              Name on Card
                            </p>
                            <input
                              required
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-white focus:border-primary h-12 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                              placeholder="John Doe"
                            />
                          </label>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm">
                          <LockClosedIcon className="h-5 w-5" />
                          <span>
                            Your payment is secure. We are SSL certified.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 md:px-10 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      {/* Section 3: Order Review */}
                      <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 py-5 border-b border-gray-200">
                        3. Order Review
                      </h2>
                      <div className="p-6">
                        <ul className="space-y-4">
                          {cart.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                  <Image
                                    src={item.product?.image ?? "https://placehold.co/64x64"}
                                    alt={item.product?.title || "Product image"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-[#333333]">
                                    {item.product?.title || "Product"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium text-[#333333]">
                                {formatPrice(item.price)}
                              </p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(cart.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{formatPrice(10)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Taxes</span>
                            <span>{formatPrice(cart.estimatedTax || 0)}</span>
                          </div>
                          <div className="flex justify-between text-[#333333] font-bold text-lg pt-2 mt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>{formatPrice(cart.totalPrice + 10)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 md:px-10 mt-2 pb-10">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={clsx(
                        "flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-wide min-w-0 px-6 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? "Processing..." : "Place Your Order"}
                    </button>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      By clicking &quot;Place Your Order&quot;, you agree to our{" "}
                      <a className="underline text-primary" href="#">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a className="underline text-primary" href="#">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </main>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
