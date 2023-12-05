"use client";

import { cn } from "@/lib/utils";
import {
  Apple,
  HomeIcon,
  LibraryBig,
  LucideNewspaper,
  MessageCircle,
  MonitorDot,
  Receipt,
  ScrollText,
  Settings,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();
  const routes = [
    {
      href: `/dashboard`,
      icon: HomeIcon,
      label: "Dashboard",
      active: pathname.indexOf("/dashboard") !== -1,
    },
    {
      href: `/billboards`,
      icon: MonitorDot,
      label: "Billboards",
      active: pathname.indexOf("/billboards") !== -1,
    },
    {
      href: `/categories`,
      icon: ScrollText,
      label: "Categories",
      active: pathname.indexOf("/categories") !== -1,
    },
    {
      href: `/collections`,
      icon: LibraryBig,
      label: "Collections",
      active: pathname.indexOf("/collections") !== -1,
    },
    {
      href: `/products`,
      icon: Apple,

      label: "Products",
      active: pathname.indexOf("/products") !== -1,
    },
    {
      href: `/orders`,
      icon: ShoppingCart,
      label: "Order",
      active: pathname.indexOf("/orders") !== -1,
    },
    {
      href: `/posts`,
      icon: LucideNewspaper,
      label: "Posts",
      active: pathname.indexOf("/posts") !== -1,
    },
    {
      href: `/vouchers`,
      icon: Receipt,
      label: "Vouchers",
      active: pathname.indexOf("/vouchers") !== -1,
    },

    {
      href: `/settings`,
      icon: Settings,
      label: "Settings",
      active: pathname.indexOf("/settings") !== -1,
    },
  ];
  const isMobile = true;
  return (
    <>
      <div className="h-full fixed flex items-center z-50">
        <aside className="md:ml-[24px] ml-3 h-full overflow-y-hidden relative flex md:w-[156px] w-88 flex-col gap-4 mt-20">
          <Link href="/dashboard" className="hidden md:flex">
            <Image
              src="/logo.svg"
              height={132}
              width={132}
              alt="logo"
              className="my-[6px]"
            />
          </Link>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-semibold md:mr-5 items-center flex relative group transition-colors hover:text-black md:hover:bg-[#A9DFD8]  rounded-md",
                route.active
                  ? " dark:text-black md:bg-[#A9DFD8]"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2 p-3 ">
                <route.icon
                  className={cn(
                    "w-5 h-5   md:group-hover:text-black group-hover:fill-[#A9DFD8] group-hover:text-[#A9DFD8]",
                    route.active
                      ? " md:text-black fill-[#A9DFD8] text-[#A9DFD8]"
                      : ""
                  )}
                />
                <span className="hidden md:flex">{route.label}</span>
              </div>
              {isMobile && (
                <div
                  className={cn(
                    "ml-auto opacity-0 border-2 right-0 border-[#A9DFD8] h-5 transition-all",
                    route.active && "opacity-100"
                  )}
                />
              )}
            </Link>
          ))}
        </aside>
        <div className="h-full  bg-[#2C2D33] w-[1px]" />
      </div>
    </>
  );
};

export default Navigation;
