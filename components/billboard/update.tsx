import { z } from "zod";
import { CreateUpdateForm } from "../create-update-form";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
export interface BillboardFormProps {
  initialData: Doc<"billboard"> | null;
}

export const formSchema = z.object({
  producer: z.string().min(1, { message: "Nhà sản xuất không được để trống!" }),
  title: z.string().min(1, { message: "Nhà sản xuất không được để trống!" }),
  subTitle: z.string(),
  imageUrl: z.string().min(1, { message: "Ảnh không được để trống!" }),
  order: z.optional(z.string()),
  url: z.optional(z.string()),
  isPublish: z.boolean(),
});

export type BillboardFormValues = z.infer<typeof formSchema>;

const UpdateBillboard = ({ billboard }: { billboard: Doc<"billboard"> }) => {
  const defaultValues = {
    producer: billboard.producer,
    title: billboard.title,
    subTitle: billboard.subTitle,
    imageUrl: billboard.imageUrl,
    order: billboard.order,
    url: billboard.url,
    isPublish: true,
  };
  const UpdateForm = CreateUpdateForm<"billboard", BillboardFormValues>(
    billboard,
    defaultValues,
    formSchema,
    api.billboard.create,
    api.billboard.update,
    api.billboard.remove,
    "Billboards",
    true
  );
  return UpdateForm;
};

export default UpdateBillboard;
