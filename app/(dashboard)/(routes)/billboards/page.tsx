"use client";
import {
  BillboardColumn,
  BillboardColumns,
} from "@/components/billboard/columns";
import { Client } from "@/components/client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const BillboardsPage = () => {
  const billboards = useQuery(api.billboard.getBillboard);
  const formattedCategories: BillboardColumn[] = billboards
    ? billboards.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        subTitle: item.subTitle,
        order: item.order,
        url: item.url,
        producer: item.producer,
        title: item.title,
        imageUrl: item.imageUrl,
        isPublish: item.isPublish,
      }))
    : [];
  const client = Client<BillboardColumn>(
    formattedCategories,
    "Billboards",
    "Các bảng quảng cáo trong cửa hàng của bạn",
    BillboardColumns
  );
  return (
    <div className=" w-full px-5">
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">{client}</div>
      </div>
    </div>
  );
};

export default BillboardsPage;
