"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CellAction from "./cell-action";
import { UserWithProps } from '@/types/interface';

export const columns: ColumnDef<UserWithProps>[] = [
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
      const user = row.original;
      const searchText = filterValue.toLowerCase();
      const fullName = `${user.name.toLowerCase()}`;

      // Type-safe search across all user fields
      const searchFields = [
        user.email.toLowerCase(),
        fullName,
        user.phoneNumber.toLowerCase(),
        user.id.toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullName = `${row.original.name}`;
      return <span className="ml-2.5">{fullName}</span>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.original.email;
      return <span className="ml-2.5">{email}</span>;
    },
  },
  {
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Orders
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orders = row.original.orders.length;
      return <span className="ml-2.5">{orders} {orders <= 1 ? "item" : "items"}</span>;
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
      const isActive = row.original.isActive;
      return <div className="ml-2.5 flex items-center gap-2">
        <div className={`size-2 mt-0.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}></div>
        <span>{isActive ? "Active" : "Inactive"}</span>
      </div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="ml-2.5">{date.toLocaleDateString()}</span>;
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
