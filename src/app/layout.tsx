import "@/styles/tailwind.css";
import { LAYOUT_TEXT, NAVIGATION_TEXT } from "@/utils/text";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { NavLinkProps } from "./components/NavLink";

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

export const metadata: Metadata = {
  title: {
    template: `%s - ${LAYOUT_TEXT.root.name}`,
    default: `${LAYOUT_TEXT.root.name} - ${LAYOUT_TEXT.root.title}`,
  },
  description: LAYOUT_TEXT.root.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks: NavLinkProps[] = [
    { href: "/shop/mosaics", children: NAVIGATION_TEXT.mosaics },
  ];
  return (
    <html
      lang="en"
      className={clsx(
        "h-full scroll-smooth bg-white antialiased",
        inter.variable,
        lexend.variable
      )}
    >
      <body className="flex h-full flex-col">
        <Header navLinks={navLinks} />
        {children}
        <Footer navLinks={navLinks} />
      </body>
    </html>
  );
}
