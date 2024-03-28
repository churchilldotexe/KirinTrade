"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, PropsWithChildren } from "react";

const Navigation = ({ children }: PropsWithChildren) => {
  return (
    <nav className="flex justify-center bg-primary px-4 text-primary-foreground">
      {children}
    </nav>
  );
};

export const NavLink = (
  props: Omit<ComponentProps<typeof Link>, "className">,
) => {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "focus-visible::bg-secondary focus-visible::text-secondary-foreground p-4 hover:bg-secondary hover:text-secondary-foreground",
        pathname === props.href && "bg-background text-foreground",
      )}
    />
  );
};

export default Navigation;
