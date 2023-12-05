import { z } from "zod";
import { CreateUpdateForm } from "../create-update-form";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { BillboardFormValues, formSchema } from "./create";

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
