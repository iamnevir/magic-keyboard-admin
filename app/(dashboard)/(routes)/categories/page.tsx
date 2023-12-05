"use client";
import {
  CategoryColumn,
  CategoryColumns,
} from "@/components/catgegories/columns";
import { Client } from "@/components/client";
import SkeletonTable from "@/components/skeleton-table";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CategoriesPage = () => {
  const router = useRouter();
  const remove = useMutation(api.category.removeAll);
  const categories = useQuery(api.category.getCategories);
  if (categories === undefined) {
    return <SkeletonTable />;
  }
  const formattedCategories: CategoryColumn[] = categories
    ? categories.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        imageUrl: item.imageUrl,
        name: item.name,
        description: item.description,
      }))
    : [];

  const onDeleteAll = async (selectedRow: typeof formattedCategories) => {
    try {
      const ids = selectedRow.map((item) => item._id);
      remove({ id: ids });

      router.refresh();
      toast.success(`Đã xóa toàn bộ dữ liệu.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const client = Client<CategoryColumn>(
    formattedCategories,
    "Categories",
    "Các danh mục trong cửa hàng của bạn",
    CategoryColumns,
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

export default CategoriesPage;
