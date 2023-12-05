import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CollectionFormValues, formSchema } from "./create";
import { CreateUpdateModal } from "../create-update-modal";

const UpdateCollection = ({
  collection,
}: {
  collection: Doc<"collection">;
}) => {
  const defaultValues = {
    name: collection.name,
    categoryId: collection.categoryId,
    descripton: collection.description,
  };
  const UpdateForm = CreateUpdateModal<"collection", CollectionFormValues>(
    collection,
    defaultValues,
    formSchema,
    api.collection.create,
    api.collection.update,
    "Collections",
    true
  );
  return UpdateForm;
};

export default UpdateCollection;
