import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ProductsColumn, ProductsColumns } from "./columns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Client } from "../client";

const ProductsList = ({ category }: { category: Doc<"category"> }) => {
  const router = useRouter();
  const products = useQuery(api.product.getProductsByCategory, {
    categoryId: category._id,
  });
  const formattedProducts: ProductsColumn[] = products
    ? products.map((item) => ({
        _id: item._id,
        _creationTime: item._creationTime,
        slug: item.slug,
        producer: item.producer,
        description: item.description,
        infomation: item.infomation,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        isSale: item.isSale,
        salePrice: item.salePrice,
        timeSale: item.timeSale,
        options: item.options,
        images: item.images,
        collectionId: item.collectionId,
        isPublish: item.isPublish,
      }))
    : [];
  const remove = useMutation(api.product.removeAll);
  const onDeleteAll = async (selectedRow: typeof formattedProducts) => {
    try {
      const ids = selectedRow.map((item) => item._id);
      remove({ id: ids });
      router.refresh();
      toast.success(`Đã xóa toàn bộ dữ liệu.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const keyboardClient = Client<ProductsColumn>(
    formattedProducts,
    category.name,
    `Toàn bộ sản phẩm ${category.name} trong cửa hàng của bạn`,
    ProductsColumns,
    "name",
    onDeleteAll,
    true
  );
  return (
    <div className=" w-full px-5">
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">{keyboardClient}</div>
      </div>
    </div>
  );
};

export default ProductsList;
