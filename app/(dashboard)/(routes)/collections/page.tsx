"use client";
import { Client } from "@/components/client";
import {
  CollectionColumn,
  CollectionColumns,
} from "@/components/collections/columns";
import SkeletonTable from "@/components/skeleton-table";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CollectionsPage = () => {
  const router = useRouter();
  const remove = useMutation(api.collection.removeAll);
  const collections = useQuery(api.collection.getCollections);
  if (collections === undefined) {
    return <SkeletonTable />;
  }
  const formattedCollections: CollectionColumn[] = collections
    ? collections.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        name: item.name,
        categoryId: item.categoryId,
        description: item.description,
      }))
    : [];

  const onDeleteAll = async (selectedRow: typeof formattedCollections) => {
    try {
      const ids = selectedRow.map((item) => item._id);
      remove({ id: ids });
      router.refresh();
      toast.success(`Đã xóa toàn bộ dữ liệu.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const client = Client<CollectionColumn>(
    formattedCollections,
    "Collections",
    "Các bộ sưu tập trong cửa hàng của bạn",
    CollectionColumns,
    "name",
    onDeleteAll
  );
  return (
    <div className=" w-full px-5">
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">{client}</div>
      </div>
    </div>
  );
};

export default CollectionsPage;
