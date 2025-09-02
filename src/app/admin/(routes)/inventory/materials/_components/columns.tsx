"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialWithSupplier } from "@/types/interface";
import CellAction from "./cell-action";
import Image from "next/image";
import UpdateStock from '@/components/forms/update-stock';

export const columns: ColumnDef<MaterialWithSupplier>[] = [
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
      const material = row.original;
      const searchText = filterValue.toLowerCase();

      // Type-safe search across all material fields
      const searchFields = [
        material.name.toLowerCase(),
        material.supplier.name.toLowerCase(),
        material.id.toLowerCase(),
      ];

      return searchFields.some((field) => field.includes(searchText));
    },
  },
  {
    accessorKey: "material",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Material
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
              src={row.original.image || ""}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="w-[200px] truncate">{row.original.name}</h3>
            </div>
            <div
              title={row.original.supplier.name}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[190px] hover:underline truncate overflow-hidden whitespace-nowrap">
                Supplier: {row.original.supplier.name}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "supplierId",
    header: "",
    cell: ({ row }) => {
      const supplier = row.original.supplier.name;
      return <span className="hidden">{supplier}</span>;
    },
  },
  {
    accessorKey: "unitPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit Price
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price;
      const unit = row.original.unit;
      return (
        <span className="ml-2.5">
          ₱{price.toLocaleString()} per {unit}
        </span>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.original.stock;
      return (
        <UpdateStock id={row.original.id} stock={stock} />
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
