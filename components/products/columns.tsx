"use client";

import { ColumnDef, Row } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MenuAction } from "../action-menu";
import { formatDate, priceFormatter } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { SelectBoxRowForColumns } from "../billboard/columns";
import { useQuery } from "convex/react";
import { Badge } from "../ui/badge";
export type ProductsColumn = {
  _id: Id<"product">;
  _creationTime: number;
  producer?: string | undefined;
  description?: any;
  infomation?: any;
  slug: string | undefined;
  name: string;
  price?: number | undefined;
  isSale: boolean | undefined;
  salePrice: number | undefined;
  timeSale: number | undefined;
  pay?: string | undefined;
  quantity: number | undefined;
  collectionId: Id<"collection">;
  options: any;
  images?: string[] | undefined;
  isPublish: boolean;
};

export const ProductsColumns: ColumnDef<ProductsColumn>[] = [
  SelectBoxRowForColumns,
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
  },
  {
    accessorKey: "collectionId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bộ sưu tập
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <CollectionId row={row} />,
  },
  {
    accessorKey: "producer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hãng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.producer ? row.original.producer : "Vô danh",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.price ? priceFormatter.format(row.original.price) : "Free",
  },
  {
    accessorKey: "isSale",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sale
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.isSale ? (
        <Badge className=" bg-[#00EE00]" variant="outline">
          Sale
        </Badge>
      ) : (
        <Badge variant="destructive">Not Sale</Badge>
      ),
  },
  {
    accessorKey: "salePrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá Sale
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.salePrice
        ? priceFormatter.format(row.original.salePrice)
        : "None",
  },
  {
    accessorKey: "pay",
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
    cell: ({ row }) => {
      switch (row.original.pay) {
        case "order":
          return "Order";
        case "preorder":
          return "Pre-Order";
        case "coming":
          return "Coming Soon";
        default:
          return "Order";
      }
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số lượng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
      const productAction = MenuAction<"product">(
        row.original,
        api.product.remove,
        "products"
      );
      return productAction;
    },
  },
];

const CollectionId = ({ row }: { row: Row<ProductsColumn> }) => {
  const collection = useQuery(api.collection.getCollectionById, {
    collectionId: row.original.collectionId,
  });
  return <div className="ml-4">{collection?.name}</div>;
};
