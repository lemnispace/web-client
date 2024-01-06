import { Button } from "@/components/button";
import { Container } from "@/components/container";
import Link from "next/link";
import { Logo } from "./Logo";
import MobileNavigation from "./MobileNavigation";
import { NavLink, NavLinkProps } from "./NavLink";
import ShoppingCart from "./ShoppingCart";

export function Header() {
  const navLinks: NavLinkProps[] = [{ href: "#Mosaic", children: "Mosaics" }];
  const separatedNavLinks: NavLinkProps[] = [
    {
      href: "/cart",
      children: <ShoppingCart description="items in cart, view bag" />,
    },
  ];
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <Logo className="h-8 w-auto" />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {separatedNavLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
            <Button href="/register" color="primary">
              <span>Shop now</span>
            </Button>
            <div className="-mr-1 md:hidden">
              <MobileNavigation
                items={navLinks}
                separatedItems={separatedNavLinks}
              />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
