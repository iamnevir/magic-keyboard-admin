"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { cn, formatDate, priceFormatter } from "@/lib/utils";
import { SelectBoxRowForColumns } from "../billboard/columns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useQuery } from "convex/react";
import { useState } from "react";
import ImageModal from "./image-modal";

export type OrderColumn = {
  _id: Id<"order">;
  _creationTime: number;
  userId?: string | undefined;
  phone: string;
  name: string;
  payment: string;
  address: string;
  totalPrice: number;
  isPaid: boolean;
  code: string;
  orderStatus?: string | undefined;
  orderItems: {
    product: Id<"product">;
    image?: string | undefined;
    quantity: number;
    price: number;
    option: string;
  }[];
};

export const OrderColumns: ColumnDef<OrderColumn>[] = [
  SelectBoxRowForColumns,
  {
    accessorKey: "name",
    header: "Tên người nhận",
    cell: ({ row }) => (
      <span className=" whitespace-nowrap">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <span className=" whitespace-nowrap">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => (
      <span className=" whitespace-nowrap">{row.original.address}</span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tổng tiền
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.totalPrice
        ? priceFormatter.format(row.original.totalPrice)
        : "Free",
  },
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phương thức thanh toán
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge className="bg-green-500">{row.original.payment}</Badge>
    ),
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thanh toán
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const checkout = useQuery(api.checkout.getcheckoutByOrder, {
        orderId: row.original._id,
      });
      if (!row.original.isPaid && checkout) {
        return (
          <>
            <ImageModal
              open={open}
              setOpen={setOpen}
              orderId={row.original._id}
            />
            {checkout.accept ? (
              <Badge
                onClick={() => setOpen(true)}
                className="bg-green-500 cursor-pointer"
              >
                {"Đã thanh toán"}
              </Badge>
            ) : (
              <Badge
                onClick={() => setOpen(true)}
                className="bg-yellow-500 cursor-pointer"
              >
                {"Yêu cầu thanh toán"}
              </Badge>
            )}
          </>
        );
      }
      if (row.original.isPaid) {
        return (
          <>
            <ImageModal
              open={open}
              setOpen={setOpen}
              orderId={row.original._id}
            />
            <Badge
              onClick={() => setOpen(true)}
              className="bg-green-500 cursor-pointer"
            >
              {"Đã thanh toán"}
            </Badge>
          </>
        );
      } else {
        return <Badge variant="destructive">{"Chưa thanh toán"}</Badge>;
      }
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.original.orderStatus !== "Đã hủy"
            ? "bg-green-500 text-white"
            : "bg-rose-500 text-white"
        )}
      >
        {row.original.orderStatus}
      </Badge>
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
          Ngày đặt hàng
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
      const orderAction = MenuAction<"order">(
        row.original,
        api.category.remove,
        "orders"
      );
      return orderAction;
    },
  },
];
