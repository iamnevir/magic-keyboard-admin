"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate } from "@/lib/utils";

export type CategoryColumn = {
  _id: Id<"category">;
  _creationTime: number;
  name: string;
  collections?: Id<"collection">[];
};

export const CategoryColumns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Tên danh mục",
  },
  {
    accessorKey: "_creationTime",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.original._creationTime),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const categoryAction = MenuAction<"category">(
        row.original,
        api.category.remove,
        "categories"
      );
      return categoryAction;
    },
  },
];
