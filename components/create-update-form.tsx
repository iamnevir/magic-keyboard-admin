//@ts-nocheck
"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Doc, TableNames } from "@/convex/_generated/dataModel";
import { DialogFooter } from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";
import { SingleImageDropzone } from "./single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Checkbox } from "./ui/checkbox";
import { OptionFormModal } from "./orders/option-form";
import { Card, CardContent } from "./ui/card";
import Editor from "./editor";
import slugify from "react-slugify";
import OrderItemTable from "./orders/order-item-table";

export function CreateUpdateForm<
  T extends TableNames,
  Type extends FieldValues
>(
  initialData: Doc<T>,
  defaultValues: DefaultValues<Type>,
  formSchema: z.ZodType<any, any, any>,
  createApi: FunctionReference<"mutation">,
  updateApi: FunctionReference<"mutation">,
  removeApi: FunctionReference<"mutation">,
  formName: "Billboards" | "Orders" | "Posts",
  isUpdate: boolean
) {
  const router = useRouter();
  const create = useMutation(createApi);
  const update = useMutation(updateApi);
  const remove = useMutation(removeApi);
  const { edgestore } = useEdgeStore();
  const [open, setOpen] = useState(false);
  const [addProduct, setAddProduct] = useState(false);

  const title = isUpdate ? `Sửa ${formName}` : `Tạo ${formName}`;
  const description = isUpdate
    ? `Sửa thông tin ${formName}`
    : `Thêm mới ${formName}`;
  const toastMessage = isUpdate
    ? `${formName} đã cập nhật`
    : `${formName} đã được tạo`;
  const action = isUpdate ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<Type>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const loading = form.formState.isSubmitting;
  const onSubmit = async (data: Type) => {
    try {
      if (isUpdate) {
        if (formName === "Posts") {
          const content =
            "getJSON" in data.content &&
            typeof data.content.getJSON === "function"
              ? data.content.getJSON()
              : undefined;
          update({
            id: initialData._id,
            title: data.title,
            author: data.author,
            content: content,
            type: data.type,
            slug: slugify(data.title),
            thumnail: data.thumnail,
            isPublish: data.isPublish,
          });
        } else {
          update({ id: initialData._id, ...data });
        }
      } else {
        if (formName === "Billboards") {
          create(data);
        }

        if (formName === "Posts") {
          const content =
            "getJSON" in data.content &&
            typeof data.content.getJSON === "function"
              ? data.content.getJSON()
              : undefined;
          create({
            title: data.title,
            author: data.author,
            content: content,
            type: data.type,
            slug: slugify(data.title),
            thumnail: data.thumnail,
            isPublish: data.isPublish,
          });
        }
      }

      form.reset();
      router.push(`/${formName.toLowerCase()}`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    }
  };
  const onDelete = async () => {
    try {
      if (isUpdate) {
        remove({ id: initialData._id });
      }
      if (formName === "Billboards") {
        await edgestore.publicFiles.delete({
          url: initialData.imageUrl as string,
        });
      }
      router.push(`/${formName.toLowerCase()}`);
      toast.success(`${formName} deleted.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between mb-3 ml-4">
        <Heading title={title} description={description} />
        {isUpdate && (
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formName === "Billboards" && (
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormControl>
                        <SingleImageDropzone
                          width={1150}
                          height={600}
                          value={field.value}
                          onChange={async (file) => {
                            if (file) {
                              const res = await edgestore.publicFiles.upload({
                                file,
                                options: {
                                  replaceTargetUrl:
                                    initialData.imageUrl as string,
                                },
                              });
                              field.onChange(res.url);
                            } else {
                              field.onChange("");
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="producer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                      Tên nhà sản xuất
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                      Tiêu đề
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                        placeholder="Nhập tên tiêu đề"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                      Link sản phẩm {"("}nếu có{")"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                        placeholder="Điền link muốn đến của bảng quảng cáo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                      Mô tả
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 dark:bg-xam  focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                        placeholder="Nhập mô tả"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                      Trạng thái
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="coming">Coming Soon</SelectItem>
                            <SelectItem value="preorder">Pre-Order</SelectItem>
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
                      Bật nếu muốn bảng quảng cáo này xuất hiện trong trang chủ.
                    </FormDescription>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Nhập mô tả"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {formName === "Orders" && (
            <div className="flex item-center space-x-3 w-full">
              <div className="mt-5 w-[50%]">
                <Card>
                  <CardContent className="gap-5 px-6 space-y-5 mt-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Tên người nhận
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                              placeholder="Tên người nhận"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                              placeholder="Số điện thoại"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Thanh toán" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup defaultValue={field.value}>
                                  <SelectItem value="Thanh toán khi nhận hàng">
                                    Thanh toán khi nhận hàng
                                  </SelectItem>
                                  <SelectItem value="Chuyển khoản">
                                    Chuyển khoản
                                  </SelectItem>
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
                      name="orderStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng thái đơn hàng" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup defaultValue={field.value}>
                                  <SelectItem value="Đơn hàng đang đợi được xác nhận">
                                    Đơn hàng đang đợi được xác nhận
                                  </SelectItem>
                                  <SelectItem value="Đơn hàng đang được chuẩn bị">
                                    Đơn hàng đang được chuẩn bị
                                  </SelectItem>
                                  <SelectItem value="Đơn hàng đang được giao">
                                    Đơn hàng đang được giao
                                  </SelectItem>
                                  <SelectItem value="Đã nhận hàng">
                                    Đã nhận hàng
                                  </SelectItem>
                                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Địa chỉ
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                              placeholder="Địa chỉ đặt hàng"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isPaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              className="h-5 w-5"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="ml-2">Thanh toán</FormLabel>
                          <FormDescription>
                            Chỉ tích nếu đơn hàng đã được thanh toán.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Tổng tiền
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={loading}
                              className="bg-zinc-300/50 border-0 dark:bg-xam focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                              placeholder=" Tổng tiền"
                              value={field.value}
                              onChange={(event) => {
                                const value = parseInt(event.target.value);
                                field.onChange(value ? value : 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="mt-5 w-full">
                <Card>
                  <CardContent className=" px-6 gap-5 mt-2 w-full">
                    <FormField
                      control={form.control}
                      name="orderItems"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Sản phẩm
                          </FormLabel>
                          <FormDescription>
                            Các sản phẩm được order
                          </FormDescription>
                          <FormControl>
                            <>
                              <div
                                onClick={() => setAddProduct(true)}
                                className={` rounded-md border-2 p-2 border-dashed cursor-pointer`}
                              >
                                <span className="text-xl">+</span>{" "}
                                <span className="text-sm">Thêm sản phẩm</span>
                              </div>
                              <OptionFormModal
                                value={field.value}
                                onChange={field.onChange}
                                open={addProduct}
                                setOpen={setAddProduct}
                              />
                            </>
                          </FormControl>
                          <FormDescription>
                            <OrderItemTable
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {formName === "Posts" && (
            <div className="flex item-center space-x-3 w-full">
              <div className="mt-5 w-full">
                <Card>
                  <CardContent className="space-y-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <FormLabel className=" uppercase text-xs font-bold ">
                            Tiêu đề
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className=" focus-visible:ring-0  focus-visible:ring-offset-0"
                              placeholder="Nhập tiêu đề"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold">
                            Mô tả tiêu đề
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Nhập mô tả tiêu đề"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold">
                            Tác giả
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Nhập tên tác giả"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="thumnail"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <FormControl>
                            <SingleImageDropzone
                              width={600}
                              height={300}
                              value={field.value}
                              onChange={async (file) => {
                                if (file) {
                                  const res =
                                    await edgestore.publicFiles.upload({
                                      file,
                                      options: {
                                        replaceTargetUrl:
                                          initialData.imageUrl as string,
                                      },
                                    });
                                  field.onChange(res.url);
                                } else {
                                  field.onChange("");
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold ">
                            Nội dung
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
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" uppercase text-xs font-bold dark:text-white">
                            Dạng bài viết
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Dạng bài viết" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup
                                  defaultValue={
                                    field.value ? field.value : "news"
                                  }
                                  defaultChecked={true}
                                >
                                  <SelectItem value="news">News</SelectItem>
                                  <SelectItem value="guides">Guides</SelectItem>
                                  <SelectItem value="review">Review</SelectItem>
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
                            Bật nếu muốn bài viết này xuất hiện trong trang chủ.
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
            </div>
          )}
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
