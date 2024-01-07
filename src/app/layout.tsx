import "@/styles/tailwind.css";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter, Lexend } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

const DESCRIPTION =
  "Explore LemniSpace, the innovative e-commerce platform specializing in personalized products. Our unique service allows users to create custom text mosaics and other tailor-made items, offering an interactive and creative shopping experience. Ideal for those seeking one-of-a-kind gifts or personal keepsakes.";

export const metadata: Metadata = {
  title: {
    template: "%s - LemniSpace",
    default: "LemniSpace - Customizable E-commerce Platform",
  },
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        "h-full scroll-smooth bg-white antialiased",
        inter.variable,
        lexend.variable
      )}
    >
      <body className="flex h-full flex-col">{children}</body>
    </html>
  );
}
