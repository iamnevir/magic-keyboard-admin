"use client";
import ProductsList from "@/components/products/product-list";
import SkeletonTable from "@/components/skeleton-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
const ProductsPage = () => {
  const categories = useQuery(api.category.getCategories);
  if (categories === undefined) {
    return <SkeletonTable />;
  }
  return (
    <Tabs defaultValue={categories?.[0]._id} defaultChecked={true}>
      <TabsList className="ml-6 dark:bg-xam">
        {categories?.map((category) => (
          <TabsTrigger key={category._id} value={category._id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories?.map((category) => (
        <TabsContent key={category._id} value={category._id}>
          <ProductsList category={category} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductsPage;
