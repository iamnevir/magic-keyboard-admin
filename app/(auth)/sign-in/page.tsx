"use client";
import { cn } from "@/lib/utils";
import { SignIn } from "@clerk/clerk-react";

export default function Home() {
  const isMobile = false;
  return (
    <div className=" h-full w-full  flex items-center justify-center ">
      <div className="absolute h-full w-full bg-main-page bg-[length:1490px_720px] bg-center bg-no-repeat brightness-150 blur" />
      <div className={cn(isMobile ? "ml-[0px]" : "ml-[400px]")}>
        <SignIn />
      </div>
    </div>
  );
}
