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
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Textarea } from "../ui/textarea";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";

const formOption = z.object({
  product: z.string(),
  quantity: z.number(),
  option: z.string(),
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
    product: string;
    option: string;
    quantity: number;
  }[];
  onChange: (
    value: {
      product: string;
      option: string;
      quantity: number;
    }[]
  ) => void;
}) {
  const products = useQuery(api.product.getProducts);
  const form = useForm<z.infer<typeof formOption>>({
    resolver: zodResolver(formOption),
    defaultValues: {
      product: "",
      option: "",
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
            Thêm Sản phẩm
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 dark:bg-xam "
          >
            <div className="flex items-center w-full">
              <div className="space-y-8 px-6 w-full">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Sản phẩm
                      </FormLabel>
                      <div className="w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? products?.find(
                                      (product) => product._id === field.value
                                    )?.name
                                  : "Chọn sản phẩm"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[450px]">
                            <Command>
                              <CommandInput placeholder="Tìm sản phẩm..." />
                              <CommandEmpty>Not found.</CommandEmpty>
                              <CommandGroup>
                                {products?.map((product) => (
                                  <CommandItem
                                    value={product._id}
                                    key={product.name}
                                    onSelect={() => {
                                      form.setValue("product", product._id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        product._id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {product.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="option"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Option
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          className="  border-0 bg-zinc-300/50 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="..."
                          {...field}
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
                          value={field.value}
                          onChange={(event) => {
                            const value = parseInt(event.target.value);
                            field.onChange(value ? value : 0);
                          }}
                          className="  border-0 bg-zinc-300/50 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="Nhập số lượng hàng"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
