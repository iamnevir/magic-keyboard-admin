"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate } from "@/lib/utils";

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

export const BillboardColumns: ColumnDef<BillboardColumn>[] = [
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
  },
  {
    accessorKey: "isPublish",
    header: "Hiển thị",
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
      const billboardAction = MenuAction<"billboard">(
        row.original,
        api.billboard.remove,
        "billboards"
      );
      return billboardAction;
    },
  },
];
