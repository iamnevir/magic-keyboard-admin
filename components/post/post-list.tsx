"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { PostColumn, PostColumns } from "./columns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Client } from "../client";

export default function PostList({ type }: { type: string }) {
  const router = useRouter();
  const posts = useQuery(api.post.getPostByType, { type });
  const formattedPosts: PostColumn[] = posts
    ? posts.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        title: item.title,
        slug: item.slug,
        type: item.type,
        author: item.author,
        content: item.content,
        thumnail: item.thumnail,
        isPublish: item.isPublish,
      }))
    : [];
  const remove = useMutation(api.post.removeAll);
  const onDeleteAll = async (selectedRow: typeof formattedPosts) => {
    try {
      const ids = selectedRow.map((item) => item._id);
      remove({ id: ids });
      router.refresh();
      toast.success(`Đã xóa toàn bộ dữ liệu.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const postsClient = Client<PostColumn>(
    formattedPosts,
    "Posts",
    `Toàn bộ bài viết ${type} trong cửa hàng của bạn`,
    PostColumns,
    "name",
    onDeleteAll
  );
  return (
    <div className=" w-full px-5">
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">{postsClient}</div>
      </div>
    </div>
  );
}
