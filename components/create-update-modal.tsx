"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Doc, Id, TableNames } from "@/convex/_generated/dataModel";
import { FunctionReference } from "convex/server";
import { useMutation, useQuery } from "convex/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { api } from "@/convex/_generated/api";
import { SingleImageDropzone } from "./single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleFileDropzone } from "./single-file-dropzone";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import slugify from "react-slugify";

export function CreateUpdateModal<
  T extends TableNames,
  Type extends FieldValues
>(
  initialData: Doc<T>,
  defaultValues: DefaultValues<Type>,
  formSchema: z.ZodType<any, any, any>,
  createApi: FunctionReference<"mutation">,
  updateApi: FunctionReference<"mutation">,
  formName: "Categories" | "Collections" | "Musics" | "Vouchers",
  isUpdate: boolean
) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const update = useMutation(updateApi);
  const create = useMutation(createApi);
  const updateCategory = useMutation(api.category.update);
  const { edgestore } = useEdgeStore();
  const title = isUpdate ? `Sửa ${formName}` : `Tạo ${formName}`;
  const toastMessage = isUpdate
    ? `${formName} đã cập nhật`
    : `${formName} đã được tạo`;
  const action = isUpdate ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<Type>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: Type) => {
    try {
      if (isUpdate) {
        if (formName === "Categories") {
          update({
            id: initialData._id,
            slug: slugify(values.name),
            ...values,
          });
        } else {
          update({ id: initialData._id, ...values });
        }
      } else {
        if (formName === "Categories") {
          create({ slug: slugify(values.name), ...values });
        } else {
          create({ ...values });
        }
      }
      form.reset();
      setOpen(false);
      if (formName === "Musics") {
        router.push(`/settings`);
      } else {
        router.push(`/${formName.toLowerCase()}`);
      }

      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("Có gì đó sai sai!!!");
    }
  };

  const handleClose = () => {
    setOpen(!open);
    router.push(`/${formName.toLowerCase()}`);
  };
  const categories = useQuery(api.category.getCategories);
  useEffect(() => {
    setOpen(true);
  }, []);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="dark:bg-xam dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 dark:bg-xam"
          >
            {formName === "Categories" && (
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Tên Danh mục
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="  border-0 bg-zinc-300/50 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="Nhập tên danh mục"
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
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
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
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormControl>
                        <SingleImageDropzone
                          width={450}
                          height={350}
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
            )}
            {formName === "Musics" && (
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold dark:bg-xam dark:text-white">
                        Tên nhạc
                      </FormLabel>
                      <FormControl>
                        <Input
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
                  name="url"
                  render={({ field }) => (
                    <FormItem className=" w-full ">
                      <FormControl>
                        <SingleFileDropzone
                          width={400}
                          height={100}
                          value={field.value}
                          onChange={async (file) => {
                            if (file) {
                              const res = await edgestore.publicFiles.upload({
                                file,
                                options: {
                                  replaceTargetUrl: initialData.url as string,
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
            )}
            {formName === "Collections" && (
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        Tên Bộ sưu tập
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
                          placeholder="Nhập tên bộ sưu tập"
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
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Danh mục</FormLabel>
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
                                ? categories?.find(
                                    (category) => category._id === field.value
                                  )?.name
                                : "Chọn danh mục"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search language..." />
                            <CommandEmpty>Not found.</CommandEmpty>
                            <CommandGroup>
                              {categories?.map((category) => (
                                <CommandItem
                                  value={category._id}
                                  key={category.name}
                                  onSelect={() => {
                                    form.setValue("categoryId", category._id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category._id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Bộ sưu tập của bạn sẽ thuộc danh mục này.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {formName === "Vouchers" && (
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        Mã giảm giá
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
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
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Thời gian hết hạn</FormLabel>

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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(value: any) =>
                                field.onChange(value ? value.getTime() : 0)
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        Loại giảm giá
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            setType(value);
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Loại giảm giá" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup
                              defaultValue={field.value}
                              defaultChecked={true}
                            >
                              <SelectItem value="freeship">
                                Free ship
                              </SelectItem>
                              <SelectItem value="%">Giảm theo %</SelectItem>
                              <SelectItem value="tructiep">
                                Giảm trực tiếp
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
                  name="percent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        % Giảm
                      </FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={(event) => {
                            const value = parseInt(event.target.value);
                            field.onChange(value ? value : 0);
                          }}
                          disabled={type !== "%"}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
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
                      <FormLabel className="uppercase text-xs font-bold  dark:bg-xam dark:text-white">
                        Số tiền giảm
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={type !== "tructiep"}
                          type="number"
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 dark:bg-black dark:text-white focus-visible:ring-offset-0"
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
              </div>
            )}
            <DialogFooter className="dark:bg-xam px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                {action}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
