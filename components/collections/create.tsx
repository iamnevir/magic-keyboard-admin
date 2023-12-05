import { z } from "zod";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CreateUpdateModal } from "../create-update-modal";
export interface CategoryFormProps {
  initialData: Doc<"category"> | null;
}

export const formSchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục không được để trống!" }),
  categoryId: z
    .string()
    .min(1, { message: "Bộ sưu tập phải nằm trong 1 danh mục nào đó." }),
  description: z.string().optional(),
});

export type CollectionFormValues = z.infer<typeof formSchema>;

const CreateCollection = () => {
  const defaultValues = {
    name: "",
    categoryId: "",
    description: "",
  };
  const collection = {
    _id: "" as Id<"collection">,
    _creationTime: 0,
    name: "",
    categoryId: "" as Id<"category">,
    description: "",
  };
  const createForm = CreateUpdateModal<"collection", CollectionFormValues>(
    collection,
    defaultValues,
    formSchema,
    api.collection.create,
    api.collection.update,
    "Collections",
    false
  );
  return createForm;
};

export default CreateCollection;
