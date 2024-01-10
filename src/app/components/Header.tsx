import { Container } from "@/components/container";
import { classNames } from "@/utils";
import Link from "next/link";
import { Logo } from "./Logo";
import MobileNavigation from "./MobileNavigation";
import { NavLink, NavLinkProps } from "./NavLink";
import ShoppingCart from "./ShoppingCart";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  navLinks: NavLinkProps[];
}
export function Header({ navLinks, className, ...props }: HeaderProps) {
  const separatedNavLinks: NavLinkProps[] = [
    {
      href: "/cart",
      children: <ShoppingCart description="items in cart, view bag" />,
    },
  ];
  return (
    <header className={classNames("py-10", className)} {...props}>
      <Container>
        <nav className="relative z-50 flex justify-between" data-testid="main-header-nav">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
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
