"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BillboardColumn } from "./billboard/columns";

export function Client<T>(
  data: Array<T>,
  clientName: string,
  description: string,
  columns: ColumnDef<T>[]
) {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Heading
          title={`${clientName} (${data.length})`}
          description={description}
        />
        <div className="flex items-center py-2">
          <Button
            variant="primary"
            onClick={() => router.push("/billboards/new")}
          >
            Tạo mới
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="producer" />
    </>
  );
}
