"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, PropsWithChildren } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

const Navigation = ({ children }: PropsWithChildren) => {
  return (
    <nav className="relative flex justify-center bg-primary px-4 text-primary-foreground">
      <div className="absolute inset-0 my-auto mr-auto flex h-fit w-fit sm:px-5 md:px-8">
        <Link href={"/"}>
          <div className="grid place-content-center place-items-center">
            <Image
              src="/kirin-logo.png"
              alt="deer antler logo"
              width={45}
              height={45}
              className="sm:row col-start-1 col-end-1 row-start-1 row-end-1 hidden object-cover sm:flex md:-mr-12 md:mb-6 xl:mb-7 xl:mr-8"
            />
            <h1 className="col-start-1 col-end-1 row-start-1 row-end-1 mx-auto hidden text-2xl  md:flex md:text-3xl xl:text-5xl">
              Kirin <span className="md:hidden xl:flex">Trade</span>
            </h1>
          </div>
        </Link>
      </div>
      {children}
      <div className="absolute inset-0 my-auto ml-auto h-fit w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon />
            <span className="sr-only">Admin Navigation</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={"/admin"}>Admin Dashboard</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
        "focus-visible::bg-secondary focus-visible::text-secondary-foreground rounded-t-sm p-4 hover:bg-secondary hover:text-secondary-foreground md:px-8 md:text-2xl lg:px-12 lg:text-3xl",
        pathname === props.href && "bg-background text-foreground",
      )}
    />
  );
};

export default Navigation;
