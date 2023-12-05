import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { formSchema } from "./create";
import { CreateUpdateModal } from "../create-update-modal";
import { z } from "zod";

const UpdateVoucher = ({ voucher }: { voucher: Doc<"voucher"> }) => {
  const defaultValues = {
    code: voucher.code,
    time: voucher.time,
    type: voucher.type,
    percent: voucher.percent,
    price: voucher.price,
  };
  const UpdateForm = CreateUpdateModal<"voucher", z.infer<typeof formSchema>>(
    voucher,
    defaultValues,
    formSchema,
    api.voucher.create,
    api.voucher.update,
    "Vouchers",
    true
  );
  return UpdateForm;
};

export default UpdateVoucher;
