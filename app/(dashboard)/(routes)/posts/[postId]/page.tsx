"use client";
import { CreateUpdateForm } from "@/components/create-update-form";
import CreatePost from "@/components/post/create";
import UpdatePost from "@/components/post/update";
import { ProductForm } from "@/components/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const ProductPage = ({ params }: { params: { postId: Id<"post"> } }) => {
  try {
    const post = useQuery(api.post.getpostById, {
      postId: params.postId,
    });
    if (post === undefined) {
      return (
        <div className="pl-5 pt-5 flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      );
    }
    if (post === null) {
      return <div>Not found</div>;
    }

    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <UpdatePost post={post} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <CreatePost />
        </div>
      </div>
    );
  }
};

export default ProductPage;
