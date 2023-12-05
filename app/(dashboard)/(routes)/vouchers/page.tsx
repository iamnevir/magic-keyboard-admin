"use client";
import { Client } from "@/components/client";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoucherColumn, VoucherColumns } from "@/components/voucher/columns";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const VouchersPage = () => {
  const router = useRouter();
  const remove = useMutation(api.voucher.removeAll);
  const vouchers = useQuery(api.voucher.getvouchers);
  if (vouchers === undefined) {
    return <SkeletonTable />;
  }
  const formattedVouchers: VoucherColumn[] = vouchers
    ? vouchers.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        code: item.code,
        time: item.time,
        type: item.type,
        percent: item.percent,
        price: item.price,
      }))
    : [];

  const onDeleteAll = async (selectedRow: typeof formattedVouchers) => {
    try {
      const ids = selectedRow.map((item) => item._id);
      remove({ id: ids });

      router.refresh();
      toast.success(`Đã xóa toàn bộ dữ liệu.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const client = Client<VoucherColumn>(
    formattedVouchers,
    "Vouchers",
    "Các voucher trong cửa hàng của bạn",
    VoucherColumns,
    "code",
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

export default VouchersPage;
