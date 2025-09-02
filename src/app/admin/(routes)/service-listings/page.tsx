import React from "react";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/globals/heading";
import { DataTable } from "@/components/globals/data-table";
import { columns } from "./_components/columns";

const Page = async () => {
  const data = await db.service.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      materials: {
        include: {
          supplier: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Services"
          description="View and manage services for your system."
        />
        <Link href="/admin/service-listings/create">
          <Button variant="primary">
            <PlusIcon className="size-4" />
            Add new service
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
