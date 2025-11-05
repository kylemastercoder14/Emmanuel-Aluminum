import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { DataTable } from "@/components/globals/data-table";
import { columns } from "./_components/columns";

const Page = async () => {
  const data = await db.serviceRating.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItem: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
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
          title="Service Ratings"
          description="View and manage all service ratings from customers."
        />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;

