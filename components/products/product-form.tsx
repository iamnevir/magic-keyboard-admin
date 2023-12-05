"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Trash,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { DialogFooter } from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { MultiFileDropzoneUsage } from "./upload-image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { usePreventUserFromErasingContent } from "@/hooks/use-leave-page-confirmation";
import { OptionForm } from "./option-form";
import slugify from "react-slugify";
import Editor from "../editor";
import { Editor as Edit } from "@tiptap/core";
import { Calendar } from "../ui/calendar";

export interface ProductFormProps {
  initialData: Doc<"product"> | null;
}
export const formSchema = z.object({
  producer: z.string().min(1, { message: "Nhà sản xuất không được để trống!" }),
  name: z.string().min(1, { message: "Tên bàn phím không được để trống!" }),
  description: z.optional(z.any()),
  infomation: z.optional(z.any()),
  price: z.optional(z.number()).default(0),
  isSale: z.boolean().optional(),
  salePrice: z.number().optional(),
  timeSale: z.number().optional(),
  pay: z.optional(z.string()),
  quantity: z.optional(z.number()),
  collectionId: z
    .string()
    .min(1, { message: "Sản phẩm phải nằm trong một bộ sưu tập." }),
  options: z.optional(
    z.array(
      z.object({
        name: z.string(),
        option: z.array(
          z.object({
            name: z.string(),
            image: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
        ),
      })
    )
  ),
  images: z.array(z.string()),
  isPublish: z.boolean(),
});
const defaultValues = {
  producer: "",
  name: "",
  description: "",
  infomation: "",
  price: 0,
  isSale: false,
  salePrice: 0,
  timeSale: 0,
  pay: "",
  quantity: 0,
  collectionId: "",
  options: undefined,
  images: [],
  isPublish: true,
};
export function ProductForm({
  initialData,
}: {
  initialData: Doc<"product"> | null;
}) {
  const router = useRouter();
  const create = useMutation(api.product.create);
  const update = useMutation(api.product.update);
  const remove = useMutation(api.product.remove);
  const [open, setOpen] = useState(false);

  const title = initialData ? `Sửa Sản phẩm` : `Tạo Sản phẩm mới`;
  const descriptionForm = initialData
    ? `Sửa thông tin sản phẩm`
    : `Thêm mới sản phẩm`;
  const toastMessage = initialData
    ? `Sản phẩm đã cập nhật`
    : `Sản phẩm đã được tạo`;
  const action = initialData ? "Lưu thay đổi" : "Tạo mới";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : defaultValues,
  });

  const loading = form.formState.isSubmitting;
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        const sumQuantity = data.options?.map((item) => {
          const quantity = item.option.map((i) => i.quantity);
          const sum = quantity.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          );
          return sum;
        });
        const quantity = sumQuantity?.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );

        const price = data.options?.[0]?.option
          ? data.options?.[0]?.option[0].price
          : data.price;

        const description =
          typeof data.description.getJSON === "function"
            ? data.description.getJSON()
            : data.description;
        const infomation =
          typeof data.infomation.getJSON === "function"
            ? data.infomation.getJSON()
            : data.infomation;
        update({
          slug: slugify(data.name),
          id: initialData._id,
          producer: data.producer,
          description: description ? description : null,
          infomation: infomation ? infomation : null,
          price: price,
          isSale: data.isSale,
          salePrice: data.salePrice,
          timeSale: data.timeSale,
          pay: data.pay,
          options: data.options,
          images: data.images,
          name: data.name,
          collectionId: data.collectionId as Id<"collection">,
          quantity: quantity ? quantity : data.quantity,
          isPublish: data.isPublish,
        });
        router.refresh();
      } else {
        const sumQuantity = data.options?.map((item) => {
          const quantity = item.option.map((i) => i.quantity);
          const sum = quantity.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          );
          return sum;
        });
        const quantity = sumQuantity?.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );

        const price = data.options?.[0]?.option
          ? data.options?.[0]?.option[0].price
          : data.price;
        const description =
          typeof data.description.getJSON === "function"
            ? data.description.getJSON()
            : data.description;
        const infomation: Edit =
          typeof data.infomation.getJSON === "function"
            ? data.infomation.getJSON()
            : data.infomation;
        create({
          slug: slugify(data.name),
          producer: data.producer,
          description: description ? description : null,
          infomation: infomation ? infomation : null,
          price: price,
          isSale: data.isSale,
          salePrice: data.salePrice,
          timeSale: data.timeSale,
          pay: data.pay,
          options: data.options,
          images: data.images,
          name: data.name,
          collectionId: data.collectionId as Id<"collection">,
          quantity: quantity ? quantity : data.quantity,
          isPublish: data.isPublish,
        });

        router.push("/products");
      }

      toast.success(toastMessage);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
      console.log(error);
    }
  };
  const onDelete = async () => {
    try {
      if (initialData) {
        remove({ id: initialData._id });
      }
      router.push(`/products`);
      toast.success(`Sản phẩm đã bị xóa.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    } finally {
      setOpen(false);
    }
  };
  const collections = useQuery(api.collection.getCollections);
  const [formChanged, setFormChanged] = useState(false);
  usePreventUserFromErasingContent(formChanged);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between mb-3 ml-4">
        <Heading title={title} description={descriptionForm} />
        {initialData && (
          <Button
            disabled={loading}
            variant="danger"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-2"
          onChange={() => setFormChanged(true)}
        >
          <>
            <div className="flex ">
              <div className="space-y-8 px-6">
                <Card className="dark:bg-xam">
                  <CardHeader>
                    <CardTitle>Thông tin sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <FormLabel className=" uppercase text-xs font-bold ">
                            Tên bàn phím
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className=" focus-visible:ring-0  focus-visible:ring-offset-0"
                              placeholder="Nhập tên bàn phím"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="producer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold">
                            Tên nhà sản xuất
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Nhập tên nhà sản xuất"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold ">
                            Mô tả
                          </FormLabel>
                          <FormControl>
                            <Editor
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card className="dark:bg-xam min-w-[500px]">
                  <CardHeader>
                    <CardTitle>Thông tin chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 w-full">
                    <div className=" flex items-center w-full space-x-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className=" uppercase text-xs font-bold">
                              Giá
                            </FormLabel>
                            <FormControl>
                              <Input
                                className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Giá của sản phẩm sẽ ở đây"
                                onChange={(event) => {
                                  const value = parseInt(event.target.value);
                                  field.onChange(value ? value : 0);
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className=" uppercase text-xs font-bold">
                              Số lượng
                            </FormLabel>
                            <FormControl>
                              <Input
                                className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="0"
                                onChange={(event) => {
                                  const value = parseInt(event.target.value);
                                  field.onChange(value ? value : 0);
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className=" flex items-center w-full space-x-4">
                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className=" uppercase text-xs font-bold">
                              Giá Sale
                            </FormLabel>
                            <FormControl>
                              <Input
                                className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Giá Sale"
                                onChange={(event) => {
                                  const value = parseInt(event.target.value);
                                  field.onChange(value ? value : 0);
                                }}
                                type="number"
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                      <FormField
                        control={form.control}
                        name="timeSale"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className=" uppercase text-xs font-bold">
                              Thời gian Sale
                            </FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        <span>
                                          {formatDate(field.value).toString()}
                                        </span>
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    //@ts-ignore
                                    selected={field.value}
                                    onSelect={(value: any) =>
                                      field.onChange(value.getTime())
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isSale"
                        render={({ field }) => (
                          <FormItem>
                            <FormDescription>
                              {field.value ? "Sale" : "Not"}
                            </FormDescription>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-readonly
                                disabled={loading}
                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="collectionId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Bộ sưu tập</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? collections?.find(
                                        (collection) =>
                                          collection._id === field.value
                                      )?.name
                                    : "Chọn bộ sưu tập"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search collection..." />
                                <CommandEmpty>Not found.</CommandEmpty>
                                <CommandGroup>
                                  {collections?.map((collection) => (
                                    <CommandItem
                                      value={collection._id}
                                      key={collection.name}
                                      onSelect={() => {
                                        form.setValue(
                                          "collectionId",
                                          collection._id
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          collection._id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {collection.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Bàn phím của bạn sẽ thuộc bộ sưu tập này.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Trạng thái
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng thái" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup
                                  defaultValue="order"
                                  defaultChecked={true}
                                >
                                  <SelectItem value="coming">
                                    Coming Soon
                                  </SelectItem>
                                  <SelectItem value="preorder">
                                    Pre-Order
                                  </SelectItem>
                                  <SelectItem value="order">Order</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isPublish"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Publish
                          </FormLabel>
                          <FormDescription>
                            Bật nếu muốn sản phẩm này xuất hiện trong trang chủ.
                          </FormDescription>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-readonly
                              disabled={loading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className=" px-6 space-y-8">
                <FormField
                  control={form.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                        Phân loại hàng
                      </FormLabel>
                      <FormDescription>
                        Thêm phân loại hàng cho sản phẩm của bạn.
                      </FormDescription>
                      <FormControl>
                        <div className="gap-3 flex items-start">
                          {field.value?.map((item, index) => (
                            <div key={index} className=" relative">
                              <OptionForm
                                key={item.name}
                                value={field.value}
                                option={item}
                                onChange={field.onChange}
                              />
                              <div
                                className="absolute bottom-0 right-0 mr-[100px] mb-6 cursor-pointer items-center hover:scale-125 p-[10px] bg-rose-600 rounded-md"
                                onClick={() => {
                                  const newValue = field.value?.filter(
                                    (f) => f !== item
                                  );
                                  if (newValue) field.onChange([...newValue]);
                                }}
                              >
                                <Trash2 className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          ))}
                          <div
                            onClick={() => {
                              if (field.value) {
                                field.onChange([
                                  ...field.value,
                                  { name: "", option: [] },
                                ]);
                              } else {
                                field.onChange([{ name: "", option: [] }]);
                              }
                            }}
                            className={` rounded-md border-2 p-2 border-dashed cursor-pointer`}
                          >
                            <span className="text-xl">+</span>{" "}
                            <span className="text-sm">Thêm nhóm phân loại</span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Card className="dark:bg-xam">
                  <CardHeader>
                    <CardTitle>Thông tin mô tả chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="infomation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Editor
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="dark:bg-xam ml-5">
              <CardHeader>
                <CardTitle>Ảnh đính kèm</CardTitle>
              </CardHeader>
              <CardContent className="space-2">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormControl>
                        <MultiFileDropzoneUsage
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </>
          <DialogFooter className="px-6 py-4">
            <Button variant="primary" disabled={loading}>
              {action}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
