"use client";
import {
  CategoryColumn,
  CategoryColumns,
} from "@/components/catgegories/columns";
import { Client } from "@/components/client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const CategoriesPage = () => {
  const categories = useQuery(api.category.getCategories);
  const formattedCategories: CategoryColumn[] = categories
    ? categories.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        name: item.name,
        collections: item.collections,
      }))
    : [];
  const client = Client<CategoryColumn>(
    formattedCategories,
    "Categories",
    "Các danh mục trong cửa hàng của bạn",
    CategoryColumns
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
