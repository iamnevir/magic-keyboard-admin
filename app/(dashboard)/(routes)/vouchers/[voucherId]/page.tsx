"use client";
import { Skeleton } from "@/components/ui/skeleton";
import CreateVoucher from "@/components/voucher/create";
import UpdateVoucher from "@/components/voucher/update";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const CategoryPage = ({ params }: { params: { voucherId: Id<"voucher"> } }) => {
  try {
    const voucher = useQuery(api.voucher.getvoucherById, {
      voucherId: params.voucherId,
    });
    if (voucher === undefined) {
      return (
        <div className="pl-5 pt-5 flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      );
    }
    if (voucher === null) {
      return <div>Not found</div>;
    }

    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <UpdateVoucher voucher={voucher} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          {" "}
          <CreateVoucher />{" "}
        </div>
      </div>
    );
  }
};

export default CategoryPage;
