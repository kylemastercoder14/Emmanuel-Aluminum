"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceWithMaterials } from "@/types/interface";
import CellAction from "./cell-action";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ServiceWithMaterials>[] = [
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
        service.name.toLowerCase(),
        service.id.toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
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
        <div className="flex items-center group gap-2">
          <div className="relative w-[40px] h-[40px]">
            <Image
              className="w-full h-full rounded-md object-contain"
              fill
              alt={row.original.name}
              src={row.original.images[0] || ""}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="w-[200px] truncate">{row.original.name}</h3>
            </div>
            <div
              title={row.original.category}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
                Category: {row.original.category}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "colors",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Colors
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const colors = row.original.colors;
      return <span className="ml-2.5">{colors.join(", ")}</span>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price;
      return <span className="ml-2.5">₱{price.toLocaleString()}</span>;
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
          Type
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.original.type;
      return <span className="ml-2.5">{type || "N/A"}</span>;
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
      const isAvailable = row.original.isAvailable;
      return (
        <Badge
          variant={isAvailable ? "default" : "destructive"}
          className="ml-2.5"
        >
          {isAvailable ? "Available" : "Unavailable"}
        </Badge>
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
          Date Added
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
