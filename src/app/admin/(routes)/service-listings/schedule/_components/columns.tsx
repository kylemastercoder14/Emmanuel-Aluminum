"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderWithOrderItems } from "@/types/interface";
import CellAction from "./cell-action";

export const columns: ColumnDef<OrderWithOrderItems>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order #
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center group gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="w-[250px] truncate">{row.original.orderId}</h3>
            </div>
            <div
              title={row.original.createdAt.toLocaleString()}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[230px] hover:underline truncate overflow-hidden whitespace-nowrap">
                Date Submitted: {row.original.createdAt.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, _, filterValue) => {
      const service = row.original;
      const searchText = filterValue.toLowerCase();

      // Type-safe search across all service fields
      const searchFields = [
        service.orderId.toLowerCase(),
        service.id.toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user?.name;
      return <span className="ml-2.5">{user}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
      return <span className="ml-2.5">₱{amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Method
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;
      return <span className="ml-2.5">{paymentMethod || "N/A"}</span>;
    },
  },
  {
    accessorKey: "schedule",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scheduled Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.scheduledDate; // e.g. "2025-09-25"
      const time = row.original.scheduledTime; // e.g. "08:00"

      // Combine date & time into a single Date object
      const dateTime = new Date(`${date}T${time}`);

      // Format options
      const formattedDate = dateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const formattedTime = dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // ensures AM/PM
      });

      return (
        <span className="ml-2.5">
          {formattedDate} - {formattedTime}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;
      return <CellAction data={data} />;
    },
  },
];
