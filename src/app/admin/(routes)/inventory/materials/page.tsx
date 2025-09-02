import React from "react";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/globals/heading";
import { DataTable } from "@/components/globals/data-table";
import { columns } from "./_components/columns";

const Page = async () => {
  const data = await db.material.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      supplier: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Materials"
          description="View and manage materials for your system."
        />
        <Link href="/admin/inventory/materials/create">
          <Button variant="primary">
            <PlusIcon className="size-4" />
            Add new material
          </Button>
        </Link>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;
