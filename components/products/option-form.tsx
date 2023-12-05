"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { OptionFormModal } from "./option-form-modal";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
const formOptionSchema = z.object({
  name: z.string().min(2, { message: "vl tên ngắn thế, thêm tí đê =))" }),
  option: z.array(
    z.object({
      name: z.string().min(2, { message: "vl tên ngắn thế, thêm tí đê =))" }),
      image: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
});

export function OptionForm({
  value,
  key,
  option,
  onChange,
}: {
  value?: {
    name: string;
    option: {
      name: string;
      image: string;
      price: number;
      quantity: number;
    }[];
  }[];
  key?: string;
  option?: {
    name: string;
    option: {
      name: string;
      image: string;
      price: number;
      quantity: number;
    }[];
  };
  onChange: (
    value: {
      name: string;
      option: {
        name: string;
        image: string;
        price: number;
        quantity: number;
      }[];
    }[]
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState(false);

  const form = useForm<z.infer<typeof formOptionSchema>>({
    resolver: zodResolver(formOptionSchema),
    defaultValues: option
      ? option
      : {
          name: "",
          option: [],
        },
  });

  function onSubmitOption(values: z.infer<typeof formOptionSchema>) {
    setSave(true);
    if (value && option) {
      const index = value.indexOf(option);
      const newValue = [...value];
      newValue[index] = values;
      onChange(newValue);
    } else {
      onChange([values]);
    }
  }

  return (
    <div className="items-center justify-center relative" key={key}>
      <div
        className={cn(
          "flex-col items-center space-y-2",
          save && "pointer-events-none opacity-20"
        )}
      >
        <Card>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitOption)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên nhóm phân loại</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={option ? option.name : field.value}
                              placeholder="layout & keycap"
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name="option"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phân loại</FormLabel>
                          <FormControl>
                            <>
                              {" "}
                              <div
                                onClick={() => setOpen(true)}
                                className={` rounded-md border-2 p-2 border-dashed cursor-pointer`}
                              >
                                <span className="text-xl">+</span>{" "}
                                <span className="text-sm">Thêm phân loại</span>
                              </div>
                              <OptionFormModal
                                value={field.value}
                                onChange={field.onChange}
                                open={open}
                                setOpen={setOpen}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            <Table>
                              <TableCaption>
                                Danh sách phân loại hàng
                              </TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tên</TableHead>
                                  <TableHead>Giá</TableHead>
                                  <TableHead>Số lượng</TableHead>
                                  <TableHead>Ảnh</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {option && !field.value
                                  ? option.option.map((item) => (
                                      <TableRow key={item.name}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                          {item.image ? (
                                            <Image
                                              alt="option-image"
                                              src={item.image}
                                              width={100}
                                              height={60}
                                              objectFit="contain"
                                            />
                                          ) : (
                                            <ImageIcon />
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <div
                                            className="cursor-pointer items-center hover:scale-125 p-2 bg-rose-600 rounded-full"
                                            onClick={() => {
                                              const newValue =
                                                field.value.filter(
                                                  (i: any) => i !== item
                                                );
                                              field.onChange([...newValue]);
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4 text-white" />
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  : field.value.map((item) => (
                                      <TableRow key={item.name}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                          {item.image ? (
                                            <Image
                                              alt="option-image"
                                              src={item.image}
                                              width={100}
                                              height={60}
                                              objectFit="contain"
                                            />
                                          ) : (
                                            <ImageIcon />
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <div
                                            className="cursor-pointer items-center hover:scale-125 p-1 bg-rose-600 rounded-full"
                                            onClick={() => {
                                              const newValue =
                                                field.value.filter(
                                                  (i) => i !== item
                                                );
                                              field.onChange([...newValue]);
                                            }}
                                          >
                                            <Trash2 className="w-3 h-3 text-white" />
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                              </TableBody>
                            </Table>
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div
                    className="px-4 py-2 cursor-pointer rounded-md ml-auto bg-[#A9DFD8] text-black hover:scale-[1.10]"
                    onClick={form.handleSubmit(onSubmitOption)}
                  >
                    Lưu
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div
        className={cn(
          " absolute -mt-[250px] translate-x-[140px] text-xl cursor-pointer rounded-md ml-auto hover:scale-[1.10] hover:underline underline-offset-2",
          save ? "" : "hidden"
        )}
        onClick={() => setSave(false)}
      >
        Sửa
      </div>
    </div>
  );
}
