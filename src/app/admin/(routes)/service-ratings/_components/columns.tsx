"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { format } from "date-fns";

interface ServiceRatingWithRelations {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItem: {
    id: string;
    color: string;
    quantity: string;
    service: {
      id: string;
      name: string;
    };
  };
}

export const columns: ColumnDef<ServiceRatingWithRelations>[] = [
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
      const rating = row.original;
      const searchText = filterValue.toLowerCase();
      const searchFields = [
        rating.user.name.toLowerCase(),
        rating.user.email.toLowerCase(),
        rating.orderItem.service.name.toLowerCase(),
        rating.comment?.toLowerCase() || "",
        rating.id.toLowerCase(),
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
      const user = row.original.user;
      return (
        <div className="ml-2.5">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
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
      const orderItem = row.original.orderItem;
      return (
        <div className="ml-2.5">
          <div className="font-medium">{orderItem.service.name}</div>
          <div className="text-sm text-gray-500">
            Color: {orderItem.color} • Qty: {orderItem.quantity}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="ml-2.5">
          <StarRating rating={row.original.rating} readonly={true} size={18} />
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      const comment = row.original.comment;
      return (
        <div className="ml-2.5 max-w-md">
          {comment ? (
            <p className="text-sm">{comment}</p>
          ) : (
            <span className="text-gray-400 italic">No comment</span>
          )}
        </div>
      );
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
          Date
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <span className="ml-2.5">
          {format(new Date(date), "MMM dd, yyyy HH:mm")}
        </span>
      );
    },
  },
];

