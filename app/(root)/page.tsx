"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (!isAuthenticated && !isLoading) {
    redirect("/");
  } else {
    redirect("/dashboard");
  }
}
