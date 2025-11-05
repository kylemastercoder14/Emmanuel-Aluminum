"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface FeedbackWithRelations {
  id: string;
  type: string;
  rating: number;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const columns: ColumnDef<FeedbackWithRelations>[] = [
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
      const feedback = row.original;
      const searchText = filterValue.toLowerCase();
      const searchFields = [
        feedback.user.name.toLowerCase(),
        feedback.user.email.toLowerCase(),
        feedback.type.toLowerCase(),
        feedback.message?.toLowerCase() || "",
        feedback.id.toLowerCase(),
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Feedback Type
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="ml-2.5">
          <Badge variant="outline">{type}</Badge>
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
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.original.message;
      return (
        <div className="ml-2.5 max-w-md">
          {message ? (
            <p className="text-sm">{message}</p>
          ) : (
            <span className="text-gray-400 italic">No message</span>
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

