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

const CreateBillboard = () => {
  const defaultValues = {
    producer: "",
    title: "",
    subTitle: "",
    imageUrl: "",
    order: "",
    url: "",
    isPublish: true,
  };
  const billboard = {
    _id: "" as Id<"billboard">,
    _creationTime: 0,
    producer: "",
    title: "",
    subTitle: "",
    imageUrl: "",
    order: "",
    url: "",
    isPublish: true,
  };
  const createForm = CreateUpdateForm<"billboard", BillboardFormValues>(
    billboard,
    defaultValues,
    formSchema,
    api.billboard.create,
    api.billboard.update,
    api.billboard.remove,
    "Billboards",
    false
  );
  return createForm;
};

export default CreateBillboard;
