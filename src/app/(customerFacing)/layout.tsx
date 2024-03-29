import Navigation, { NavLink } from "@/components/Navigation";
import React from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation>
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/ kkorders">Sales</NavLink>
      </Navigation>
      <div className="container my-6">{children}</div>
    </>
  );
}
