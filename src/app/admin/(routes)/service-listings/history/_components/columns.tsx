"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderWithOrderItems } from "@/types/interface";
import CellAction from "./cell-action";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case "Pending":
          return (
            <Badge className="bg-yellow-200 ml-2.5 text-yellow-600 border-yellow-600 border">
              Pending
            </Badge>
          );
        case "Scheduled":
          return (
            <Badge className="bg-blue-200 ml-2.5 text-blue-600 border-blue-600 border">
              Scheduled
            </Badge>
          );
        case "Completed":
          return (
            <Badge className="bg-green-200 ml-2.5 text-green-600 border-green-600 border">
              Completed
            </Badge>
          );
        case "Cancelled":
          return (
            <Badge className="bg-red-200 ml-2.5 text-red-600 border-red-600 border">
              Cancelled
            </Badge>
          );
        default:
          return (
            <Badge className="bg-gray-200 ml-2.5 text-gray-600 border-gray-600 border">
              Unknown
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="ml-2.5 flex items-center gap-2">
          <div
            className={`size-2 mt-0.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span>{isActive ? "Active" : "Inactive"}</span>
        </div>
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
