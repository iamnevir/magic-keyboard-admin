import SaleCard from "@/components/dashboard/sale-card";
import Image from "next/image";
import {
  BadgeDollarSign,
  ClipboardCheck,
  ShoppingBag,
  UserPlus2,
} from "lucide-react";
import { Overview } from "@/components/dashboard/bar-chart";

const DashboardPage = () => {
  const sales = [
    {
      icon: BadgeDollarSign,
      value: "$5k",
      label: "Total Sales",
      review: "+10% from yesterday",
      color: "#FEB95A",
    },
    {
      icon: ClipboardCheck,
      value: "500",
      label: "Total Order",
      review: "+8% from yesterday",
      color: "#A9DFD8",
    },
    {
      icon: ShoppingBag,
      value: "$5k",
      label: "Product Solid",
      review: "+2% from yesterday",
      color: "#F2C8ED",
    },
    {
      icon: UserPlus2,
      value: "$5k",
      label: "New Customer",
      review: "+3% from yesterday",
      color: "#20AEF3",
    },
  ];
  return (
    <div className=" h-full w-full overflow-auto ">
      <div className=" flex items-center w-full ml-6">
        <div className=" dark:bg-[#21222D] flex flex-col gap-1 p-5 rounded-lg">
          <span className="text-md">Today&apos; Sales</span>
          <span className="text-xs text-muted-foreground">Sales Summary</span>
          <div className="flex items-center gap-4 mt-5">
            {sales.map((item) => (
              <SaleCard key={item.label} data={item} />
            ))}
          </div>
        </div>
        <div className="flex items-center relative rounded-lg ml-10">
          <Image
            src="/chart.png"
            alt="level"
            width={310}
            height={255}
            className="rounded-[10px]"
          />
        </div>
      </div>
      <div className="flex items-center w-full ml-6 mt-6">
        <div className=" w-full bg-xam rounded-lg px-3 py-5">
          <Overview />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
