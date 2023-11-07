// @ts-nocheck
"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import {
  DefaultValues,
  FieldValues,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { FileUpload } from "@/components/ui/file-upload";
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
import { createContext, useState } from "react";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Doc, TableNames } from "@/convex/_generated/dataModel";
import { DialogFooter } from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";

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
  formName: "Billboards" | "Categories" | "Collection",
  isUpdate: boolean
) {
  const router = useRouter();
  const create = useMutation(createApi);
  const update = useMutation(updateApi);
  const remove = useMutation(removeApi);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data: Type) => {
    try {
      setLoading(true);
      console.log(data);
      if (isUpdate) {
        update({ id: initialData._id, ...data });
      } else {
        create(data);
      }

      form.reset();
      router.push(`/${formName.toLowerCase()}`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      if (isUpdate) {
        remove({ id: initialData._id });
      }
      router.refresh();
      router.push(`/${formName.toLowerCase()}`);
      toast.success(`${formName} deleted.`);
    } catch (error) {
      toast.error("Có gì đó sai sai!!!");
    } finally {
      setLoading(false);
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
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
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
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Comming Soon" />
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
