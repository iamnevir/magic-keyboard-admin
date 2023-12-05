"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate } from "@/lib/utils";
import { SelectBoxRowForColumns } from "../billboard/columns";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "convex/react";

export type CollectionColumn = {
  _id: Id<"collection">;
  _creationTime: number;
  name: string;
  categoryId: Id<"category">;
};

export const CollectionColumns: ColumnDef<CollectionColumn>[] = [
  SelectBoxRowForColumns,
  {
    accessorKey: "name",
    header: "Tên Collection",
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Danh mục
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = useQuery(api.category.getCategoryById, {
        categoryId: row.original.categoryId,
      });
      return <div className="ml-4">{category?.name}</div>;
    },
  },
  {
    accessorKey: "_creationTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">{formatDate(row.original._creationTime)}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const collectionAction = MenuAction<"collection">(
        row.original,
        api.collection.remove,
        "collections"
      );
      return collectionAction;
    },
  },
];
