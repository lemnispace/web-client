import "@/styles/tailwind.css";
import { LAYOUT_TEXT } from "@/utils/text";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: LAYOUT_TEXT.shop.name,
  description: LAYOUT_TEXT.shop.description,
};

export default function ShopLayout(props: { children: React.ReactNode }) {
  return <div className="bg-gray-50">{props.children}</div>;
}
