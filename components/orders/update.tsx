import { z } from "zod";
import { CreateUpdateForm } from "../create-update-form";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { formSchema } from "./create";

const UpdateOrder = ({ order }: { order: Doc<"order"> }) => {
  const defaultValues = {
    phone: order.phone,
    address: order.address,
    totalPrice: order.totalPrice,
    isPaid: order.isPaid,
    orderItems: order.orderItems,
    userId: order.userId,
    name: order.name,
    payment: order.payment,
    code: order.code,
    orderStatus: order.orderStatus,
  };
  const UpdateForm = CreateUpdateForm<"order", z.infer<typeof formSchema>>(
    order,
    defaultValues,
    formSchema,
    api.order.create,
    api.order.update,
    api.order.remove,
    "Orders",
    true
  );
  return UpdateForm;
};

export default UpdateOrder;
