import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { DataTable } from "@/components/globals/data-table";
import { columns } from "./_components/columns";

const Page = async () => {
  const data = await db.orders.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        include: {
          address: true,
          orders: true,
          notifications: true,
          conversation: true
        },
      },
      payments: true,
      orderItems: {
        include: {
          service: {
            include: {
              serviceRatings: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Service History"
          description="View and manage service history for your system."
        />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;
