import { Container } from "@/components/container";
import { GLOBAL_APP_TEXT } from "@/utils/text";
import clsx from "clsx";
import { Logo } from "./Logo";
import { NavLink, NavLinkProps } from "./NavLink";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  navLinks: NavLinkProps[];
}
export function Footer({ navLinks, className, ...props }: FooterProps) {
  return (
    <footer className={clsx("bg-slate-50", className)} {...props}>
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-10 w-auto max-w-full" aria-label="Logo" />
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <p className="mt-6 text-sm text-gray-500 sm:mt-0 w-full text-center">
            Copyright &copy; {new Date().getFullYear()} {GLOBAL_APP_TEXT.name}.
            All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
