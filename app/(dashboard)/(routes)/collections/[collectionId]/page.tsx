"use client";
import CreateCollection from "@/components/collections/create";
import UpdateCollection from "@/components/collections/update";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const CollectionPage = ({
  params,
}: {
  params: { collectionId: Id<"collection"> };
}) => {
  try {
    const collection = useQuery(api.collection.getCollectionById, {
      collectionId: params.collectionId,
    });
    if (collection === undefined) {
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
    if (collection === null) {
      return <div>Not found</div>;
    }

    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <UpdateCollection collection={collection} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          {" "}
          <CreateCollection />{" "}
        </div>
      </div>
    );
  }
};

export default CollectionPage;
