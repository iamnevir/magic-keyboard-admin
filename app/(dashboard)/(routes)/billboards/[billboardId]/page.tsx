"use client";
import CreateBillboard from "@/components/billboard/create";
import UpdateBillboard from "@/components/billboard/update";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const BillboardPage = ({
  params,
}: {
  params: { billboardId: Id<"billboard"> };
}) => {
  try {
    const billboard = useQuery(api.billboard.getBillboardById, {
      billboardId: params.billboardId,
    });
    if (billboard === undefined) {
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
    if (billboard === null) {
      return <div>Not found</div>;
    }

    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <UpdateBillboard billboard={billboard} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          {" "}
          <CreateBillboard />{" "}
        </div>
      </div>
    );
  }
};

export default BillboardPage;
