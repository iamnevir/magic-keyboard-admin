import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CategoryFormValues, formSchema } from "./create";
import { CreateUpdateModal } from "../create-update-modal";

const UpdateCategory = ({ category }: { category: Doc<"category"> }) => {
  const defaultValues = {
    name: category.name,
    imageUrl: category.imageUrl,
    descripton: category.description,
  };
  const UpdateForm = CreateUpdateModal<"category", CategoryFormValues>(
    category,
    defaultValues,
    formSchema,
    api.category.create,
    api.category.update,
    "Categories",
    true
  );
  return UpdateForm;
};

export default UpdateCategory;
