"use client";
import { ProductForm } from "@/components/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const ProductPage = ({ params }: { params: { productId: Id<"product"> } }) => {
  try {
    const product = useQuery(api.product.getProductById, {
      productId: params.productId,
    });
    if (product === undefined) {
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
    if (product === null) {
      return <div>Not found</div>;
    }

    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          {" "}
          <ProductForm initialData={product} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <ProductForm initialData={null} />{" "}
        </div>
      </div>
    );
  }
};

export default ProductPage;
