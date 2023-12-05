"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";

const formOption = z.object({
  name: z.string().min(2, { message: "vl tên ngắn thế, thêm tí đê =))" }),
  image: z.string(),
  price: z.number(),
  quantity: z.number(),
});
export function OptionFormModal({
  value,
  onChange,
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  value: {
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  onChange: (
    value: {
      name: string;
      image: string;
      price: number;
      quantity: number;
    }[]
  ) => void;
}) {
  const { edgestore } = useEdgeStore();
  const form = useForm<z.infer<typeof formOption>>({
    resolver: zodResolver(formOption),
    defaultValues: {
      name: "",
      image: "",
      price: 0,
      quantity: 0,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formOption>) => {
    try {
      console.log(values);
      onChange([...value, values]);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Có gì đó sai sai!!!");
    }
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="dark:bg-xam dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Thêm Option
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 dark:bg-xam w-[500px]"
          >
            <div className="flex items-center">
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Tên Phân loại
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="  border-0 bg-zinc-300/50 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="Nhập tên phân loại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Giá
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          className="  border-0 bg-zinc-300/50 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="Giá của loại hàng"
                          onChange={(event) => {
                            field.onChange(parseFloat(event.target.value));
                          }}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Số lượng
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          onChange={(event) => {
                            const value = parseInt(event.target.value);
                            field.onChange(value ? value : 0);
                          }}
                          value={field.value}
                          className="  border-0 bg-zinc-300/50 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="Nhập số lượng hàng"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>{" "}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                      Ảnh
                    </FormLabel>
                    <FormControl>
                      <SingleImageDropzone
                        width={300}
                        height={200}
                        value={field.value}
                        onChange={async (file) => {
                          if (file) {
                            const res = await edgestore.publicFiles.upload({
                              file,
                              options: {
                                replaceTargetUrl: field.value,
                              },
                            });
                            field.onChange(res.url);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="dark:bg-xam px-6 py-4">
              <div
                className="px-4 py-2 cursor-pointer rounded-md ml-auto bg-[#A9DFD8] text-black hover:scale-[1.10]"
                onClick={form.handleSubmit(onSubmit)}
              >
                Add
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
