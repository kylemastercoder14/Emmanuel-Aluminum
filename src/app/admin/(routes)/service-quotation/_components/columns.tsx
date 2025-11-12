"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CellAction from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { Quotation } from "@prisma/client";

export const columns: ColumnDef<Quotation>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span className="ml-2.5">{index}</span>;
    },
    filterFn: (row, _, filterValue) => {
      const service = row.original;
      const searchText = filterValue.toLowerCase();

      // Type-safe search across all service fields
      const searchFields = [
        service.email.toLowerCase(),
        service.firstName.toLowerCase(),
        service.lastName.toLowerCase(),
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
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      const email = row.original.email;
      const contact = row.original.contactNumber;
      return (
        <div className="flex items-center ml-2.5 group gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="w-[200px] truncate">
                {firstName} {lastName}
              </h3>
            </div>
            <div
              title={`${email} (${contact})`}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[250px] hover:underline truncate overflow-hidden whitespace-nowrap">
                {email} ({contact})
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center ml-2.5 group gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="w-[200px] truncate">{row.original.serviceType}</h3>
            </div>
            <div
              title={`${row.original.color} (${row.original.variants})`}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
                Variant: {row.original.color} ({row.original.variants})
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size = row.original.size;
      const unit = row.original.unit;
      return (
        <span className="ml-2.5">
          {size} {unit}
        </span>
      );
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
        case "PENDING":
          return (
            <Badge className="bg-yellow-200 ml-2.5 text-yellow-600 border-yellow-600 border">
              Pending
            </Badge>
          );
        case "APPROVED":
          return (
            <Badge className="bg-blue-200 ml-2.5 text-blue-600 border-blue-600 border">
              Approved
            </Badge>
          );
        case "SCHEDULED":
          return (
            <Badge className="bg-green-200 ml-2.5 text-green-600 border-green-600 border">
              Scheduled
            </Badge>
          );
        case "REJECTED":
          return (
            <Badge className="bg-red-200 ml-2.5 text-red-600 border-red-600 border">
              Rejected
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
    accessorKey: "preferredDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Preferred
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.preferredDate);
      return <span className="ml-2.5">{date.toLocaleDateString()}</span>;
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
