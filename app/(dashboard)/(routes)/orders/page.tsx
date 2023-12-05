"use client";
import { Client } from "@/components/client";
import { OrderColumn, OrderColumns } from "@/components/orders/columns";
import SkeletonTable from "@/components/skeleton-table";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const router = useRouter();
  const remove = useMutation(api.order.removeAll);
  const orders = useQuery(api.order.getorder);
  if (orders === undefined) {
    return <SkeletonTable />;
  }
  const formattedOrders: OrderColumn[] = orders
    ? orders.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        userId: item.userId,
        name: item.name,
        phone: item.phone,
        payment: item.payment,
        isPaid: item.isPaid,
        address: item.address,
        totalPrice: item.totalPrice,
        code: item.code,
        orderStatus: item.orderStatus,
        orderItems: item.orderItems,
      }))
    : [];

  const onDeleteAll = async (selectedRow: typeof formattedOrders) => {
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
  const client = Client<OrderColumn>(
    formattedOrders,
    "Orders",
    "Danh sách hóa đơn trong cửa hàng của bạn",
    OrderColumns,
    "phone",
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

export default OrdersPage;
