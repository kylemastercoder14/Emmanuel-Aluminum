import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { DataTable } from "@/components/globals/data-table";
import { columns } from "./_components/columns";

const Page = async () => {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: true,
	  address: true,
	  notifications: true,
	  conversation: true
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Customers"
          description="View and manage customer profile for your system."
        />
      </div>

      <div className="mt-5">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default Page;
