import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { DataTable } from "@/components/globals/data-table";
import { columns } from "./_components/columns";

const Page = async () => {
  const data = await db.orders.findMany({
	where: {
		status: "Cancelled"
	},
	orderBy: {
	  createdAt: "asc",
	},
	include: {
	  user: true,
	  payments: true,
	  orderItems: {
		include: {
		  service: true,
		},
	  },
	},
  });

  return (
	<div>
	  <div className="flex items-center justify-between">
		<Heading
		  title="Service Cancellation"
		  description="View and manage service cancellation for your system."
		/>
	  </div>
	  <div className="mt-5">
		<DataTable columns={columns} data={data} />
	  </div>
	</div>
  );
};

export default Page;
