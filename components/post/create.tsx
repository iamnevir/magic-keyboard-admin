import { z } from "zod";
import { CreateUpdateForm } from "../create-update-form";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
export interface PostFormProps {
  initialData: Doc<"post"> | null;
}

export const formSchema = z.object({
  title: z.string(),
  subTitle: z.optional(z.string()),
  type: z.string(),
  author: z.string(),
  content: z.optional(z.any()),
  thumnail: z.string(),
  isPublish: z.boolean(),
});

export type PostFormValues = z.infer<typeof formSchema>;

const CreatePost = () => {
  const defaultValues = {
    title: "",
    subTitle: "",
    type: "",
    author: "",
    content: "",
    thumnail: "",
    isPublish: true,
  };
  const post = {
    _id: "" as Id<"post">,
    _creationTime: 0,
    title: "",
    subTitle: "",
    type: "",
    author: "",
    content: "",
    thumnail: "",
    isPublish: true,
  };
  const createForm = CreateUpdateForm<"post", PostFormValues>(
    post,
    defaultValues,
    formSchema,
    api.post.create,
    api.post.update,
    api.post.remove,
    "Posts",
    false
  );
  return createForm;
};

export default CreatePost;
