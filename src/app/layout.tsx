import "@/styles/tailwind.css";
import { NAVIGATION_LINKS } from "@/utils/links";
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
    { href: NAVIGATION_LINKS.shop, children: NAVIGATION_TEXT.collections },
  ];
  return (
    <html
      lang="en"
      className={clsx(
        "h-full scroll-smooth bg-white antialiased",
        inter.variable,
        lexend.variable
      )}
      suppressHydrationWarning
    >
      <body
        className="flex h-auto min-h-full flex-col"
        suppressHydrationWarning
      >
        <Header navLinks={navLinks} />
        {children}
        <Footer navLinks={navLinks} />
      </body>
    </html>
  );
}
