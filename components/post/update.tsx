import { z } from "zod";
import { CreateUpdateForm } from "../create-update-form";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { PostFormValues, formSchema } from "./create";

const UpdatePost = ({ post }: { post: Doc<"post"> }) => {
  const defaultValues = {
    title: post.title,
    subTitle: post.subTitle,
    type: post.type,
    author: post.author,
    content: post.content,
    thumnail: post.thumnail,
    isPublish: post.isPublish,
  };
  const UpdateForm = CreateUpdateForm<"post", PostFormValues>(
    post,
    defaultValues,
    formSchema,
    api.post.create,
    api.post.update,
    api.post.remove,
    "Posts",
    true
  );
  return UpdateForm;
};

export default UpdatePost;
