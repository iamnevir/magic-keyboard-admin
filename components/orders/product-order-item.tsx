import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const ProductOrderItem = ({ productId }: { productId: Id<"product"> }) => {
  const product = useQuery(api.product.getProductById, { productId });
  return <span>{product?.name}</span>;
};

export default ProductOrderItem;
