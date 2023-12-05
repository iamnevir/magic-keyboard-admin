import { z } from "zod";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CreateUpdateForm } from "../create-update-form";
export interface CategoryFormProps {
  initialData: Doc<"category"> | null;
}

export const formSchema = z.object({
  userId: z.optional(z.string()),
  phone: z.string(),
  name: z.string(),
  address: z.string(),
  payment: z.string(),
  totalPrice: z.number(),
  isPaid: z.boolean(),
  code: z.string(),
  orderStatus: z.optional(z.string()),
  orderItems: z.array(
    z.object({
      product: z.string(),
      image: z.optional(z.string()),
      quantity: z.number(),
      price: z.number(),
      option: z.string(),
    })
  ),
});

const CreateOrder = () => {
  const defaultValues = {
    userId: "",
    phone: "",
    name: "",
    address: "",
    payment: "",
    totalPrice: 0,
    isPaid: false,
    code: "",
    orderStatus: "",
    orderItems: [],
  };
  const order = {
    _id: "" as Id<"order">,
    _creationTime: 0,
    userId: "",
    phone: "",
    name: "",
    address: "",
    payment: "",
    totalPrice: 0,
    isPaid: false,
    code: "",
    orderStatus: "",
    orderItems: [],
  };
  const createForm = CreateUpdateForm<"order", z.infer<typeof formSchema>>(
    order,
    defaultValues,
    formSchema,
    api.order.create,
    api.order.update,
    api.order.remove,
    "Orders",
    false
  );
  return createForm;
};

export default CreateOrder;
