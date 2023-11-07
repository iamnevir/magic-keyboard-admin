"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import {
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { dark } from "@clerk/themes";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = false;
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={
        !isMobile
          ? {
              baseTheme: dark,
              elements: {
                modalContent: "ml-[500px] mt-[50px]",
                formButtonPrimary: "hover:scale-[1.05] ",
                socialButtonsBlockButton:
                  " bg-[#e1f0f6]  text-[#0E435C]  hover:bg-[#e0eff6] hover:scale-[1.05] ",
                card: " rounded-tr-[10px] rounded-br-[10px] rounded-tl-[0px] rounded-bl-[0px] border-transparent h-[550px]",
                footerAction: " hidden",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "auto",
              },
            }
          : {
              baseTheme: dark,
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-[#CC75DB] to-[#5137AE] shadow-black  shadow-lg hover:scale-[1.05]",
                socialButtonsBlockButton:
                  " bg-[#e0eff6] text-[#0E435C] shadow-white shadow-md hover:bg-[#e0eff6] hover:scale-[1.05] ",
                card: "ml-5 scale-[1.25] rounded-tr-[10px] rounded-br-[10px] rounded-tl-[0px] rounded-bl-[0px] border-transparent h-[550px] mr-[50px]",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "auto",
              },
            }
      }
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
