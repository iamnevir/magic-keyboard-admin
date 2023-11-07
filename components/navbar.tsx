"use client";

import { UserButton } from "@clerk/nextjs";
import { BellRing, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <div className="flex items-center w-full justify-between overflow-hidden z-50">
      <div className=" md:flex items-center dark:bg-[#21222D] rounded-lg ml-[24px] h-11 hidden">
        <Search className="w-4 h-4 ml-4 -mr-2 dark:text-white text-white" />
        <Input
          className="w-[504px] focus-visible:ring-0 focus-visible:ring-offset-0 h-full border-none bg-transparent dark:placeholder:text-white hover:placeholder:text-[#87888C]"
          placeholder="Search here..."
        />
      </div>
      <div className="flex items-center gap-4 m-5 ml-auto">
        <ModeToggle />
        <div className="relative flex cursor-pointer">
          <BellRing className="w-5 h-5 " />
          <span className="absolute flex h-2 w-2 ml-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className=" inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
