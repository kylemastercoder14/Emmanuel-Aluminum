"use client";

import React from "react";
import { DataTable } from "@/components/globals/data-table";
import { getColumns } from "./columns";
import { Staff } from "@prisma/client";

interface StaffTableProps {
  data: Staff[];
  currentRole: string;
}

const StaffTable: React.FC<StaffTableProps> = ({ data, currentRole }) => {
  let columns = getColumns(currentRole);

  // 🧩 Hide the "Actions" column for non-admins
  if (currentRole !== "Admin") {
    columns = columns.filter((col) => col.id !== "actions");
  }

  return <DataTable columns={columns} data={data} />;
};

export default StaffTable;
