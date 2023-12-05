"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { SelectBoxRowForColumns } from "../billboard/columns";
import Image from "next/image";
export type PostColumn = {
  _id: Id<"post">;
  _creationTime: number;
  title: string;
  author: string;
  content?: any;
  type: string;
  slug: string | undefined;
  thumnail: string;
  isPublish: boolean;
};

export const PostColumns: ColumnDef<PostColumn>[] = [
  SelectBoxRowForColumns,
  {
    accessorKey: "title",
    header: "Tên sản phẩm",
  },

  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tác giả
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.author ? row.original.author : "Vô danh"),
  },
  {
    accessorKey: "thumnail",
    header: "Thumnail",
    cell: ({ row }) => (
      <Image
        src={row.original.thumnail}
        alt="thumnail"
        width={270}
        height={200}
        className=" object-cover w-[250px] h-[120px] rounded-md"
      />
    ),
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
      const productAction = MenuAction<"post">(
        row.original,
        api.post.remove,
        "posts"
      );
      return productAction;
    },
  },
];
