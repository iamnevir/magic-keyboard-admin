"use client";
import { SignUp } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className=" h-full w-full  flex items-center justify-center ">
      <div className="absolute h-full w-full bg-main-page bg-[length:1490px_720px] bg-center bg-no-repeat brightness-150 blur" />
      <div className="ml-[400px]">
        <SignUp />
      </div>
    </div>
  );
}
