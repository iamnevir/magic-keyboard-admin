"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
export type BillboardColumn = {
  _id: Id<"billboard">;
  _creationTime: number;
  subTitle?: string | undefined;
  order?: string | undefined;
  url?: string | undefined;
  producer: string;
  title: string;
  imageUrl: string;
  isPublish: boolean;
};
export const SelectBoxRowForColumns = {
  id: "select",
  header: ({ table }: { table: any }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }: { row: any }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
export const BillboardColumns: ColumnDef<BillboardColumn>[] = [
  SelectBoxRowForColumns,
  {
    accessorKey: "producer",
    header: "Nhà sản xuất",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "subTitle",
    header: "Mô tả",
  },
  {
    accessorKey: "order",
    header: "Trạng thái",
    cell: ({ row }) => {
      switch (row.original.order) {
        case "preorder":
          return "Pre-Order";
        case "coming":
          return "Comming Soon";
        case "order":
          return "Order";
      }
    },
  },
  {
    accessorKey: "isPublish",
    header: "Hiển thị",
    cell: ({ row }) => (row.original.isPublish ? "Hiển thị" : "Ẩn"),
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
      const billboardAction = MenuAction<"billboard">(
        row.original,
        api.billboard.remove,
        "billboards"
      );
      return billboardAction;
    },
  },
];
