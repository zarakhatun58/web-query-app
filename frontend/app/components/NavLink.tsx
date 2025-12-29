"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, children }, ref) => {
    return (
      <Link ref={ref} href={href} className={cn(className)}>
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
