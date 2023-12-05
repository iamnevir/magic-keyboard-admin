import { z } from "zod";
import { CreateUpdateForm } from "../create-update-form";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CreateUpdateModal } from "../create-update-modal";
export interface CategoryFormProps {
  initialData: Doc<"category"> | null;
}

export const formSchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục không được để trống!" }),
  imageUrl: z.string(),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

const CreateCategory = () => {
  const defaultValues = {
    name: "",
    imageUrl: "",
    description: "",
  };
  const category = {
    _id: "" as Id<"category">,
    _creationTime: 0,
    imageUrl: "",
    name: "",
    description: "",
  };
  const createForm = CreateUpdateModal<"category", CategoryFormValues>(
    category,
    defaultValues,
    formSchema,
    api.category.create,
    api.category.update,
    "Categories",
    false
  );
  return createForm;
};

export default CreateCategory;
