import { z } from "zod";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CreateUpdateModal } from "../create-update-modal";
export interface CategoryFormProps {
  initialData: Doc<"category"> | null;
}

export const formSchema = z.object({
  code: z.string().min(5, { message: "Mã quá ngắn." }),
  time: z.optional(z.number()),
  type: z.string().min(1, { message: "Hãy chọn kiểu giảm giá cho voucher." }),
  percent: z.optional(z.number()),
  price: z.optional(z.number()),
});

const CreateVoucher = () => {
  const defaultValues = {
    code: "",
    time: 0,
    type: "",
    percent: 0,
    price: 0,
  };
  const voucher = {
    _id: "" as Id<"voucher">,
    _creationTime: 0,
    code: "",
    time: 0,
    type: "",
    percent: 0,
    price: 0,
  };
  const createForm = CreateUpdateModal<"voucher", z.infer<typeof formSchema>>(
    voucher,
    defaultValues,
    formSchema,
    api.voucher.create,
    api.voucher.update,
    "Vouchers",
    false
  );
  return createForm;
};

export default CreateVoucher;
