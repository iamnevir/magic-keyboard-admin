import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
const ImageModal = ({
  orderId,
  open,
  setOpen,
}: {
  orderId: Id<"order">;
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const removeImage = useMutation(api.checkout.deleteById);
  const remove = useMutation(api.checkout.remove);
  const updateOrder = useMutation(api.order.update);
  const update = useMutation(api.checkout.update);
  const checkout = useQuery(api.checkout.getcheckoutByOrder, {
    orderId,
  });
  const imageUrl = useQuery(api.checkout.getImage, { image: checkout?.image! });
  const onAccept = async () => {
    if (checkout) {
      try {
        update({ id: checkout._id, accept: true });
        updateOrder({ id: orderId, isPaid: true });
        setOpen(false);
        toast.success("Đã chấp thuận thanh toán.");
      } catch (error) {
        setOpen(false);
        toast.error("Có gì đó sai sai!!");
      }
    }
  };
  const onUnAccept = async () => {
    if (checkout) {
      try {
        await removeImage({ storageId: checkout.image });
        await remove({ id: checkout?._id });
        setOpen(false);
        toast.success(
          "Xóa ảnh thành công! Khách hàng sẽ được yêu cầu thực hiện thanh toán lại."
        );
      } catch (error) {
        setOpen(false);
        toast.error("Có gì đó sai sai!!");
      }
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <>
            <Image
              className=" rounded-[10px] object-contain"
              width={400}
              height={350}
              src={imageUrl ? imageUrl : ""}
              alt=""
            />
            {checkout?.accept ? null : (
              <DialogFooter>
                <Button onClick={onUnAccept} variant="danger">
                  UnAccept
                </Button>
                <Button onClick={onAccept} variant="primary">
                  Accept
                </Button>
              </DialogFooter>
            )}
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageModal;
