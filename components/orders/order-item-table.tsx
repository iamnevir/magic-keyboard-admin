import { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Trash2 } from "lucide-react";
import ProductOrderItem from "./product-order-item";
import Image from "next/image";

const OrderItemTable = ({
  value,
  onChange,
}: {
  value: {
    product: Id<"product">;
    image?: string | undefined;
    quantity: number;
    price: number;
    option: string;
  }[];
  onChange: (
    value: {
      product: Id<"product">;
      image?: string | undefined;
      quantity: number;
      price: number;
      option: string;
    }[]
  ) => void;
}) => {
  return (
    <Table>
      <TableCaption>Danh sách sản phẩm</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Mẫu</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Số lượng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {value.map((item) => (
          <TableRow key={item.product}>
            <TableCell className="w-[120px]">
              <Image
                src={item.image ? item.image : ""}
                alt="image"
                width={100}
                height={100}
                className="w-[100px] h-[100px]"
              />
            </TableCell>
            <TableCell className="">
              <ProductOrderItem productId={item.product} />
            </TableCell>
            <TableCell className="">{item.option}</TableCell>
            <TableCell className="">{item.price}</TableCell>
            <TableCell className="">{item.quantity}</TableCell>
            <TableCell>
              <div
                className="cursor-pointer items-center hover:scale-125 p-2 bg-rose-600 rounded-full"
                onClick={() => {
                  const newValue = value.filter((i: any) => i !== item);
                  onChange([...newValue]);
                }}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderItemTable;
