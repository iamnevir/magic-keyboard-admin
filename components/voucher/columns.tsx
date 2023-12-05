"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate, priceFormatter } from "@/lib/utils";
import { SelectBoxRowForColumns } from "../billboard/columns";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export type VoucherColumn = {
  _id: Id<"voucher">;
  _creationTime: number;
  code: string;
  time?: number | undefined;
  type: string;
  percent?: number | undefined;
  price?: number | undefined;
};

export const VoucherColumns: ColumnDef<VoucherColumn>[] = [
  SelectBoxRowForColumns,
  {
    accessorKey: "code",
    header: "Mã giảm giá",
  },
  {
    accessorKey: "time",
    header: "Ngày hết hạn",
    cell: ({ row }) =>
      row.original.time ? formatDate(row.original.time) : "Không có",
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loại mã
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      switch (row.original.type) {
        case "%":
          return "Giảm %";
        case "tructiep":
          return "Giảm trực tiếp";
        case "freeship":
          return "Free Ship";
        default:
          return "Giảm trực tiếp";
      }
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giảm trực tiếp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.price ? priceFormatter.format(row.original.price) : "None",
  },
  {
    accessorKey: "percent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giảm theo %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.percent ? (
        <span>
          {row.original.percent}
          {" %"}
        </span>
      ) : (
        "None"
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
      const voucherAction = MenuAction<"voucher">(
        row.original,
        api.voucher.remove,
        "vouchers"
      );
      return voucherAction;
    },
  },
];
