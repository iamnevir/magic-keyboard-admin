"use client";
import PostList from "@/components/post/post-list";
import ProductsList from "@/components/products/product-list";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
const PostsPage = () => {
  const router = useRouter();
  const posts = useQuery(api.post.getPosts);
  if (posts === undefined) {
    return <SkeletonTable />;
  }
  const typeAll = posts.map((item) => item.type);
  const typeList = Array.from(new Set(typeAll));
  function capitalizeFirstLetter(input: string): string {
    return `${input[0].toUpperCase()}${input.slice(1)}`;
  }
  if (typeList.length <= 0) {
    return (
      <div className=" absolute left-[40%] top-[50%] flex items-center gap-5">
        Bạn chưa có bài viết nào.
        <Button onClick={() => router.push("/posts/new")} variant="primary">
          Tạo mới
        </Button>
      </div>
    );
  }
  return (
    <Tabs defaultValue={typeList[0]} defaultChecked={true}>
      <TabsList className="ml-6 dark:bg-xam">
        {typeList.map((item, index) => (
          <TabsTrigger key={index} value={item}>
            {capitalizeFirstLetter(item)}
          </TabsTrigger>
        ))}
      </TabsList>
      {typeList?.map((type, index) => (
        <TabsContent key={index} value={type}>
          <PostList type={type} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PostsPage;
