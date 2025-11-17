"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      const orders = row.original.orders;
      const count = orders.length;

      if (!count) {
        return <span className="ml-2.5 text-muted-foreground">No orders</span>;
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <button className="ml-2.5 text-primary underline-offset-4 hover:underline text-sm font-medium">
              {count} {count === 1 ? "order" : "orders"}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-5xl">
            <DialogHeader>
              <DialogTitle>Orders for {row.original.name}</DialogTitle>
              <DialogDescription>
                {count} {count === 1 ? "order" : "orders"} placed by this customer.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="py-2 pr-2 text-left font-medium">Order ID</th>
                    <th className="py-2 pr-2 text-left font-medium">Status</th>
                    <th className="py-2 pr-2 text-left font-medium">Payment</th>
                    <th className="py-2 pr-2 text-right font-medium">Total</th>
                    <th className="py-2 pr-2 text-right font-medium">Paid</th>
                    <th className="py-2 pr-2 text-left font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-1.5 pr-2 font-mono text-xs">{order.orderId}</td>
                      <td className="py-1.5 pr-2">{order.status}</td>
                      <td className="py-1.5 pr-2">{order.paymentStatus}</td>
                      <td className="py-1.5 pr-2 text-right">
                        ₱{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-1.5 pr-2 text-right">
                        ₱{order.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-1.5 pr-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
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
