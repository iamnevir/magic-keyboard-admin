import Navbar from "@/components/navbar";
import Navigation from "@/components/navigation";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <Navigation />
      <div className="h-full w-full ">
        <div className="fixed inset-0 h-[80px] ml-[80px] md:ml-[185px] z-50 dark:bg-[#0A0A0A] bg-white">
          <Navbar />
        </div>
        <div className="mt-[80px] ml-[62px] md:ml-[185px]">{children}</div>
      </div>
    </div>
  );
}
