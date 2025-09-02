import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/globals/data-table";
import { columns } from './_components/columns';

const Page = async () => {
  const users = await db.staff.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Staff"
          description="View and manage administrative staff for your system."
        />
        <Link href="/admin/users/create">
          <Button variant="primary">
            <PlusIcon className="size-4" />
            Add new user
          </Button>
        </Link>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default Page;
