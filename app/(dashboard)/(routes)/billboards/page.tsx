"use client";
import {
  BillboardColumn,
  BillboardColumns,
} from "@/components/billboard/columns";
import { Client } from "@/components/client";
import SkeletonTable from "@/components/skeleton-table";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BillboardsPage = () => {
  const router = useRouter();
  const remove = useMutation(api.billboard.removeAll);
  const billboards = useQuery(api.billboard.getBillboard);
  if (billboards === undefined) {
    return <SkeletonTable />;
  }
  const formattedBillboards: BillboardColumn[] = billboards
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

  const onDeleteAll = async (selectedRow: typeof formattedBillboards) => {
    try {
      console.log(selectedRow);
      const ids = selectedRow.map((item) => item._id);
      console.log(ids);
      remove({ id: ids });

      router.refresh();
      toast.success(`Đã xóa toàn bộ dữ liệu.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const client = Client<BillboardColumn>(
    formattedBillboards,
    "Billboards",
    "Các bảng quảng cáo trong cửa hàng của bạn",
    BillboardColumns,
    "producer",
    onDeleteAll
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
